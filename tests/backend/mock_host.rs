//! Test-only, synchronous in-memory implementation of the actual host surface.
//! All IDs/invoices are synthetic; nothing here accesses the network or LNbits.
#![allow(dead_code)]
use crate::tests::Guest;
use serde_json::{json, Value};
use std::{cell::RefCell, collections::BTreeMap};

pub const HASH: &str = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
pub const WALLET: &str = "private-flow-wallet";
pub const OTHER_WALLET: &str = "other-wallet";

pub struct StorageGetRequest {
    pub table: String,
    pub id: String,
}
pub struct StorageGetPublicRequest {
    pub table: String,
    pub id: String,
}
pub struct StorageGetResponse {
    pub data_json: Option<String>,
}
pub struct StorageSetRequest {
    pub table: String,
    pub data_json: Option<String>,
}
pub struct StorageSetResponse {
    pub ok: bool,
}
pub struct StoragePaginatedRequest {
    pub table: String,
    pub filters_json: Option<String>,
    pub search: Option<String>,
    pub search_fields_json: Option<String>,
    pub sort_by: Option<String>,
    pub descending: bool,
    pub limit: u32,
    pub offset: u32,
}
pub struct StoragePaginatedResponse {
    pub rows_json: String,
    pub total: u32,
}
#[derive(Clone)]
pub struct CreateInvoicePublicRequest {
    pub source_id: String,
    pub amount: u64,
    pub currency: String,
    pub memo: String,
    pub extra: Vec<(String, String)>,
}
pub struct CreateInvoiceResponse {
    pub payment_hash: String,
    pub payment_request: String,
    pub checking_id: String,
}
pub struct WalletSummary {
    pub id: String,
    pub name: String,
    pub currency: Option<String>,
}
pub struct ListWalletsResponse {
    pub wallets: Vec<WalletSummary>,
}
pub struct NowResponse {
    pub timestamp: u64,
}
pub struct RandomIdRequest {
    pub prefix: String,
}
pub struct RandomIdResponse {
    pub id: String,
}
pub struct LogRequest {
    pub level: String,
    pub message: String,
}
pub struct LogResponse {
    pub ok: bool,
}
pub struct StorageDeleteRequest {
    pub table: String,
    pub id: String,
}
pub struct StorageDeleteResponse {
    pub ok: bool,
}
pub struct HttpRequest {
    pub method: String,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub body: Option<String>,
}
// The generated bindings name the WIT `http-call` record `HttpCall`.
pub type HttpCall = HttpRequest;
pub struct HttpResponse {
    pub status_code: i32,
    pub headers: Vec<(String, String)>,
    pub body: String,
}

pub const FLOW_PUBLIC_FIELDS: &[&str] = &[
    "id",
    "title",
    "description",
    "schemaJson",
    "pricingJson",
    "currency",
    "status",
    "capacity",
    "settingsJson",
    "createdAt",
    "updatedAt",
];

