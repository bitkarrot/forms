use super::*;

// Deliberately hand-written test surface; production Guest still comes from WIT.
#[allow(dead_code)]
pub(crate) trait Guest {
    fn list_flows(payload: String) -> String;
    fn create_flow(payload: String) -> String;
    fn get_flow(payload: String) -> String;
    fn update_flow(payload: String) -> String;
    fn set_flow_status(payload: String) -> String;
    fn list_submissions(payload: String) -> String;
    fn update_submission(payload: String) -> String;
    fn export_submissions(payload: String) -> String;
    fn list_wallets(payload: String) -> String;
    fn public_get_flow(payload: String) -> String;
    fn public_submit(payload: String) -> String;
    fn public_get_submission(payload: String) -> String;
    fn on_invoice_paid(payload: String) -> String;
    fn delete_flow(payload: String) -> String;
    fn send_test_notification(payload: String) -> String;
}

fn decode(s: String) -> Value {
    serde_json::from_str(&s).unwrap()
}

fn fields() -> Value {
    json!({"fields": [
        {"id": "name", "type": "text", "label": "Name", "required": true},
        {"id": "email", "type": "email", "label": "Email", "required": true},
        {"id": "ticket", "type": "radio", "label": "Ticket", "required": true,
         "options": ["general", "vip"]},
        {"id": "npub", "type": "nostr_pubkey", "label": "Nostr pubkey", "required": false}
    ]})
}

fn create_request() -> Value {
    json!({
        "walletId": host::WALLET,
        "title": "Mock event",
        "description": "A test event",
        "schemaJson": fields(),
        "pricingJson": {"mode": "fixed", "amountSat": 100},
        "capacity": 0,
    })
}

fn create_flow() -> Value {
    host::reset();
    decode(Component::create_flow(create_request().to_string()))
}

fn publish(flow_id: &str) {
    let result = decode(Component::set_flow_status(
        json!({"flowId": flow_id, "status": "published"}).to_string(),
    ));
    assert_eq!(result["status"], "published", "{result}");
}

fn answers() -> Value {
    json!({"name": "Alice", "email": "alice@example.com", "ticket": "vip"})
}

fn submit(flow_id: &str) -> Value {
    decode(Component::public_submit(
        json!({"flowId": flow_id, "answers": answers()}).to_string(),
    ))
}

fn sub_status(sub_id: &str) -> Value {
    decode(Component::public_get_submission(
        json!({"submissionId": sub_id}).to_string(),
    ))
}

#[test]
fn create_flow_persists_and_lists() {
    let flow = create_flow();
    assert_eq!(flow["title"], "Mock event");
    assert_eq!(flow["status"], "draft");
    assert_eq!(flow["walletId"], host::WALLET);
    let list = decode(Component::list_flows("{}".into()));
    assert_eq!(list["total"], 1);
    let fetched = decode(Component::get_flow(
        json!({"flowId": flow["id"]}).to_string(),
    ));
    assert_eq!(fetched["id"], flow["id"]);
}

#[test]
fn create_flow_rejects_foreign_wallet() {
    host::reset();
    let mut req = create_request();
    req["walletId"] = json!("not-my-wallet");
    let result = decode(Component::create_flow(req.to_string()));
    assert!(result.get("error").is_some());
}

#[test]
fn update_flow_validates_and_keeps_wallet() {
    let flow = create_flow();
    let result = decode(Component::update_flow(
        json!({"flowId": flow["id"], "title": "Renamed", "walletId": "x"}).to_string(),
    ));
    assert!(result.get("error").is_some());
    let result = decode(Component::update_flow(
        json!({"flowId": flow["id"], "title": "Renamed"}).to_string(),
    ));
    assert_eq!(result["title"], "Renamed");
    assert_eq!(result["walletId"], host::WALLET);
}

#[test]
fn public_flow_hides_wallet_and_reports_capacity() {
    let flow = create_flow();
    publish(flow["id"].as_str().unwrap());
    let view = decode(Component::public_get_flow(
        json!({"flowId": flow["id"]}).to_string(),
    ));
    assert!(view.get("walletId").is_none());
    assert!(view.get("remaining").is_some());
}

