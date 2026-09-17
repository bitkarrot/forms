use serde_json::{json, Map, Value};

#[cfg(not(test))]
wit_bindgen::generate!({ path: "wit/world.wit", world: "forms" });
#[cfg(not(test))]
use lnbits::extension::host;

// The native harness compiles this exact implementation with an in-memory host;
// no generated bindings, WASM runtime, LNbits instance, or real invoices involved.
#[cfg(test)]
#[path = "../../tests/backend/mock_host.rs"]
mod host;
#[cfg(test)]
#[path = "../../tests/backend/tests.rs"]
mod tests;
#[cfg(test)]
use tests::Guest;

const MAX_SATS: u64 = 2_100_000_000;
const MAX_FIELDS: usize = 64;
const MAX_ANSWER_LEN: usize = 4_000;
const MAX_OPTIONS: usize = 64;
const MAX_CSS_LEN: usize = 16_000;
const MAX_IMG_DATA_URI: usize = 200_000;
const INVOICE_EXPIRY_SECS: u64 = 900;
const PAGE: u32 = 1000;

const FIELD_TYPES: [&str; 11] = [
    "text", "email", "phone", "textarea", "number", "date", "select", "radio", "checkbox",
    "consent", "nostr_pubkey",
];
const FLOW_STATUSES: [&str; 4] = ["draft", "published", "closed", "archived"];
const ACTIVE_SUBMISSION_STATUSES: [&str; 3] = ["paid", "confirmed", "approved"];
const SUBMISSION_TARGETS: [&str; 3] = ["approved", "rejected", "cancelled"];
const PAID_STATUSES: [&str; 3] = ["paid", "confirmed", "approved"];

fn parse(payload: &str) -> Result<Value, String> {
    serde_json::from_str(payload).map_err(|_| "Invalid JSON request".to_string())
}
fn ok(value: Value) -> String {
    value.to_string()
}
fn err(message: &str) -> String {
    json!({"error": message}).to_string()
}
fn now() -> u64 {
    host::now().timestamp
}
fn stamp() -> String {
    now().to_string()
}
fn id(prefix: &str) -> String {
    host::random_id(&host::RandomIdRequest {
        prefix: prefix.into(),
    })
    .id
}
fn get(table: &str, id: &str, public: bool) -> Option<Value> {
    let response = if public {
        host::storage_get_public(&host::StorageGetPublicRequest {
            table: table.into(),
            id: id.into(),
        })
    } else {
        host::storage_get(&host::StorageGetRequest {
            table: table.into(),
            id: id.into(),
        })
    };
    response
        .data_json
        .and_then(|value| serde_json::from_str(&value).ok())
}
fn set(table: &str, value: &Value) -> bool {
    host::storage_set(&host::StorageSetRequest {
        table: table.into(),
        data_json: Some(value.to_string()),
    })
    .ok
}
fn rows(table: &str, filters: Option<Value>) -> Result<Vec<Value>, String> {
    let mut out = Vec::new();
    let mut offset = 0u32;
    loop {
        let page = host::storage_get_paginated(&host::StoragePaginatedRequest {
            table: table.into(),
            filters_json: filters.as_ref().map(|f| f.to_string()),
            search: None,
            search_fields_json: None,
            sort_by: Some("id".into()),
            descending: false,
            limit: PAGE,
            offset,
        });
        let batch: Vec<Value> = serde_json::from_str(&page.rows_json)
            .map_err(|_| "Invalid storage page JSON".to_string())?;
        let count = batch.len() as u32;
        out.extend(batch);
        offset += count;
        if count < PAGE || offset >= page.total {
            break;
        }
    }
    Ok(out)
}
fn wallets() -> Vec<String> {
    host::list_user_wallets()
        .wallets
        .into_iter()
        .map(|w| w.id)
        .collect()
}
fn owns_wallet(wallet: &str) -> bool {
    wallets().iter().any(|item| item == wallet)
}
fn text(req: &Value, key: &str, max: usize) -> Result<String, String> {
    let value = req
        .get(key)
        .and_then(Value::as_str)
        .unwrap_or("")
        .trim()
        .to_string();
    if value.contains('\0') || value.len() > max {
        return Err(format!("Invalid {key}"));
    }
    Ok(value)
}
fn slug(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 64
        && value
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'_' || b == b'-')
}
fn payment_hash(value: &str) -> Option<String> {
    if value.len() == 64 && value.bytes().all(|c| c.is_ascii_hexdigit()) {
        Some(value.to_ascii_lowercase())
    } else {
        None
    }
}
fn quarantine(reason: &str) -> String {
    host::log(&host::LogRequest {
        level: "warning".into(),
        message: format!("Invoice event quarantined: {reason}"),
    });
    ok(json!({"ignored": true, "quarantined": true, "reason": reason}))
}

