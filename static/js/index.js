(() => {
  const API = '/api/v1/ext/forms'
  const themePresetOptions = [
    {value: 'standard', label: 'Standard'},
    {value: 'bitcoin', label: 'Bitcoin'},
    {value: 'minimal', label: 'Minimal'},
    {value: 'contrast', label: 'High contrast'},
    {value: 'typeform', label: 'Typeform'},
  ]
  const themeModeOptions = [
    {value: 'light', label: 'Light'},
    {value: 'dark', label: 'Dark'},
  ]
  const rendererOptions = [
    {value: 'compact', label: 'All on one page'},
    {value: 'stepper', label: 'Step by step'},
  ]

  // Old flows stored a single theme value: light|dark|bitcoin|minimal|contrast.
  function themeSettings(settings) {
    const theme = settings.theme || 'standard'
    if (theme === 'dark') return {preset: 'standard', mode: 'dark'}
    if (theme === 'light') return {preset: 'standard', mode: 'light'}
    return {preset: themePresetOptions.some(o => o.value === theme) ? theme : 'standard', mode: settings.themeMode === 'dark' ? 'dark' : 'light'}
  }
  const fieldTypeOptions = [
    {value: 'text', label: 'Short answer', icon: 'text_fields', color: '#8b5cf6'},
    {value: 'textarea', label: 'Paragraph', icon: 'subject', color: '#65a30d'},
    {value: 'email', label: 'Email', icon: 'mail_outline', color: '#f59e0b'},
    {value: 'phone', label: 'Phone', icon: 'phone', color: '#0ea5e9'},
    {value: 'number', label: 'Number', icon: 'tag', color: '#eab308'},
    {value: 'date', label: 'Date', icon: 'event', color: '#ef4444'},
    {value: 'select', label: 'Dropdown', icon: 'arrow_drop_down_circle', color: '#22c55e'},
    {value: 'radio', label: 'Multiple choice', icon: 'radio_button_checked', color: '#14b8a6'},
    {value: 'checkbox', label: 'Checkbox', icon: 'check_box', color: '#3b82f6'},
    {value: 'consent', label: 'Consent', icon: 'gavel', color: '#a855f7'},
    {value: 'nostr_pubkey', label: 'Nostr pubkey', icon: 'key', color: '#8e30eb'},
  ]

  function fieldIcon(type) {
    return (fieldTypeOptions.find(t => t.value === type) || {}).icon || 'help_outline'
  }

  function slugify(s) {
    return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40)
  }

  function newField(type = 'text') {
    return {id: '', type, label: '', required: false, help: '', optionsText: ''}
  }

  const flowTemplates = [
    {
      value: 'blank', label: 'Blank form',
      data: {title: '', description: '', amountSat: 0, requireApproval: false,
        fields: [{id: 'name', type: 'text', label: 'Name', required: true, help: '', optionsText: ''}, {id: 'email', type: 'email', label: 'Email', required: true, help: '', optionsText: ''}]},
    },
    {
      value: 'event', label: 'Event ticket',
      data: {title: 'Event registration', description: 'Reserve your spot.', amountSat: 1000, requireApproval: false,
        fields: [
          {id: 'name', type: 'text', label: 'Full name', required: true, help: '', optionsText: ''},
          {id: 'email', type: 'email', label: 'Email', required: true, help: '', optionsText: ''},
          {id: 'ticket_type', type: 'radio', label: 'Ticket type', required: true, help: '', optionsText: 'General, Supporter'},
          {id: 'dietary', type: 'text', label: 'Dietary requirements', required: false, help: '', optionsText: ''},
          {id: 'nostr', type: 'nostr_pubkey', label: 'Nostr pubkey (optional)', required: false, help: 'Your npub for attendee networking.', optionsText: ''},
          {id: 'terms', type: 'consent', label: 'I accept the event terms', required: true, help: '', optionsText: ''},
        ]},
    },
    {
      value: 'membership', label: 'Paid membership',
      data: {title: 'Membership signup', description: 'Join our community.', amountSat: 2100, requireApproval: false,
        fields: [
          {id: 'name', type: 'text', label: 'Name', required: true, help: '', optionsText: ''},
          {id: 'email', type: 'email', label: 'Email', required: true, help: '', optionsText: ''},
          {id: 'nostr', type: 'nostr_pubkey', label: 'Nostr pubkey', required: false, help: '', optionsText: ''},
          {id: 'tier', type: 'select', label: 'Membership tier', required: true, help: '', optionsText: 'Standard, Patron'},
          {id: 'terms', type: 'consent', label: 'I agree to the membership terms', required: true, help: '', optionsText: ''},
        ]},
    },
    {
      value: 'donation', label: 'Donation + signup',
      data: {title: 'Support us', description: 'Donate and stay in the loop.', amountSat: 500, requireApproval: false,
        fields: [
          {id: 'name', type: 'text', label: 'Name (optional)', required: false, help: '', optionsText: ''},
          {id: 'email', type: 'email', label: 'Email for updates', required: true, help: '', optionsText: ''},
          {id: 'message', type: 'textarea', label: 'Message (optional)', required: false, help: '', optionsText: ''},
        ]},
    },
    {
      value: 'application', label: 'Application (approval)',
      data: {title: 'Application', description: 'Apply — approved applicants receive a payment link.', amountSat: 0, requireApproval: true,
        fields: [
          {id: 'name', type: 'text', label: 'Name', required: true, help: '', optionsText: ''},
          {id: 'email', type: 'email', label: 'Email', required: true, help: '', optionsText: ''},
          {id: 'motivation', type: 'textarea', label: 'Why do you want to join?', required: true, help: '', optionsText: ''},
          {id: 'nostr', type: 'nostr_pubkey', label: 'Nostr pubkey (optional)', required: false, help: '', optionsText: ''},
        ]},
    },
  ]

  const customCssSample = `/* Palette — override the theme variables */
:root {
  --q-primary: #7c3aed;        /* buttons & accents */
  --q-secondary: #4f46e5;
  --forms-page: #faf5ff;       /* page background */
  --forms-card: #ffffff;       /* form card */
  --forms-text: #1e1b4b;       /* main text */
  --forms-muted: #7a7794;      /* secondary text */
  --forms-border: rgba(30, 27, 75, 0.16);
}

/* Form card shape & shadow */
.q-card {
  border-radius: 24px;
  box-shadow: 0 16px 48px rgba(124, 58, 237, 0.15);
}

/* Question typography (stepper layout) */
.tf-qlabel { font-family: Georgia, 'Times New Roman', serif; }
.tf-qnum { color: var(--q-primary); }

/* Buttons */
.q-btn--unelevated {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Multiple-choice option cards */
.tf-option:hover { background: rgba(124, 58, 237, 0.07); }
`

  function schemaToFields(schemaJson) {
    try {
      const fields = JSON.parse(schemaJson || '{"fields":[]}').fields || []
      return fields.map(f => ({...f, optionsText: (f.options || []).join(', ')}))
    } catch (_) { return [] }
  }

  function fieldsToSchema(fields) {
    const seen = new Set()
    const out = fields.map((f, i) => {
      const label = (f.label || '').trim()
      if (!label) throw new Error(`Field ${i + 1} needs a label.`)
      let id = slugify(f.id) || slugify(label)
      if (!id) throw new Error(`Field ${i + 1} needs an id (letters or numbers).`)
      while (seen.has(id)) id = `${id}_${i + 1}`
      seen.add(id)
      const field = {id, type: f.type, label, required: Boolean(f.required), help: (f.help || '').trim()}
      if (['select', 'radio'].includes(f.type)) {
        field.options = (f.optionsText || '').split(',').map(s => s.trim()).filter(Boolean)
        if (!field.options.length) throw new Error(`Field "${label}" needs at least one option.`)
      }
      return field
    })
    return {fields: out}
  }

  const app = Vue.createApp({
    render: window.FORMS_INDEX_RENDER(),
    data: () => ({
      flows: [], wallets: [], loading: false, loadError: '', saving: false, formError: '', isDark: false,
      themePresetOptions, themeModeOptions, rendererOptions, fieldTypeOptions, flowTemplates, customCssSample,
      flowDialog: {show: false, editing: false, template: 'blank', sel: 0, view: 'edit', previewStep: -1, previewAnswers: {}, data: {title: '', description: '', walletId: null, amountSat: 0, capacity: 0, themePreset: 'standard', themeMode: 'light', renderer: 'compact', requireApproval: false, fields: [], customCss: '', headerImage: '', confirmText: ''}},
      subsDialog: {show: false, flow: null, rows: []},
      csvDialog: {show: false, filename: '', content: ''},
      subsFilter: '', subsStatusFilter: null,
      shareDialog: {show: false, flow: null},
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
        {name: 'answers', label: 'Answers', field: 'answersJson', align: 'left'},
        {name: 'ticket', label: 'Ticket', field: 'ticketCode', align: 'left'},
        {name: 'actions', label: '', field: 'id', align: 'right'},
      ] },
      filteredSubs() {
        const q = (this.subsFilter || '').toLowerCase().trim()
        const rows = this.subsStatusFilter ? this.subsDialog.rows.filter(r => r.status === this.subsStatusFilter) : this.subsDialog.rows
        if (!q) return rows
        return rows.filter(r => [r.id, r.ticketCode, r.answersJson].some(v => (v || '').toLowerCase().includes(q)))
      },
      previewStepper() { return this.flowDialog.data.renderer === 'stepper' && this.flowDialog.data.fields.length > 0 },
      previewClasses() {
        const d = this.flowDialog.data
        const preset = ['bitcoin', 'minimal', 'contrast', 'typeform'].includes(d.themePreset) ? `theme-${d.themePreset}` : ''
        return [preset, d.themeMode === 'dark' ? 'theme-dark' : ''].filter(Boolean).join(' ')
      },
      previewProgress() {
        const n = this.flowDialog.data.fields.length
        return n ? (this.flowDialog.previewStep + 1) / n : 0
      },
      previewLastStep() { return this.flowDialog.previewStep === this.flowDialog.data.fields.length - 1 },
      previewSubmitLabel() {
        const amount = Number(this.flowDialog.data.amountSat) || 0
        return amount > 0 ? `Pay ${amount.toLocaleString()} sats` : 'Submit'
      },
      bannerStyle() {
        const url = (this.flowDialog.data.headerImage || '').trim()
        if (url) return {backgroundImage: `url("${url.replace(/"/g, '%22')}")`, backgroundSize: 'cover', backgroundPosition: 'center'}
        return {background: 'linear-gradient(120deg, color-mix(in srgb, var(--q-primary) 28%, transparent), color-mix(in srgb, var(--q-secondary, var(--q-primary)) 14%, transparent))'}
      },
      isExternalHeader() { return /^https?:\/\//.test(this.flowDialog.data.headerImage || '') },
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
      setView(v) {
        if (v === 'preview') { this.flowDialog.previewStep = -1; this.flowDialog.previewAnswers = {} }
        this.formError = ''
      },
      pickHeaderImage() {
        const inp = document.createElement('input')
        inp.type = 'file'; inp.accept = 'image/*'
        inp.onchange = () => this.onHeaderFile(inp)
        inp.click()
      },
      onHeaderFile(inp) {
        const f = inp.files && inp.files[0]
        if (!f) return
        if (f.size > 145000) { this.formError = 'Header image too large — pick one under ~140 KB (data URIs are ~33% bigger than the file).'; return }
        const r = new FileReader()
        r.onload = () => { this.flowDialog.data.headerImage = String(r.result || ''); this.formError = '' }
        r.onerror = () => { this.formError = 'Could not read that image file.' }
        r.readAsDataURL(f)
      },
      insertCssSample() {
        const d = this.flowDialog.data
        d.customCss = d.customCss?.trim() ? `${d.customCss.trimEnd()}\n\n${customCssSample}` : customCssSample
      },
      fieldOptions(field) { return (field.optionsText || '').split(',').map(s => s.trim()).filter(Boolean) },
      previewFieldEmpty(field) { const v = this.flowDialog.previewAnswers[field.id]; return v === undefined || v === null || v === '' },
      previewOptionKey(i) { return String.fromCharCode(65 + i) },
      previewChoose(field, opt) {
        this.flowDialog.previewAnswers[field.id] = opt
        if (!this.previewLastStep) setTimeout(() => this.previewNext(), 280)
      },
      previewNext() {
        const field = this.flowDialog.data.fields[this.flowDialog.previewStep]
        if (field && field.required && this.previewFieldEmpty(field)) { this.formError = `"${field.label || 'Untitled question'}" is required.`; return }
        this.formError = ''
        if (this.flowDialog.previewStep < this.flowDialog.data.fields.length - 1) this.flowDialog.previewStep += 1
      },
      previewPrev() { this.flowDialog.previewStep = Math.max(-1, this.flowDialog.previewStep - 1); this.formError = '' },
      previewOk() {
        if (this.flowDialog.previewStep === -1) { this.flowDialog.previewStep = 0; return }
        if (this.previewLastStep) return
        this.previewNext()
      },
      openFlowDialog(flow = null) {
        this.formError = ''
        if (flow) {
          const settings = JSON.parse(flow.settingsJson || '{}')
          const {preset, mode} = themeSettings(settings)
          this.flowDialog = {show: true, editing: true, template: 'blank', sel: 0, view: 'edit', previewStep: -1, previewAnswers: {}, data: {id: flow.id, title: flow.title, description: flow.description, walletId: flow.walletId, amountSat: (JSON.parse(flow.pricingJson || '{}').amountSat) || 0, capacity: flow.capacity || 0, themePreset: preset, themeMode: mode, renderer: settings.renderer === 'stepper' ? 'stepper' : 'compact', requireApproval: Boolean(settings.requireApproval), fields: schemaToFields(flow.schemaJson), customCss: settings.customCss || '', headerImage: settings.headerImage || '', confirmText: settings.confirmText || ''}}
        } else {
          const blank = flowTemplates[0].data
          this.flowDialog = {show: true, editing: false, template: 'blank', sel: 0, view: 'edit', previewStep: -1, previewAnswers: {}, data: {title: blank.title, description: blank.description, walletId: this.wallets[0]?.id || null, amountSat: blank.amountSat, capacity: 0, themePreset: 'standard', themeMode: 'light', renderer: 'compact', requireApproval: blank.requireApproval, fields: blank.fields.map(f => ({...f})), customCss: '', headerImage: '', confirmText: ''}}
        }
      },
      applyTemplate(value) {
        const tpl = flowTemplates.find(t => t.value === value)
        if (!tpl || this.flowDialog.editing) return
        const d = this.flowDialog.data
        d.title = tpl.data.title
        d.description = tpl.data.description
        d.amountSat = tpl.data.amountSat
        d.requireApproval = tpl.data.requireApproval
        d.fields = tpl.data.fields.map(f => ({...f}))
        this.flowDialog.sel = 0
      },
      fieldIcon,
      typeLabel(type) { return (fieldTypeOptions.find(t => t.value === type) || {}).label || type },
      selectField(i) { this.flowDialog.sel = i },
      toggleRequired(i) {
        const f = this.flowDialog.data.fields[i]
        if (f.type === 'consent') { f.required = true; return }
        f.required = !f.required
      },
      addField(type = 'text') {
        const fields = this.flowDialog.data.fields
        fields.push(newField(type))
        this.flowDialog.sel = fields.length - 1
      },
      duplicateField(i) {
        const fields = this.flowDialog.data.fields
        fields.splice(i + 1, 0, {...fields[i], id: ''})
        this.flowDialog.sel = i + 1
      },
      removeField(i) {
        const fields = this.flowDialog.data.fields
        fields.splice(i, 1)
        this.flowDialog.sel = Math.min(this.flowDialog.sel, fields.length - 1)
      },
      moveField(i, dir) {
        const fields = this.flowDialog.data.fields
        const j = i + dir
        if (j < 0 || j >= fields.length) return
        fields.splice(j, 0, fields.splice(i, 1)[0])
        this.flowDialog.sel = j
      },
      async saveFlow() {
        if (this.saving) return
        const d = this.flowDialog.data
        if (!d.title?.trim() || (!this.flowDialog.editing && !d.walletId)) { this.formError = 'Title and payout wallet are required.'; return }
        let schemaJson
        try { schemaJson = fieldsToSchema(d.fields) }
        catch (e) { this.formError = e.message; return }
        const payload = {
          title: d.title.trim(), description: d.description || '', capacity: Number(d.capacity) || 0,
          pricingJson: {mode: Number(d.amountSat) > 0 ? 'fixed' : 'free', amountSat: Number(d.amountSat) || 0},
          schemaJson,
          settingsJson: {theme: d.themePreset, themeMode: d.themeMode, renderer: d.renderer, requireApproval: Boolean(d.requireApproval), customCss: d.customCss || '', headerImage: d.headerImage || '', confirmText: d.confirmText || ''},
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
      publicUrl(flow) { return `${location.origin}/ext/forms/f/${flow.id}` },
      embedSnippet(flow) { return `<script src="${location.origin}/ext-assets/forms/js/embed.js" data-flow="${flow.id}" async><\/script>` },
      openPublic(flow) { LNbitsBridge.openInNewTab(this.publicUrl(flow)) },
      confirmDelete(flow) {
        this.$q.dialog({
          title: 'Delete flow?',
          message: `"${flow.title || 'Untitled'}" and all of its submissions will be permanently deleted. This cannot be undone.`,
          cancel: {flat: true, noCaps: true, label: 'Cancel'},
          ok: {unelevated: true, noCaps: true, color: 'negative', label: 'Delete'},
          persistent: true,
        }).onOk(() => this.deleteFlow(flow))
      },
      async deleteFlow(flow) {
        try {
          await this.api('DELETE', `/flows/${flow.id}`)
          this.flows = this.flows.filter(f => f.id !== flow.id)
          LNbitsBridge.notify('Flow deleted.', 'positive').catch(() => {})
        } catch (e) { LNbitsBridge.notify(e.message, 'negative').catch(() => {}) }
      },
      openShare(flow) { this.shareDialog = {show: true, flow} },
      copyText(text, label) {
        try { navigator.clipboard.writeText(text); LNbitsBridge.notify(`${label} copied.`, 'positive').catch(() => {}) }
        catch (_) { LNbitsBridge.notify('Clipboard access is unavailable. Copy the text manually.', 'warning').catch(() => {}) }
      },
      copyPublicLink(flow) { this.copyText(this.publicUrl(flow), 'Public link') },
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
          this.csvDialog = {show: true, filename: `${(flow.title || 'submissions').replace(/[^\w-]+/g, '_')}.csv`, content: csv}
        } catch (e) { LNbitsBridge.notify(e.message, 'negative').catch(() => {}) }
      },
      async copyCsv() {
        try {
          await navigator.clipboard.writeText(this.csvDialog.content)
          LNbitsBridge.notify('CSV copied to clipboard.', 'positive').catch(() => {})
        } catch (_) {
          LNbitsBridge.notify('Clipboard access is unavailable — select the text and copy manually.', 'warning').catch(() => {})
        }
      },
      statusColor(s) { return {draft: 'grey', published: 'positive', closed: 'warning', archived: 'grey-6', pending_payment: 'orange', paid: 'positive', confirmed: 'positive', approved: 'teal', rejected: 'negative', cancelled: 'grey', expired: 'grey-6'}[s] || 'grey' },
      answersPreview(row) {
        try {
          const a = JSON.parse(row.answersJson || '{}')
          return Object.entries(a).map(([k, v]) => `${k}: ${v === true ? 'yes' : v === false ? 'no' : v}`).join(' · ')
        } catch (_) { return row.answersJson || '' }
      },
      priceLabel(flow) { try { const p = JSON.parse(flow.pricingJson || '{}'); return p.mode === 'fixed' ? `${p.amountSat} sats` : 'free' } catch (_) { return 'free' } },
      formatSats(v) { return Number(v || 0).toLocaleString() },
    },
  })
  app.use(Quasar)
  const vm = app.mount('#q-app')
  document.getElementById('q-app').classList.remove('vue-pending')
  LNbitsBridge.connect().then(() => { vm.initTheme(); vm.load() }).catch(e => { vm.loadError = e.message })
})()