#[test]
fn submit_requires_published_flow() {
    let flow = create_flow();
    let result = submit(flow["id"].as_str().unwrap());
    assert!(result.get("error").is_some());
}

#[test]
fn submit_validates_required_and_typed_answers() {
    let flow = create_flow();
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let missing = decode(Component::public_submit(
        json!({"flowId": flow_id, "answers": {"email": "a@b.co", "ticket": "vip"}})
            .to_string(),
    ));
    assert!(missing.get("error").is_some());
    let bad_option = decode(Component::public_submit(
        json!({"flowId": flow_id, "answers": {"name": "A", "email": "a@b.co", "ticket": "backdoor"}})
            .to_string(),
    ));
    assert!(bad_option.get("error").is_some());
    let bad_email = decode(Component::public_submit(
        json!({"flowId": flow_id, "answers": {"name": "A", "email": "nope", "ticket": "vip"}})
            .to_string(),
    ));
    assert!(bad_email.get("error").is_some());
    let unknown = decode(Component::public_submit(
        json!({"flowId": flow_id, "answers": {"name": "A", "email": "a@b.co", "ticket": "vip", "extra": "x"}})
            .to_string(),
    ));
    assert!(unknown.get("error").is_some());
}

#[test]
fn paid_submit_creates_pending_submission_and_invoice() {
    let flow = create_flow();
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let result = submit(flow_id);
    assert_eq!(result["status"], "pending_payment", "{result}");
    assert_eq!(result["amountSat"], 100);
    assert_eq!(result["paymentRequest"], "lnbc-synthetic-never-pay");
    let sub = host::row("submissions", result["submissionId"].as_str().unwrap()).unwrap();
    assert_eq!(sub["status"], "pending_payment");
    assert_eq!(sub["paymentHash"], host::HASH);
    let view = sub_status(result["submissionId"].as_str().unwrap());
    assert_eq!(view["paid"], false);
}

#[test]
fn invoice_paid_event_marks_paid_with_ticket() {
    let flow = create_flow();
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let result = submit(flow_id);
    let sub_id = result["submissionId"].as_str().unwrap();
    let delivered = decode(Component::on_invoice_paid(host::last_event().to_string()));
    assert_eq!(delivered["updated"], true, "{delivered}");
    let sub = host::row("submissions", sub_id).unwrap();
    assert_eq!(sub["status"], "paid");
    assert!(!sub["ticketCode"].as_str().unwrap().is_empty());
    let view = sub_status(sub_id);
    assert_eq!(view["paid"], true);
    assert!(view["ticketCode"].as_str().unwrap().starts_with("tkt"));
}

#[test]
fn duplicate_payment_event_is_noop() {
    let flow = create_flow();
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let result = submit(flow_id);
    let sub_id = result["submissionId"].as_str().unwrap().to_string();
    decode(Component::on_invoice_paid(host::last_event().to_string()));
    let ticket = host::row("submissions", &sub_id).unwrap()["ticketCode"].clone();
    let again = decode(Component::on_invoice_paid(host::last_event().to_string()));
    assert_eq!(again["duplicate"], true);
    assert_eq!(host::row("submissions", &sub_id).unwrap()["ticketCode"], ticket);
}

#[test]
fn settlement_before_invoice_return_is_recorded() {
    let flow = create_flow();
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    host::state(|s| s.settle_during_create = true);
    let result = submit(flow_id);
    let sub_id = result["submissionId"].as_str().unwrap();
    let early = host::state(|s| s.early_result.take()).unwrap();
    assert_eq!(early["updated"], true, "early={early} sub={:?}", host::row("submissions", sub_id));
    let view = sub_status(sub_id);
    assert_eq!(view["paid"], true);
}

#[test]
fn wrong_amount_payment_is_quarantined() {
    let flow = create_flow();
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let result = submit(flow_id);
    let sub_id = result["submissionId"].as_str().unwrap();
    let mut event = host::last_event();
    event["amount"] = json!(50_000);
    let delivered = decode(Component::on_invoice_paid(event.to_string()));
    assert_eq!(delivered["quarantined"], true);
    assert_eq!(host::row("submissions", sub_id).unwrap()["status"], "pending_payment");
}

