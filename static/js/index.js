(() => {
  const API = '/api/v1/ext/forms'
  const themeOptions = ['light', 'dark', 'bitcoin', 'minimal', 'contrast']

  function fieldsToText(schemaJson) {
    try {
      const fields = JSON.parse(schemaJson || '{"fields":[]}').fields || []
      return fields.map(f => [f.id, f.type, f.label, f.required ? 'required' : '', (f.options || []).join(',')].join('|')).join('\n')
    } catch (_) { return '' }
  }

  function textToFields(text) {
    const fields = []
    for (const line of (text || '').split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const [id, type, label, req, opts] = trimmed.split('|').map(s => (s || '').trim())
      const field = {id, type, label, required: req === 'required'}
      if (opts) field.options = opts.split(',').map(s => s.trim()).filter(Boolean)
      fields.push(field)
    }
    return {fields}
  }

  const app = Vue.createApp({
    render: window.FORMS_INDEX_RENDER(),
    data: () => ({
      flows: [], wallets: [], loading: false, loadError: '', saving: false, formError: '', isDark: false,
      themeOptions,
      flowDialog: {show: false, editing: false, data: {title: '', description: '', walletId: null, amountSat: 0, capacity: 0, theme: 'light', fieldsText: 'name|text|Name|required\nemail|email|Email|required', customCss: ''}},
      subsDialog: {show: false, flow: null, rows: []},
    }),
    computed: {
      walletOptions() { return this.wallets.map(w => ({label: w.name, value: w.id})) },
      columns() { return [
        {name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true},
        {name: 'status', label: 'Status', field: 'status', align: 'left'},
        {name: 'price', label: 'Price', field: 'pricingJson', align: 'left'},
        {name: 'actions', label: '', field: 'id', align: 'right'},
      ] },
      subColumns() { return [
        {name: 'id', label: 'ID', field: 'id', align: 'left'},
        {name: 'status', label: 'Status', field: 'status', align: 'left'},
        {name: 'amount', label: 'Sats', field: 'amountSat', align: 'right'},
        {name: 'ticket', label: 'Ticket', field: 'ticketCode', align: 'left'},
        {name: 'actions', label: '', field: 'id', align: 'right'},
      ] },
    },
    methods: {
      async api(method, path, body) { const result = await LNbitsBridge.callApi(method, API + path, body); if (result && result.error) throw new Error(result.error); return result },
      initTheme() { this.isDark = matchMedia('(prefers-color-scheme: dark)').matches; this.applyTheme() },
      applyTheme() { document.body.classList.toggle('body--dark', this.isDark); this.$q.dark.set(this.isDark) },
      toggleTheme() { this.isDark = !this.isDark; this.applyTheme() },
      async load() {
        this.loading = true; this.loadError = ''
        try {
          const [flows, wallets] = await Promise.all([this.api('GET', '/flows'), this.api('GET', '/wallets')])
          this.flows = flows.data || []; this.wallets = wallets.data || []
        } catch (e) { this.loadError = e.message || 'Flows could not be loaded.' }
        finally { this.loading = false }
      },
      openFlowDialog(flow = null) {
        this.formError = ''
        this.flowDialog = flow
          ? {show: true, editing: true, data: {id: flow.id, title: flow.title, description: flow.description, walletId: flow.walletId, amountSat: (JSON.parse(flow.pricingJson || '{}').amountSat) || 0, capacity: flow.capacity || 0, theme: (JSON.parse(flow.settingsJson || '{}').theme) || 'light', fieldsText: fieldsToText(flow.schemaJson), customCss: (JSON.parse(flow.settingsJson || '{}').customCss) || ''}}
          : {show: true, editing: false, data: {title: '', description: '', walletId: this.wallets[0]?.id || null, amountSat: 0, capacity: 0, theme: 'light', fieldsText: 'name|text|Name|required\nemail|email|Email|required', customCss: ''}}
      },
      async saveFlow() {
        if (this.saving) return
        const d = this.flowDialog.data
        if (!d.title?.trim() || (!this.flowDialog.editing && !d.walletId)) { this.formError = 'Title and payout wallet are required.'; return }
        const payload = {
          title: d.title.trim(), description: d.description || '', capacity: Number(d.capacity) || 0,
          pricingJson: {mode: Number(d.amountSat) > 0 ? 'fixed' : 'free', amountSat: Number(d.amountSat) || 0},
          schemaJson: textToFields(d.fieldsText),
          settingsJson: {theme: d.theme, customCss: d.customCss || ''},
        }
        this.saving = true; this.formError = ''
        try {
          const saved = this.flowDialog.editing
            ? await this.api('PUT', `/flows/${d.id}`, payload)
            : await this.api('POST', '/flows', {...payload, walletId: d.walletId})
          const i = this.flows.findIndex(f => f.id === saved.id)
          if (i < 0) this.flows.unshift(saved); else this.flows.splice(i, 1, saved)
          this.flowDialog.show = false
          LNbitsBridge.notify('Flow saved.', 'positive').catch(() => {})
        } catch (e) { this.formError = e.message }
        finally { this.saving = false }
      },
      async setStatus(flow, status) {
        try {
          await this.api('POST', `/flows/${flow.id}/status`, {status})
          flow.status = status
        } catch (e) { LNbitsBridge.notify(e.message, 'negative').catch(() => {}) }
      },
      copyPublicLink(flow) {
        const url = `${location.origin}/ext/forms/f/${flow.id}`
        try { navigator.clipboard.writeText(url); LNbitsBridge.notify('Public link copied.', 'positive').catch(() => {}) }
        catch (_) { window.prompt('Copy the public link:', url) }
      },
      async openSubmissions(flow) {
        this.subsDialog = {show: true, flow, rows: []}
        try { this.subsDialog.rows = (await this.api('GET', `/flows/${flow.id}/submissions`)).data || [] }
        catch (e) { LNbitsBridge.notify(e.message, 'negative').catch(() => {}) }
      },
      async moderate(sub, status) {
        try {
          await this.api('PATCH', `/submissions/${sub.id}`, {status})
          sub.status = status
        } catch (e) { LNbitsBridge.notify(e.message, 'negative').catch(() => {}) }
      },
      async exportCsv() {
        const flow = this.subsDialog.flow; if (!flow) return
        try {
          const rows = (await this.api('GET', `/flows/${flow.id}/export`)).data || []
          const cols = ['id', 'status', 'amountSat', 'ticketCode', 'paymentHash', 'createdAt', 'paidAt', 'answersJson']
          const csv = [cols.join(',')].concat(rows.map(r => cols.map(c => JSON.stringify(r[c] ?? '')).join(','))).join('\n')
          const blob = new Blob([csv], {type: 'text/csv'})
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${flow.title || 'submissions'}.csv`; a.click()
        } catch (e) { LNbitsBridge.notify(e.message, 'negative').catch(() => {}) }
      },
      statusColor(s) { return {draft: 'grey', published: 'positive', closed: 'warning', archived: 'grey-6', pending_payment: 'orange', paid: 'positive', confirmed: 'positive', approved: 'teal', rejected: 'negative', cancelled: 'grey', expired: 'grey-6'}[s] || 'grey' },
      priceLabel(flow) { try { const p = JSON.parse(flow.pricingJson || '{}'); return p.mode === 'fixed' ? `${p.amountSat} sats` : 'free' } catch (_) { return 'free' } },
      formatSats(v) { return Number(v || 0).toLocaleString() },
    },
  })
  app.use(Quasar)
  app.mount('#q-app')
  document.getElementById('q-app').classList.remove('vue-pending')
  const vm = app._instance.proxy
  LNbitsBridge.connect().then(() => { vm.initTheme(); vm.load() }).catch(e => { vm.loadError = e.message })
})()
