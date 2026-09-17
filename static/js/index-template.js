window.FORMS_INDEX_RENDER=function(){
const { createElementVNode: _createElementVNode, resolveComponent: _resolveComponent, createVNode: _createVNode, openBlock: _openBlock, createElementBlock: _createElementBlock, createCommentVNode: _createCommentVNode, toDisplayString: _toDisplayString, withCtx: _withCtx, createBlock: _createBlock, createTextVNode: _createTextVNode, renderList: _renderList, Fragment: _Fragment, resolveDirective: _resolveDirective, withDirectives: _withDirectives, withModifiers: _withModifiers, normalizeClass: _normalizeClass, normalizeProps: _normalizeProps, guardReactiveProps: _guardReactiveProps } = Vue

return function render(_ctx, _cache) {
  const _component_q_space = _resolveComponent("q-space")
  const _component_q_btn = _resolveComponent("q-btn")
  const _component_q_spinner = _resolveComponent("q-spinner")
  const _component_q_icon = _resolveComponent("q-icon")
  const _component_q_card = _resolveComponent("q-card")
  const _component_q_badge = _resolveComponent("q-badge")
  const _component_q_td = _resolveComponent("q-td")
  const _component_q_table = _resolveComponent("q-table")
  const _component_q_btn_toggle = _resolveComponent("q-btn-toggle")
  const _component_q_separator = _resolveComponent("q-separator")
  const _component_q_select = _resolveComponent("q-select")
  const _component_q_input = _resolveComponent("q-input")
  const _component_q_checkbox = _resolveComponent("q-checkbox")
  const _component_q_item_section = _resolveComponent("q-item-section")
  const _component_q_item = _resolveComponent("q-item")
  const _component_q_list = _resolveComponent("q-list")
  const _component_q_menu = _resolveComponent("q-menu")
  const _component_q_toggle = _resolveComponent("q-toggle")
  const _component_q_linear_progress = _resolveComponent("q-linear-progress")
  const _component_q_option_group = _resolveComponent("q-option-group")
  const _component_q_dialog = _resolveComponent("q-dialog")
  const _directive_close_popup = _resolveDirective("close-popup")

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
                      icon: "code",
                      label: "Share",
                      onClick: $event => (_ctx.openShare(props.row))
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
        _createVNode(_component_q_card, { class: "fp-dialog" }, {
          default: _withCtx(() => [
            _createElementVNode("div", { class: "fp-header row items-center q-pa-md" }, [
              _createVNode(_component_q_icon, {
                name: "dynamic_form",
                size: "sm",
                color: "primary",
                class: "q-mr-sm"
              }),
              _createElementVNode("div", { class: "text-h6" }, _toDisplayString(_ctx.flowDialog.editing?'Edit flow':'New flow'), 1 /* TEXT */),
              _createVNode(_component_q_space),
              _createVNode(_component_q_btn_toggle, {
                modelValue: _ctx.flowDialog.view,
                "onUpdate:modelValue": [$event => ((_ctx.flowDialog.view) = $event), _ctx.setView],
                "no-caps": "",
                unelevated: "",
                rounded: "",
                class: "fp-view-toggle",
                "toggle-color": "primary",
                options: [{value:'edit',label:'Edit',icon:'edit'},{value:'preview',label:'Preview',icon:'visibility'}]
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
            ]),
            _createVNode(_component_q_separator),
            _createElementVNode("div", { class: "q-pa-lg" }, [
              (_ctx.flowDialog.view==='edit')
                ? (_openBlock(), _createElementBlock("div", {
                    key: 0,
                    class: "q-gutter-md"
                  }, [
                    (!_ctx.flowDialog.editing)
                      ? (_openBlock(), _createBlock(_component_q_select, {
                          key: 0,
                          outlined: "",
                          dense: "",
                          "emit-value": "",
                          "map-options": "",
                          modelValue: _ctx.flowDialog.template,
                          "onUpdate:modelValue": [$event => ((_ctx.flowDialog.template) = $event), _ctx.applyTemplate],
                          options: _ctx.flowTemplates.map(t=>({value:t.value,label:t.label})),
                          label: "Start from template"
                        }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"]))
                      : _createCommentVNode("v-if", true),
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
                    _createVNode(_component_q_checkbox, {
                      dense: "",
                      modelValue: _ctx.flowDialog.data.requireApproval,
                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.requireApproval) = $event),
                      label: "Require manual approval after payment"
                    }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                    _createElementVNode("div", { class: "row q-col-gutter-sm" }, [
                      _createVNode(_component_q_select, {
                        class: "col-12 col-sm-4",
                        outlined: "",
                        dense: "",
                        "emit-value": "",
                        "map-options": "",
                        modelValue: _ctx.flowDialog.data.themePreset,
                        "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.themePreset) = $event),
                        options: _ctx.themePresetOptions,
                        label: "Theme preset"
                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"]),
                      _createVNode(_component_q_select, {
                        class: "col-6 col-sm-4",
                        outlined: "",
                        dense: "",
                        "emit-value": "",
                        "map-options": "",
                        modelValue: _ctx.flowDialog.data.themeMode,
                        "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.themeMode) = $event),
                        options: _ctx.themeModeOptions,
                        label: "Mode"
                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"]),
                      _createVNode(_component_q_select, {
                        class: "col-6 col-sm-4",
                        outlined: "",
                        dense: "",
                        "emit-value": "",
                        "map-options": "",
                        modelValue: _ctx.flowDialog.data.renderer,
                        "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.renderer) = $event),
                        options: _ctx.rendererOptions,
                        label: "Layout"
                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"])
                    ]),
                    _createElementVNode("div", null, [
                      _createElementVNode("div", { class: "row items-center q-mb-xs" }, [
                        _createElementVNode("div", { class: "text-subtitle2" }, "Questions"),
                        _createVNode(_component_q_space),
                        _createVNode(_component_q_btn, {
                          unelevated: "",
                          dense: "",
                          "no-caps": "",
                          size: "sm",
                          color: "primary",
                          icon: "add",
                          label: "Add question"
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_q_menu, {
                              anchor: "bottom right",
                              self: "top right"
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_q_list, {
                                  dense: "",
                                  style: {"min-width":"190px"}
                                }, {
                                  default: _withCtx(() => [
                                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.fieldTypeOptions, (t) => {
                                      return _withDirectives((_openBlock(), _createBlock(_component_q_item, {
                                        key: t.value,
                                        clickable: "",
                                        onClick: $event => (_ctx.addField(t.value))
                                      }, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_q_item_section, { avatar: "" }, {
                                            default: _withCtx(() => [
                                              _createVNode(_component_q_icon, {
                                                name: t.icon,
                                                size: "sm"
                                              }, null, 8 /* PROPS */, ["name"])
                                            ]),
                                            _: 2 /* DYNAMIC */
                                          }, 1024 /* DYNAMIC_SLOTS */),
                                          _createVNode(_component_q_item_section, null, {
                                            default: _withCtx(() => [
                                              _createTextVNode(_toDisplayString(t.label), 1 /* TEXT */)
                                            ]),
                                            _: 2 /* DYNAMIC */
                                          }, 1024 /* DYNAMIC_SLOTS */)
                                        ]),
                                        _: 2 /* DYNAMIC */
                                      }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"])), [
                                        [_directive_close_popup]
                                      ])
                                    }), 128 /* KEYED_FRAGMENT */))
                                  ]),
                                  _: 1 /* STABLE */
                                })
                              ]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      (!_ctx.flowDialog.data.fields.length)
                        ? (_openBlock(), _createElementBlock("div", {
                            key: 0,
                            class: "text-grey-7 q-mb-sm"
                          }, "No questions — the form will only collect a payment."))
                        : (_openBlock(), _createElementBlock("div", {
                            key: 1,
                            class: "row q-col-gutter-md"
                          }, [
                            _createElementVNode("div", { class: "col-12 col-sm-5 tf-qlist" }, [
                              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.flowDialog.data.fields, (field, i) => {
                                return (_openBlock(), _createElementBlock("div", {
                                  key: i,
                                  class: _normalizeClass(["tf-qcard", {'tf-active': i===_ctx.flowDialog.sel}]),
                                  onClick: $event => (_ctx.selectField(i))
                                }, [
                                  _createElementVNode("span", { class: "tf-qnum" }, _toDisplayString(i+1), 1 /* TEXT */),
                                  _createVNode(_component_q_icon, {
                                    name: _ctx.fieldIcon(field.type),
                                    size: "xs",
                                    class: "tf-qicon"
                                  }, null, 8 /* PROPS */, ["name"]),
                                  _createElementVNode("span", { class: "tf-qcard-label ellipsis" }, _toDisplayString(field.label||'Untitled question'), 1 /* TEXT */),
                                  _createVNode(_component_q_btn, {
                                    flat: "",
                                    round: "",
                                    dense: "",
                                    size: "sm",
                                    icon: "more_vert",
                                    "aria-label": "Question actions",
                                    onClick: _withModifiers(() => {}, ["stop"])
                                  }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_q_menu, null, {
                                        default: _withCtx(() => [
                                          _createVNode(_component_q_list, { dense: "" }, {
                                            default: _withCtx(() => [
                                              _withDirectives((_openBlock(), _createBlock(_component_q_item, {
                                                clickable: "",
                                                disable: i===0,
                                                onClick: $event => (_ctx.moveField(i,-1))
                                              }, {
                                                default: _withCtx(() => [
                                                  _createVNode(_component_q_item_section, null, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode("Move up")
                                                    ]),
                                                    _: 1 /* STABLE */
                                                  })
                                                ]),
                                                _: 1 /* STABLE */
                                              }, 8 /* PROPS */, ["disable", "onClick"])), [
                                                [_directive_close_popup]
                                              ]),
                                              _withDirectives((_openBlock(), _createBlock(_component_q_item, {
                                                clickable: "",
                                                disable: i===_ctx.flowDialog.data.fields.length-1,
                                                onClick: $event => (_ctx.moveField(i,1))
                                              }, {
                                                default: _withCtx(() => [
                                                  _createVNode(_component_q_item_section, null, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode("Move down")
                                                    ]),
                                                    _: 1 /* STABLE */
                                                  })
                                                ]),
                                                _: 1 /* STABLE */
                                              }, 8 /* PROPS */, ["disable", "onClick"])), [
                                                [_directive_close_popup]
                                              ]),
                                              _withDirectives((_openBlock(), _createBlock(_component_q_item, {
                                                clickable: "",
                                                onClick: $event => (_ctx.duplicateField(i))
                                              }, {
                                                default: _withCtx(() => [
                                                  _createVNode(_component_q_item_section, null, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode("Duplicate")
                                                    ]),
                                                    _: 1 /* STABLE */
                                                  })
                                                ]),
                                                _: 1 /* STABLE */
                                              }, 8 /* PROPS */, ["onClick"])), [
                                                [_directive_close_popup]
                                              ]),
                                              _withDirectives((_openBlock(), _createBlock(_component_q_item, {
                                                clickable: "",
                                                onClick: $event => (_ctx.removeField(i))
                                              }, {
                                                default: _withCtx(() => [
                                                  _createVNode(_component_q_item_section, { class: "text-negative" }, {
                                                    default: _withCtx(() => [
                                                      _createTextVNode("Delete")
                                                    ]),
                                                    _: 1 /* STABLE */
                                                  })
                                                ]),
                                                _: 1 /* STABLE */
                                              }, 8 /* PROPS */, ["onClick"])), [
                                                [_directive_close_popup]
                                              ])
                                            ]),
                                            _: 2 /* DYNAMIC */
                                          }, 1024 /* DYNAMIC_SLOTS */)
                                        ]),
                                        _: 2 /* DYNAMIC */
                                      }, 1024 /* DYNAMIC_SLOTS */)
                                    ]),
                                    _: 2 /* DYNAMIC */
                                  }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"])
                                ], 10 /* CLASS, PROPS */, ["onClick"]))
                              }), 128 /* KEYED_FRAGMENT */))
                            ]),
                            (_ctx.flowDialog.data.fields[_ctx.flowDialog.sel])
                              ? (_openBlock(), _createElementBlock("div", {
                                  key: 0,
                                  class: "col-12 col-sm-7"
                                }, [
                                  _createElementVNode("div", { class: "q-gutter-sm" }, [
                                    _createVNode(_component_q_select, {
                                      outlined: "",
                                      dense: "",
                                      "emit-value": "",
                                      "map-options": "",
                                      modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type,
                                      "onUpdate:modelValue": [$event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type) = $event), $event => (_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type==='consent'&&(_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].required=true))],
                                      options: _ctx.fieldTypeOptions,
                                      label: "Question type"
                                    }, {
                                      option: _withCtx((scope) => [
                                        _createVNode(_component_q_item, _normalizeProps(_guardReactiveProps(scope.itemProps)), {
                                          default: _withCtx(() => [
                                            _createVNode(_component_q_item_section, { avatar: "" }, {
                                              default: _withCtx(() => [
                                                _createVNode(_component_q_icon, {
                                                  name: scope.opt.icon
                                                }, null, 8 /* PROPS */, ["name"])
                                              ]),
                                              _: 2 /* DYNAMIC */
                                            }, 1024 /* DYNAMIC_SLOTS */),
                                            _createVNode(_component_q_item_section, null, {
                                              default: _withCtx(() => [
                                                _createTextVNode(_toDisplayString(scope.opt.label), 1 /* TEXT */)
                                              ]),
                                              _: 2 /* DYNAMIC */
                                            }, 1024 /* DYNAMIC_SLOTS */)
                                          ]),
                                          _: 2 /* DYNAMIC */
                                        }, 1040 /* FULL_PROPS, DYNAMIC_SLOTS */)
                                      ]),
                                      _: 1 /* STABLE */
                                    }, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"]),
                                    _createVNode(_component_q_input, {
                                      outlined: "",
                                      dense: "",
                                      modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].label,
                                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].label) = $event),
                                      label: "Question",
                                      placeholder: "Your question here"
                                    }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                                    _createVNode(_component_q_input, {
                                      outlined: "",
                                      dense: "",
                                      modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].help,
                                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].help) = $event),
                                      label: "Description (optional)"
                                    }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                                    _createVNode(_component_q_input, {
                                      outlined: "",
                                      dense: "",
                                      modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].id,
                                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].id) = $event),
                                      label: "Field ID",
                                      hint: "Auto from question if empty"
                                    }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                                    (['select','radio'].includes(_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type))
                                      ? (_openBlock(), _createBlock(_component_q_input, {
                                          key: 0,
                                          outlined: "",
                                          dense: "",
                                          type: "textarea",
                                          autogrow: "",
                                          modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].optionsText,
                                          "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].optionsText) = $event),
                                          label: "Choices (comma-separated)"
                                        }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]))
                                      : _createCommentVNode("v-if", true),
                                    _createVNode(_component_q_toggle, {
                                      modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].required,
                                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].required) = $event),
                                      label: "Required",
                                      disable: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type==='consent'
                                    }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "disable"]),
                                    (_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type==='nostr_pubkey')
                                      ? (_openBlock(), _createElementBlock("div", {
                                          key: 1,
                                          class: "text-caption text-grey-7"
                                        }, "One-click Nostr sign-in only works in the embed widget — on the hosted page attendees paste their npub manually."))
                                      : _createCommentVNode("v-if", true)
                                  ])
                                ]))
                              : _createCommentVNode("v-if", true)
                          ]))
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
                          key: 1,
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
                  ]))
                : (_openBlock(), _createElementBlock("div", {
                    key: 1,
                    class: _normalizeClass(["form-preview", _ctx.previewClasses])
                  }, [
                    _createVNode(_component_q_card, { class: "q-pa-lg fp-preview-card" }, {
                      default: _withCtx(() => [
                        (_ctx.previewStepper && _ctx.flowDialog.previewStep===-1)
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 0,
                              class: "text-center q-pa-lg"
                            }, [
                              _createElementVNode("div", { class: "text-h5 q-mt-none q-mb-sm" }, _toDisplayString(_ctx.flowDialog.data.title || 'Untitled form'), 1 /* TEXT */),
                              (_ctx.flowDialog.data.description)
                                ? (_openBlock(), _createElementBlock("p", {
                                    key: 0,
                                    class: "text-grey-8"
                                  }, _toDisplayString(_ctx.flowDialog.data.description), 1 /* TEXT */))
                                : _createCommentVNode("v-if", true),
                              _createVNode(_component_q_btn, {
                                unelevated: "",
                                "no-caps": "",
                                color: "primary",
                                size: "lg",
                                onClick: _ctx.previewOk
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
                              (_ctx.flowDialog.data.amountSat>0)
                                ? (_openBlock(), _createElementBlock("div", {
                                    key: 1,
                                    class: "text-caption q-mt-lg"
                                  }, _toDisplayString(Number(_ctx.flowDialog.data.amountSat).toLocaleString()) + " sats to complete", 1 /* TEXT */))
                                : _createCommentVNode("v-if", true)
                            ]))
                          : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                              (!_ctx.previewStepper)
                                ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                    _createElementVNode("div", { class: "text-h5 q-mt-none q-mb-sm" }, _toDisplayString(_ctx.flowDialog.data.title || 'Untitled form'), 1 /* TEXT */),
                                    (_ctx.flowDialog.data.description)
                                      ? (_openBlock(), _createElementBlock("p", {
                                          key: 0,
                                          class: "text-grey-8"
                                        }, _toDisplayString(_ctx.flowDialog.data.description), 1 /* TEXT */))
                                      : _createCommentVNode("v-if", true)
                                  ], 64 /* STABLE_FRAGMENT */))
                                : _createCommentVNode("v-if", true),
                              (_ctx.previewStepper)
                                ? (_openBlock(), _createBlock(_component_q_linear_progress, {
                                    key: 1,
                                    value: _ctx.previewProgress,
                                    rounded: "",
                                    class: "q-mb-md"
                                  }, null, 8 /* PROPS */, ["value"]))
                                : _createCommentVNode("v-if", true),
                              _createElementVNode("div", { class: "q-gutter-md" }, [
                                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.flowDialog.data.fields, (field, i) => {
                                  return (_openBlock(), _createElementBlock(_Fragment, null, [
                                    (!_ctx.previewStepper || i===_ctx.flowDialog.previewStep)
                                      ? (_openBlock(), _createElementBlock("div", { key: i }, [
                                          (_ctx.previewStepper)
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
                                                  _createTextVNode(_toDisplayString(field.label || 'Untitled question'), 1 /* TEXT */),
                                                  (!field.required)
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
                                                      modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
                                                      placeholder: "Type your answer here…"
                                                    }, null, 8 /* PROPS */, ["type", "modelValue", "onUpdate:modelValue"]))
                                                  : (field.type==='textarea')
                                                    ? (_openBlock(), _createBlock(_component_q_input, {
                                                        key: 2,
                                                        outlined: "",
                                                        type: "textarea",
                                                        rows: "4",
                                                        modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                        "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
                                                        placeholder: "Type your answer here…"
                                                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]))
                                                    : (field.type==='select')
                                                      ? (_openBlock(), _createBlock(_component_q_select, {
                                                          key: 3,
                                                          outlined: "",
                                                          options: _ctx.fieldOptions(field),
                                                          modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                          "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
                                                          placeholder: "Choose an option"
                                                        }, null, 8 /* PROPS */, ["options", "modelValue", "onUpdate:modelValue"]))
                                                      : (field.type==='radio')
                                                        ? (_openBlock(), _createElementBlock("div", {
                                                            key: 4,
                                                            class: "tf-options"
                                                          }, [
                                                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.fieldOptions(field), (opt, oi) => {
                                                              return (_openBlock(), _createElementBlock("div", {
                                                                key: oi,
                                                                class: _normalizeClass(["tf-option", {'tf-selected': _ctx.flowDialog.previewAnswers[field.id]===opt}]),
                                                                onClick: $event => (_ctx.previewChoose(field, opt))
                                                              }, [
                                                                _createElementVNode("span", { class: "tf-key" }, _toDisplayString(_ctx.previewOptionKey(oi)), 1 /* TEXT */),
                                                                _createElementVNode("span", { class: "tf-optext" }, _toDisplayString(opt), 1 /* TEXT */),
                                                                (_ctx.flowDialog.previewAnswers[field.id]===opt)
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
                                                              modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
                                                              label: field.type==='consent'?'I accept':'Yes'
                                                            }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "label"]))
                                                          : _createCommentVNode("v-if", true)
                                              ]))
                                            : (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                                (['text','email','phone','number','date','nostr_pubkey'].includes(field.type))
                                                  ? (_openBlock(), _createBlock(_component_q_input, {
                                                      key: 0,
                                                      outlined: "",
                                                      dense: "",
                                                      type: field.type==='number'?'number':(field.type==='date'?'date':'text'),
                                                      modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
                                                      label: field.label+(field.required?' *':''),
                                                      hint: field.help
                                                    }, null, 8 /* PROPS */, ["type", "modelValue", "onUpdate:modelValue", "label", "hint"]))
                                                  : (field.type==='textarea')
                                                    ? (_openBlock(), _createBlock(_component_q_input, {
                                                        key: 1,
                                                        outlined: "",
                                                        type: "textarea",
                                                        rows: "3",
                                                        modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                        "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
                                                        label: field.label+(field.required?' *':''),
                                                        hint: field.help
                                                      }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "label", "hint"]))
                                                    : (field.type==='select')
                                                      ? (_openBlock(), _createBlock(_component_q_select, {
                                                          key: 2,
                                                          outlined: "",
                                                          dense: "",
                                                          options: _ctx.fieldOptions(field),
                                                          modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                          "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
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
                                                              options: _ctx.fieldOptions(field).map(o=>({label:o,value:o})),
                                                              modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
                                                              type: "radio"
                                                            }, null, 8 /* PROPS */, ["options", "modelValue", "onUpdate:modelValue"])
                                                          ]))
                                                        : (['checkbox','consent'].includes(field.type))
                                                          ? (_openBlock(), _createBlock(_component_q_checkbox, {
                                                              key: 4,
                                                              modelValue: _ctx.flowDialog.previewAnswers[field.id],
                                                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers[field.id]) = $event),
                                                              label: field.label+(field.required?' *':'')
                                                            }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "label"]))
                                                          : _createCommentVNode("v-if", true)
                                              ], 64 /* STABLE_FRAGMENT */))
                                        ]))
                                      : _createCommentVNode("v-if", true)
                                  ], 64 /* STABLE_FRAGMENT */))
                                }), 256 /* UNKEYED_FRAGMENT */))
                              ]),
                              (_ctx.formError)
                                ? (_openBlock(), _createElementBlock("div", {
                                    key: 2,
                                    class: "text-negative q-mt-md",
                                    role: "alert"
                                  }, _toDisplayString(_ctx.formError), 1 /* TEXT */))
                                : _createCommentVNode("v-if", true),
                              (_ctx.previewStepper)
                                ? (_openBlock(), _createElementBlock("div", {
                                    key: 3,
                                    class: "row items-end justify-between q-mt-lg"
                                  }, [
                                    _createVNode(_component_q_btn, {
                                      flat: "",
                                      "no-caps": "",
                                      label: "Back",
                                      disable: _ctx.flowDialog.previewStep<=0,
                                      onClick: _ctx.previewPrev
                                    }, null, 8 /* PROPS */, ["disable", "onClick"]),
                                    _createElementVNode("div", { class: "text-center" }, [
                                      _createVNode(_component_q_btn, {
                                        unelevated: "",
                                        "no-caps": "",
                                        color: "primary",
                                        onClick: _ctx.previewOk
                                      }, {
                                        default: _withCtx(() => [
                                          _createElementVNode("span", null, _toDisplayString(_ctx.previewLastStep ? _ctx.previewSubmitLabel : 'OK'), 1 /* TEXT */),
                                          (!_ctx.previewLastStep)
                                            ? (_openBlock(), _createBlock(_component_q_icon, {
                                                key: 0,
                                                name: "check",
                                                class: "q-ml-xs"
                                              }))
                                            : _createCommentVNode("v-if", true)
                                        ]),
                                        _: 1 /* STABLE */
                                      }, 8 /* PROPS */, ["onClick"]),
                                      _createElementVNode("div", { class: "tf-hint" }, [
                                        _createTextVNode("press "),
                                        _createElementVNode("b", null, "Enter ↵")
                                      ])
                                    ])
                                  ]))
                                : (_openBlock(), _createBlock(_component_q_btn, {
                                    key: 4,
                                    unelevated: "",
                                    "no-caps": "",
                                    color: "primary",
                                    class: "full-width q-mt-lg",
                                    label: _ctx.previewSubmitLabel
                                  }, null, 8 /* PROPS */, ["label"]))
                            ], 64 /* STABLE_FRAGMENT */))
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createElementVNode("div", { class: "text-center text-caption text-grey-7 q-mt-sm" }, "Preview — answers aren't submitted")
                  ], 2 /* CLASS */))
            ])
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
    _createVNode(_component_q_dialog, {
      modelValue: _ctx.shareDialog.show,
      "onUpdate:modelValue": $event => ((_ctx.shareDialog.show) = $event)
    }, {
      default: _withCtx(() => [
        (_ctx.shareDialog.flow)
          ? (_openBlock(), _createBlock(_component_q_card, {
              key: 0,
              class: "q-pa-lg",
              style: {"min-width":"min(92vw,560px)"}
            }, {
              default: _withCtx(() => [
                _createElementVNode("div", { class: "text-h6 q-mb-md" }, "Share — " + _toDisplayString(_ctx.shareDialog.flow.title), 1 /* TEXT */),
                _createElementVNode("div", { class: "q-gutter-md" }, [
                  _createVNode(_component_q_input, {
                    outlined: "",
                    readonly: "",
                    "model-value": _ctx.publicUrl(_ctx.shareDialog.flow),
                    label: "Public link"
                  }, {
                    append: _withCtx(() => [
                      _createVNode(_component_q_btn, {
                        flat: "",
                        round: "",
                        dense: "",
                        icon: "content_copy",
                        "aria-label": "Copy link",
                        onClick: $event => (_ctx.copyText(_ctx.publicUrl(_ctx.shareDialog.flow),'Public link'))
                      }, null, 8 /* PROPS */, ["onClick"])
                    ]),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["model-value"]),
                  _createVNode(_component_q_input, {
                    outlined: "",
                    readonly: "",
                    type: "textarea",
                    rows: "3",
                    "model-value": _ctx.embedSnippet(_ctx.shareDialog.flow),
                    label: "Embed snippet — paste into any website"
                  }, {
                    append: _withCtx(() => [
                      _createVNode(_component_q_btn, {
                        flat: "",
                        round: "",
                        dense: "",
                        icon: "content_copy",
                        "aria-label": "Copy snippet",
                        onClick: $event => (_ctx.copyText(_ctx.embedSnippet(_ctx.shareDialog.flow),'Embed snippet'))
                      }, null, 8 /* PROPS */, ["onClick"])
                    ]),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["model-value"]),
                  _createElementVNode("div", { class: "text-caption text-grey-7" }, "The embed renders the form on your site and supports one-click Nostr sign-in via the visitor's browser signer (NIP-07) — this does not work on the hosted page. Cross-origin embeds require this LNbits instance to send CORS headers."),
                  _createElementVNode("div", { class: "row justify-end" }, [
                    _createVNode(_component_q_btn, {
                      flat: "",
                      "no-caps": "",
                      label: "Close",
                      onClick: $event => (_ctx.shareDialog.show=false)
                    }, null, 8 /* PROPS */, ["onClick"])
                  ])
                ])
              ]),
              _: 1 /* STABLE */
            }))
          : _createCommentVNode("v-if", true)
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
            _createElementVNode("div", { class: "row q-col-gutter-sm q-mb-sm" }, [
              _createVNode(_component_q_input, {
                class: "col-12 col-sm-7",
                outlined: "",
                dense: "",
                clearable: "",
                modelValue: _ctx.subsFilter,
                "onUpdate:modelValue": $event => ((_ctx.subsFilter) = $event),
                label: "Search id, ticket, answers"
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
              _createVNode(_component_q_select, {
                class: "col-12 col-sm-5",
                outlined: "",
                dense: "",
                clearable: "",
                "emit-value": "",
                "map-options": "",
                modelValue: _ctx.subsStatusFilter,
                "onUpdate:modelValue": $event => ((_ctx.subsStatusFilter) = $event),
                options: ['pending_payment','paid','confirmed','approved','rejected','cancelled','expired'].map(s=>({value:s,label:s})),
                label: "Status"
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            _createVNode(_component_q_table, {
              rows: _ctx.filteredSubs,
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
              "body-cell-answers": _withCtx((props) => [
                _createVNode(_component_q_td, { props: props }, {
                  default: _withCtx(() => [
                    _createElementVNode("span", { class: "text-caption" }, _toDisplayString(_ctx.answersPreview(props.row)), 1 /* TEXT */)
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
                unelevated: "",
                "no-caps": "",
                color: "primary",
                icon: "download",
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
    }, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
    _createVNode(_component_q_dialog, {
      modelValue: _ctx.csvDialog.show,
      "onUpdate:modelValue": $event => ((_ctx.csvDialog.show) = $event)
    }, {
      default: _withCtx(() => [
        _createVNode(_component_q_card, {
          class: "q-pa-lg",
          style: {"min-width":"min(92vw,640px)"}
        }, {
          default: _withCtx(() => [
            _createElementVNode("div", { class: "text-h6 q-mb-xs" }, "Export CSV"),
            _createElementVNode("div", { class: "text-caption text-grey-7 q-mb-sm" }, [
              _createTextVNode("Downloads are blocked inside the LNbits frame — copy the CSV below and save it as "),
              _createElementVNode("b", null, _toDisplayString(_ctx.csvDialog.filename), 1 /* TEXT */)
            ]),
            _createVNode(_component_q_input, {
              outlined: "",
              readonly: "",
              type: "textarea",
              rows: "12",
              "model-value": _ctx.csvDialog.content,
              "input-style": "font-family:monospace;font-size:0.8rem"
            }, null, 8 /* PROPS */, ["model-value"]),
            _createElementVNode("div", { class: "row justify-end q-gutter-sm q-mt-md" }, [
              _createVNode(_component_q_btn, {
                flat: "",
                "no-caps": "",
                label: "Close",
                onClick: $event => (_ctx.csvDialog.show=false)
              }, null, 8 /* PROPS */, ["onClick"]),
              _createVNode(_component_q_btn, {
                unelevated: "",
                "no-caps": "",
                color: "primary",
                icon: "content_copy",
                label: "Copy CSV",
                onClick: _ctx.copyCsv
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