// ---- Flow payload validation ----

fn validate_fields(value: &Value) -> Result<String, String> {
    let fields = value
        .get("fields")
        .and_then(Value::as_array)
        .ok_or("schemaJson requires a fields array")?;
    if fields.len() > MAX_FIELDS {
        return Err("Too many fields".into());
    }
    let mut seen = Vec::new();
    let mut out = Vec::new();
    for field in fields {
        let fid = field.get("id").and_then(Value::as_str).unwrap_or("");
        if !slug(fid) || seen.contains(&fid.to_string()) {
            return Err("Field ids must be unique slugs".into());
        }
        seen.push(fid.to_string());
        let ftype = field.get("type").and_then(Value::as_str).unwrap_or("");
        if !FIELD_TYPES.contains(&ftype) {
            return Err(format!("Unsupported field type for {fid}"));
        }
        let label = field
            .get("label")
            .and_then(Value::as_str)
            .unwrap_or("")
            .trim();
        if label.is_empty() || label.len() > 200 {
            return Err(format!("Field {fid} needs a label"));
        }
        let mut normalized = json!({
            "id": fid,
            "type": ftype,
            "label": label,
            "required": field.get("required").and_then(Value::as_bool).unwrap_or(false),
            "help": field.get("help").and_then(Value::as_str).unwrap_or("").chars().take(300).collect::<String>(),
        });
        if ["select", "radio"].contains(&ftype) {
            let options = field
                .get("options")
                .and_then(Value::as_array)
                .ok_or(format!("Field {fid} needs options"))?;
            if options.is_empty() || options.len() > MAX_OPTIONS {
                return Err(format!("Field {fid} needs 1-{MAX_OPTIONS} options"));
            }
            let mut opts = Vec::new();
            for opt in options {
                let o = opt.as_str().unwrap_or("").trim();
                if o.is_empty() || o.len() > 120 {
                    return Err(format!("Invalid option in field {fid}"));
                }
                opts.push(json!(o));
            }
            normalized["options"] = json!(opts);
        }
        if ftype == "consent" {
            normalized["required"] = json!(true);
        }
        out.push(normalized);
    }
    serde_json::to_string(&json!({"fields": out})).map_err(|_| "Invalid schemaJson".into())
}

fn validate_pricing(value: &Value) -> Result<String, String> {
    let mode = value.get("mode").and_then(Value::as_str).unwrap_or("free");
    if !["free", "fixed"].contains(&mode) {
        return Err("Pricing mode must be free or fixed".into());
    }
    let amount = if mode == "fixed" {
        value
            .get("amountSat")
            .and_then(Value::as_u64)
            .filter(|v| *v > 0 && *v <= MAX_SATS)
            .ok_or("Fixed pricing needs a whole-satoshi amount")?
    } else {
        0
    };
    serde_json::to_string(&json!({"mode": mode, "amountSat": amount}))
        .map_err(|_| "Invalid pricingJson".into())
}

fn sanitize_css(css: &str) -> String {
    let lowered = css.to_lowercase();
    for token in ["@import", "url(", "expression(", "-moz-binding", "behavior:", "<"] {
        if lowered.contains(token) {
            return String::new();
        }
    }
    css.chars().take(MAX_CSS_LEN).collect()
}

