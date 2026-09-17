(function () {
  'use strict';
  // Capture synchronously: async tags may all exist before any one executes.
  var scriptTag = document.currentScript;
  if (!scriptTag || !scriptTag.parentNode) return;
  var flowId = scriptTag.getAttribute('data-flow');
  if (!flowId || !/^[a-zA-Z0-9_-]{1,128}$/.test(flowId)) return;
  var srcUrl;
  try { srcUrl = new URL(scriptTag.src, document.baseURI); } catch (_) { return; }
  if (!/^https?:$/.test(srcUrl.protocol)) return;
  var ORIGIN = srcUrl.origin;
  var API = ORIGIN + '/api/v1/ext/forms';
  var QR_URL = new URL('qr.js', srcUrl).href;
  var POLL_MS = 2000;
  var disposed = false, flow = null, fields = [], settings = {}, pricing = {};
  var submission = null, pollTimer = null, tickTimer = null, errorBox = null, qrCancel = null;

  var PRESETS = {
    standard: {card: '#ffffff', text: '#1f2937', muted: '#6b7280', primary: '#1976d2', border: 'rgba(0,0,0,0.15)'},
    bitcoin: {card: '#ffffff', text: '#1f2937', muted: '#6b7280', primary: '#f7931a', border: 'rgba(0,0,0,0.15)'},
    minimal: {card: '#ffffff', text: '#1f2937', muted: '#6b7280', primary: '#374151', border: 'rgba(0,0,0,0.15)'},
    contrast: {card: '#ffffff', text: '#000000', muted: '#333333', primary: '#0000cc', border: '#000000'},
    typeform: {card: '#ffffff', text: '#262627', muted: '#73726e', primary: '#4fb0ae', border: 'rgba(38,38,39,0.2)', pill: true},
  };
  var DARK_PRESETS = {
    standard: {card: '#1e1e1e', text: 'rgba(255,255,255,0.9)', muted: 'rgba(255,255,255,0.62)', primary: '#1976d2', border: 'rgba(255,255,255,0.15)'},
    bitcoin: {card: '#241d16', text: 'rgba(255,255,255,0.9)', muted: 'rgba(255,255,255,0.62)', primary: '#f7931a', border: 'rgba(255,255,255,0.15)'},
    minimal: {card: '#1e1e1e', text: 'rgba(255,255,255,0.9)', muted: 'rgba(255,255,255,0.62)', primary: '#d1d5db', border: 'rgba(255,255,255,0.15)'},
    contrast: {card: '#000000', text: '#ffffff', muted: '#cccccc', primary: '#ffd700', border: '#ffffff'},
    typeform: {card: '#333334', text: 'rgba(255,255,255,0.92)', muted: 'rgba(255,255,255,0.6)', primary: '#4fb0ae', border: 'rgba(255,255,255,0.2)', pill: true},
  };
  function palette() {
    var name = PRESETS[settings.theme] ? settings.theme : 'standard';
    var set = settings.themeMode === 'dark' ? DARK_PRESETS : PRESETS;
    return set[name] || set.standard;
  }
  function contrastColor(hex) {
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 >= 145 ? '#111827' : '#ffffff';
  }

  function element(tag, cls, text, parent) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = String(text);
    if (parent) parent.appendChild(node);
    return node;
  }
  function button(cls, text, parent, click) {
    var node = element('button', cls, text, parent);
    node.type = 'button';
    if (click) node.addEventListener('click', click);
    return node;
  }
  function replaceContents(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function formatSats(v) { return Number(v || 0).toLocaleString() + ' sats'; }
  function api(method, path, body) {
    var opts = {method: method, credentials: 'omit', headers: {'Content-Type': 'application/json'}};
    if (body) opts.body = JSON.stringify(body);
    return fetch(API + path, opts).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) throw new Error((data && (data.error || data.detail)) || 'HTTP ' + response.status);
        if (data && data.error) throw new Error(data.error);
        return data;
      });
    });
  }

  // --- minimal bech32 encoder for npub (NIP-07 returns hex) ---
  var B32 = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  function polymod(values) {
    var chk = 1, GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    for (var i = 0; i < values.length; i++) {
      var top = chk >> 25;
      chk = ((chk & 0x1ffffff) << 5) ^ values[i];
      for (var j = 0; j < 5; j++) if ((top >> j) & 1) chk ^= GEN[j];
    }
    return chk;
  }
  function hrpExpand(hrp) {
    var out = [];
    for (var i = 0; i < hrp.length; i++) out.push(hrp.charCodeAt(i) >> 5);
    out.push(0);
    for (i = 0; i < hrp.length; i++) out.push(hrp.charCodeAt(i) & 31);
    return out;
  }
  function convertBits(data, from, to, pad) {
    var acc = 0, bits = 0, out = [], maxv = (1 << to) - 1;
    for (var i = 0; i < data.length; i++) {
      acc = (acc << from) | data[i];
      bits += from;
      while (bits >= to) { bits -= to; out.push((acc >> bits) & maxv); }
    }
    if (pad && bits > 0) out.push((acc << (to - bits)) & maxv);
    return out;
  }
  function hexToNpub(hex) {
    if (!/^[0-9a-f]{64}$/i.test(hex)) return hex;
    var bytes = [];
    for (var i = 0; i < 64; i += 2) bytes.push(parseInt(hex.substr(i, 2), 16));
    var data = convertBits(bytes, 8, 5, true);
    var values = hrpExpand('npub').concat(data);
    var mod = polymod(values.concat([0, 0, 0, 0, 0, 0])) ^ 1;
    var checksum = [];
    for (i = 0; i < 6; i++) checksum.push((mod >> (5 * (5 - i))) & 31);
    var out = 'npub1';
    for (i = 0; i < data.length; i++) out += B32.charAt(data[i]);
    for (i = 0; i < 6; i++) out += B32.charAt(checksum[i]);
    return out;
  }

  var container = element('div', 'forms-widget-container');
  container.setAttribute('data-flow', flowId);
  scriptTag.parentNode.insertBefore(container, scriptTag);
  var shadow = container.attachShadow({mode: 'open'});
  element('style', '', `
*{margin:0;padding:0;box-sizing:border-box}
:host{display:block}
button,input,textarea,select{font:inherit}button:disabled{opacity:.55;cursor:not-allowed}
.fm-card{max-width:560px;margin:0 auto;padding:1.75rem;border-radius:1rem;background:#fff;color:#1f2937;font:16px/1.5 sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.fm-banner{height:120px;border-radius:.75rem;background-size:cover;background-position:center;margin-bottom:1rem}
.fm-title{font-size:1.5rem;line-height:1.2;margin-bottom:.5rem;overflow-wrap:anywhere}
.fm-desc{white-space:pre-wrap;overflow-wrap:anywhere;margin-bottom:1rem}
.fm-muted{font-size:.85rem;margin-bottom:1rem}
.fm-field{margin-bottom:1rem}
.fm-label{display:block;font-weight:600;margin-bottom:.35rem}
.fm-label .fm-req{color:#b91c1c}
.fm-input,.fm-textarea,.fm-select{width:100%;padding:.6rem .7rem;border:1px solid;border-radius:.5rem;background:transparent;color:inherit}
.fm-textarea{resize:vertical;min-height:80px}
.fm-help{font-size:.8rem;opacity:.7;margin-top:.2rem}
.fm-radio{display:block;margin:.3rem 0;font-weight:400}
.fm-check{display:flex;align-items:center;gap:.5rem;font-weight:400}
.fm-submit{display:block;width:100%;padding:.85rem;border:none;border-radius:.6rem;font-weight:700;cursor:pointer;margin-top:.5rem}
.fm-nostr{width:auto;padding:.4rem .8rem;border:1px solid;border-radius:.5rem;background:transparent;color:inherit;cursor:pointer;font-size:.85rem;margin-top:.35rem}
.fm-error{color:#b91c1c;font-size:.9rem;margin:.75rem 0}
.fm-note{font-size:.8rem;opacity:.7;margin-top:.75rem}
.fm-center{text-align:center}
.fm-qr{display:flex;justify-content:center;padding:12px;background:#fff;border-radius:8px;margin:1rem 0}
.fm-qr canvas{display:block;width:100%;max-width:260px;height:auto;image-rendering:pixelated}
.fm-bolt{width:100%;font:.75rem monospace;padding:.5rem;border:1px solid;border-radius:.4rem;resize:none;background:transparent;color:inherit}
.fm-actions{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin:.75rem 0}
.fm-btn{padding:.55rem 1rem;border:1px solid;border-radius:.5rem;background:transparent;color:inherit;cursor:pointer;text-decoration:none;font-size:.9rem}
.fm-btn.fm-primary{border:none;font-weight:700}
.fm-wait{display:flex;align-items:center;justify-content:center;gap:.6rem;margin-top:1rem;font-size:.9rem}
.fm-spin{width:1.1rem;height:1.1rem;border:2px solid;border-top-color:transparent;border-radius:50%;animation:fm-rot .8s linear infinite;display:inline-block}
@keyframes fm-rot{to{transform:rotate(360deg)}}
.fm-ticket{font:1.3rem monospace;letter-spacing:.08em;overflow-wrap:anywhere;margin-top:.5rem}
`, shadow);
  var card = element('div', 'fm-card', null, shadow);
  element('div', 'fm-center fm-muted', 'Loading form…', card);

  function applyPalette() {
    var p = palette();
    card.style.background = p.card;
    card.style.color = p.text;
    card.style.setProperty('--fm-primary', p.primary);
    card.querySelectorAll('.fm-input,.fm-textarea,.fm-select,.fm-bolt,.fm-nostr,.fm-btn').forEach(function (n) {
      n.style.borderColor = p.border;
    });
    card.querySelectorAll('.fm-submit,.fm-btn.fm-primary').forEach(function (n) {
      n.style.background = p.primary;
      n.style.color = contrastColor(p.primary);
    });
    if (p.pill) {
      card.querySelectorAll('.fm-submit,.fm-btn').forEach(function (n) { n.style.borderRadius = '999px'; });
      card.querySelectorAll('.fm-input,.fm-textarea,.fm-select').forEach(function (n) { n.style.borderRadius = '12px'; });
    }
    card.querySelectorAll('.fm-muted,.fm-help,.fm-note').forEach(function (n) { n.style.color = p.muted; });
    card.querySelectorAll('.fm-spin').forEach(function (n) { n.style.borderColor = p.border; n.style.borderTopColor = 'transparent'; });
  }

  function parseJson(text, fallback) {
    try { return JSON.parse(text || ''); } catch (_) { return fallback; }
  }

  function nostrButton(input) {
    if (!window.nostr || typeof window.nostr.getPublicKey !== 'function') return null;
    var btn = button('fm-nostr', 'Use Nostr signer', null, function () {
      btn.disabled = true;
      btn.textContent = 'Waiting for signer…';
      window.nostr.getPublicKey().then(function (hex) {
        input.value = hexToNpub(String(hex));
        input.dispatchEvent(new Event('input'));
      }).catch(function () {
        btn.textContent = 'Signer unavailable — paste npub manually';
      }).finally(function () {
        btn.disabled = false;
        if (btn.textContent === 'Waiting for signer…') btn.textContent = 'Use Nostr signer';
      });
    });
    return btn;
  }

  function fieldEmpty(field, answers) {
    var v = answers[field.id];
    return v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);
  }

  function renderField(field, answers, parent) {
    var wrap = element('div', 'fm-field', null, parent);
    var label = element('label', 'fm-label', field.label, wrap);
    label.setAttribute('for', 'fm-' + field.id);
    if (field.required) element('span', 'fm-req', ' *', label);
    var input;
    if (field.type === 'textarea') {
      input = element('textarea', 'fm-textarea', null, wrap);
    } else if (field.type === 'select') {
      input = element('select', 'fm-select', null, wrap);
      element('option', '', '', input).value = '';
      (field.options || []).forEach(function (o) {
        var opt = element('option', '', o, input);
        opt.value = o;
      });
    } else if (field.type === 'radio') {
      (field.options || []).forEach(function (o) {
        var lab = element('label', 'fm-radio', null, wrap);
        var radio = element('input', '', null, lab);
        radio.type = 'radio';
        radio.name = 'fm-' + field.id;
        radio.value = o;
        radio.addEventListener('change', function () { answers[field.id] = o; });
        lab.appendChild(document.createTextNode(' ' + o));
      });
      input = null;
    } else if (field.type === 'checkbox' || field.type === 'consent') {
      var lab = element('label', 'fm-check', null, wrap);
      lab.parentNode.insertBefore(lab, wrap.firstChild);
      input = element('input', '', null, lab);
      input.type = 'checkbox';
      lab.appendChild(document.createTextNode(' ' + field.label + (field.required ? ' *' : '')));
      label.remove();
    } else {
      input = element('input', 'fm-input', null, wrap);
      input.type = {email: 'email', number: 'number', date: 'date', phone: 'tel'}[field.type] || 'text';
    }
    if (input && field.type !== 'radio') {
      input.id = 'fm-' + field.id;
      input.addEventListener('input', function () { answers[field.id] = input.type === 'checkbox' ? input.checked : input.value; });
      if (field.type === 'checkbox' || field.type === 'consent') answers[field.id] = false;
    }
    if (field.help) element('div', 'fm-help', field.help, wrap);
    if (field.type === 'nostr_pubkey') {
      var nb = nostrButton(input);
      if (nb) wrap.appendChild(nb);
      else element('div', 'fm-help', 'No Nostr signer found — paste your npub.', wrap);
    }
    return input;
  }

  function renderForm(message) {
    stopTimers();
    submission = null;
    replaceContents(card);
    var p = palette();
    if (settings.headerImage) {
      var banner = element('div', 'fm-banner', null, card);
      banner.style.backgroundImage = 'url("' + String(settings.headerImage).replace(/"/g, '%22') + '")';
    }
    element('h1', 'fm-title', flow.title, card);
    if (flow.description) element('p', 'fm-desc', flow.description, card);
    if (flow.remaining !== null && flow.remaining !== undefined) {
      element('div', 'fm-muted', flow.remaining + ' spot(s) remaining', card);
    }
    var answers = {};
    fields.forEach(function (f) { renderField(f, answers, card); });
    errorBox = element('div', 'fm-error', message || '', card);
    errorBox.setAttribute('role', 'alert');
    var isPaid = pricing.mode === 'fixed' && Number(pricing.amountSat) > 0;
    var submit = button('fm-submit', isPaid ? 'Pay ' + formatSats(pricing.amountSat) : 'Submit', card, function () {
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i];
        if (f.required && fieldEmpty(f, answers)) {
          errorBox.textContent = '"' + f.label + '" is required.';
          return;
        }
      }
      errorBox.textContent = '';
      submit.disabled = true;
      submit.textContent = 'Submitting…';
      api('POST', '/f/' + encodeURIComponent(flowId) + '/submit', {answers: answers}).then(function (result) {
        if (disposed) return;
        if (!result || !result.submissionId) throw new Error('Invalid response');
        submission = result;
        if (result.status === 'confirmed') { renderConfirmed(result); return; }
        renderInvoice(result);
      }).catch(function (e) {
        errorBox.textContent = e.message || 'Submission failed.';
        submit.disabled = false;
        submit.textContent = isPaid ? 'Pay ' + formatSats(pricing.amountSat) : 'Submit';
      });
    });
    applyPalette();
  }

  function loadQR(cb) {
    if (window.FormsQR && typeof window.FormsQR.create === 'function') { cb(window.FormsQR); return; }
    var script = document.createElement('script');
    var done = false;
    var timer = setTimeout(function () { finish(null); }, 10000);
    function finish(lib) {
      if (done) return;
      done = true;
      qrCancel = null;
      clearTimeout(timer);
      script.onload = script.onerror = null;
      script.remove();
      cb(lib);
    }
    qrCancel = function () { finish(null); };
    script.src = QR_URL;
    script.async = true;
    if (scriptTag.nonce) script.nonce = scriptTag.nonce;
    script.onload = function () { finish(window.FormsQR || null); };
    script.onerror = function () { finish(null); };
    document.head.appendChild(script);
  }

  function drawQR(box, bolt11) {
    loadQR(function (library) {
      if (!library) { box.textContent = 'QR unavailable — copy the invoice below.'; return; }
      try {
        var qr = library.create(0, 'M');
        qr.addData('LIGHTNING:' + bolt11.toUpperCase(), 'Alphanumeric');
        qr.make();
        var count = qr.getModuleCount(), scale = 4, margin = 4;
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = (count + margin * 2) * scale;
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Lightning invoice QR code');
        var ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no canvas');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        for (var r = 0; r < count; r++) for (var c = 0; c < count; c++) if (qr.isDark(r, c)) ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
        replaceContents(box);
        box.appendChild(canvas);
      } catch (_) { box.textContent = 'QR unavailable — copy the invoice below.'; }
    });
  }

  function stopTimers() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    if (qrCancel) { qrCancel(); qrCancel = null; }
  }

  function renderInvoice(result) {
    replaceContents(card);
    var amount = result.amountSat || (pricing.amountSat || 0);
    element('div', 'fm-title fm-center', 'Pay ' + formatSats(amount), card);
    var countdown = element('div', 'fm-muted fm-center', '', card);
    var qrBox = element('div', 'fm-qr', 'Preparing QR…', card);
    drawQR(qrBox, result.paymentRequest);
    var actions = element('div', 'fm-actions', null, card);
    var wallet = element('a', 'fm-btn fm-primary', 'Open in wallet', actions);
    wallet.href = 'lightning:' + result.paymentRequest;
    button('fm-btn', 'Copy invoice', actions, function () {
      Promise.resolve().then(function () { return navigator.clipboard.writeText(result.paymentRequest); }).then(function () {
        copyStatus.textContent = 'Invoice copied.';
      }).catch(function () {
        bolt.focus(); bolt.select();
        copyStatus.textContent = 'Select and copy the invoice text.';
      });
    });
    var bolt = element('textarea', 'fm-bolt', null, card);
    bolt.readOnly = true; bolt.rows = 3; bolt.value = result.paymentRequest;
    bolt.setAttribute('aria-label', 'BOLT11 invoice');
    var copyStatus = element('div', 'fm-muted fm-center', '', card);
    copyStatus.setAttribute('role', 'status');
    var wait = element('div', 'fm-wait', null, card);
    element('span', 'fm-spin', null, wait);
    element('span', '', 'Waiting for verified payment…', wait);
    applyPalette();

    function tick() {
      if (!result.expiresAt) { countdown.textContent = ''; return; }
      var left = Math.max(0, Number(result.expiresAt) - Math.floor(Date.now() / 1000));
      var m = Math.floor(left / 60), s = String(left % 60).padStart(2, '0');
      countdown.textContent = 'Expires in ' + m + ':' + s;
      if (left <= 0) renderForm('The invoice expired. Submit again to get a fresh one.');
    }
    tick();
    tickTimer = setInterval(tick, 1000);
    pollTimer = setInterval(function () {
      api('GET', '/s/' + encodeURIComponent(result.submissionId)).then(function (view) {
        if (disposed || !view) return;
        if (view.paid) { stopTimers(); renderConfirmed(view); }
        else if (['expired', 'cancelled', 'rejected'].includes(view.status)) {
          renderForm('This submission is ' + view.status + '. You can submit again for a new invoice.');
        }
      }).catch(function () { /* transient — keep polling */ });
    }, POLL_MS);
  }

  function renderConfirmed(view) {
    stopTimers();
    replaceContents(card);
    var box = element('div', 'fm-center', null, card);
    element('div', 'fm-title', settings.confirmText || 'Registration confirmed', box);
    var code = view && view.ticketCode;
    if (code) {
      element('div', 'fm-muted', 'Your confirmation code', box);
      element('div', 'fm-ticket', code, box);
    }
    applyPalette();
  }

  api('GET', '/f/' + encodeURIComponent(flowId)).then(function (data) {
    if (disposed) return;
    if (!data || data.id !== flowId) throw new Error('Flow identity mismatch');
    flow = data;
    fields = parseJson(flow.schemaJson, {fields: []}).fields || [];
    settings = parseJson(flow.settingsJson, {});
    pricing = parseJson(flow.pricingJson, {});
    if (flow.status !== 'published') {
      replaceContents(card);
      element('div', 'fm-center', 'This form is not open for submissions.', card);
      applyPalette();
      return;
    }
    renderForm();
  }).catch(function () {
    if (disposed) return;
    replaceContents(card);
    element('div', 'fm-error fm-center', 'This form is unavailable.', card);
    applyPalette();
  });

  // Cleanup hooks if the host page removes the widget.
  var observer = new MutationObserver(function () {
    if (!document.contains(container)) { disposed = true; stopTimers(); observer.disconnect(); }
  });
  observer.observe(document.documentElement, {childList: true, subtree: true});
})();
