# Forms (WASM) — Payment-Gated Forms & Registration Workflows for LNbits

Status: planning
Verified against: `lnbits` dev branch (`v1.6.2-rc1`, commit `e336fe1`), `lnbits/core/wasm_ext/`
Sibling research: `../proposal.md` (GammaMarkets), `../paidtasks/` (legacy-ABI template)

## 1. Naming

**Recommendation: `forms` (display name "Forms").**

- The primitive users search for and build is a *form*; the payment gate is a feature of it.
- "Workflows" over-promises: MVP has one linear submit → pay → fulfill pipeline, not a
  general workflow engine.
- LNbits store names are short nouns (TipJar, Paywall, SatsPay, Events, PaidTasks).
- Tagline carries the differentiator: *"Payment-gated forms, registrations and paid
  workflows."*
- Free flows (payment disabled) keep the name honest as a general tool.
- Fallback if reviewers find `forms` too broad: `paidforms`.

## 2. Product shape

A self-hostable, Lightning-native paid registration/workflow engine:

```
draft → submitted → pending_payment → paid → fulfilled
                  → expired / cancelled → refunded
```

- One schema, two renderers: compact form + Typeform-style stepper (conversational
  renderer later, over the same schema — never bake a transcript into the data model).
- Payments are Lightning-only for MVP (LNbits invoices to the organizer's wallet).
  Stripe is a post-MVP option via `http.request`.
- Theming: preset light/dark themes + organizer-supplied custom CSS where the host
  context allows it (the frame CSP is strict — see §9).
- Distribution: hosted public page + copy-paste embed widget for external sites.
- Optional NIP-07 "Nostr login" field type for pubkey prefill on the public side.
  No Nostr on the backend.
- Target users: Bitcoin meetups, Nostr communities, hacker events, membership clubs,
  paid workshops.

## 3. WASM runtime facts (verified on dev)

### 3.1 Module ABI — component model, NOT the paidtasks ABI

- Runtime is wasmtime with `wasm_component_model = true` + WASIp2
  (`linker.add_wasip2()`). Modules must be **WASM components**.
- Exports are invoked as `export(payload: string) -> string`; payload is a JSON object
  serialized to string, return value is a JSON string parsed into the HTTP response.
- Host functions are component-model imports under `lnbits:extension/<interface>`:
  - `lnbits:extension/host` — storage, websocket.publish, wallet.*, http.request,
    extension.api.request, system.random_id/now/log
  - `lnbits:extension/utils-currencies` — list/rate/convert/fiat-to-sats/sats-to-fiat
  - `lnbits:extension/utils-lightning` — decode/validate invoice, payment-hash,
    amount, expiry, memo, verify-preimage, random-secret-and-hash
  - `lnbits:extension/utils-lnurl` — resolve
  - `lnbits:extension/utils-server` — health
- Function names are kebab-case (`storage-get`, `create-invoice-public`, …).
  Params/results are component records; complex objects travel as JSON strings inside
  `*_json` fields (e.g. `data_json`, `rows_json`); **maps serialize as
  `list<tuple<string, string>>`** (confirmed: `extra-json` is silently ignored —
  see `zapgoalswasm/tests/backend/stock_invoice_abi.py`).
- Reference implementations: `../zapgoalswasm/` and `../giftcardswasm/` are
  working, registry-included component extensions. Each ships `wasm/wit/world.wit`
  (hand-authored) + `wasm/src/bindings.rs` (generated, checked in). Toolchain:
  **cargo-component + `wasm32-wasip1`**, pinned in `build-tools.json`
  (Rust 1.98.0, cargo-component 0.21.1, Node 22.22.3).
- Runtime limits enforced per invocation: fuel, max execution ms, request/response
  bytes, memory, stack. No long-running loops — WASM is per-call only.

### 3.2 `config.json` schema (dev)

```jsonc
{
  "id": "forms",
  "name": "Forms",
  "extension_type": "wasm",
  "version": "0.1.0",
  "min_lnbits_version": "1.6.0",
  "wasm": {
    "module": "wasm/forms.wasm",
    "world": "forms",
    "exports": [
      {"name": "create-flow", "visibility": "authenticated"},
      {"name": "public-submit", "visibility": "public"},
      {"name": "on-invoice-paid", "visibility": "event"}
    ]
  },
  "events": {"onInvoicePaid": "on-invoice-paid"},
  "ui_routes": [
    {"path": "/", "entrypoint": "templates/forms/index.html", "auth": "user"},
    {"path": "/f/{flowId}", "entrypoint": "templates/forms/public.html",
     "auth": "public"}
  ],
  "api_routes": [
    {"method": "POST", "path": "/f/{flowId}/submit", "export": "public-submit",
     "auth": "public",
     "ownerContext": {"table": "flows", "idParam": "flowId"}}
  ],
  "permissions": [ /* see §7 */ ]
}
```

- `api_routes` mount at `/api/v1/ext/forms<path>`; `auth: "public" | "user"`.
- `ownerContext`: for public routes, resolves the row in `table` by `idParam` and runs
  the export with that row's `__lnbits_owner_id__` → storage writes land in the flow
  owner's namespace. This is the multi-tenant backbone.
- `events.onInvoicePaid` fires (context `"event"`, owner resolved via
  `extra.source_id` → public-invoice source tables) when a payment tagged with this
  extension settles. Payload: `paymentHash`, `checkingId`, `walletId`, `amount`,
  `bolt11`, `extra`, full `payment` object.

### 3.3 Storage — schema'd tables, owner-scoped

Not raw KV. The extension ships `storage/schema.json` + `storage/migrations/NNN_*.json`
(ops: `create_table`, `add_field`, `create_index`). Field types:
`string | integer | number | boolean | datetime`, plus `list`, `nullable`, `default`.
Every row gets `id` (PK) + `__lnbits_owner_id__` (set by host, reserved name).

Host methods (permission → method):
- `ext.storage.read` → `storage.get`, `storage.get_paginated` (owner-scoped)
- `ext.storage.write` → `storage.set` (upsert), `storage.delete`
- `ext.storage.read_public` → `storage.get_public`, `storage.get_public_paginated`
  — fields filtered by declared `public_fields` policy
- `ext.storage.append_public` → `storage.append_public`
  — public inserts with `allowed_fields` + `max_rows_per_source` cap (natural
  per-flow submission bound if we choose this path)

Query model: exact-match `filters`, `search`+`search_fields` (LIKE), `sort_by`,
`limit` ≤1000, `offset`. Design tables around these primitives — no arbitrary WHERE.

### 3.4 Payments

- `wallet.create_invoice` (auth; wallet must belong to the calling user)
- `wallet.create_invoice_public` (no auth): policies `[{table, wallet_field}]` →
  `source_id` looks up the public-table row, reads `wallet_field`, creates the
  invoice into that wallet. Invoice `extra` is set to
  `{tag: ext_id, source_id, extra_<ext_id>: <our dict>}` — `extra_forms.submission_id`
  links payment → submission.
- `utils.currencies.fiat_to_sats` / `sats_to_fiat` — fiat-denominated pricing with
  sats settlement, rate snapshotted on the submission.
- `utils.lightning.invoice_expiry` — client-side expiry countdown.
- `utils.lightning.random_secret_and_hash` — ticket/check-in codes.
- `wallet.pay_invoice` — refunds/payouts (post-MVP; needs `wallet.pay_invoice` perm
  + explicit user grant).

### 3.5 Frontend — sandboxed iframe + bridge

- `ui_routes` serve static `.html` entrypoints inside a hardened iframe:
  `sandbox allow-scripts`, CSP `default-src 'none'; connect-src 'none'`.
  **No fetch/XHR/WebSocket from extension JS — all IO goes through the
  parent bridge** (MessageChannel, `lnbits-extension:connect` handshake).
- Styles: `style-src` allows only `/ext-assets/<id>/`; `style-src-attr 'none'`
  kills `style=` attributes (and, in modern browsers, `element.style` CSSOM
  mutation). `<style>` elements are blocked too. Theming design lives in §9.1.
- Framing: the wrapper page sends `frame-ancestors 'self'` +
  `X-Frame-Options: SAMEORIGIN`, and the frame CSP also ends with
  `frame-ancestors 'self'` → **the hosted pages cannot be iframed into an
  external site**. The embed story is therefore a JS widget, not an iframe (§9.2).
- Bridge actions: `context` (extensionId, routeParams, query, public flag), `api`
  (proxied call to declared `api_routes`), `ui.notify`, `navigation.replace`,
  `navigation.open_new_tab` (user-prompted), `storage.session.get/set`,
  `ui.scan_qr` (perm `ui.camera.scan_qr`), `permissions.request*` (incl. background
  payments + wallet watch grants), `payment.subscribe` (ws `/api/v1/ws/<hash>`; only
  for payment hashes seen in prior API responses — available if we ever want it),
  `websocket.subscribe/send` (perm `websocket.subscribe`; `/api/v1/ext/ws/forms/<item>`
  — **not used in MVP**; payment status is a verified-receipt poll, §8).
- Core vendor assets are served at `/ext-assets/forms/_lnbits/`:
  `vue.global.prod.js`, `quasar.umd.prod.js`, `quasar.css`, `material-icons.css`,
  `qrcode.vue.browser.js` → **Vue3 + Quasar UMD + QR component, no CDN**.
  Note: no `unsafe-eval` in `script-src`, so Vue templates must be
  **precompiled** at build time (zapgoals' `build-templates.js` →
  `*-template.js` pattern) — no runtime template compilation.
- Bridge client: copy `zapgoalswasm/static/js/bridge.js` — a ~60-line
  MessageChannel wrapper (`connect`, `callApi`, `notify`, `replaceRoute`,
  `subscribePayment`, `onEvent`).
- Dynamic styling in-frame works via **`adoptedStyleSheets`**
  (`new CSSStyleSheet().replaceSync(...)`) — proven by zapgoals'
  `applyGoalDesign()`. Sanitize inputs (color regex, font whitelist).
- Static assets: whitelisted mime types only; `.js`/`.css` starting with
  `<!doctype|<html|<script` are rejected (no HTML smuggling).

### 3.6 Constraints that shape the design

| Constraint | Consequence |
|---|---|
| No cron/timers (`onInvoicePaid` is the only event) | Lazy expiry: recompute pending-submission staleness inside `public_submit`/`public_get_submission` using invoice `expires_at` + `system.now` |
| No `check_invoice`/payment-status host read | Payment status reaches us via `onInvoicePaid` (backend) and `payment.subscribe` (frontend). Store status on the submission row. |
| No secrets host API | Stripe secret keys (post-MVP) live in a non-public table, owner-scoped. Never in `public_fields`. |
| No outbound WebSocket; `http.request` = HTTPS + per-origin allowlist, SSRF-guarded | Stripe API reachable (`api.stripe.com` origin); Nostr relays not — use `extension.api.request` → nostrclient instead |
| No per-IP rate limiting on public routes | Bound abuse in-module: per-flow pending cap, per-source append caps, ws publish rate policy |
| 64KB http.request body, ~256KB api response, runtime byte limits | Keep `answers_json` bounded; reject oversized submissions early |

## 4. Reference implementations and ABI generations

Three WASM extension generations exist in this workspace:

- **`paidtasks/`** — legacy ABI: raw `host` externs (`db_get`, `db_secret_get`,
  `http_request`), `public_request:`/`public_response:` KV indirection, Jinja
  templates, old config keys. **Will not instantiate on the dev runtime.**
  Repo-layout reference only.
- **`zapgoalswasm/`** — current component-model ABI, registry-included
  (v0.5.2, sha256-pinned release zip). Canonical reference: `wasm/wit/world.wit`,
  `build-tools.json` toolchain pins, `Makefile`, `tools/package.py` deterministic
  packaging, `manifest.json` explicit release manifest, mock-host cargo tests +
  pytest config tests + playwright specs. **Copy this skeleton.**
- **`giftcardswasm/`** — second registry example; good reference for multiple
  public pages (`redeem/{token}`) and a `settings` table pattern.

## 5. Module design

- **Language/toolchain:** Rust + **cargo-component → `wasm32-wasip1`**, matching
  zapgoals' pinned toolchain (`build-tools.json`: Rust 1.98.0, cargo-component
  0.21.1). serde_json for payload I/O; generated `bindings.rs` checked in.
