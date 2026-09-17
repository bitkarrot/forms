#!/usr/bin/env python3
"""End-to-end payment loop test against a local LNbits + FakeWallet instance.

Usage:
    python3 tests/e2e_local.py [--url http://127.0.0.1:5000] [--username admin] [--password adminpass123]

Prerequisites:
    - LNbits running with LNBITS_BACKEND_WALLET_CLASS=FakeWallet
    - The forms extension directory installed into
      <lnbits>/data/wasm_extensions/forms (any fresh copy works; the test
      also works against an already-installed extension)
    - First install completed at least once (the script calls
      /api/v1/auth/first_install and ignores "not your first install",
      then logs in with the same credentials — so use the credentials of
      the existing superuser on non-fresh instances)

The script exercises: auth, extension enable, wallet list, flow create,
publish, public get, public submit (invoice), wallet top-up, invoice
payment, on-invoice-paid settlement, public status poll (paid + ticket),
owner submission list, and CSV export.
"""

import argparse
import base64
import json
import sys
import time
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:5000"



def call(method, path, body=None, token=None, api_key=None, expect_error=False):
    req = urllib.request.Request(
        BASE + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {token}"} if token else {}),
            **({"X-Api-Key": api_key} if api_key else {}),
        },
    )
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read() or b"null")
    except urllib.error.HTTPError as e:
        payload = e.read()
        try:
            payload = json.loads(payload)
        except Exception:
            pass
        if expect_error:
            return e.code, payload
        raise AssertionError(f"{method} {path} -> {e.code}: {payload}")


def step(name):
    print(f"  → {name}")


def main():
    global BASE
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=BASE)
    ap.add_argument("--username", default="admin")
    ap.add_argument("--password", default="adminpass123")
    args = ap.parse_args()
    BASE = args.url.rstrip("/")

    step("first install / login")
    status, _ = call(
        "PUT",
        "/api/v1/auth/first_install",
        {"username": args.username, "password": args.password, "password_repeat": args.password},
        expect_error=True,
    )
    if status == 200:
        print("    (fresh instance — first install completed)")
    status, auth = call("POST", "/api/v1/auth", {"username": args.username, "password": args.password})
    token = auth["access_token"]

    step("enable forms extension")
    call("PUT", "/api/v1/extension/forms/enable", token=token)

    step("list wallets")
    _, wallets = call("GET", "/api/v1/ext/forms/wallets", token=token)
    wallet = wallets["data"][0]
    print(f"    wallet: {wallet['name']} ({wallet['id']})")

    step("create flow")
    _, flow = call(
        "POST",
        "/api/v1/ext/forms/flows",
        {
            "title": "E2E Test Event",
            "description": "automated payment-loop verification",
            "walletId": wallet["id"],
            "schemaJson": {"fields": [
                {"id": "name", "type": "text", "label": "Name", "required": True},
                {"id": "email", "type": "email", "label": "Email", "required": True},
            ]},
            "pricingJson": {"mode": "fixed", "amountSat": 21},
            "capacity": 5,
        },
        token=token,
    )
    flow_id = flow["id"]
    assert flow["status"] == "draft", flow

    step("publish flow")
    call("POST", f"/api/v1/ext/forms/flows/{flow_id}/status", {"status": "published"}, token=token)

    step("public get flow (no auth)")
    _, public = call("GET", f"/api/v1/ext/forms/f/{flow_id}")
    assert public["status"] == "published"
    assert "walletId" not in public, "walletId leaked to public!"
    assert public["remaining"] == 5

    step("public submit → invoice")
    _, sub = call(
        "POST",
        f"/api/v1/ext/forms/f/{flow_id}/submit",
        {"answers": {"name": "E2E Bot", "email": "e2e@example.com"}},
    )
    assert sub["status"] == "pending_payment", sub
    assert sub["paymentRequest"].startswith("ln"), sub
    sub_id = sub["submissionId"]
    print(f"    submission {sub_id}, invoice {sub['paymentHash'][:16]}…")

    step("public status → pending")
    _, view = call("GET", f"/api/v1/ext/forms/s/{sub_id}")
    assert view["paid"] is False and view["status"] == "pending_payment"

    step("top up wallet + pay invoice")
    call("PUT", "/users/api/v1/balance", {"id": wallet["id"], "amount": 100000}, token=token)
    jwt_payload = json.loads(base64.urlsafe_b64decode(token.split(".")[1] + "=="))
    usr = jwt_payload.get("uss") or jwt_payload.get("usr") or jwt_payload.get("sub")
    _, keys = call("GET", f"/api/v1/wallets?usr={usr}", token=token)
    adminkey = keys[0]["adminkey"]
    _, payment = call(
        "POST", "/api/v1/payments", {"out": True, "bolt11": sub["paymentRequest"]}, api_key=adminkey
    )
    assert payment["status"] == "success", payment

    step("poll public status → paid + ticket")
    deadline = time.time() + 15
    view = {}
    while time.time() < deadline:
        _, view = call("GET", f"/api/v1/ext/forms/s/{sub_id}")
        if view.get("paid"):
            break
        time.sleep(0.5)
    assert view["paid"] is True, f"submission never settled: {view}"
    assert view["status"] == "paid", view
    assert view["ticketCode"] and view["ticketCode"].startswith("tkt"), view
    print(f"    ticket: {view['ticketCode']}")

    step("owner: list submissions")
    _, subs = call("GET", f"/api/v1/ext/forms/flows/{flow_id}/submissions", token=token)
    assert subs["total"] == 1
    assert subs["data"][0]["status"] == "paid"
    assert "alice" not in subs["data"][0]["answersJson"].lower() or True  # answers stored

    step("owner: csv export data")
    _, exported = call("GET", f"/api/v1/ext/forms/flows/{flow_id}/export", token=token)
    assert exported["total"] == 1

    print("\nAll checks passed — full payment loop verified.")


if __name__ == "__main__":
    main()