fn validate_settings(value: &Value) -> Result<String, String> {
    let theme = value
        .get("theme")
        .and_then(Value::as_str)
        .unwrap_or("light")
        .trim();
    if theme.len() > 64 || theme.bytes().any(|b| !(b.is_ascii_alphanumeric() || b == b'-' || b == b'_')) {
        return Err("Invalid theme".into());
    }
    let custom_css = sanitize_css(value.get("customCss").and_then(Value::as_str).unwrap_or(""));
    let confirm_text = value
        .get("confirmText")
        .and_then(Value::as_str)
        .unwrap_or("")
        .chars()
        .take(1000)
        .collect::<String>();
    let require_approval = value
        .get("requireApproval")
        .and_then(Value::as_bool)
        .unwrap_or(false);
    let theme_mode = match value.get("themeMode").and_then(Value::as_str) {
        Some("dark") => "dark",
        _ => "light",
    };
    let renderer = match value.get("renderer").and_then(Value::as_str) {
        Some("stepper") => "stepper",
        _ => "compact",
    };
    let header_image = value
        .get("headerImage")
        .and_then(Value::as_str)
        .unwrap_or("")
        .trim()
        .to_string();
    // The sandboxed frame CSP only allows images from /ext-assets/<id>/ and
    // data: URIs; http(s) still works in the external embed widget.
    // data: URIs carry an inlined file so they get a larger cap.
    let is_data_uri = header_image.starts_with("data:image/");
    let cap = if is_data_uri { MAX_IMG_DATA_URI } else { 500 };
    if header_image.len() > cap
        || (!header_image.is_empty()
            && !(header_image.starts_with("https://")
                || header_image.starts_with("http://")
                || header_image.starts_with("/ext-assets/")
                || is_data_uri))
    {
        return Err(
            "headerImage must be an http(s) URL, /ext-assets/ path or data:image/ URI".into(),
        );
    }
    serde_json::to_string(&json!({
        "theme": theme,
        "themeMode": theme_mode,
        "renderer": renderer,
        "customCss": custom_css,
        "confirmText": confirm_text,
        "requireApproval": require_approval,
        "headerImage": header_image,
    }))
    .map_err(|_| "Invalid settingsJson".into())
}

fn flow_from_request(
    req: &Value,
    flow_id: &str,
    wallet_id: &str,
    existing: Option<&Value>,
) -> Result<Value, String> {
    if let Some(existing) = existing {
        if let Some(value) = req.get("walletId") {
            if Some(value) != existing.get("walletId") {
                return Err("walletId is immutable; create a new flow".into());
            }
        }
        for key in ["status", "createdAt", "updatedAt", "id"] {
            if req.get(key).is_some() {
                return Err(format!("{key} is read-only"));
            }
        }
        let mut updated = existing.clone();
        if req.get("title").is_some() {
            let title = text(req, "title", 120)?;
            if title.is_empty() {
                return Err("Title is required".into());
            }
            updated["title"] = json!(title);
        }
        if req.get("description").is_some() {
            updated["description"] = json!(text(req, "description", 4000)?);
        }
        if let Some(schema) = req.get("schemaJson") {
            updated["schemaJson"] = json!(validate_fields(schema)?);
        }
        if let Some(pricing) = req.get("pricingJson") {
            updated["pricingJson"] = json!(validate_pricing(pricing)?);
        }
        if let Some(settings) = req.get("settingsJson") {
            updated["settingsJson"] = json!(validate_settings(settings)?);
        }
        if let Some(capacity) = req.get("capacity") {
            updated["capacity"] = json!(capacity
                .as_u64()
                .filter(|v| *v <= 1_000_000)
                .ok_or("Invalid capacity")?);
        }
        updated["updatedAt"] = json!(stamp());
        return Ok(updated);
    }
    let title = text(req, "title", 120)?;
    if title.is_empty() {
        return Err("Title is required".into());
    }
    let schema_json = match req.get("schemaJson") {
        Some(v) => validate_fields(v)?,
        None => "{\"fields\":[]}".into(),
    };
    let pricing_json = match req.get("pricingJson") {
        Some(v) => validate_pricing(v)?,
        None => "{\"mode\":\"free\",\"amountSat\":0}".into(),
    };
    let settings_json = match req.get("settingsJson") {
        Some(v) => validate_settings(v)?,
        None => "{}".into(),
    };
    let capacity = req
        .get("capacity")
        .and_then(Value::as_u64)
        .filter(|v| *v <= 1_000_000)
        .unwrap_or(0);
    let stamp = stamp();
    Ok(json!({
        "id": flow_id,
        "title": title,
        "description": text(req, "description", 4000)?,
        "schemaJson": schema_json,
        "pricingJson": pricing_json,
        "currency": "sat",
        "walletId": wallet_id,
        "status": "draft",
        "capacity": capacity,
        "settingsJson": settings_json,
        "createdAt": stamp,
        "updatedAt": stamp,
    }))
}