#[test]
fn wrong_wallet_payment_is_quarantined() {
    let flow = create_flow();
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let result = submit(flow_id);
    let sub_id = result["submissionId"].as_str().unwrap();
    let mut event = host::last_event();
    event["walletId"] = json!(host::OTHER_WALLET);
    let delivered = decode(Component::on_invoice_paid(event.to_string()));
    assert_eq!(delivered["quarantined"], true);
    assert_eq!(host::row("submissions", sub_id).unwrap()["status"], "pending_payment");
}

#[test]
fn capacity_blocks_additional_submissions() {
    let mut req = create_request();
    req["capacity"] = json!(1);
    host::reset();
    let flow = decode(Component::create_flow(req.to_string()));
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    assert!(submit(flow_id).get("error").is_none());
    let second = submit(flow_id);
    assert_eq!(second["error"], "This flow is full");
}

#[test]
fn expired_pending_frees_capacity_and_status() {
    let mut req = create_request();
    req["capacity"] = json!(1);
    host::reset();
    let flow = decode(Component::create_flow(req.to_string()));
    let flow_id = flow["id"].as_str().unwrap().to_string();
    publish(&flow_id);
    let first = submit(&flow_id);
    let sub_id = first["submissionId"].as_str().unwrap().to_string();
    host::state(|s| s.timestamp += 901);
    let view = sub_status(&sub_id);
    assert_eq!(view["status"], "expired");
    assert!(submit(&flow_id).get("error").is_none());
}

#[test]
fn free_flow_confirms_without_invoice() {
    let mut req = create_request();
    req["pricingJson"] = json!({"mode": "free"});
    host::reset();
    let flow = decode(Component::create_flow(req.to_string()));
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let result = submit(flow_id);
    assert_eq!(result["status"], "confirmed", "{result}");
    assert!(result["ticketCode"].as_str().unwrap().starts_with("tkt"));
    assert!(host::state(|s| s.invoices.is_empty()));
    let view = sub_status(result["submissionId"].as_str().unwrap());
    assert_eq!(view["paid"], true);
}

#[test]
fn submissions_admin_list_export_and_moderate() {
    let flow = create_flow();
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let result = submit(flow_id);
    let sub_id = result["submissionId"].as_str().unwrap();
    let list = decode(Component::list_submissions(json!({"flowId": flow_id}).to_string()));
    assert_eq!(list["total"], 1);
    let exported = decode(Component::export_submissions(json!({"flowId": flow_id}).to_string()));
    assert_eq!(exported["total"], 1);
    let mod_result = decode(Component::update_submission(
        json!({"subId": sub_id, "status": "cancelled"}).to_string(),
    ));
    assert_eq!(mod_result["status"], "cancelled");
    let filtered = decode(Component::list_submissions(
        json!({"flowId": flow_id, "status": "cancelled"}).to_string(),
    ));
    assert_eq!(filtered["total"], 1);
}

#[test]
fn approval_flow_confirms_then_issues_ticket_on_approval() {
    let mut req = create_request();
    req["settingsJson"] = json!({"requireApproval": true});
    host::reset();
    let flow = decode(Component::create_flow(req.to_string()));
    let flow_id = flow["id"].as_str().unwrap();
    publish(flow_id);
    let result = submit(flow_id);
    let sub_id = result["submissionId"].as_str().unwrap();
    let delivered = decode(Component::on_invoice_paid(host::last_event().to_string()));
    assert_eq!(delivered["updated"], true, "{delivered}");
    let sub = host::row("submissions", sub_id).unwrap();
    assert_eq!(sub["status"], "confirmed");
    assert_eq!(sub["ticketCode"], "");
    let view = sub_status(sub_id);
    assert_eq!(view["paid"], true);
    assert!(view["ticketCode"].as_str().unwrap_or("x").is_empty());
    let approved = decode(Component::update_submission(
        json!({"subId": sub_id, "status": "approved"}).to_string(),
    ));
    assert_eq!(approved["status"], "approved");
    let ticket = host::row("submissions", sub_id).unwrap()["ticketCode"].clone();
    assert!(ticket.as_str().unwrap().starts_with("tkt"));
    assert!(sub_status(sub_id)["ticketCode"].as_str().unwrap().starts_with("tkt"));
}

