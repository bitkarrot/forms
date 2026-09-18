window.FORMS_PUBLIC_RENDER=function(){
const { resolveComponent: _resolveComponent, createVNode: _createVNode, createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock, createCommentVNode: _createCommentVNode, toDisplayString: _toDisplayString, withCtx: _withCtx, createBlock: _createBlock, normalizeStyle: _normalizeStyle, Fragment: _Fragment, renderList: _renderList, createTextVNode: _createTextVNode, normalizeClass: _normalizeClass } = Vue

return function render(_ctx, _cache) {
  const _component_q_spinner = _resolveComponent("q-spinner")
  const _component_q_icon = _resolveComponent("q-icon")
  const _component_q_btn = _resolveComponent("q-btn")
  const _component_q_card = _resolveComponent("q-card")
  const _component_q_input = _resolveComponent("q-input")
  const _component_q_select = _resolveComponent("q-select")
  const _component_q_checkbox = _resolveComponent("q-checkbox")
  const _component_q_linear_progress = _resolveComponent("q-linear-progress")
  const _component_qrcode_vue = _resolveComponent("qrcode-vue")
  const _component_q_spinner_dots = _resolveComponent("q-spinner-dots")
  const _component_q_dialog = _resolveComponent("q-dialog")

  return (_openBlock(), _createElementBlock("div", {
    class: "public-page",
    style: _normalizeStyle(_ctx.pageStyle)
  }, [
    _createElementVNode("div", { class: "pf-form" }, [
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
              class: "pf-card text-center"
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
            ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
                (_ctx.settings.endImage)
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 0,
                      class: "pf-banner",
                      style: _normalizeStyle(_ctx.endBannerStyle)
                    }, null, 4 /* STYLE */))
                  : _createCommentVNode("v-if", true),
                _createVNode(_component_q_card, { class: "pf-card text-center" }, {
                  default: _withCtx(() => [
                    _createVNode(_component_q_icon, {
                      name: "check_circle",
                      color: "positive",
                      size: "3rem"
                    }),
                    _createElementVNode("div", { class: "text-h5 q-mt-md" }, _toDisplayString(_ctx.settings.confirmText || 'Thanks — your submission has been received.'), 1 /* TEXT */),
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
                })
              ], 64 /* STABLE_FRAGMENT */))
            : (_ctx.flow)
              ? (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
                  _createElementVNode("div", { class: "pf-headerblock" }, [
                    (_ctx.settings.headerImage)
                      ? (_openBlock(), _createElementBlock("div", {
                          key: 0,
                          class: "pf-banner",
                          style: _normalizeStyle(_ctx.bannerStyle)
                        }, null, 4 /* STYLE */))
                      : _createCommentVNode("v-if", true),
                    (!_ctx.isStepper || _ctx.step===-1)
                      ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                          _createElementVNode("h1", { class: "pf-title" }, _toDisplayString(_ctx.flow.title), 1 /* TEXT */),
                          (_ctx.flow.description)
                            ? (_openBlock(), _createElementBlock("p", {
                                key: 0,
                                class: "pf-desc"
                              }, _toDisplayString(_ctx.flow.description), 1 /* TEXT */))
                            : _createCommentVNode("v-if", true),
                          (_ctx.flow.remaining!==null && _ctx.flow.remaining!==undefined)
                            ? (_openBlock(), _createElementBlock("div", {
                                key: 1,
                                class: "pf-remaining"
                              }, _toDisplayString(_ctx.flow.remaining) + " spot(s) remaining", 1 /* TEXT */))
                            : _createCommentVNode("v-if", true)
                        ], 64 /* STABLE_FRAGMENT */))
                      : _createCommentVNode("v-if", true)
                  ]),
                  (_ctx.isStepper && _ctx.step===-1)
                    ? (_openBlock(), _createElementBlock("div", {
                        key: 0,
                        class: "tf-stage text-center"
                      }, [
                        _createVNode(_component_q_btn, {
                          unelevated: "",
                          "no-caps": "",
                          color: "primary",
                          size: "lg",
                          onClick: $event => (_ctx.step=0)
                        }, {
                          default: _withCtx(() => [
                            _createElementVNode("span", null, "Start"),
                            _createVNode(_component_q_icon, {
                              name: "arrow_forward",
                              class: "q-ml-sm"
                            })
                          ]),
                          _: 1 /* STABLE */
                        }, 8 /* PROPS */, ["onClick"]),
                        (_ctx.pricing.mode==='fixed' && _ctx.pricing.amountSat>0)
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 0,
                              class: "pf-hint q-mt-md"
                            }, _toDisplayString(_ctx.formatSats(_ctx.pricing.amountSat)) + " sats to complete", 1 /* TEXT */))
                          : _createCommentVNode("v-if", true)
                      ]))
                    : (_openBlock(), _createElementBlock("div", {
                        key: 1,
                        class: _normalizeClass({'tf-stage': _ctx.isStepper})
                      }, [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.formFields, (field, i) => {
                          return (_openBlock(), _createElementBlock(_Fragment, null, [
                            (!_ctx.isStepper || i===_ctx.step)
                              ? (_openBlock(), _createElementBlock("div", {
                                  key: field.id,
                                  class: _normalizeClass(["pf-card", {'tf-flat': _ctx.isStepper}])
                                }, [
                                  (_ctx.isStepper)
                                    ? (_openBlock(), _createElementBlock("div", {
                                        key: 0,
                                        class: "tf-q"
                                      }, [
                                        _createElementVNode("div", { class: "tf-qnum" }, [
                                          _createTextVNode(_toDisplayString(i+1) + " ", 1 /* TEXT */),
                                          _createVNode(_component_q_icon, {
                                            name: "arrow_forward",
                                            size: "0.9em"
                                          })
                                        ]),
                                        _createElementVNode("div", { class: "tf-qlabel" }, [
                                          _createTextVNode(_toDisplayString(field.label), 1 /* TEXT */),
                                          (!field.required && !_ctx.isOptionalLabel(field))
                                            ? (_openBlock(), _createElementBlock("span", {
                                                key: 0,
                                                class: "tf-opt"
                                              }, "(optional)"))
                                            : _createCommentVNode("v-if", true)
                                        ]),
                                        (field.help)
                                          ? (_openBlock(), _createElementBlock("div", {
                                              key: 0,
                                              class: "tf-qhelp"
                                            }, _toDisplayString(field.help), 1 /* TEXT */))
                                          : _createCommentVNode("v-if", true),
                                        (['text','email','phone','number','date','nostr_pubkey'].includes(field.type))
                                          ? (_openBlock(), _createBlock(_component_q_input, {
                                              key: 1,
                                              outlined: "",
                                              type: field.type==='number'?'number':(field.type==='date'?'date':'text'),
                                              modelValue: _ctx.answers[field.id],
                                              "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                              placeholder: "Type your answer here…"
                                            }, null, 8 /* PROPS */, ["type", "modelValue", "onUpdate:modelValue"]))
                                          : (field.type==='textarea')
                                            ? (_openBlock(), _createBlock(_component_q_input, {
                                                key: 2,
                                                outlined: "",
                                                type: "textarea",
                                                rows: "4",
                                                modelValue: _ctx.answers[field.id],
                                                "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                                placeholder: "Type your answer here…"
                                              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]))
                                            : (field.type==='select')
                                              ? (_openBlock(), _createBlock(_component_q_select, {
                                                  key: 3,
                                                  outlined: "",
                                                  options: field.options||[],
                                                  modelValue: _ctx.answers[field.id],
                                                  "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                                  placeholder: "Choose an option"
                                                }, null, 8 /* PROPS */, ["options", "modelValue", "onUpdate:modelValue"]))
                                              : (field.type==='radio')
                                                ? (_openBlock(), _createElementBlock("div", {
                                                    key: 4,
                                                    class: "tf-options"
                                                  }, [
                                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(field.options||[], (opt, oi) => {
                                                      return (_openBlock(), _createElementBlock("div", {
                                                        key: oi,
                                                        class: _normalizeClass(["tf-option", {'tf-selected': _ctx.answers[field.id]===opt}]),
                                                        onClick: $event => (_ctx.chooseOption(field, opt))
                                                      }, [
                                                        _createElementVNode("span", { class: "tf-key" }, _toDisplayString(_ctx.optionKey(oi)), 1 /* TEXT */),
                                                        _createElementVNode("span", { class: "tf-optext" }, _toDisplayString(opt), 1 /* TEXT */),
                                                        (_ctx.answers[field.id]===opt)
                                                          ? (_openBlock(), _createBlock(_component_q_icon, {
                                                              key: 0,
                                                              name: "check",
                                                              class: "tf-check"
                                                            }))
                                                          : _createCommentVNode("v-if", true)
                                                      ], 10 /* CLASS, PROPS */, ["onClick"]))
                                                    }), 128 /* KEYED_FRAGMENT */))
                                                  ]))
                                                : (['checkbox','consent'].includes(field.type))
                                                  ? (_openBlock(), _createBlock(_component_q_checkbox, {
                                                      key: 5,
                                                      modelValue: _ctx.answers[field.id],
                                                      "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                                      label: field.type==='consent'?'I accept':'Yes'
                                                    }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "label"]))
                                                  : _createCommentVNode("v-if", true)
                                      ]))
                                    : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                        _createElementVNode("div", { class: "pf-qlabel" }, [
                                          _createTextVNode(_toDisplayString(field.label), 1 /* TEXT */),
                                          (field.required)
                                            ? (_openBlock(), _createElementBlock("span", {
                                                key: 0,
                                                class: "pf-req"
                                              }, "*"))
                                            : (!_ctx.isOptionalLabel(field))
                                              ? (_openBlock(), _createElementBlock("span", {
                                                  key: 1,
                                                  class: "tf-opt"
                                                }, "(optional)"))
                                              : _createCommentVNode("v-if", true)
                                        ]),
                                        (field.help)
                                          ? (_openBlock(), _createElementBlock("div", {
                                              key: 0,
                                              class: "pf-qhelp"
                                            }, _toDisplayString(field.help), 1 /* TEXT */))
                                          : _createCommentVNode("v-if", true),
                                        (['text','email','phone','number','date','nostr_pubkey'].includes(field.type))
                                          ? (_openBlock(), _createBlock(_component_q_input, {
                                              key: 1,
                                              outlined: "",
                                              type: field.type==='number'?'number':(field.type==='date'?'date':'text'),
                                              modelValue: _ctx.answers[field.id],
                                              "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                              placeholder: "Type your answer here…"
                                            }, null, 8 /* PROPS */, ["type", "modelValue", "onUpdate:modelValue"]))
                                          : (field.type==='textarea')
                                            ? (_openBlock(), _createBlock(_component_q_input, {
                                                key: 2,
                                                outlined: "",
                                                type: "textarea",
                                                rows: "3",
                                                modelValue: _ctx.answers[field.id],
                                                "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                                placeholder: "Type your answer here…"
                                              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]))
                                            : (field.type==='select')
                                              ? (_openBlock(), _createBlock(_component_q_select, {
                                                  key: 3,
                                                  outlined: "",
                                                  options: field.options||[],
                                                  modelValue: _ctx.answers[field.id],
                                                  "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                                  placeholder: "Choose an option"
                                                }, null, 8 /* PROPS */, ["options", "modelValue", "onUpdate:modelValue"]))
                                              : (field.type==='radio')
                                                ? (_openBlock(), _createElementBlock("div", {
                                                    key: 4,
                                                    class: "tf-options"
                                                  }, [
                                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(field.options||[], (opt, oi) => {
                                                      return (_openBlock(), _createElementBlock("div", {
                                                        key: oi,
                                                        class: _normalizeClass(["tf-option", {'tf-selected': _ctx.answers[field.id]===opt}]),
                                                        onClick: $event => (_ctx.answers[field.id]=opt)
                                                      }, [
                                                        _createElementVNode("span", { class: "tf-key" }, _toDisplayString(_ctx.optionKey(oi)), 1 /* TEXT */),
                                                        _createElementVNode("span", { class: "tf-optext" }, _toDisplayString(opt), 1 /* TEXT */),
                                                        (_ctx.answers[field.id]===opt)
                                                          ? (_openBlock(), _createBlock(_component_q_icon, {
                                                              key: 0,
                                                              name: "check",
                                                              class: "tf-check"
                                                            }))
                                                          : _createCommentVNode("v-if", true)
                                                      ], 10 /* CLASS, PROPS */, ["onClick"]))
                                                    }), 128 /* KEYED_FRAGMENT */))
                                                  ]))
                                                : (['checkbox','consent'].includes(field.type))
                                                  ? (_openBlock(), _createBlock(_component_q_checkbox, {
                                                      key: 5,
                                                      modelValue: _ctx.answers[field.id],
                                                      "onUpdate:modelValue": $event => ((_ctx.answers[field.id]) = $event),
                                                      label: field.type==='consent'?'I accept':'Yes'
                                                    }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "label"]))
                                                  : _createCommentVNode("v-if", true)
                                      ], 64 /* STABLE_FRAGMENT */))
                                ], 2 /* CLASS */))
                              : _createCommentVNode("v-if", true)
                          ], 64 /* STABLE_FRAGMENT */))
                        }), 256 /* UNKEYED_FRAGMENT */)),
                        (_ctx.submitError)
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 0,
                              class: "text-negative q-mt-md",
                              role: "alert"
                            }, _toDisplayString(_ctx.submitError), 1 /* TEXT */))
                          : _createCommentVNode("v-if", true),
                        (_ctx.isStepper)
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 1,
                              class: "text-center"
                            }, [
                              _createVNode(_component_q_btn, {
                                unelevated: "",
                                "no-caps": "",
                                color: "primary",
                                loading: _ctx.submitting,
                                onClick: _ctx.onOk
                              }, {
                                default: _withCtx(() => [
                                  _createElementVNode("span", null, _toDisplayString(_ctx.isLastStep ? _ctx.submitLabel : 'OK'), 1 /* TEXT */),
                                  (!_ctx.isLastStep)
                                    ? (_openBlock(), _createBlock(_component_q_icon, {
                                        key: 0,
                                        name: "check",
                                        class: "q-ml-xs"
                                      }))
                                    : _createCommentVNode("v-if", true)
                                ]),
                                _: 1 /* STABLE */
                              }, 8 /* PROPS */, ["loading", "onClick"]),
                              _createElementVNode("div", { class: "tf-hint" }, [
                                _createTextVNode("press "),
                                _createElementVNode("b", null, "Enter ↵"),
                                _createTextVNode(" or use the "),
                                _createElementVNode("b", null, "↓ ↑"),
                                _createTextVNode(" arrows")
                              ])
                            ]))
                          : _createCommentVNode("v-if", true),
                        (_ctx.isStepper)
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 2,
                              class: "tf-nav",
                              role: "group",
                              "aria-label": "Question navigation"
                            }, [
                              _createVNode(_component_q_btn, {
                                unelevated: "",
                                dense: "",
                                square: "",
                                icon: "keyboard_arrow_up",
                                disable: _ctx.step<=0,
                                "aria-label": "Previous question",
                                onClick: _ctx.prevStep
                              }, null, 8 /* PROPS */, ["disable", "onClick"]),
                              _createVNode(_component_q_btn, {
                                unelevated: "",
                                dense: "",
                                square: "",
                                icon: "keyboard_arrow_down",
                                "aria-label": "Next question",
                                onClick: _ctx.onOk
                              }, null, 8 /* PROPS */, ["onClick"])
                            ]))
                          : _createCommentVNode("v-if", true),
                        (_ctx.isStepper)
                          ? (_openBlock(), _createBlock(_component_q_linear_progress, {
                              key: 3,
                              value: _ctx.stepProgress,
                              class: "tf-progress",
                              "aria-label": "Form progress"
                            }, null, 8 /* PROPS */, ["value"]))
                          : (_openBlock(), _createBlock(_component_q_btn, {
                              key: 4,
                              unelevated: "",
                              "no-caps": "",
                              color: "primary",
                              size: "lg",
                              class: "full-width q-mt-sm",
                              loading: _ctx.submitting,
                              label: _ctx.submitLabel,
                              onClick: _ctx.submit
                            }, null, 8 /* PROPS */, ["loading", "label", "onClick"])),
                        (_ctx.hasNostrField && (!_ctx.isStepper || _ctx.formFields[_ctx.step]?.type==='nostr_pubkey'))
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 5,
                              class: "pf-hint text-center q-mt-md"
                            }, "Nostr sign-in is not available on this page. Paste your npub manually, or use the embedded form on the organizer's website for one-click login."))
                          : _createCommentVNode("v-if", true)
                      ], 2 /* CLASS */))
                ], 64 /* STABLE_FRAGMENT */))
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
                  (_ctx.expiresInText)
                    ? (_openBlock(), _createElementBlock("div", {
                        key: 0,
                        class: "text-center text-caption text-grey-7"
                      }, "Expires in " + _toDisplayString(_ctx.expiresInText), 1 /* TEXT */))
                    : _createCommentVNode("v-if", true),
                  _createElementVNode("div", { class: "qr-box q-my-md" }, [
                    _createVNode(_component_qrcode_vue, {
                      value: 'LIGHTNING:'+_ctx.invoice.paymentRequest.toUpperCase(),
                      size: 240
                    }, null, 8 /* PROPS */, ["value"])
                  ]),
                  _createElementVNode("div", { class: "row justify-center q-mb-md" }, [
                    _createVNode(_component_q_btn, {
                      unelevated: "",
                      "no-caps": "",
                      color: "primary",
                      icon: "bolt",
                      label: "Open in wallet",
                      href: 'lightning:'+_ctx.invoice.paymentRequest
                    }, null, 8 /* PROPS */, ["href"])
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
  ], 4 /* STYLE */))
}
}
