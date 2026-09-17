window.FORMS_INDEX_RENDER=function(){
const { createElementVNode: _createElementVNode, resolveComponent: _resolveComponent, createVNode: _createVNode, openBlock: _openBlock, createElementBlock: _createElementBlock, createCommentVNode: _createCommentVNode, toDisplayString: _toDisplayString, withCtx: _withCtx, createBlock: _createBlock, createTextVNode: _createTextVNode, renderList: _renderList, Fragment: _Fragment } = Vue

return function render(_ctx, _cache) {
  const _component_q_space = _resolveComponent("q-space")
  const _component_q_btn = _resolveComponent("q-btn")
  const _component_q_spinner = _resolveComponent("q-spinner")
  const _component_q_icon = _resolveComponent("q-icon")
  const _component_q_card = _resolveComponent("q-card")
  const _component_q_badge = _resolveComponent("q-badge")
  const _component_q_td = _resolveComponent("q-td")
  const _component_q_table = _resolveComponent("q-table")
  const _component_q_input = _resolveComponent("q-input")
  const _component_q_select = _resolveComponent("q-select")
  const _component_q_checkbox = _resolveComponent("q-checkbox")
  const _component_q_dialog = _resolveComponent("q-dialog")

  return (_openBlock(), _createElementBlock("div", {
    class: "q-pa-md",
    style: {"max-width":"960px","margin":"0 auto"}
  }, [
    _createElementVNode("div", { class: "row items-center q-mb-md" }, [
      _createElementVNode("div", { class: "text-h5" }, "Paid Workflows"),
      _createVNode(_component_q_space),
      _createVNode(_component_q_btn, {
        flat: "",
        round: "",
        dense: "",
        icon: _ctx.isDark?'light_mode':'dark_mode',
        "aria-label": "Toggle theme",
        onClick: _ctx.toggleTheme
      }, null, 8 /* PROPS */, ["icon", "onClick"]),
      _createVNode(_component_q_btn, {
        unelevated: "",
        "no-caps": "",
        color: "primary",
        icon: "add",
        label: "New flow",
        onClick: $event => (_ctx.openFlowDialog())
      }, null, 8 /* PROPS */, ["onClick"])
    ]),
    (_ctx.loading)
      ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: "text-center q-pa-xl"
        }, [
          _createVNode(_component_q_spinner, {
            color: "primary",
            size: "3rem"
          })
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
                onClick: $event => (_ctx.load())
              }, null, 8 /* PROPS */, ["onClick"])
            ]),
            _: 1 /* STABLE */
          }))
        : (!_ctx.flows.length)
          ? (_openBlock(), _createBlock(_component_q_card, {
              key: 2,
              class: "q-pa-xl text-center text-grey-7"
            }, {
              default: _withCtx(() => [
                _createTextVNode("No flows yet. Create a paid registration or signup form to get started.")
              ]),
              _: 1 /* STABLE */
            }))
          : (_openBlock(), _createBlock(_component_q_table, {
              key: 3,
              rows: _ctx.flows,
              columns: _ctx.columns,
              "row-key": "id",
              flat: "",
              bordered: "",
              pagination: {rowsPerPage:20}
            }, {
              "body-cell-status": _withCtx((props) => [
                _createVNode(_component_q_td, { props: props }, {
                  default: _withCtx(() => [
                    _createVNode(_component_q_badge, {
                      color: _ctx.statusColor(props.row.status)
                    }, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(props.row.status), 1 /* TEXT */)
                      ]),
                      _: 2 /* DYNAMIC */
                    }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["color"])
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["props"])
              ]),
              "body-cell-price": _withCtx((props) => [
                _createVNode(_component_q_td, { props: props }, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(_ctx.priceLabel(props.row)), 1 /* TEXT */)
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["props"])
              ]),
              "body-cell-actions": _withCtx((props) => [
                _createVNode(_component_q_td, { props: props }, {
                  default: _withCtx(() => [
                    _createVNode(_component_q_btn, {
                      flat: "",
                      dense: "",
                      "no-caps": "",
                      size: "sm",
                      icon: "link",
                      label: "Link",
                      onClick: $event => (_ctx.copyPublicLink(props.row))
                    }, null, 8 /* PROPS */, ["onClick"]),
                    _createVNode(_component_q_btn, {
                      flat: "",
                      dense: "",
                      "no-caps": "",
                      size: "sm",
                      icon: "open_in_new",
                      label: "View",
                      onClick: $event => (_ctx.openPublic(props.row))
                    }, null, 8 /* PROPS */, ["onClick"]),
                    (props.row.status!=='published')
                      ? (_openBlock(), _createBlock(_component_q_btn, {
                          key: 0,
                          flat: "",
                          dense: "",
                          "no-caps": "",
                          size: "sm",
                          color: "positive",
                          label: "Publish",
                          onClick: $event => (_ctx.setStatus(props.row,'published'))
                        }, null, 8 /* PROPS */, ["onClick"]))
                      : _createCommentVNode("v-if", true),
                    (props.row.status==='published')
                      ? (_openBlock(), _createBlock(_component_q_btn, {
                          key: 1,
                          flat: "",
                          dense: "",
                          "no-caps": "",
                          size: "sm",
                          color: "warning",
                          label: "Close",
                          onClick: $event => (_ctx.setStatus(props.row,'closed'))
                        }, null, 8 /* PROPS */, ["onClick"]))
                      : _createCommentVNode("v-if", true),
                    _createVNode(_component_q_btn, {
                      flat: "",
                      dense: "",
                      "no-caps": "",
                      size: "sm",
                      icon: "edit",
                      label: "Edit",
                      onClick: $event => (_ctx.openFlowDialog(props.row))
                    }, null, 8 /* PROPS */, ["onClick"]),
                    _createVNode(_component_q_btn, {
                      flat: "",
                      dense: "",
                      "no-caps": "",
                      size: "sm",
                      icon: "list",
                      label: "Submissions",
                      onClick: $event => (_ctx.openSubmissions(props.row))
                    }, null, 8 /* PROPS */, ["onClick"])
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["props"])
              ]),
              _: 1 /* STABLE */
            }, 8 /* PROPS */, ["rows", "columns"])),
    _createVNode(_component_q_dialog, {
      modelValue: _ctx.flowDialog.show,
      "onUpdate:modelValue": $event => ((_ctx.flowDialog.show) = $event)
    }, {
      default: _withCtx(() => [
        _createVNode(_component_q_card, {
          class: "q-pa-lg",
          style: {"min-width":"min(92vw,560px)"}
        }, {
          default: _withCtx(() => [
            _createElementVNode("div", { class: "text-h6 q-mb-md" }, _toDisplayString(_ctx.flowDialog.editing?'Edit flow':'New flow'), 1 /* TEXT */),
            _createElementVNode("div", { class: "q-gutter-md" }, [
              _createVNode(_component_q_input, {
                outlined: "",
                dense: "",
                modelValue: _ctx.flowDialog.data.title,
                "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.title) = $event),
                label: "Title",
                rules: [v=>Boolean(v&&v.trim())||'Required']
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "rules"]),
              _createVNode(_component_q_input, {
                outlined: "",
                dense: "",
                type: "textarea",
                autogrow: "",
                modelValue: _ctx.flowDialog.data.description,
                "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.description) = $event),
                label: "Description"
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
              _createVNode(_component_q_select, {
                outlined: "",
                dense: "",
                modelValue: _ctx.flowDialog.data.walletId,
                "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.walletId) = $event),
                options: _ctx.walletOptions,
                "emit-value": "",
                "map-options": "",
                label: "Payout wallet",
                disable: _ctx.flowDialog.editing
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options", "disable"]),
              _createVNode(_component_q_input, {
                outlined: "",
                dense: "",
                type: "number",
                min: "0",
                modelValue: _ctx.flowDialog.data.amountSat,
                "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.amountSat) = $event),
                modelModifiers: { number: true },
                label: "Price (sats, 0 = free)"
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
              _createVNode(_component_q_input, {
                outlined: "",
                dense: "",
                type: "number",
                min: "0",
                modelValue: _ctx.flowDialog.data.capacity,
                "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.capacity) = $event),
                modelModifiers: { number: true },
                label: "Capacity (0 = unlimited)"
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
              _createVNode(_component_q_select, {
                outlined: "",
                dense: "",
                modelValue: _ctx.flowDialog.data.theme,
                "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.theme) = $event),
                options: _ctx.themeOptions,
                label: "Theme"
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"]),
              _createElementVNode("div", null, [
                _createElementVNode("div", { class: "row items-center q-mb-xs" }, [
                  _createElementVNode("div", { class: "text-subtitle2" }, "Fields"),
                  _createVNode(_component_q_space),
                  _createVNode(_component_q_btn, {
                    flat: "",
                    dense: "",
                    "no-caps": "",
                    size: "sm",
                    icon: "add",
                    label: "Add field",
                    onClick: _ctx.addField
                  }, null, 8 /* PROPS */, ["onClick"])
                ]),
                (!_ctx.flowDialog.data.fields.length)
                  ? (_openBlock(), _createElementBlock("div", {
                      key: 0,
                      class: "text-grey-7 q-mb-sm"
                    }, "No fields — the form will only collect a payment."))
                  : _createCommentVNode("v-if", true),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.flowDialog.data.fields, (field, i) => {
                  return (_openBlock(), _createElementBlock("div", {
                    key: i,
                    class: "field-row q-mb-sm q-pa-sm rounded-borders"
                  }, [
                    _createElementVNode("div", { class: "row q-col-gutter-sm items-center" }, [
                      _createVNode(_component_q_select, {
                        class: "col-12 col-sm-4",
                        outlined: "",
                        dense: "",
                        "emit-value": "",
                        "map-options": "",
                        modelValue: field.type,
                        "onUpdate:modelValue": [$event => ((field.type) = $event), $event => (field.type==='consent'&&(field.required=true))],
                        options: _ctx.fieldTypeOptions,
                        label: "Type"
                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"]),
                      _createVNode(_component_q_input, {
                        class: "col-12 col-sm-5",
                        outlined: "",
                        dense: "",
                        modelValue: field.label,
                        "onUpdate:modelValue": $event => ((field.label) = $event),
                        label: "Label"
                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                      _createElementVNode("div", { class: "col-12 col-sm-3 row items-center justify-end" }, [
                        _createVNode(_component_q_checkbox, {
                          dense: "",
                          modelValue: field.required,
                          "onUpdate:modelValue": $event => ((field.required) = $event),
                          label: "Required",
                          disable: field.type==='consent'
                        }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "disable"]),
                        _createVNode(_component_q_btn, {
                          flat: "",
                          round: "",
                          dense: "",
                          size: "sm",
                          icon: "arrow_upward",
                          "aria-label": "Move up",
                          disable: i===0,
                          onClick: $event => (_ctx.moveField(i,-1))
                        }, null, 8 /* PROPS */, ["disable", "onClick"]),
                        _createVNode(_component_q_btn, {
                          flat: "",
                          round: "",
                          dense: "",
                          size: "sm",
                          icon: "arrow_downward",
                          "aria-label": "Move down",
                          disable: i===_ctx.flowDialog.data.fields.length-1,
                          onClick: $event => (_ctx.moveField(i,1))
                        }, null, 8 /* PROPS */, ["disable", "onClick"]),
                        _createVNode(_component_q_btn, {
                          flat: "",
                          round: "",
                          dense: "",
                          size: "sm",
                          icon: "delete",
                          color: "negative",
                          "aria-label": "Delete field",
                          onClick: $event => (_ctx.removeField(i))
                        }, null, 8 /* PROPS */, ["onClick"])
                      ]),
                      _createVNode(_component_q_input, {
                        class: "col-12 col-sm-6",
                        outlined: "",
                        dense: "",
                        modelValue: field.id,
                        "onUpdate:modelValue": $event => ((field.id) = $event),
                        label: "Field ID",
                        hint: "Auto from label if empty"
                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                      _createVNode(_component_q_input, {
                        class: "col-12 col-sm-6",
                        outlined: "",
                        dense: "",
                        modelValue: field.help,
                        "onUpdate:modelValue": $event => ((field.help) = $event),
                        label: "Help text (optional)"
                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                      (['select','radio'].includes(field.type))
                        ? (_openBlock(), _createBlock(_component_q_input, {
                            key: 0,
                            class: "col-12",
                            outlined: "",
                            dense: "",
                            modelValue: field.optionsText,
                            "onUpdate:modelValue": $event => ((field.optionsText) = $event),
                            label: "Options (comma-separated)"
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]))
                        : _createCommentVNode("v-if", true),
                      (field.type==='nostr_pubkey')
                        ? (_openBlock(), _createElementBlock("div", {
                            key: 1,
                            class: "col-12 text-caption text-grey-7"
                          }, "One-click Nostr sign-in only works in the embed widget — on the hosted page attendees paste their npub manually."))
                        : _createCommentVNode("v-if", true)
                    ])
                  ]))
                }), 128 /* KEYED_FRAGMENT */))
              ]),
              _createVNode(_component_q_input, {
                outlined: "",
                dense: "",
                type: "textarea",
                rows: "3",
                modelValue: _ctx.flowDialog.data.customCss,
                "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.customCss) = $event),
                label: "Custom CSS (optional)"
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
              (_ctx.formError)
                ? (_openBlock(), _createElementBlock("div", {
                    key: 0,
                    class: "text-negative",
                    role: "alert"
                  }, _toDisplayString(_ctx.formError), 1 /* TEXT */))
                : _createCommentVNode("v-if", true),
              _createElementVNode("div", { class: "row justify-end q-gutter-sm" }, [
                _createVNode(_component_q_btn, {
                  flat: "",
                  "no-caps": "",
                  label: "Cancel",
                  onClick: $event => (_ctx.flowDialog.show=false)
                }, null, 8 /* PROPS */, ["onClick"]),
                _createVNode(_component_q_btn, {
                  unelevated: "",
                  "no-caps": "",
                  color: "primary",
                  label: "Save",
                  loading: _ctx.saving,
                  onClick: _ctx.saveFlow
                }, null, 8 /* PROPS */, ["loading", "onClick"])
              ])
            ])
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
    _createVNode(_component_q_dialog, {
      modelValue: _ctx.subsDialog.show,
      "onUpdate:modelValue": $event => ((_ctx.subsDialog.show) = $event)
    }, {
      default: _withCtx(() => [
        _createVNode(_component_q_card, {
          class: "q-pa-lg",
          style: {"min-width":"min(92vw,720px)"}
        }, {
          default: _withCtx(() => [
            _createElementVNode("div", { class: "text-h6 q-mb-md" }, "Submissions — " + _toDisplayString(_ctx.subsDialog.flow&&_ctx.subsDialog.flow.title), 1 /* TEXT */),
            _createVNode(_component_q_table, {
              rows: _ctx.subsDialog.rows,
              columns: _ctx.subColumns,
              "row-key": "id",
              flat: "",
              dense: "",
              pagination: {rowsPerPage:10}
            }, {
              "body-cell-status": _withCtx((props) => [
                _createVNode(_component_q_td, { props: props }, {
                  default: _withCtx(() => [
                    _createVNode(_component_q_badge, {
                      color: _ctx.statusColor(props.row.status)
                    }, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(props.row.status), 1 /* TEXT */)
                      ]),
                      _: 2 /* DYNAMIC */
                    }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["color"])
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["props"])
              ]),
              "body-cell-actions": _withCtx((props) => [
                _createVNode(_component_q_td, { props: props }, {
                  default: _withCtx(() => [
                    (['paid','confirmed'].includes(props.row.status))
                      ? (_openBlock(), _createBlock(_component_q_btn, {
                          key: 0,
                          flat: "",
                          dense: "",
                          "no-caps": "",
                          size: "sm",
                          label: "Approve",
                          onClick: $event => (_ctx.moderate(props.row,'approved'))
                        }, null, 8 /* PROPS */, ["onClick"]))
                      : _createCommentVNode("v-if", true),
                    (['paid','confirmed'].includes(props.row.status))
                      ? (_openBlock(), _createBlock(_component_q_btn, {
                          key: 1,
                          flat: "",
                          dense: "",
                          "no-caps": "",
                          size: "sm",
                          color: "negative",
                          label: "Reject",
                          onClick: $event => (_ctx.moderate(props.row,'rejected'))
                        }, null, 8 /* PROPS */, ["onClick"]))
                      : _createCommentVNode("v-if", true)
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["props"])
              ]),
              _: 1 /* STABLE */
            }, 8 /* PROPS */, ["rows", "columns"]),
            _createElementVNode("div", { class: "row justify-end q-mt-md" }, [
              _createVNode(_component_q_btn, {
                flat: "",
                "no-caps": "",
                label: "Export CSV",
                onClick: _ctx.exportCsv
              }, null, 8 /* PROPS */, ["onClick"]),
              _createVNode(_component_q_btn, {
                flat: "",
                "no-caps": "",
                label: "Close",
                onClick: $event => (_ctx.subsDialog.show=false)
              }, null, 8 /* PROPS */, ["onClick"])
            ])
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
  ]))
}
}
