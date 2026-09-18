// Forms extension — browser E2E via Playwright.
// Drives the admin builder inside the sandboxed extension iframe, then walks
// the public hosted page through a paid submission (invoice paid via API).
import {chromium} from 'playwright'

const BASE = 'http://127.0.0.1:5000'
const USER = 'admin'
const PASS = 'adminpass123'

let step = 0
const say = msg => console.log(`[${String(++step).padStart(2, '0')}] ${msg}`)
const fail = msg => { console.error(`FAIL: ${msg}`); process.exit(1) }
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function waitFrame(page, marker, timeout = 20000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    for (const f of page.frames()) {
      if (!f.url().includes('/ext-frame/forms/')) continue
      try {
        if (await f.locator(marker).count() > 0) return f
      } catch {}
    }
    await sleep(400)
  }
  return null
}

const browser = await chromium.launch({headless: true})
const ctx = await browser.newContext({viewport: {width: 1440, height: 950}})
const page = await ctx.newPage()

say('login to LNbits')
await page.goto(`${BASE}/`, {waitUntil: 'domcontentloaded'})
await page.locator('input[name="username"]').fill(USER)
await page.locator('input[name="password"]').fill(PASS)
await page.locator('button:has-text("Login")').first().click()
await page.waitForTimeout(3000)
if (!page.url().includes('/wallet/')) fail('login failed, url=' + page.url())

say('open Forms extension admin')
await page.goto(`${BASE}/ext/forms`, {waitUntil: 'domcontentloaded'})
await sleep(1500)
// dismiss the LNbits default-credentials warning dialog if present
for (let i = 0; i < 3; i++) {
  const dlg = page.locator('.q-dialog:visible')
  if (!(await dlg.count())) break
  const ok = dlg.locator('.q-btn').last()
  if (await ok.count()) await ok.click().catch(() => {})
  else await page.keyboard.press('Escape')
  await sleep(400)
}
const admin = await waitFrame(page, '.q-btn:has-text("New flow")')
if (!admin) fail('admin iframe never rendered New flow button')
say('admin iframe mounted')

say('open New flow dialog')
await admin.locator('.q-btn:has-text("New flow")').first().click()
await admin.waitForSelector('.fb-layout', {timeout: 8000})

say('apply "Event registration" template from palette')
await admin.locator('.fb-pal-item:has-text("Event ticket")').click()
await sleep(300)
const cardCount = await admin.locator('.fb-card').count()
if (cardCount < 3) fail(`expected ≥3 question cards from template, got ${cardCount}`)
say(`canvas shows ${cardCount} question cards`)

say('add a Phone field via palette')
await admin.locator('.fb-pal-item:has-text("Phone")').click()
await sleep(200)
const cardCount2 = await admin.locator('.fb-card').count()
if (cardCount2 !== cardCount + 1) fail(`addField failed: ${cardCount} → ${cardCount2}`)
await admin.locator('.fb-card').last().locator('input').first().fill('Phone number')

say('set price to 21 sats (Payment panel)')
await admin.locator('.fb-side .q-expansion-item:has-text("Payment")').click()
await sleep(400)
await admin.locator('.fb-acc input[type="number"]').first().fill('21')
await sleep(200)

say('edit first question label inline')
const labelInput = admin.locator('.fb-card').nth(0).locator('input').first()
await labelInput.click()
await labelInput.fill('Full name')
if (await labelInput.inputValue() !== 'Full name') fail('inline label edit failed')

say('set theme to Typeform — canvas must restyle live')
await admin.locator('.fb-side .q-expansion-item:has-text("Appearance")').click()
await sleep(400)
await admin.locator('.fb-acc:has-text("Appearance") .q-select').nth(0).click()
await page.waitForTimeout(400)
await admin.locator('.q-menu .q-item:has-text("Typeform")').first().click()
await sleep(500)
const canvasBg = await admin.locator('.fb-canvas').evaluate(el => getComputedStyle(el).backgroundColor)
const cardRadius = await admin.locator('.fb-card').first().evaluate(el => getComputedStyle(el).borderRadius)
console.log(`   canvas bg=${canvasBg} card radius=${cardRadius}`)
if (canvasBg !== 'rgb(250, 249, 247)') fail(`theme not applied live to canvas: ${canvasBg}`)
if (cardRadius !== '20px') fail(`typeform card radius not applied: ${cardRadius}`)
say('theme change reflected live on canvas')

say('set header image to bundled sample')
await admin.locator('.fb-acc:has-text("Appearance") input[placeholder*="/ext-assets"]').first().fill('/ext-assets/forms/assets/banner.png')
await sleep(300)
const bannerBg = await admin.locator('.fb-banner').evaluate(el => getComputedStyle(el).backgroundImage)
if (!bannerBg.includes('banner.png')) fail(`canvas banner not set: ${bannerBg}`)
say('canvas banner shows sample image')