- **WIT:** author `wasm/wit/world.wit` (`package lnbits:extension`), importing only
  the host functions we use — model on `zapgoalswasm/wasm/wit/world.wit`. Confirmed
  serialization: record fields kebab-case; `dict` fields → `list<tuple<string,
  string>>`; complex/nested objects → `*_json: option<string>`; optionals →
  `option<...>`.
- **Exports:** kebab-case names (`create-flow`, `public-submit`, `on-invoice-paid`),
  `func(payload: string) -> string`, one export per route (visibility is enforced
  per-export).
- **Route paths:** ui_routes carry the ext id — `/forms`, `/forms/f/{flow_id}` →
  served at `/ext/forms`, `/ext/forms/f/{flow_id}`. api_routes are auto-namespaced:
  `/flows` → `/api/v1/ext/forms/flows`.

### Exports

Authenticated (organizer):
| export | route | purpose |
|---|---|---|
| `list-flows` | GET `/api/v1/ext/forms/flows` | paginated flow list |
| `create-flow` | POST `/flows` | create draft |
| `get-flow` | GET `/flows/{flowId}` | full flow for builder |
| `update-flow` | PUT `/flows/{flowId}` | edit fields/pricing/settings (`ownerContext`) |
| `set-flow-status` | POST `/flows/{flowId}/status` | publish/close (`ownerContext`) |
| `list-submissions` | GET `/flows/{flowId}/submissions` | paginated, filtered (`ownerContext`) |
| `update-submission` | PATCH `/submissions/{subId}` | approve/reject/cancel (`ownerContext` on `submissions`) |
| `export-submissions` | GET `/flows/{flowId}/export` | JSON rows → client-side CSV (`ownerContext`) |
| `list-wallets` | GET `/wallets` | payout wallet picker (`wallet.list`) |

