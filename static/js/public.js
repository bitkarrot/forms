(() => {
  const API = '/api/v1/ext/forms'
  const POLL_MS = 2000

  const app = Vue.createApp({
    render: window.FORMS_PUBLIC_RENDER(),
    data: () => ({
      flow: null, settings: {}, loading: true, loadError: '', answers: {}, submitting: false,
      invoice: null, invoiceDialog: false, confirmed: false, submission: null,
      pollTimer: null, tickTimer: null, nowTs: Math.floor(Date.now() / 1000), step: -1, expired: false,
    }),
    computed: {
      formFields() {
        try { return JSON.parse(this.flow?.schemaJson || '{"fields":[]}').fields || [] } catch (_) { return [] }
      },
      pricing() { try { return JSON.parse(this.flow?.pricingJson || '{}') } catch (_) { return {} } },
      isStepper() { return this.settings.renderer === 'stepper' && this.formFields.length > 0 },
      stepProgress() { return this.formFields.length ? (this.step + 1) / this.formFields.length : 0 },
      isLastStep() { return this.step === this.formFields.length - 1 },
      expiresIn() {
        if (!this.invoice?.expiresAt) return null
        return Math.max(0, Number(this.invoice.expiresAt) - this.nowTs)
      },
      expiresInText() {
        if (this.expiresIn === null) return ''
        const m = Math.floor(this.expiresIn / 60)
        const s = String(this.expiresIn % 60).padStart(2, '0')
        return `${m}:${s}`
      },
      submitLabel() {
        return this.pricing.mode === 'fixed' && this.pricing.amountSat > 0
          ? `Pay ${this.formatSats(this.pricing.amountSat)} sats`
          : 'Submit'
      },
      bannerStyle() {
        const u = this.settings.headerImage
        return u ? {backgroundImage: `url("${String(u).replace(/"/g, '%22')}")`} : {}
      },
      endBannerStyle() {
        const u = this.settings.endImage
        return u ? {backgroundImage: `url("${String(u).replace(/"/g, '%22')}")`} : {}
      },
      pageStyle() {
        const c = this.settings.colors || {}
        const vars = {'--fc-card-op': this.settings.cardOpacity ?? 1}
        if (c.global) vars['--fc-global'] = c.global
        if (c.title) vars['--fc-title'] = c.title
        if (c.description) vars['--fc-desc'] = c.description
        if (c.question) vars['--fc-question'] = c.question
        const bg = (this.settings.bgImage || '').trim()
        if (bg) Object.assign(vars, {backgroundImage: `url("${bg.replace(/"/g, '%22')}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'})
        return vars
      },
    },
    methods: {
      async api(method, path, body) { const result = await LNbitsBridge.callApi(method, API + path, body); if (result && result.error) throw new Error(result.error); return result },
      formatSats(v) { return Number(v || 0).toLocaleString() },
      async loadFlow() {
        this.loading = true; this.loadError = ''
        try {
          const flowId = LNbitsBridge.context()?.routeParams?.flowId
          if (!flowId) throw new Error('Missing flow id')
          const flow = await this.api('GET', `/f/${flowId}`)
          if (flow.status !== 'published') throw new Error('This flow is not open for submissions.')
          this.flow = flow
          this.settings = JSON.parse(flow.settingsJson || '{}')
          this.applyTheme()
          this.applyCustomCss()
        } catch (e) { this.loadError = e.message || 'This form could not be loaded.' }
        finally { this.loading = false }
      },
      applyTheme() {
        const preset = ['bitcoin', 'minimal', 'contrast', 'typeform'].includes(this.settings.theme) ? this.settings.theme : 'standard'
        const dark = this.settings.themeMode === 'dark' || (!('themeMode' in this.settings) && this.settings.theme === 'dark')
        document.body.classList.remove('theme-bitcoin', 'theme-minimal', 'theme-contrast', 'theme-typeform')
        if (preset !== 'standard') document.body.classList.add(`theme-${preset}`)
        document.body.classList.toggle('body--dark', dark)
        document.body.classList.toggle('theme-dark', dark)
        this.$q.dark.set(dark)
      },
      applyCustomCss() {
        const css = this.settings.customCss
        if (!css) return
        try {
          const sheet = new CSSStyleSheet()
          sheet.replaceSync(css)
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
        } catch (_) { /* constructable sheets unsupported — preset themes still apply */ }
      },
      fieldEmpty(field) {
        const v = this.answers[field.id]
        return v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)
      },
      showError(msg) { LNbitsBridge.notify(msg, 'negative').catch(() => {}) },
      nextStep() {
        const field = this.formFields[this.step]
        if (field && field.required && this.fieldEmpty(field)) {
          this.showError(`"${field.label}" is required.`)
          return
        }
        if (this.step < this.formFields.length - 1) this.step += 1
      },
      prevStep() { this.step = Math.max(-1, this.step - 1) },
      onOk() {
        if (this.step === -1) { this.step = 0; return }
        if (this.isLastStep) { this.submit(); return }
        this.nextStep()
      },
      optionKey(i) { return String.fromCharCode(65 + i) },
      isOptionalLabel(field) { return /optional/i.test(field?.label || '') },
      chooseOption(field, opt) {
        this.answers[field.id] = opt
        if (!this.isLastStep) setTimeout(() => this.nextStep(), 280)
      },
      onKey(e) {
        if (!this.flow || this.loading || this.invoiceDialog || this.confirmed) return
        if (document.querySelector('.q-menu, .q-dialog')) return
        const tag = e.target ? e.target.tagName : ''
        if (tag === 'TEXTAREA') return
        if (!this.isStepper) {
          if (e.key === 'Enter') { e.preventDefault(); this.submit() }
          return
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          if (e.target && e.target.closest && e.target.closest('.q-select')) return
          e.preventDefault()
          if (e.key === 'ArrowUp') this.prevStep(); else this.onOk()
          return
        }
        if (e.key === 'Enter') { e.preventDefault(); this.onOk(); return }
        const field = this.formFields[this.step]
        if (field && field.type === 'radio' && tag !== 'INPUT' && /^[a-zA-Z]$/.test(e.key)) {
          const opt = (field.options || [])[e.key.toLowerCase().charCodeAt(0) - 97]
          if (opt) { e.preventDefault(); this.chooseOption(field, opt) }
        }
      },
      async submit() {
        if (this.submitting) return
        this.submitting = true
        try {
          const flowId = this.flow.id
          const result = await this.api('POST', `/f/${flowId}/submit`, {answers: this.answers})
          this.submission = result
          if (result.status === 'confirmed') { this.confirmed = true; return }
          this.invoice = result
          this.expired = false
          this.invoiceDialog = true
          this.startPolling(result.submissionId)
          this.startTicking()
        } catch (e) { this.showError(e.message) }
        finally { this.submitting = false }
      },
      startPolling(submissionId) {
        this.stopPolling()
        this.pollTimer = setInterval(async () => {
          try {
            const view = await this.api('GET', `/s/${submissionId}`)
            this.submission = view
            if (view.paid) {
              this.stopPolling(); this.stopTicking()
              this.invoiceDialog = false
              this.confirmed = true
            } else if (['expired', 'cancelled', 'rejected'].includes(view.status)) {
              this.onAttemptEnded(`This submission is ${view.status}. You can submit again for a new invoice.`)
            }
          } catch (_) { /* keep polling; transient errors are fine */ }
        }, POLL_MS)
      },
      startTicking() {
        this.stopTicking()
        this.tickTimer = setInterval(() => {
          this.nowTs = Math.floor(Date.now() / 1000)
          if (this.invoice?.expiresAt && this.nowTs >= Number(this.invoice.expiresAt) && !this.submission?.paid) {
            this.onAttemptEnded('The invoice expired. Submit again to get a fresh one.')
          }
        }, 1000)
      },
      onAttemptEnded(message) {
        this.stopPolling(); this.stopTicking()
        this.invoiceDialog = false
        this.expired = true
        this.showError(message)
      },
      cancelInvoice() { this.invoiceDialog = false },
      onInvoiceHide() {
        // Dismissed while still pending — stop watching and cancel the
        // submission so it doesn't linger as pending_payment.
        if (!this.invoice || this.expired || this.submission?.paid) return
        this.stopPolling(); this.stopTicking()
        this.cancelSubmission()
      },
      async cancelSubmission() {
        const id = this.submission?.submissionId || this.invoice?.submissionId
        if (!id || this.submission?.status !== 'pending_payment') return
        try { await this.api('POST', `/s/${id}/cancel`) } catch (_) {}
      },
      stopPolling() { if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null } },
      stopTicking() { if (this.tickTimer) { clearInterval(this.tickTimer); this.tickTimer = null } },
      copyInvoice() {
        try {
          navigator.clipboard.writeText(this.invoice.paymentRequest)
          LNbitsBridge.notify('Invoice copied.', 'positive').catch(() => {})
        } catch (_) {
          LNbitsBridge.notify('Clipboard access is unavailable. Copy the invoice text manually.', 'warning').catch(() => {})
        }
      },
    },
    mounted() { window.addEventListener('keydown', this.onKey) },
    beforeUnmount() { this.stopPolling(); this.stopTicking(); window.removeEventListener('keydown', this.onKey) },
  })
  app.use(Quasar)
  if (window.QrcodeVue?.default) app.component('qrcode-vue', window.QrcodeVue.default)
  const vm = app.mount('#q-app')
  document.getElementById('q-app').classList.remove('vue-pending')
  LNbitsBridge.connect().then(() => vm.loadFlow()).catch(e => { vm.loading = false; vm.loadError = e.message })
})()