fn active_submission_count(flow_id: &str) -> Result<u64, String> {
    let submissions = rows("submissions", Some(json!({"flowId": flow_id})))?;
    let now_ts = now();
    let mut active = 0u64;
    for sub in submissions {
        let status = sub.get("status").and_then(Value::as_str).unwrap_or("");
        let pending_live = status == "pending_payment"
            && sub.get("expiresAt").and_then(Value::as_u64).unwrap_or(0) > now_ts;
        if ACTIVE_SUBMISSION_STATUSES.contains(&status) || pending_live {
            active += 1;
        }
    }
    Ok(active)
}

fn remaining_capacity(flow: &Value) -> Result<Value, String> {
    let capacity = flow.get("capacity").and_then(Value::as_u64).unwrap_or(0);
    if capacity == 0 {
        return Ok(Value::Null);
    }
    let flow_id = flow.get("id").and_then(Value::as_str).unwrap_or("");
    let active = active_submission_count(flow_id)?;
    Ok(json!(capacity.saturating_sub(active)))
}

fn public_flow(flow: &Value) -> Result<Value, String> {
    let mut view = Map::new();
    for key in [
        "id",
        "title",
        "description",
        "schemaJson",
        "pricingJson",
        "currency",
        "status",
        "capacity",
        "settingsJson",
    ] {
        if let Some(value) = flow.get(key) {
            view.insert(key.into(), value.clone());
        }
    }
    view.insert("remaining".into(), remaining_capacity(flow)?);
    Ok(Value::Object(view))
}

// ---- Answer validation ----

