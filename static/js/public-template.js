window.FORMS_PUBLIC_RENDER=function(){
const { resolveComponent: _resolveComponent, createVNode: _createVNode, createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock, createCommentVNode: _createCommentVNode, toDisplayString: _toDisplayString, withCtx: _withCtx, createBlock: _createBlock, renderList: _renderList, Fragment: _Fragment, createTextVNode: _createTextVNode } = Vue

return function render(_ctx, _cache) {
  const _component_q_spinner = _resolveComponent("q-spinner")
  const _component_q_icon = _resolveComponent("q-icon")
  const _component_q_btn = _resolveComponent("q-btn")
  const _component_q_card = _resolveComponent("q-card")
  const _component_q_input = _resolveComponent("q-input")
  const _component_q_select = _resolveComponent("q-select")
  const _component_q_option_group = _resolveComponent("q-option-group")
  const _component_q_checkbox = _resolveComponent("q-checkbox")
  const _component_qrcode_vue = _resolveComponent("qrcode-vue")
  const _component_q_spinner_dots = _resolveComponent("q-spinner-dots")
  const _component_q_dialog = _resolveComponent("q-dialog")

  return (_openBlock(), _createElementBlock("div", { class: "public-page row justify-center q-py-md q-py-sm-xl" }, [
    _createElementVNode("div", { class: "col-12 col-sm-9 col-md-7 col-lg-5" }, [
      (_ctx.loading)
        ? (_openBlock(), _createElementBlock("div", {
            key: 0,
            class: "text-center q-pa-xl"
          }, [
            _createVNode(_component_q_spinner, {
              color: "primary",
              size: "3rem"
            }),
            _createElementVNode("div", { class: "q-mt-md" }, "Loading…")
          ]))
        : (_ctx.loadError)
          ? (_openBlock(), _createBlock(_component_q_card, {
              key: 1,
              class: "q-pa-lg text-center"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_q_icon, {
                  name: "error_outline",
                  color: "negative",
                  size: "3rem"
                }),
                _createElementVNode("div", { class: "text-h6 q-mt-md" }, _toDisplayString(_ctx.loadError), 1 /* TEXT */),
                _createVNode(_component_q_btn, {
                  outline: "",
                  color: "primary",
                  class: "q-mt-md",
                  label: "Retry",
                  onClick: $event => (_ctx.loadFlow())
                }, null, 8 /* PROPS */, ["onClick"])
              ]),
              _: 1 /* STABLE */
            }))
          : (_ctx.flow && _ctx.confirmed)
            ? (_openBlock(), _createBlock(_component_q_card, {
                key: 2,
                class: "q-pa-lg text-center"
              }, {
                default: _withCtx(() => [
                  _createVNode(_component_q_icon, {
                    name: "check_circle",
                    color: "positive",
                    size: "3rem"
                  }),
                  _createElementVNode("div", { class: "text-h5 q-mt-md" }, _toDisplayString(_ctx.settings.confirmText || 'Registration confirmed'), 1 /* TEXT */),
                  (_ctx.submission && _ctx.submission.ticketCode)
                    ? (_openBlock(), _createElementBlock("div", {
                        key: 0,
                        class: "q-mt-lg"
                      }, [
                        _createElementVNode("div", { class: "text-caption text-grey-7" }, "Your confirmation code"),
                        _createElementVNode("div", { class: "text-h6 ticket-code" }, _toDisplayString(_ctx.submission.ticketCode), 1 /* TEXT */)
                      ]))
                    : _createCommentVNode("v-if", true)
                ]),
                _: 1 /* STABLE */
              }))
            : (_ctx.flow)
              ? (_openBlock(), _createBlock(_component_q_card, {
                  key: 3,
                  class: "q-pa-lg"
                }, {
                  default: _withCtx(() => [
                    _createElementVNode("h1", { class: "text-h5 q-mt-none q-mb-sm" }, _toDisplayString(_ctx.flow.title), 1 /* TEXT */),
                    (_ctx.flow.description)
                      ? (_openBlock(), _createElementBlock("p", {
                          key: 0,
                          class: "text-grey-8"
                        }, _toDisplayString(_ctx.flow.description), 1 /* TEXT */))
                      : _createCommentVNode("v-if", true),
                    (_ctx.flow.remaining!==null && _ctx.flow.remaining!==undefined)
                      ? (_openBlock(), _createElementBlock("div", {
                          key: 1,
                          class: "text-caption q-mb-md"
                        }, _toDisplayString(_ctx.flow.remaining) + " spot(s) remaining", 1 /* TEXT */))
                      : _createCommentVNode("v-if", true),
                    _createElementVNode("div", { class: "q-gutter-md" }, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.formFields, (field) => {
                        return (_openBlock(), _createElementBlock("div", {
                          key: field.id
                        }, [
                          (['text','email','phone','number','date','nostr_pubkey'].includes(field.type))
                            ? (_openBlock(), _createBlock(_component_q_input, {
                                key: 0,
                                outlined: "",
                                dense: "",
                                type: field.type==='textarea'?'textarea':'text',
                                modelValue: _ctx.answers[field.id],
                                "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                label: field.label+(field.required?' *':''),
                                hint: field.help
                              }, null, 8 /* PROPS */, ["type", "modelValue", "onUpdate:modelValue", "label", "hint"]))
                            : (field.type==='textarea')
                              ? (_openBlock(), _createBlock(_component_q_input, {
                                  key: 1,
                                  outlined: "",
                                  type: "textarea",
                                  rows: "3",
                                  modelValue: _ctx.answers[field.id],
                                  "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                  label: field.label+(field.required?' *':''),
                                  hint: field.help
                                }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "label", "hint"]))
                              : (field.type==='select')
                                ? (_openBlock(), _createBlock(_component_q_select, {
                                    key: 2,
                                    outlined: "",
                                    dense: "",
                                    options: field.options||[],
                                    modelValue: _ctx.answers[field.id],
                                    "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                    label: field.label+(field.required?' *':'')
                                  }, null, 8 /* PROPS */, ["options", "modelValue", "onUpdate:modelValue", "label"]))
                                : (field.type==='radio')
                                  ? (_openBlock(), _createElementBlock("div", { key: 3 }, [
                                      _createElementVNode("div", { class: "text-subtitle2" }, [
                                        _createTextVNode(_toDisplayString(field.label), 1 /* TEXT */),
                                        (field.required)
                                          ? (_openBlock(), _createElementBlock("span", { key: 0 }, " *"))
                                          : _createCommentVNode("v-if", true)
                                      ]),
                                      _createVNode(_component_q_option_group, {
                                        options: (field.options||[]).map(o=>({label:o,value:o})),
                                        modelValue: _ctx.answers[field.id],
                                        "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                        type: "radio"
                                      }, null, 8 /* PROPS */, ["options", "modelValue", "onUpdate:modelValue"])
                                    ]))
                                  : (['checkbox','consent'].includes(field.type))
                                    ? (_openBlock(), _createBlock(_component_q_checkbox, {
                                        key: 4,
                                        modelValue: _ctx.answers[field.id],
                                        "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                        label: field.label+(field.required?' *':'')
                                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "label"]))
                                    : _createCommentVNode("v-if", true)
                        ]))
                      }), 128 /* KEYED_FRAGMENT */))
                    ]),
                    (_ctx.submitError)
                      ? (_openBlock(), _createElementBlock("div", {
                          key: 2,
                          class: "text-negative q-mt-md",
                          role: "alert"
                        }, _toDisplayString(_ctx.submitError), 1 /* TEXT */))
                      : _createCommentVNode("v-if", true),
                    _createVNode(_component_q_btn, {
                      unelevated: "",
                      "no-caps": "",
                      color: "primary",
                      class: "full-width q-mt-lg",
                      loading: _ctx.submitting,
                      label: _ctx.submitLabel,
                      onClick: _ctx.submit
                    }, null, 8 /* PROPS */, ["loading", "label", "onClick"]),
                    (_ctx.hasNostrField)
                      ? (_openBlock(), _createElementBlock("div", {
                          key: 3,
                          class: "text-caption text-grey-7 q-mt-sm"
                        }, "Nostr sign-in is not available on this page. Paste your npub manually, or use the embedded form on the organizer's website for one-click login."))
                      : _createCommentVNode("v-if", true)
                  ]),
                  _: 1 /* STABLE */
                }))
              : _createCommentVNode("v-if", true)
    ]),
    _createVNode(_component_q_dialog, {
      modelValue: _ctx.invoiceDialog,
      "onUpdate:modelValue": $event => ((_ctx.invoiceDialog) = $event),
      position: "top"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_q_card, {
          class: "q-pa-lg",
          style: {"min-width":"min(92vw,420px)"}
        }, {
          default: _withCtx(() => [
            (_ctx.invoice)
              ? (_openBlock(), _createElementBlock("div", { key: 0 }, [
                  _createElementVNode("div", { class: "text-h6 text-center" }, "Pay " + _toDisplayString(_ctx.formatSats(_ctx.invoice.amountSat)) + " sats", 1 /* TEXT */),
                  _createElementVNode("div", { class: "qr-box q-my-md" }, [
                    _createVNode(_component_qrcode_vue, {
                      value: 'LIGHTNING:'+_ctx.invoice.paymentRequest.toUpperCase(),
                      size: 240
                    }, null, 8 /* PROPS */, ["value"])
                  ]),
                  _createVNode(_component_q_input, {
                    outlined: "",
                    readonly: "",
                    type: "textarea",
                    autogrow: "",
                    "model-value": _ctx.invoice.paymentRequest,
                    label: "BOLT11 invoice"
                  }, {
                    append: _withCtx(() => [
                      _createVNode(_component_q_btn, {
                        flat: "",
                        round: "",
                        dense: "",
                        icon: "content_copy",
                        "aria-label": "Copy invoice",
                        onClick: _ctx.copyInvoice
                      }, null, 8 /* PROPS */, ["onClick"])
                    ]),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["model-value"]),
                  _createElementVNode("div", {
                    class: "pending-row q-mt-md",
                    "aria-live": "polite"
                  }, [
                    _createVNode(_component_q_spinner_dots, {
                      color: "primary",
                      size: "2rem"
                    }),
                    _createElementVNode("span", null, "Waiting for verified payment…")
                  ])
                ]))
              : _createCommentVNode("v-if", true)
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
  ]))
}
}
