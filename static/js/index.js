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
  // The bundled material-icons font has no ostrich, and .svg assets aren't
  // servable from /ext-assets/ — embed the nostrich badge as a data URI.
  const NOSTRICH = '<img src="data:image/png;base64,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" alt="">'

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
    {value: 'nostr_pubkey', label: 'Nostr pubkey', svg: NOSTRICH, color: '#c045f0'},
  ]

  function fieldIcon(type) {
    return (fieldTypeOptions.find(t => t.value === type) || {}).icon || 'help_outline'
  }
  function fieldSvg(type) {
    return (fieldTypeOptions.find(t => t.value === type) || {}).svg || ''
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

  const colorKeys = [{key: 'global', label: 'Global'}, {key: 'title', label: 'Title'}, {key: 'description', label: 'Description'}, {key: 'question', label: 'Question'}]

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
      flows: [], wallets: [], loading: false, loadError: '', saving: false, isDark: false,
      themePresetOptions, themeModeOptions, rendererOptions, fieldTypeOptions, flowTemplates, customCssSample, colorKeys,
      flowDialog: {show: false, editing: false, template: 'blank', sel: 0, view: 'edit', previewStep: -1, previewAnswers: {}, data: {title: '', description: '', walletId: null, amountSat: 0, capacity: 0, themePreset: 'standard', themeMode: 'light', renderer: 'compact', requireApproval: false, fields: [], customCss: '', headerImage: '', confirmText: '', bgImage: '', endImage: '', cardOpacity: 1, colors: {global: '', title: '', description: '', question: ''}, notifyUrl: '', notifyKey: '', notifyOnSubmit: true, notifyOnPaid: true}},
      notifyTesting: false, notifyResult: '', notifyOk: false,
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
      themeVars() {
        const c = this.flowDialog.data.colors || {}
        const vars = {'--fc-card-op': this.flowDialog.data.cardOpacity ?? 1}
        if (c.global) vars['--fc-global'] = c.global
        if (c.title) vars['--fc-title'] = c.title
        if (c.description) vars['--fc-desc'] = c.description
        if (c.question) vars['--fc-question'] = c.question
        return vars
      },
      canvasStyle() {
        const bg = (this.flowDialog.data.bgImage || '').trim()
        const style = {...this.themeVars}
        if (bg) Object.assign(style, {backgroundImage: `url("${bg.replace(/"/g, '%22')}")`, backgroundSize: 'cover', backgroundPosition: 'center'})
        return style
      },
      endBannerStyle() {
        const u = (this.flowDialog.data.endImage || '').trim()
        return u ? {backgroundImage: `url("${u.replace(/"/g, '%22')}")`} : {}
      },
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
      },
      showError(msg) { LNbitsBridge.notify(msg || 'Something went wrong.', 'negative').catch(() => {}) },
      isExtImg(v) { return /^https?:\/\//.test(v || '') },
      pickHeaderImage() { this.pickImage('headerImage') },
      pickImage(field) {
        const inp = document.createElement('input')
        inp.type = 'file'; inp.accept = 'image/*'
        inp.onchange = () => {
          const f = inp.files && inp.files[0]
          if (!f) return
          if (f.size > 145000) { this.showError('Image too large — pick one under ~140 KB (data URIs are ~33% bigger than the file).'); return }
          const r = new FileReader()
          r.onload = () => { this.flowDialog.data[field] = String(r.result || '') }
          r.onerror = () => { this.showError('Could not read that image file.') }
          r.readAsDataURL(f)
        }
        inp.click()
      },
      async testNotify() {
        const d = this.flowDialog.data
        this.notifyTesting = true; this.notifyResult = ''
        try {
          const r = await this.api('POST', `/flows/${d.id}/notify-test`, {flowId: d.id, settingsJson: {notifyUrl: d.notifyUrl || '', notifyKey: d.notifyKey || '', notifyOnSubmit: true, notifyOnPaid: true}})
          this.notifyOk = Boolean(r.sent)
          this.notifyResult = r.sent ? `Sent — HTTP ${r.statusCode}` : (r.error || 'Failed')
        } catch (e) {
          this.notifyOk = false; this.notifyResult = e.message || 'Failed'
        } finally { this.notifyTesting = false }
      },
      insertCssSample() {
        const d = this.flowDialog.data
        d.customCss = d.customCss?.trim() ? `${d.customCss.trimEnd()}\n\n${customCssSample}` : customCssSample
      },
      fieldOptions(field) { return (field.optionsText || '').split(',').map(s => s.trim()).filter(Boolean) },
      previewFieldEmpty(field) { const v = this.flowDialog.previewAnswers[field.id]; return v === undefined || v === null || v === '' },
      previewOptionKey(i) { return String.fromCharCode(65 + i) },
      isOptionalLabel(field) { return /optional/i.test(field?.label || '') },
      previewChoose(field, opt) {
        this.flowDialog.previewAnswers[field.id] = opt
        if (!this.previewLastStep) setTimeout(() => this.previewNext(), 280)
      },
      previewNext() {
        const field = this.flowDialog.data.fields[this.flowDialog.previewStep]
        if (field && field.required && this.previewFieldEmpty(field)) { this.showError(`"${field.label || 'Untitled question'}" is required.`); return }
        if (this.flowDialog.previewStep < this.flowDialog.data.fields.length - 1) this.flowDialog.previewStep += 1
      },
      previewPrev() { this.flowDialog.previewStep = Math.max(-1, this.flowDialog.previewStep - 1) },
      previewOk() {
        if (this.flowDialog.previewStep === -1) { this.flowDialog.previewStep = 0; return }
        if (this.previewLastStep) return
        this.previewNext()
      },
      openFlowDialog(flow = null) {
        if (flow) {
          const settings = JSON.parse(flow.settingsJson || '{}')
          const {preset, mode} = themeSettings(settings)
          this.flowDialog = {show: true, editing: true, template: 'blank', sel: 0, view: 'edit', previewStep: -1, previewAnswers: {}, data: {id: flow.id, status: flow.status, title: flow.title, description: flow.description, walletId: flow.walletId, amountSat: (JSON.parse(flow.pricingJson || '{}').amountSat) || 0, capacity: flow.capacity || 0, themePreset: preset, themeMode: mode, renderer: settings.renderer === 'stepper' ? 'stepper' : 'compact', requireApproval: Boolean(settings.requireApproval), fields: schemaToFields(flow.schemaJson), customCss: settings.customCss || '', headerImage: settings.headerImage || '', confirmText: settings.confirmText || '', bgImage: settings.bgImage || '', endImage: settings.endImage || '', cardOpacity: settings.cardOpacity ?? 1, colors: Object.assign({global: '', title: '', description: '', question: ''}, settings.colors || {}), notifyUrl: settings.notifyUrl || '', notifyKey: settings.notifyKey || '', notifyOnSubmit: settings.notifyOnSubmit !== false, notifyOnPaid: settings.notifyOnPaid !== false}}
        } else {
          const blank = flowTemplates[0].data
          this.flowDialog = {show: true, editing: false, template: 'blank', sel: 0, view: 'edit', previewStep: -1, previewAnswers: {}, data: {title: blank.title, description: blank.description, walletId: this.wallets[0]?.id || null, amountSat: blank.amountSat, capacity: 0, themePreset: 'standard', themeMode: 'light', renderer: 'compact', requireApproval: blank.requireApproval, fields: blank.fields.map(f => ({...f})), customCss: '', headerImage: '', confirmText: '', bgImage: '', endImage: '', cardOpacity: 1, colors: {global: '', title: '', description: '', question: ''}, notifyUrl: '', notifyKey: '', notifyOnSubmit: true, notifyOnPaid: true}}
        }
        this.notifyResult = ''
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
      fieldIcon, fieldSvg,
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
      async saveFlow(publish = false) {
        if (this.saving) return
        const d = this.flowDialog.data
        if (!d.title?.trim() || (!this.flowDialog.editing && !d.walletId)) { this.showError('Title and payout wallet are required.'); return }
        let schemaJson
        try { schemaJson = fieldsToSchema(d.fields) }
        catch (e) { this.showError(e.message); return }
        const payload = {
          title: d.title.trim(), description: d.description || '', capacity: Number(d.capacity) || 0,
          pricingJson: {mode: Number(d.amountSat) > 0 ? 'fixed' : 'free', amountSat: Number(d.amountSat) || 0},
          schemaJson,
          settingsJson: {theme: d.themePreset, themeMode: d.themeMode, renderer: d.renderer, requireApproval: Boolean(d.requireApproval), customCss: d.customCss || '', headerImage: d.headerImage || '', confirmText: d.confirmText || '', bgImage: d.bgImage || '', endImage: d.endImage || '', cardOpacity: Number(d.cardOpacity ?? 1), colors: d.colors || {}, notifyUrl: d.notifyUrl || '', notifyKey: d.notifyKey || '', notifyOnSubmit: Boolean(d.notifyOnSubmit), notifyOnPaid: Boolean(d.notifyOnPaid)},
        }
        this.saving = true
        try {
          const saved = this.flowDialog.editing
            ? await this.api('PUT', `/flows/${d.id}`, payload)
            : await this.api('POST', '/flows', {...payload, walletId: d.walletId})
          if (publish && saved.status !== 'published') {
            await this.api('POST', `/flows/${saved.id}/status`, {status: 'published'})
            saved.status = 'published'
          }
          const i = this.flows.findIndex(f => f.id === saved.id)
          if (i < 0) this.flows.unshift(saved); else this.flows.splice(i, 1, saved)
          this.flowDialog.show = false
          LNbitsBridge.notify(publish ? 'Flow published.' : 'Flow saved.', 'positive').catch(() => {})
        } catch (e) { this.showError(e.message) }
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
          let fields = []
          try { fields = (JSON.parse(flow.schemaJson || '{}').fields || []).map(f => ({id: f.id, label: f.label || f.id})) } catch (_) {}
          const known = new Set(fields.map(f => f.id))
          const extraKeys = []
          for (const r of rows) {
            try {
              for (const k of Object.keys(JSON.parse(r.answersJson || '{}'))) {
                if (!known.has(k) && !extraKeys.includes(k)) extraKeys.push(k)
              }
            } catch (_) {}
          }
          const meta = ['id', 'status', 'amountSat', 'ticketCode', 'paymentHash', 'createdAt', 'paidAt']
          const headers = [...meta, ...fields.map(f => f.label), ...extraKeys]
          const cell = v => v === null || v === undefined ? '' : v === true ? 'yes' : v === false ? 'no' : Array.isArray(v) ? v.join('; ') : String(v)
          const csv = [headers.map(h => JSON.stringify(h)).join(',')].concat(rows.map(r => {
            let a = {}
            try { a = JSON.parse(r.answersJson || '{}') } catch (_) {}
            const answerCols = [...fields.map(f => a[f.id]), ...extraKeys.map(k => a[k])]
            return [...meta.map(c => cell(r[c])), ...answerCols.map(cell)].map(v => JSON.stringify(v)).join(',')
          })).join('\n')
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
