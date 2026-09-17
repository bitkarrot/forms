.PHONY: build check package test test-python test-backend

PYTHON ?= python3

build:
	$(PYTHON) tools/check_toolchain.py
	npm run build
	cargo component build --manifest-path wasm/Cargo.toml --locked --release
	cp wasm/target/wasm32-wasip1/release/forms.wasm wasm/module.wasm

check:
	$(PYTHON) tools/check_toolchain.py
	npm run build
	$(PYTHON) -m json.tool config.json >/dev/null
	$(PYTHON) -m json.tool storage/schema.json >/dev/null
	$(PYTHON) -c "import json,pathlib; [json.loads(p.read_text()) for p in pathlib.Path('storage/migrations').glob('*.json')]"
	cargo component check --manifest-path wasm/Cargo.toml --locked

package: build
	$(PYTHON) tools/package.py

test-python:
	$(PYTHON) -m pytest -q tests/test_config.py

test-backend:
	cargo test --locked --manifest-path tests/backend/Cargo.toml --lib

test: test-python test-backend