#[test]
fn css_sanitization_strips_dangerous_constructs() {
    host::reset();
    let mut req = create_request();
    req["settingsJson"] = json!({"theme": "dark", "customCss": "a{background:url(https://evil.example/x)}"});
    let flow = decode(Component::create_flow(req.to_string()));
    let settings: Value = serde_json::from_str(flow["settingsJson"].as_str().unwrap()).unwrap();
    assert_eq!(settings["customCss"], "");
    assert_eq!(settings["theme"], "dark");
}

#[test]
fn notifications_fire_on_submit_and_payment() {
    let mut req = create_request();
    req["settingsJson"] = json!({
        "notifyUrl": "https://api.web3forms.com/submit",
        "notifyKey": "test-key-123",
    });
    host::reset();
    let flow = decode(Component::create_flow(req.to_string()));
    let flow_id = flow["id"].as_str().unwrap();
    // endpoint + secret are stored but stripped from the public view
    let stored: Value = serde_json::from_str(
        host::row("flows", flow_id).unwrap()["settingsJson"].as_str().unwrap(),
    )
    .unwrap();
    assert_eq!(stored["notifyUrl"], "https://api.web3forms.com/submit");
    assert_eq!(stored["notifyKey"], "test-key-123");
    publish(flow_id);
    let public = decode(Component::public_get_flow(
        json!({"flowId": flow_id}).to_string(),
    ));
    let public_settings: Value =
        serde_json::from_str(public["settingsJson"].as_str().unwrap()).unwrap();
    assert_eq!(public_settings["notifyUrl"], "");
    assert_eq!(public_settings["notifyKey"], "");
    let result = submit(flow_id);
    assert_eq!(result["status"], "pending_payment", "{result}");
    // "submitted" notification fired once checkout started
    assert_eq!(host::state(|s| s.http_calls.len()), 1);
    let (method, url, body) = &host::state(|s| s.http_calls[0].clone());
    assert_eq!(method, "POST");
    assert_eq!(url, "https://api.web3forms.com/submit");
    let payload: Value = serde_json::from_str(body.as_deref().unwrap()).unwrap();
    assert_eq!(payload["access_key"], "test-key-123");
    assert_eq!(payload["event"], "submitted");
    assert_eq!(payload["answers"]["Email"], "alice@example.com");
    decode(Component::on_invoice_paid(host::last_event().to_string()));
    // "paid" notification fired on settlement
    assert_eq!(host::state(|s| s.http_calls.len()), 2);
    let paid_body: Value = serde_json::from_str(
        host::state(|s| s.http_calls[1].2.clone()).as_deref().unwrap(),
    )
    .unwrap();
    assert_eq!(paid_body["event"], "paid");
}

#[test]
fn notify_url_rejects_non_https() {
    host::reset();
    let mut req = create_request();
    req["settingsJson"] = json!({"notifyUrl": "http://evil.example.com/hook"});
    let result = decode(Component::create_flow(req.to_string()));
    assert!(result["error"].as_str().unwrap_or("").contains("notifyUrl"));
}

#[test]
fn notify_url_accepts_custom_hosts_but_skips_sending() {
    host::reset();
    let mut req = create_request();
    req["settingsJson"] = json!({"notifyUrl": "https://custom.example.com/hook"});
    let flow = decode(Component::create_flow(req.to_string()));
    let flow_id = flow["id"].as_str().unwrap();
    // Any https URL may be saved — the http.request policy decides what is
    // reachable, and notify() skips unlisted hosts rather than trapping the
    // submission.
    publish(flow_id);
    let result = submit(flow_id);
    assert_eq!(result["status"], "pending_payment", "{result}");
    assert_eq!(host::state(|s| s.http_calls.len()), 0);
}