#[derive(Default)]
pub struct State {
    pub rows: BTreeMap<(String, String), Value>,
    pub invoices: Vec<CreateInvoicePublicRequest>,
    pub logs: Vec<String>,
    pub timestamp: u64,
    pub seq: u64,
    pub fail_invoice: bool,
    pub fail_write_once: Option<String>,
    pub settle_during_create: bool,
    pub early_result: Option<Value>,
    pub http_calls: Vec<(String, String, Option<String>)>,
    pub http_status: i32,
}
thread_local! { static STATE: RefCell<State> = RefCell::new(State::default()); }
pub fn state<T>(f: impl FnOnce(&mut State) -> T) -> T {
    STATE.with(|s| f(&mut s.borrow_mut()))
}
pub fn reset() {
    state(|s| {
        *s = State {
            timestamp: 1_767_225_600,
            http_status: 200,
            ..State::default()
        }
    });
}
pub fn seed(table: &str, row: Value) {
    let id = row["id"].as_str().expect("seed row id").to_string();
    state(|s| {
        s.rows.insert((table.into(), id), row);
    });
}
pub fn row(table: &str, id: &str) -> Option<Value> {
    state(|s| s.rows.get(&(table.into(), id.into())).cloned())
}
pub fn storage_get(req: &StorageGetRequest) -> StorageGetResponse {
    StorageGetResponse {
        data_json: row(&req.table, &req.id).map(|v| v.to_string()),
    }
}
pub fn storage_get_public(req: &StorageGetPublicRequest) -> StorageGetResponse {
    assert_eq!(req.table, "flows", "no public-read policy for {}", req.table);
    let data = row(&req.table, &req.id).map(|mut v| {
        v.as_object_mut()
            .unwrap()
            .retain(|k, _| FLOW_PUBLIC_FIELDS.contains(&k.as_str()));
        v.to_string()
    });
    StorageGetResponse { data_json: data }
}
pub fn storage_set(req: &StorageSetRequest) -> StorageSetResponse {
    let value: Value = serde_json::from_str(req.data_json.as_ref().unwrap()).unwrap();
    let fail = state(|s| s.fail_write_once.take().as_deref() == Some(req.table.as_str()));
    if !fail {
        // Match stock ON CONFLICT: only supplied columns are updated.
        let id = value["id"].as_str().unwrap();
        let mut stored = row(&req.table, id).unwrap_or(json!({}));
        stored
            .as_object_mut()
            .unwrap()
            .extend(value.as_object().unwrap().clone());
        seed(&req.table, stored);
    }
    StorageSetResponse { ok: !fail }
}
pub fn storage_get_paginated(req: &StoragePaginatedRequest) -> StoragePaginatedResponse {
    let filters: Value = req
        .filters_json
        .as_ref()
        .map(|s| serde_json::from_str(s).unwrap())
        .unwrap_or(json!({}));
    let rows: Vec<Value> = state(|s| {
        let mut items: Vec<Value> = s
            .rows
            .iter()
            .filter(|((t, _), v)| {
                t == &req.table
                    && filters
                        .as_object()
                        .unwrap()
                        .iter()
                        .all(|(k, expected)| v.get(k) == Some(expected))
            })
            .map(|(_, v)| v.clone())
            .collect();
        items.sort_by(|a, b| a["id"].as_str().cmp(&b["id"].as_str()));
        items
    });
    let total = rows.len() as u32;
    let rows: Vec<_> = rows
        .into_iter()
        .skip(req.offset as usize)
        .take(req.limit as usize)
        .collect();
    StoragePaginatedResponse {
        rows_json: json!(rows).to_string(),
        total,
    }
}
pub fn native_extra(pairs: &[(String, String)]) -> Value {
    Value::Object(
        pairs
            .iter()
            .map(|(key, value)| (key.clone(), Value::String(value.clone())))
            .collect(),
    )
}
pub fn event(extra: Value) -> Value {
    json!({"walletId": WALLET, "pending": false, "status": "success", "paymentHash": HASH,
        "checkingId": "mock-checking-id",
        "amount": extra["amountSat"].as_str().and_then(|v| v.parse::<u64>().ok()).unwrap_or(0) * 1000,
        "extra": {"source_id": extra["flowId"], "extra_forms": extra}})
}
pub fn last_event() -> Value {
    let extra = state(|s| native_extra(&s.invoices.last().unwrap().extra));
    event(extra)
}
pub fn create_invoice_public(req: &CreateInvoicePublicRequest) -> CreateInvoiceResponse {
    // Stock CreateInvoicePublicRequest accepts native `extra`, not an
    // extra_json alias. WIT tuples become a dict through host validation.
    let extra = native_extra(&req.extra);
    assert_eq!(req.currency, "sat");
    assert_eq!(extra["amountSat"], req.amount.to_string());
    let sub_id = extra["submissionId"].as_str().expect("submission binding");
    let submission = row("submissions", sub_id).expect("submission must already be durable");
    assert_eq!(submission["flowId"], req.source_id);
    assert!(
        !req.memo.contains(sub_id),
        "private binding must not enter BOLT11 memo"
    );
    let settle = state(|s| {
        s.invoices.push(req.clone());
        assert!(!s.fail_invoice, "synthetic invoice host failure");
        s.settle_during_create
    });
    if settle {
        let result: Value =
            serde_json::from_str(&crate::Component::on_invoice_paid(event(extra).to_string()))
                .unwrap();
        state(|s| s.early_result = Some(result));
    }
    CreateInvoiceResponse {
        payment_hash: HASH.into(),
        payment_request: "lnbc-synthetic-never-pay".into(),
        checking_id: "mock-checking-id".into(),
    }
}
pub fn list_user_wallets() -> ListWalletsResponse {
    ListWalletsResponse {
        wallets: vec![
            WalletSummary {
                id: WALLET.into(),
                name: "Mock flow wallet".into(),
                currency: None,
            },
            WalletSummary {
                id: OTHER_WALLET.into(),
                name: "Mock other wallet".into(),
                currency: None,
            },
        ],
    }
}
pub fn now() -> NowResponse {
    NowResponse {
        timestamp: state(|s| s.timestamp),
    }
}
pub fn random_id(req: &RandomIdRequest) -> RandomIdResponse {
    RandomIdResponse {
        id: state(|s| {
            s.seq += 1;
            format!("{}{}", req.prefix, s.seq)
        }),
    }
}
pub fn log(req: &LogRequest) -> LogResponse {
    state(|s| s.logs.push(format!("{}:{}", req.level, req.message)));
    LogResponse { ok: true }
}
pub fn storage_delete(req: &StorageDeleteRequest) -> StorageDeleteResponse {
    let removed = state(|s| s.rows.remove(&(req.table.clone(), req.id.clone())).is_some());
    StorageDeleteResponse { ok: removed }
}
pub fn http_request(req: &HttpRequest) -> HttpResponse {
    let status = state(|s| {
        s.http_calls
            .push((req.method.clone(), req.url.clone(), req.body.clone()));
        s.http_status
    });
    HttpResponse {
        status_code: status,
        headers: vec![],
        body: "{}".into(),
    }
}