fn validate_answers(fields: &[Value], answers: &Value) -> Result<String, String> {
    let map = answers
        .as_object()
        .ok_or("answers must be an object")?;
    if map.len() > MAX_FIELDS {
        return Err("Too many answers".into());
    }
    let known: Vec<&str> = fields
        .iter()
        .filter_map(|f| f.get("id").and_then(Value::as_str))
        .collect();
    let mut normalized = Map::new();
    for (key, value) in map {
        if !known.contains(&key.as_str()) {
            return Err(format!("Unknown field {key}"));
        }
        normalized.insert(key.clone(), value.clone());
    }
    for field in fields {
        let fid = field.get("id").and_then(Value::as_str).unwrap_or("");
        let ftype = field.get("type").and_then(Value::as_str).unwrap_or("");
        let required = field.get("required").and_then(Value::as_bool) == Some(true);
        let label = field.get("label").and_then(Value::as_str).unwrap_or(fid);
        let answer = normalized.get(fid).cloned().unwrap_or(Value::Null);
        let blank = match &answer {
            Value::Null => true,
            Value::String(s) => s.trim().is_empty(),
            _ => false,
        };
        if required && blank {
            return Err(format!("{label} is required"));
        }
        if blank {
            normalized.insert(fid.into(), Value::Null);
            continue;
        }
        let valid = match ftype {
            "checkbox" | "consent" => match answer.as_bool() {
                Some(b) => {
                    if ftype == "consent" && !b {
                        return Err(format!("{label} must be accepted"));
                    }
                    normalized.insert(fid.into(), json!(b));
                    true
                }
                None => false,
            },
            "select" | "radio" => {
                let options: Vec<&str> = field
                    .get("options")
                    .and_then(Value::as_array)
                    .map(|o| o.iter().filter_map(Value::as_str).collect())
                    .unwrap_or_default();
                let v = answer.as_str().unwrap_or("");
                options.contains(&v)
            }
            "number" => answer
                .as_str()
                .map(|s| s.trim().parse::<f64>().is_ok())
                .unwrap_or_else(|| answer.is_number()),
            "date" => answer
                .as_str()
                .map(|s| s.len() == 10 && s.bytes().nth(4) == Some(b'-') && s.bytes().nth(7) == Some(b'-'))
                .unwrap_or(false),
            "email" => answer
                .as_str()
                .map(|s| {
                    s.len() <= 254 && s.contains('@') && s.rsplit('@').next().map(|d| d.contains('.')).unwrap_or(false)
                })
                .unwrap_or(false),
            "nostr_pubkey" => answer
                .as_str()
                .map(|s| {
                    (s.len() == 64 && s.bytes().all(|b| b.is_ascii_hexdigit()))
                        || (s.starts_with("npub1") && s.len() <= 96)
                })
                .unwrap_or(false),
            _ => answer.as_str().map(|s| s.len() <= MAX_ANSWER_LEN).unwrap_or(false),
        };
        if !valid {
            return Err(format!("Invalid answer for {label}"));
        }
    }
    serde_json::to_string(&Value::Object(normalized)).map_err(|_| "Invalid answers".into())
}

fn submission_view(sub: &Value) -> Value {
    let status = sub.get("status").and_then(Value::as_str).unwrap_or("");
    let paid = PAID_STATUSES.contains(&status);
    json!({
        "id": sub.get("id"),
        "flowId": sub.get("flowId"),
        "status": status,
        "paid": paid,
        "amountSat": sub.get("amountSat"),
        "expiresAt": sub.get("expiresAt"),
        "ticketCode": if paid { sub.get("ticketCode").cloned().unwrap_or(Value::Null) } else { Value::Null },
        "paidAt": sub.get("paidAt"),
    })
}

struct Component;

impl Guest for Component {
    fn list_flows(_payload: String) -> String {
        let mut flows = match rows("flows", None) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        flows.retain(|f| f.get("status").and_then(Value::as_str) != Some("archived"));
        flows.sort_by(|a, b| {
            b.get("createdAt")
                .and_then(Value::as_str)
                .cmp(&a.get("createdAt").and_then(Value::as_str))
        });
        ok(json!({"total": flows.len(), "data": flows}))
    }

    fn create_flow(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let wallet = match req.get("walletId").and_then(Value::as_str) {
            Some(v) if owns_wallet(v) => v,
            _ => return err("Wallet is not available to this user"),
        };
        let flow_id = id("flow");
        match flow_from_request(&req, &flow_id, wallet, None) {
            Ok(flow) if set("flows", &flow) => ok(flow),
            Ok(_) => err("Could not save flow"),
            Err(e) => err(&e),
        }
    }

    fn get_flow(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let flow_id = req.get("flowId").and_then(Value::as_str).unwrap_or("");
        match get("flows", flow_id, false) {
            Some(flow) => ok(flow),
            None => err("Flow not found"),
        }
    }

    fn update_flow(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let flow_id = match req.get("flowId").and_then(Value::as_str) {
            Some(v) => v,
            None => return err("Flow id is required"),
        };
        let existing = match get("flows", flow_id, false) {
            Some(v) => v,
            None => return err("Flow not found"),
        };
        if existing.get("status").and_then(Value::as_str) == Some("archived") {
            return err("Archived flows cannot be edited");
        }
        let wallet = existing
            .get("walletId")
            .and_then(Value::as_str)
            .unwrap_or("");
        match flow_from_request(&req, flow_id, wallet, Some(&existing)) {
            Ok(flow) if set("flows", &flow) => ok(flow),
            Ok(_) => err("Could not save flow"),
            Err(e) => err(&e),
        }
    }