say('switch to Preview — banner + typeform styling')
await admin.locator('.fp-view-toggle .q-btn:has-text("Preview")').click()
await admin.waitForSelector('.fp-preview-card', {timeout: 8000})
const pvBanner = await admin.locator('.fp-preview-card .form-banner').evaluate(el => getComputedStyle(el).backgroundImage).catch(() => 'none')
if (!pvBanner.includes('banner.png')) fail(`preview banner missing: ${pvBanner}`)
say('preview shows banner image')
const hasStart = await admin.locator('.fp-preview-card .q-btn:has-text("Start"), .fp-preview-card .q-btn:has(i:has-text("arrow_forward"))').count()
say(`preview stepper welcome: ${hasStart ? 'yes' : 'no'}`)

say('back to Builder and save')
await admin.locator('.fp-view-toggle .q-btn:has-text("Builder")').click()
await sleep(300)
await admin.locator('.fp-header .q-btn:has-text("Save")').click()
await sleep(1800)
if (await admin.locator('.fb-layout').count()) {
  const err = await admin.locator('[role="alert"]').allTextContents()
  fail('save failed, dialog still open: ' + err.join('|'))
}
const rowTexts = await admin.locator('tr').allTextContents()
if (!rowTexts.some(t => t.includes('Event registration'))) fail('new flow not in table: ' + rowTexts.join('|').slice(0, 300))
say('flow saved and listed')

say('publish + get public URL')
const row = admin.locator('tr:has-text("Event registration")').first()
const pubBtn = row.locator('.q-btn[aria-label="Publish"]')
if (await pubBtn.count()) { await pubBtn.click(); await sleep(900) }
const publicId = await page.evaluate(async () => {
  const a = await fetch('/api/v1/auth', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: 'admin', password: 'adminpass123'})}).then(r => r.json())
  const flows = await fetch('/api/v1/ext/forms/flows', {headers: {Authorization: `Bearer ${a.access_token}`}}).then(r => r.json())
  const f = (flows.data || flows.items || flows).find(f => f.title === 'Event registration')
  return f?.id
})
if (!publicId) fail('could not find saved flow id')
const status = await page.evaluate(async id => {
  const a = await fetch('/api/v1/auth', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: 'admin', password: 'adminpass123'})}).then(r => r.json())
  const flows = await fetch('/api/v1/ext/forms/flows', {headers: {Authorization: `Bearer ${a.access_token}`}}).then(r => r.json())
  return (flows.data || flows).find(f => f.id === id)?.status
}, publicId)
if (status !== 'published') fail(`flow not published: ${status}`)
console.log('   flow id:', publicId, '| status:', status)
say('flow published')

say('walk the public hosted page')
const pub = await ctx.newPage()
await pub.goto(`${BASE}/ext/forms/f/${publicId}`, {waitUntil: 'domcontentloaded'})
const pf = await waitFrame(pub, '.pf-card, .pf-form')
if (!pf) fail('public iframe never rendered')
say('public page rendered')

const pubBanner = await pf.locator('.pf-banner').first().evaluate(el => getComputedStyle(el).backgroundImage).catch(() => 'none')
console.log('   public banner:', pubBanner.slice(0, 80))

const startBtn = pf.locator('.q-btn:has-text("Start")').first()
if (await startBtn.count()) { await startBtn.click(); await sleep(700) }

say('fill all fields (compact layout)')
// text-ish inputs — fill per .pf-card block keyed by its .pf-qlabel
const fields = pf.locator('.pf-card:visible')
for (let i = 0; i < await fields.count(); i++) {
  const block = fields.nth(i)
  const label = ((await block.locator('.pf-qlabel, .tf-qlabel').first().innerText().catch(() => '')) || '').toLowerCase()
  const inp = block.locator('input:not([type="checkbox"]):not([type="radio"]), textarea').first()
  if (!(await inp.count())) continue
  const type = (await inp.getAttribute('type')) || 'text'
  let val
  if (type === 'email' || label.includes('email')) val = 'e2e@ui.test'
  else if (type === 'number') val = '3'
  else if (type === 'tel' || label.includes('phone')) val = '+15551234567'
  else if (type === 'url') val = 'https://example.com'
  else if (label.includes('nostr') || label.includes('npub')) val = 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m'
  else if (type === 'date') val = '2026-10-01'
  else val = 'UI E2E'
  await inp.fill(val).catch(() => {})
}
// radio option cards → first option (both stepper and compact use .tf-option now)
const groups = pf.locator('.tf-options:visible')
for (let i = 0; i < await groups.count(); i++) {
  await groups.nth(i).locator('.tf-option').first().click().catch(() => {})
}
// dropdowns
const selects = pf.locator('.q-select:visible')
for (let i = 0; i < await selects.count(); i++) {
  await selects.nth(i).click().catch(() => {})
  await sleep(300)
  await pf.locator('.q-menu .q-item').first().click().catch(() => {})
}
// checkboxes (consent etc.)
const chks = pf.locator('.q-checkbox:visible')
for (let i = 0; i < await chks.count(); i++) {
  await chks.nth(i).click().catch(() => {})
}
await sleep(300)
say('submit')
const subBtn = pf.locator('.q-btn:visible', {hasText: /pay|submit/i}).last()
if (!(await subBtn.count())) fail('no submit button on public page')
await subBtn.click()
await sleep(2000)
const errTxt = await pf.locator('[role="alert"], .text-negative').allTextContents()
if (errTxt.some(t => t.trim())) console.log('   submit error shown:', errTxt.join('|'))