Public (no auth; `ownerContext` resolves the owner from the row):
| export | route | purpose |
|---|---|---|
| `public-get-flow` | GET `/f/{flowId}` | public flow view + capacity remaining |
| `public-submit` | POST `/f/{flowId}/submit` | validate → create pending submission → `create-invoice-public` → `{submissionId, bolt11, paymentHash, amountSat, expiresAt}` |
| `public-get-submission` | GET `/s/{submissionId}` | verified status; `paid:true` only after `onInvoicePaid` has durably recorded it; ticket code + receipt data |

Event:
| export | trigger | purpose |
|---|---|---|
| `on-invoice-paid` | `events.onInvoicePaid` | match `extra.extra_forms.submissionId` → verify amount + submission still pending → `paid` → issue `ticketCode`. Idempotent: re-delivery is a no-op. |

## 6. Data model (`storage/schema.json` sketch)

```jsonc
{
  "tables": {
    "flows": {
      "fields": [
        {"name": "id", "type": "string"},
        {"name": "title", "type": "string"},
        {"name": "description", "type": "string", "default": ""},
        {"name": "schemaJson", "type": "string"},      // fields, steps, conditional rules
        {"name": "pricingJson", "type": "string"},     // products, amounts, free/paid
        {"name": "currency", "type": "string"},        // "sat" or fiat code
        {"name": "walletId", "type": "string"},        // payout wallet (never public)
        {"name": "status", "type": "string"},          // draft|published|closed
        {"name": "capacity", "type": "integer"},       // 0 = unlimited
        {"name": "settingsJson", "type": "string"},    // renderer, theme, custom CSS, confirm text
        {"name": "createdAt", "type": "string"},       // ISO ts (zapgoals convention)
        {"name": "updatedAt", "type": "string"}
      ]
    },
    "submissions": {
      "fields": [
        {"name": "id", "type": "string"},
        {"name": "flowId", "type": "string"},
        {"name": "status", "type": "string"},          // pending_payment|paid|expired|cancelled|refunded|approved|rejected
        {"name": "answersJson", "type": "string"},
        {"name": "amountSat", "type": "integer"},
        {"name": "paymentHash", "type": "string", "default": ""},
        {"name": "checkingId", "type": "string", "default": ""},
        {"name": "ticketCode", "type": "string", "default": ""},
        {"name": "expiresAt", "type": "integer"},      // invoice expiry, unix ts
        {"name": "createdAt", "type": "string"},
        {"name": "paidAt", "type": "string", "default": ""}
      ]
    }
  }
}
```