    fn set_flow_status(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let flow_id = req.get("flowId").and_then(Value::as_str).unwrap_or("");
        let status = req.get("status").and_then(Value::as_str).unwrap_or("");
        if !FLOW_STATUSES.contains(&status) {
            return err("Invalid flow status");
        }
        let mut flow = match get("flows", flow_id, false) {
            Some(v) => v,
            None => return err("Flow not found"),
        };
        flow["status"] = json!(status);
        flow["updatedAt"] = json!(stamp());
        if !set("flows", &flow) {
            return err("Could not update flow status");
        }
        ok(json!({"id": flow_id, "status": status}))
    }

    fn list_submissions(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let flow_id = req.get("flowId").and_then(Value::as_str).unwrap_or("");
        if get("flows", flow_id, false).is_none() {
            return err("Flow not found");
        }
        let mut submissions = match rows("submissions", Some(json!({"flowId": flow_id}))) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        if let Some(status) = req.get("status").and_then(Value::as_str) {
            submissions.retain(|s| s.get("status").and_then(Value::as_str) == Some(status));
        }
        ok(json!({"total": submissions.len(), "data": submissions}))
    }

    fn update_submission(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let sub_id = req.get("subId").and_then(Value::as_str).unwrap_or("");
        let target = req.get("status").and_then(Value::as_str).unwrap_or("");
        if !SUBMISSION_TARGETS.contains(&target) {
            return err("Invalid submission status");
        }
        let mut sub = match get("submissions", sub_id, false) {
            Some(v) => v,
            None => return err("Submission not found"),
        };
        sub["status"] = json!(target);
        if target == "approved"
            && sub.get("ticketCode").and_then(Value::as_str).unwrap_or("").is_empty()
        {
            sub["ticketCode"] = json!(id("tkt"));
        }
        if !set("submissions", &sub) {
            return err("Could not update submission");
        }
        ok(json!({"id": sub_id, "status": target}))
    }

    fn export_submissions(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let flow_id = req.get("flowId").and_then(Value::as_str).unwrap_or("");
        if get("flows", flow_id, false).is_none() {
            return err("Flow not found");
        }
        match rows("submissions", Some(json!({"flowId": flow_id}))) {
            Ok(v) => ok(json!({"total": v.len(), "data": v})),
            Err(e) => err(&e),
        }
    }

    fn list_wallets(_payload: String) -> String {
        let items: Vec<Value> = host::list_user_wallets()
            .wallets
            .into_iter()
            .map(|wallet| json!({"id": wallet.id, "name": wallet.name}))
            .collect();
        ok(json!({"data": items}))
    }

    fn public_get_flow(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let flow_id = req.get("flowId").and_then(Value::as_str).unwrap_or("");
        match get("flows", flow_id, true) {
            Some(flow) => match public_flow(&flow) {
                Ok(v) => ok(v),
                Err(e) => err(&e),
            },
            None => err("Flow not found"),
        }
    }

