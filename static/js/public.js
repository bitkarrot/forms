(() => {
  const API = '/api/v1/ext/forms'
  const POLL_MS = 2000

  const app = Vue.createApp({
    render: window.FORMS_PUBLIC_RENDER(),
    data: () => ({
      flow: null, settings: {}, loading: true, loadError: '', answers: {}, submitting: false,
      submitError: '', invoice: null, invoiceDialog: false, confirmed: false, submission: null,
      pollTimer: null, tickTimer: null, nowTs: Math.floor(Date.now() / 1000), step: 0, expired: false,
    }),
    computed: {
      formFields() {
        try { return JSON.parse(this.flow?.schemaJson || '{"fields":[]}').fields || [] } catch (_) { return [] }
      },
      hasNostrField() { return this.formFields.some(f => f.type === 'nostr_pubkey') },
      pricing() { try { return JSON.parse(this.flow?.pricingJson || '{}') } catch (_) { return {} } },
      isStepper() { return this.settings.renderer === 'stepper' && this.formFields.length > 0 },
      stepProgress() { return this.formFields.length ? (this.step + 1) / this.formFields.length : 0 },
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
        const preset = ['bitcoin', 'minimal', 'contrast'].includes(this.settings.theme) ? this.settings.theme : 'standard'
        const dark = this.settings.themeMode === 'dark' || (!('themeMode' in this.settings) && this.settings.theme === 'dark')
        document.body.classList.remove('theme-bitcoin', 'theme-minimal', 'theme-contrast')
        if (preset !== 'standard') document.body.classList.add(`theme-${preset}`)
        document.body.classList.toggle('body--dark', dark)
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
      nextStep() {
        const field = this.formFields[this.step]
        if (field && field.required && this.fieldEmpty(field)) {
          this.submitError = `"${field.label}" is required.`
          return
        }
        this.submitError = ''
        if (this.step < this.formFields.length - 1) this.step += 1
      },
      async submit() {
        if (this.submitting) return
        this.submitting = true; this.submitError = ''
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
        } catch (e) { this.submitError = e.message }
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
        this.submitError = message
      },
      stopPolling() { if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null } },
      stopTicking() { if (this.tickTimer) { clearInterval(this.tickTimer); this.tickTimer = null } },
      copyInvoice() {
        try { navigator.clipboard.writeText(this.invoice.paymentRequest) } catch (_) {}
      },
    },
    beforeUnmount() { this.stopPolling(); this.stopTicking() },
  })
  app.use(Quasar)
  if (window.QrcodeVue?.default) app.component('qrcode-vue', window.QrcodeVue.default)
  const vm = app.mount('#q-app')
  document.getElementById('q-app').classList.remove('vue-pending')
  LNbitsBridge.connect().then(() => vm.loadFlow()).catch(e => { vm.loading = false; vm.loadError = e.message })
})()
