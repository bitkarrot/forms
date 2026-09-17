(() => {
  const API = '/api/v1/ext/forms'
  const POLL_MS = 2000

  const app = Vue.createApp({
    render: window.FORMS_PUBLIC_RENDER(),
    data: () => ({
      flow: null, settings: {}, loading: true, loadError: '', answers: {}, submitting: false,
      submitError: '', invoice: null, invoiceDialog: false, confirmed: false, submission: null,
      pollTimer: null,
    }),
    computed: {
      formFields() {
        try { return JSON.parse(this.flow?.schemaJson || '{"fields":[]}').fields || [] } catch (_) { return [] }
      },
      hasNostrField() { return this.formFields.some(f => f.type === 'nostr_pubkey') },
      pricing() { try { return JSON.parse(this.flow?.pricingJson || '{}') } catch (_) { return {} } },
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
        const dark = this.settings.theme === 'dark'
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
      async submit() {
        if (this.submitting) return
        this.submitting = true; this.submitError = ''
        try {
          const flowId = this.flow.id
          const result = await this.api('POST', `/f/${flowId}/submit`, {answers: this.answers})
          this.submission = result
          if (result.status === 'confirmed') { this.confirmed = true; return }
          this.invoice = result
          this.invoiceDialog = true
          this.startPolling(result.submissionId)
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
              this.stopPolling()
              this.invoiceDialog = false
              this.confirmed = true
            } else if (['expired', 'cancelled', 'rejected'].includes(view.status)) {
              this.stopPolling()
              this.invoiceDialog = false
              this.submitError = `This submission is ${view.status}. You can submit again for a new invoice.`
            }
          } catch (_) { /* keep polling; transient errors are fine */ }
        }, POLL_MS)
      },
      stopPolling() { if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null } },
      copyInvoice() {
        try { navigator.clipboard.writeText(this.invoice.paymentRequest) } catch (_) {}
      },
    },
    beforeUnmount() { this.stopPolling() },
  })
  app.use(Quasar)
  app.component('qrcode-vue', QrcodeVue)
  app.mount('#q-app')
  document.getElementById('q-app').classList.remove('vue-pending')
  const vm = app._instance.proxy
  LNbitsBridge.connect().then(() => vm.loadFlow()).catch(e => { vm.loading = false; vm.loadError = e.message })
})()