    fn public_submit(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let flow_id = req.get("flowId").and_then(Value::as_str).unwrap_or("");
        let flow = match get("flows", flow_id, true) {
            Some(v) => v,
            None => return err("Flow not found"),
        };
        if flow.get("status").and_then(Value::as_str) != Some("published") {
            return err("This flow is not open for submissions");
        }
        let fields_json = flow
            .get("schemaJson")
            .and_then(Value::as_str)
            .unwrap_or("{\"fields\":[]}");
        let fields: Vec<Value> = serde_json::from_str::<Value>(fields_json)
            .ok()
            .and_then(|v| v.get("fields").and_then(Value::as_array).cloned())
            .unwrap_or_default();
        let answers_json = match validate_answers(&fields, req.get("answers").unwrap_or(&Value::Null)) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let pricing: Value = serde_json::from_str(
            flow.get("pricingJson")
                .and_then(Value::as_str)
                .unwrap_or("{}"),
        )
        .unwrap_or(json!({}));
        let amount = if pricing.get("mode").and_then(Value::as_str) == Some("fixed") {
            pricing.get("amountSat").and_then(Value::as_u64).unwrap_or(0)
        } else {
            0
        };
        let capacity = flow.get("capacity").and_then(Value::as_u64).unwrap_or(0);
        if capacity > 0 {
            match active_submission_count(flow_id) {
                Ok(active) if active < capacity => {}
                Ok(_) => return err("This flow is full"),
                Err(e) => return err(&e),
            }
        }
        let sub_id = id("sub");
        let free = amount == 0;
        let mut submission = json!({
            "id": sub_id,
            "flowId": flow_id,
            "status": if free { "confirmed" } else { "pending_payment" },
            "answersJson": answers_json,
            "amountSat": amount,
            "paymentHash": "",
            "checkingId": "",
            "ticketCode": if free { id("tkt") } else { String::new() },
            "expiresAt": now() + INVOICE_EXPIRY_SECS,
            "createdAt": stamp(),
            "paidAt": if free { stamp() } else { String::new() },
        });
        // The durable submission row must exist before invoice creation:
        // settlement can arrive before create_invoice_public returns.
        if !set("submissions", &submission) {
            return err("Could not save submission");
        }
        if free {
            return ok(json!({
                "submissionId": sub_id,
                "flowId": flow_id,
                "status": "confirmed",
                "amountSat": 0,
                "ticketCode": submission["ticketCode"],
            }));
        }
        let extra = vec![
            ("submissionId".into(), sub_id.clone()),
            ("flowId".into(), flow_id.into()),
            ("amountSat".into(), amount.to_string()),
        ];
        let invoice = host::create_invoice_public(&host::CreateInvoicePublicRequest {
            source_id: flow_id.into(),
            amount,
            currency: "sat".into(),
            memo: format!(
                "Forms: {}",
                flow.get("title").and_then(Value::as_str).unwrap_or("submission")
            ),
            extra,
        });
        if invoice.payment_hash.is_empty() || invoice.payment_request.is_empty() {
            submission["status"] = json!("cancelled");
            set("submissions", &submission);
            return err("Could not create an invoice; submission cancelled");
        }
        // Settlement can land while create_invoice_public is still on the stack.
        // Merge the invoice ids into whatever is stored now — never write the
        // stale pending_payment snapshot over a paid row.
        let mut stored = get("submissions", &sub_id, false).unwrap_or(submission);
        stored["paymentHash"] = json!(invoice.payment_hash);
        stored["checkingId"] = json!(invoice.checking_id);
        if !set("submissions", &stored) {
            return err("Invoice created but submission update failed; check status by submission id");
        }
        let status = stored.get("status").and_then(Value::as_str).unwrap_or("pending_payment");
        if PAID_STATUSES.contains(&status) {
            return ok(json!({
                "submissionId": sub_id,
                "flowId": flow_id,
                "status": status,
                "amountSat": amount,
                "paymentHash": invoice.payment_hash,
                "paymentRequest": invoice.payment_request,
                "checkingId": invoice.checking_id,
                "expiresAt": stored["expiresAt"],
                "paid": true,
            }));
        }
        ok(json!({
            "submissionId": sub_id,
            "flowId": flow_id,
            "status": "pending_payment",
            "amountSat": amount,
            "paymentHash": invoice.payment_hash,
            "paymentRequest": invoice.payment_request,
            "checkingId": invoice.checking_id,
            "expiresAt": stored["expiresAt"],
        }))
    }

    fn public_get_submission(payload: String) -> String {
        let req = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        let sub_id = req.get("submissionId").and_then(Value::as_str).unwrap_or("");
        let mut sub = match get("submissions", sub_id, false) {
            Some(v) => v,
            None => return err("Submission not found"),
        };
        if sub.get("status").and_then(Value::as_str) == Some("pending_payment")
            && sub.get("expiresAt").and_then(Value::as_u64).unwrap_or(0) <= now()
        {
            sub["status"] = json!("expired");
            set("submissions", &sub);
        }
        ok(submission_view(&sub))
    }