(Field names camelCase, matching the zapgoals/giftcards convention — payloads and
route params arrive camelCase anyway.) Migration `storage/migrations/001_init.json`:
`create_table` × 2, `create_index` on `submissions.flowId`, `submissions.status`,
`submissions.paymentHash`.

Public exposure:
- `ext.storage.read_public` policy → `flows`: `public_fields` =
  `[id, title, description, schemaJson, pricingJson, currency, status, capacity,
  settingsJson]` — `walletId` stays server-side. `source_id_field: "id"`.
- `wallet.create_invoice_public` policy → `{table: "flows", wallet_field: "walletId"}`.

## 7. Permissions (config.json sketch)

```jsonc
"permissions": [
  {"id": "ext.storage.read", "description": "Read form data"},
  {"id": "ext.storage.write", "description": "Write form data"},
  {"id": "ext.storage.read_public", "description": "Public flow pages",
   "policies": [{"table_name": "flows", "public_fields": ["id","title","description",
     "schemaJson","pricingJson","currency","status","capacity","settingsJson"],
     "source_id_field": "id"}]},
  {"id": "wallet.create_invoice_public", "description": "Create checkout invoices",
   "policies": [{"table": "flows", "wallet_field": "walletId"}]},
  {"id": "wallet.list", "description": "List your wallets (payout picker)"},
  {"id": "utils.basic", "description": "Currency conversion and invoice utilities"}
]
```