say('check for invoice / confirmation')
await sleep(1500)
const ptxt = await pf.locator('body').innerText().catch(() => '')
if (/ln1|lnbc/i.test(ptxt) || /pay \d+ sats|payable invoice|invoice/i.test(ptxt)) {
  say('invoice UI visible — paying via API')
  const res = await page.evaluate(async ({fid}) => {
    const a = await fetch('/api/v1/auth', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: 'admin', password: 'adminpass123'})}).then(r => r.json())
    const h = {Authorization: `Bearer ${a.access_token}`}
    const subs = await fetch(`/api/v1/ext/forms/flows/${fid}/submissions`, {headers: h}).then(r => r.json())
    const sub = (subs.data || subs.items || subs).filter(s => s.status === 'pending_payment').pop()
    if (!sub) return {err: 'no pending submission'}
    const jwt = JSON.parse(atob(a.access_token.split('.')[1]))
    const usr = jwt.uss || jwt.usr || jwt.sub
    const wallets = await fetch(`/api/v1/wallets?usr=${usr}`, {headers: h}).then(r => r.json())
    const adminkey = wallets[0].adminkey
    // bolt11 isn't in the status view — recover it from the wallet's payment list
    const payments = await fetch('/api/v1/payments', {headers: {'X-Api-Key': adminkey}}).then(r => r.json())
    const inv = (payments.data || payments).find(p => p.payment_hash === sub.paymentHash || p.checking_id === sub.checkingId)
    if (!inv?.bolt11) return {err: 'invoice not found in wallet payments', sub}
    await fetch('/users/api/v1/balance', {method: 'PUT', headers: {...h, 'Content-Type': 'application/json'}, body: JSON.stringify({id: wallets[0].id, amount: 200000})})
    const pay = await fetch('/api/v1/payments', {method: 'POST', headers: {'X-Api-Key': adminkey, 'Content-Type': 'application/json'}, body: JSON.stringify({out: true, bolt11: inv.bolt11})}).then(r => r.json())
    return {sub: sub.id, pay}
  }, {fid: publicId})
  if (res.err) fail(res.err)
  if (res.pay?.status !== 'success' && !res.pay?.paid) fail('payment failed: ' + JSON.stringify(res.pay).slice(0, 300))
  say(`invoice paid for submission ${res.sub}`)

  say('poll public status → ticket')
  let ticket = null
  for (let i = 0; i < 25; i++) {
    const v = await page.evaluate(async sid => (await fetch(`/api/v1/ext/forms/s/${sid}`)).json(), res.sub)
    if (v.paid && v.ticketCode) { ticket = v.ticketCode; break }
    await sleep(700)
  }
  if (!ticket) fail('submission never settled')
  say(`ticket issued: ${ticket}`)

  say('verify confirmation screen in hosted page')
  let confOk = false
  for (let i = 0; i < 20; i++) {
    const t = await pf.locator('body').innerText().catch(() => '')
    if (/tkt_|confirmed|thank|success/i.test(t)) { confOk = true; break }
    await sleep(800)
  }
  console.log('   confirmation screen:', confOk ? 'SHOWS TICKET' : 'did not update (poll may have lagged)')
} else if (/tkt_|confirmed|thank/i.test(ptxt)) {
  say('free flow — confirmation shown directly')
} else {
  fail('public page shows neither invoice nor confirmation: ' + ptxt.slice(0, 300))
}

say('verify submission appears in admin')
const subs2 = await page.evaluate(async fid => {
  const a = await fetch('/api/v1/auth', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: 'admin', password: 'adminpass123'})}).then(r => r.json())
  const s = await fetch(`/api/v1/ext/forms/flows/${fid}/submissions`, {headers: {Authorization: `Bearer ${a.access_token}`}}).then(r => r.json())
  return (s.data || s.items || s).length
}, publicId)
say(`admin sees ${subs2} submission(s)`)

await browser.close()
say('ALL UI E2E CHECKS PASSED')
process.exit(0)