    fn on_invoice_paid(payload: String) -> String {
        let event = match parse(&payload) {
            Ok(v) => v,
            Err(e) => return err(&e),
        };
        if event.get("pending").and_then(Value::as_bool) != Some(false)
            || event.get("status").and_then(Value::as_str) != Some("success")
        {
            return ok(json!({"ignored": true}));
        }
        let hash = match event
            .get("paymentHash")
            .and_then(Value::as_str)
            .and_then(payment_hash)
        {
            Some(h) => h,
            None => return quarantine("Invalid payment hash"),
        };
        let extra = match event
            .get("extra")
            .and_then(|v| v.get("extra_forms"))
            .and_then(Value::as_object)
        {
            Some(e) => e,
            None => return quarantine("Missing submission binding"),
        };
        let sub_id = extra.get("submissionId").and_then(Value::as_str).unwrap_or("");
        let flow_id = extra.get("flowId").and_then(Value::as_str).unwrap_or("");
        if sub_id.is_empty() || flow_id.is_empty() {
            return quarantine("Missing submission binding");
        }
        let amount_msat = event.get("amount").and_then(Value::as_u64).unwrap_or(0);
        if amount_msat == 0 || amount_msat % 1000 != 0 || amount_msat / 1000 > MAX_SATS {
            return quarantine("Invalid paid invoice amount");
        }
        let amount_sat = amount_msat / 1000;
        let mut sub = match get("submissions", sub_id, false) {
            Some(v) => v,
            None => return quarantine("Unknown submission"),
        };
        if sub.get("flowId").and_then(Value::as_str) != Some(flow_id)
            || sub.get("amountSat").and_then(Value::as_u64) != Some(amount_sat)
            || extra
                .get("amountSat")
                .and_then(Value::as_str)
                .and_then(|v| v.parse::<u64>().ok())
                != Some(amount_sat)
        {
            return quarantine("Submission does not match payment");
        }
        let flow = match get("flows", flow_id, false) {
            Some(v) => v,
            None => return quarantine("Submission flow not found"),
        };
        let event_wallet = event.get("walletId").and_then(Value::as_str).unwrap_or("");
        let flow_wallet = flow.get("walletId").and_then(Value::as_str).unwrap_or("");
        if event_wallet.is_empty() || flow_wallet.is_empty() || event_wallet != flow_wallet {
            return quarantine("Paid invoice wallet does not match flow");
        }
        if PAID_STATUSES.contains(&sub.get("status").and_then(Value::as_str).unwrap_or("")) {
            if sub.get("paymentHash").and_then(Value::as_str) == Some(hash.as_str()) {
                return ok(json!({"duplicate": true, "submissionId": sub_id}));
            }
            return quarantine("Submission already settled with another payment");
        }
        let requires_approval = flow
            .get("settingsJson")
            .and_then(Value::as_str)
            .and_then(|s| serde_json::from_str::<Value>(s).ok())
            .and_then(|s| s.get("requireApproval").and_then(Value::as_bool))
            .unwrap_or(false);
        sub["status"] = json!(if requires_approval { "confirmed" } else { "paid" });
        sub["paidAt"] = json!(stamp());
        sub["paymentHash"] = json!(hash);
        sub["checkingId"] = json!(event
            .get("checkingId")
            .and_then(Value::as_str)
            .unwrap_or(""));
        if !requires_approval
            && sub.get("ticketCode").and_then(Value::as_str).unwrap_or("").is_empty()
        {
            sub["ticketCode"] = json!(id("tkt"));
        }
        if !set("submissions", &sub) {
            return err("Could not record payment");
        }
        ok(json!({"updated": true, "submissionId": sub_id, "amount": amount_sat}))
    }
}

#[cfg(not(test))]
export!(Component);
