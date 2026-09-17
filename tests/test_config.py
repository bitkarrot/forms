import json
from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_wasm_config_declares_matching_exports_and_routes():
    config = json.loads((ROOT / 'config.json').read_text())
    exports = {item['name'] for item in config['wasm']['exports']}
    routes = {item['export'] for item in config['api_routes']}
    assert config['extension_type'] == 'wasm'
    assert routes <= exports
    assert {'create-flow', 'public-get-flow', 'public-submit', 'on-invoice-paid'} <= exports
    event_exports = {e['name'] for e in config['wasm']['exports'] if e['visibility'] == 'event'}
    assert config['events']['onInvoicePaid'] in event_exports


def test_public_invoice_permission_is_restricted_to_flow_wallet_field():
    config = json.loads((ROOT / 'config.json').read_text())
    permission = next(p for p in config['permissions'] if p['id'] == 'wallet.create_invoice_public')
    assert permission['policies'] == [{'table': 'flows', 'wallet_field': 'walletId'}]


def test_wallet_id_is_never_in_public_fields():
    config = json.loads((ROOT / 'config.json').read_text())
    permission = next(p for p in config['permissions'] if p['id'] == 'ext.storage.read_public')
    for policy in permission['policies']:
        assert 'walletId' not in policy['public_fields']


def test_no_websocket_or_outbound_permissions():
    config = json.loads((ROOT / 'config.json').read_text())
    ids = {p['id'] for p in config['permissions']}
    assert 'websocket.subscribe' not in ids
    assert not any(i.startswith('http.') for i in ids)


def test_storage_schema_has_flows_and_submissions():
    schema = json.loads((ROOT / 'storage/schema.json').read_text())
    assert {'flows', 'submissions'} <= set(schema['tables'])
    submission_fields = {f['name'] for f in schema['tables']['submissions']['fields']}
    assert {'id', 'flowId', 'status', 'answersJson', 'amountSat', 'paymentHash',
            'ticketCode', 'expiresAt', 'createdAt'} <= submission_fields