No extension websockets in MVP — payment confirmation is a **verified-receipt poll**
(`public_get_submission` returns `{paid: true}` only after `onInvoicePaid` has
durably recorded it), same discipline as zapgoals ("socket messages never prove
payment"). This keeps the permission surface minimal — good for acceptance.
Post-MVP additions: `wallet.pay_invoice` (refunds), `http.request`
(`api.stripe.com`), `extension.api.request` (`nostrclient`).

## 8. Payment flow (the core loop)

1. Public page `GET /f/{flowId}` → `public-get-flow` → public flow row + computed
   remaining capacity.
2. Attendee completes stepper → `POST /f/{flowId}/submit`:
   - validate answers against `schemaJson` (types, required, options, custom regex)
   - price snapshot: `pricingJson` + (fiat → `fiat-to-sats` at submit time, store rate)
   - capacity check: count `submissions` where `flowId=X` and
     `status in (paid, pending_payment-not-expired)` — lazy-expire stale pendings
   - create submission `pending_payment` (`random-id`, `expiresAt`)
   - `create-invoice-public(sourceId=flowId, amount, currency, memo,
     extra={submissionId, flowId})` → invoice lands in organizer wallet
   - return `{submissionId, paymentHash, bolt11, amountSat, expiresAt}`
3. Frontend polls `GET /s/{submissionId}` (~2s interval, backoff, watchdog timeout).
   `paid:true` is returned only from the durable row — same verified-receipt
   discipline as zapgoals' `invoice-status` route. No websockets in MVP.
4. `on-invoice-paid` event → verify `extra.extra_forms.submissionId`, check
   `amount >= amountSat`, set `status=paid`, `paidAt`, issue `ticketCode`
   (`random-secret-and-hash` — store hash, show secret).
5. Confirmation screen: ticket code + receipt; the organizer's submissions table
   refreshes on an interval (polling — no ws).

Edge cases: expired invoice → client offers "new invoice" (new submit or
re-invoice same submission via a `public-reinvoice` route — decide in P2); duplicate
payment → second `onInvoicePaid` is a no-op if already `paid`; free flow
(`amountSat=0`) → submit goes straight to `paid`/`confirmed`, no invoice.

## 9. Theming, embed widget and Nostr prefill (MVP)

### 9.1 Theme system under the frame CSP

- **Preset themes ship as static files** — this is the CSP-safe path.
  `static/themes/base.css` + `light.css`, `dark.css` + a few variants
  (`bitcoin`, `minimal`, `contrast`). The public page links `base.css` plus one
  theme file selected from `settingsJson.theme`; a runtime-inserted `<link>`
  to an ext-assets URL is allowed by `style-src`. Theme = root class +
  Quasar dark-mode flag. Ship light and dark for every preset.
- **Custom CSS on the hosted page works** — `adoptedStyleSheets` /
  `new CSSStyleSheet().replaceSync()` is not governed by `style-src`, and
  zapgoals already ships this in production (`applyGoalDesign()` in
  `public.js`). So: organizer pastes CSS in the admin panel → stored in
  `settingsJson.customCss` (kept out of `public_fields`; delivered via the
  `public-get-flow` curated response) → adopted as a constructed sheet.
  Sanitize before storing: strip `@import`, `url(`, `expression(`, `-moz-binding`,
  `behavior:` — `connect-src`/`img-src` already block exfiltration, but strip
  anyway. Cap length (~16KB).
- **Custom CSS in the embed widget is unrestricted** — it runs under the host
  site's CSP, so full organizer CSS applies there (§9.2). That is also where
  custom CSS matters most: matching the organizer's own site.

### 9.2 Embed widget (not an iframe)

Cross-origin iframing of both the wrapper and the frame is blocked by design —
and **this is the proven zapgoals pattern**: a self-contained script served
from the static mount (`<script src>` is a no-cors load, works cross-origin;
LNbits sends `CORSMiddleware allow_origins=["*"]`, so cross-origin `fetch`
to `/api/v1/ext/forms/*` works):

```html
<script src="https://<lnbits>/ext-assets/forms/js/embed.js"
        data-flow="<flow_id>"
        data-theme="dark"
        data-css="https://mysite.com/form-theme.css"
        async></script>
```

Model on `zapgoalswasm/static/js/embed.js`:

- Config comes from `document.currentScript` `data-*` attributes; the LNbits
  origin is derived from the script `src` (no `data-lnbits` needed). Each
  script tag reads its own config → multiple widgets per page.
- Renders into a **shadow root** (`attachShadow`) with an inline `<style>` —
  style isolation plus full freedom under the host page's CSP.
- Vanilla JS only (no framework); QR lib loaded as a sibling static asset
  (`new URL('qr.js', scriptSrc)`), generated locally — never a remote QR
  service.
- Flow: `GET public-get-flow` → render form → `POST public-submit` → BOLT11
  QR + copy + `lightning:` link → **poll `public-get-submission`** until
  `paid` → ticket code.
- `data-theme` picks a preset; `data-css` loads the organizer's stylesheet
  into the shadow root (host page decides its own CSP).
- Admin UI gets a "Share / Embed" panel: hosted link, snippet with theme +
  custom-css options, live preview.

### 9.3 Nostr prefill field (client-side only)

- New field type `nostr_identity` in the builder: a "Login with Nostr" button
  + pubkey input with npub paste fallback (client-side bech32 decode).
- **NIP-07 signing is embed-only.** Browser signers do not inject
  `window.nostr` into the extension's sandboxed iframe, so on the hosted
  `/ext/forms/f/<id>` page the field renders as a plain input (manual
  npub/hex paste). In the embed widget — first-party JS on the organizer's
  site — `window.nostr.getPublicKey()` works and the button auto-fills the
  pubkey. The builder UI should label this clearly ("one-click Nostr login
  works in the website embed; on the hosted page users paste their npub").
- No relays in MVP: `getPublicKey()` returns only the pubkey; we do not fetch
  kind:0 profiles. The "username"/name part is a normal field the attendee
  fills in (or the signer UX may let them copy it).
- Optional `signEvent` nonce proof → backend Schnorr verify via a Rust
  secp256k1 crate: post-MVP hardening.
- Nothing Nostr-specific touches the backend: the answer is stored as a plain
  string in `answersJson`.

## 10. Phases

**P0 — Scaffold spike (de-risked by the reference extensions)**
- Copy the `zapgoalswasm` skeleton: `wasm/wit/world.wit`, `src/bindings.rs`,
  `Cargo.toml`, `build-tools.json`, `Makefile`, `tools/`, `bridge.js`.
- Minimal `config.json` + `storage/schema.json` (one table) + one export +
  one public api_route + one ui_route page calling `context`+`api` via bridge.
- Prove the core loop early: `create-invoice-public` → `on-invoice-paid` →
  status poll — on a local lnbits dev instance.
- Deliverable: hello-world end-to-end on dev. (Remaining unknowns are small:
  none of the ABI questions — those are answered by zapgoals/giftcards.)

**P1 — Builder & admin (auth'd)**
- Schema + migration 001; flow CRUD exports; admin UI: flow list, field editor
  (short text, long text, email, number, select, radio, checkbox, date, consent),
  pricing editor (sat or fiat), wallet picker (`list-wallets`), publish/close,
  share-link copy.

**P2 — Public flow + payment loop + theming**
- Stepper renderer + compact mode; validation; `public-submit`; invoice screen
  (QR, copy, `lightning:` link, expiry countdown); status polling;
  `on-invoice-paid` → ticket code + confirmation page.
- Preset theme loading (base + light/dark + variants) on the public page;
  `nostr_identity` field (paste-only in-frame; NIP-07 button is embed-only,
  §9.3); custom CSS via `adoptedStyleSheets` (proven by zapgoals).

**P3 — Embed widget + ops**
- `static/js/embed.js` widget (zapgoals layout), `data-*` config, share/embed panel
  with snippet generator + preview; organizer custom CSS for embeds
  (`data-css` / inlined `<style>`).
- Capacity + lazy expiry; free flows; submissions table w/ filters/search;
  approve/reject/cancel; resend receipt; CSV export; templates:
  "Event ticket", "Paid membership", "Donation + signup", "Application w/ approval".

**P4 — Registry readiness**
- `description.md`, `toc.md`, tile icon, screenshots, `THIRD_PARTY_NOTICES.txt`
  for any vendored assets (QR encoder), deterministic `tools/package.py` zip +
  sha256, `manifest.json` explicit release manifest (model on
  `zapgoalswasm/manifest.json`), then request inclusion in the LNbits WASM
  extension registry once tested end-to-end.
- Test matrix like zapgoals: mock-host cargo tests (`tests/backend/`), pytest
  config/schema/distribution checks, playwright specs with intercepted
  payment writes (no real payments in CI).

**Post-MVP**
- Stripe: `http.request` to `api.stripe.com` (key in non-public table) + public
  webhook route + in-module HMAC-SHA256 verify (Rust `hmac`/`sha2` are no_std-friendly).
- Conditional-logic v2, coupons, waitlist, multi-attendee orders, refunds
  (`wallet.pay_invoice` + grant), Nostr notifications via `extension.api.request` →
  nostrclient, conversational renderer over the same schema, headless/API mode.

## 11. Open questions

Resolved by the reference extensions: host-param serialization
(`list<tuple>`/`option<string>` — zapgoals `world.wit`), WIT authoring (ship your
own `wit/world.wit`, no central SDK), in-frame custom CSS (`adoptedStyleSheets`
— zapgoals ships it), cross-origin embeds (`allow_origins=["*"]` + proven
`embed.js`), websockets (dropped — verified-receipt polling only).

Remaining:

1. `public-reinvoice` vs new submission on expiry — UX decision, P2.
2. Submission PII: `answersJson` is owner-visible; acceptable. Public reads of
   `submissions` stay off (no `read_public` policy) — receipts go through the
   `public-get-submission` curated view.
3. Custom-CSS sanitization depth: minimal strip (`@import`, `url(`,
   `expression(`) vs a structured theme editor — decide in P2.
4. Registry inclusion process: exact request path (PR to `lnbits-extensions`
   vs a separate wasm registry listing) — confirm in P4 from zapgoals' own
   submission history.

## 12. Test checklist (MVP)

1. Enable extension, grant permissions.
2. Organizer: create "Event ticket" flow → set wallet → publish → copy public link.
3. Attendee (logged-out): open `/f/<id>` → complete stepper → get BOLT11 + QR.
4. Pay invoice → public page flips to confirmed on next poll; ticket code shown.
5. Organizer sees submission `paid` on table refresh; CSV export contains the row.
6. Capacity: set capacity=1 → second submit is rejected.
7. Expiry: let invoice lapse → submit again works; stale pending auto-expires.
8. Themes: pick dark preset → hosted page renders dark; same on embed via
   `data-theme`; custom CSS applies inside the embed.
9. Embed: paste the snippet on a test page → complete a paid submission
   end-to-end.
10. Nostr: in the embed with a NIP-07 signer the field prefills the pubkey;
    on the hosted page (and signerless embeds) manual npub paste works.
