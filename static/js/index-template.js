window.FORMS_INDEX_RENDER=function(){
const { createElementVNode: _createElementVNode, resolveComponent: _resolveComponent, createVNode: _createVNode, openBlock: _openBlock, createElementBlock: _createElementBlock, createCommentVNode: _createCommentVNode, toDisplayString: _toDisplayString, withCtx: _withCtx, createBlock: _createBlock, createTextVNode: _createTextVNode, renderList: _renderList, Fragment: _Fragment, normalizeStyle: _normalizeStyle, withModifiers: _withModifiers, vModelText: _vModelText, withDirectives: _withDirectives, normalizeClass: _normalizeClass, normalizeProps: _normalizeProps, guardReactiveProps: _guardReactiveProps } = Vue

return function render(_ctx, _cache) {
  const _component_q_space = _resolveComponent("q-space")
  const _component_q_btn = _resolveComponent("q-btn")
  const _component_q_spinner = _resolveComponent("q-spinner")
  const _component_q_icon = _resolveComponent("q-icon")
  const _component_q_card = _resolveComponent("q-card")
  const _component_q_badge = _resolveComponent("q-badge")
  const _component_q_td = _resolveComponent("q-td")
  const _component_q_tooltip = _resolveComponent("q-tooltip")
  const _component_q_table = _resolveComponent("q-table")
  const _component_q_btn_toggle = _resolveComponent("q-btn-toggle")
  const _component_q_separator = _resolveComponent("q-separator")
  const _component_q_input = _resolveComponent("q-input")
  const _component_q_menu = _resolveComponent("q-menu")
  const _component_q_select = _resolveComponent("q-select")
  const _component_q_option_group = _resolveComponent("q-option-group")
  const _component_q_checkbox = _resolveComponent("q-checkbox")
  const _component_q_item_section = _resolveComponent("q-item-section")
  const _component_q_item = _resolveComponent("q-item")
  const _component_q_toggle = _resolveComponent("q-toggle")
  const _component_q_expansion_item = _resolveComponent("q-expansion-item")
  const _component_q_color = _resolveComponent("q-color")
  const _component_q_slider = _resolveComponent("q-slider")
  const _component_q_linear_progress = _resolveComponent("q-linear-progress")
  const _component_q_dialog = _resolveComponent("q-dialog")

  return (_openBlock(), _createElementBlock("div", {
    class: "q-pa-md fa-page",
    style: {"max-width":"960px","margin":"0 auto"}
  }, [
    _createElementVNode("div", { class: "row items-center q-mb-md" }, [
      _createElementVNode("div", { class: "text-h5" }, "Forms"),
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
                      round: "",
                      dense: "",
                      size: "sm",
                      icon: "link",
                      "aria-label": "Copy public link",
                      onClick: $event => (_ctx.copyPublicLink(props.row))
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_q_tooltip, null, {
                          default: _withCtx(() => [
                            _createTextVNode("Copy public link")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["onClick"]),
                    _createVNode(_component_q_btn, {
                      flat: "",
                      round: "",
                      dense: "",
                      size: "sm",
                      icon: "code",
                      "aria-label": "Share and embed",
                      onClick: $event => (_ctx.openShare(props.row))
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_q_tooltip, null, {
                          default: _withCtx(() => [
                            _createTextVNode("Share & embed")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["onClick"]),
                    _createVNode(_component_q_btn, {
                      flat: "",
                      round: "",
                      dense: "",
                      size: "sm",
                      icon: "open_in_new",
                      "aria-label": "Open public page",
                      onClick: $event => (_ctx.openPublic(props.row))
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_q_tooltip, null, {
                          default: _withCtx(() => [
                            _createTextVNode("Open public page")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["onClick"]),
                    (props.row.status!=='published')
                      ? (_openBlock(), _createBlock(_component_q_btn, {
                          key: 0,
                          flat: "",
                          round: "",
                          dense: "",
                          size: "sm",
                          color: "positive",
                          icon: "publish",
                          "aria-label": "Publish",
                          onClick: $event => (_ctx.setStatus(props.row,'published'))
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_q_tooltip, null, {
                              default: _withCtx(() => [
                                _createTextVNode("Publish")
                              ]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _: 1 /* STABLE */
                        }, 8 /* PROPS */, ["onClick"]))
                      : _createCommentVNode("v-if", true),
                    (props.row.status==='published')
                      ? (_openBlock(), _createBlock(_component_q_btn, {
                          key: 1,
                          flat: "",
                          round: "",
                          dense: "",
                          size: "sm",
                          color: "warning",
                          icon: "block",
                          "aria-label": "Close submissions",
                          onClick: $event => (_ctx.setStatus(props.row,'closed'))
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_q_tooltip, null, {
                              default: _withCtx(() => [
                                _createTextVNode("Close submissions")
                              ]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _: 1 /* STABLE */
                        }, 8 /* PROPS */, ["onClick"]))
                      : _createCommentVNode("v-if", true),
                    _createVNode(_component_q_btn, {
                      flat: "",
                      round: "",
                      dense: "",
                      size: "sm",
                      icon: "edit",
                      "aria-label": "Edit",
                      onClick: $event => (_ctx.openFlowDialog(props.row))
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_q_tooltip, null, {
                          default: _withCtx(() => [
                            _createTextVNode("Edit")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["onClick"]),
                    _createVNode(_component_q_btn, {
                      flat: "",
                      round: "",
                      dense: "",
                      size: "sm",
                      icon: "list",
                      "aria-label": "Submissions",
                      onClick: $event => (_ctx.openSubmissions(props.row))
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_q_tooltip, null, {
                          default: _withCtx(() => [
                            _createTextVNode("Submissions")
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["onClick"]),
                    (props.row.status!=='published')
                      ? (_openBlock(), _createBlock(_component_q_btn, {
                          key: 2,
                          flat: "",
                          round: "",
                          dense: "",
                          size: "sm",
                          icon: "delete",
                          color: "negative",
                          "aria-label": "Delete",
                          onClick: $event => (_ctx.confirmDelete(props.row))
                        }, {
                          default: _withCtx(() => [
                            _createVNode(_component_q_tooltip, null, {
                              default: _withCtx(() => [
                                _createTextVNode("Delete")
                              ]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _: 1 /* STABLE */
                        }, 8 /* PROPS */, ["onClick"]))
                      : _createCommentVNode("v-if", true)
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["props"])
              ]),
              _: 1 /* STABLE */
            }, 8 /* PROPS */, ["rows", "columns"])),
    _createVNode(_component_q_dialog, {
      modelValue: _ctx.flowDialog.show,
      "onUpdate:modelValue": $event => ((_ctx.flowDialog.show) = $event),
      maximized: "",
      "transition-show": "slide-up",
      "transition-hide": "slide-down"
    }, {
      default: _withCtx(() => [
        _createVNode(_component_q_card, { class: "fp-dialog column no-wrap" }, {
          default: _withCtx(() => [
            _createElementVNode("div", { class: "fp-header row items-center q-py-sm q-px-md" }, [
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
                options: [{value:'edit',label:'Builder',icon:'edit'},{value:'preview',label:'Preview',icon:'visibility'}]
              }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
              _createVNode(_component_q_space),
              _createVNode(_component_q_btn, {
                flat: "",
                "no-caps": "",
                label: "Cancel",
                onClick: $event => (_ctx.flowDialog.show=false)
              }, null, 8 /* PROPS */, ["onClick"]),
              (_ctx.flowDialog.data.status!=='published')
                ? (_openBlock(), _createBlock(_component_q_btn, {
                    key: 0,
                    unelevated: "",
                    "no-caps": "",
                    color: "positive",
                    label: "Publish",
                    loading: _ctx.saving,
                    onClick: $event => (_ctx.saveFlow(true))
                  }, null, 8 /* PROPS */, ["loading", "onClick"]))
                : _createCommentVNode("v-if", true),
              _createVNode(_component_q_btn, {
                unelevated: "",
                "no-caps": "",
                color: "primary",
                label: "Save",
                loading: _ctx.saving,
                onClick: $event => (_ctx.saveFlow())
              }, null, 8 /* PROPS */, ["loading", "onClick"])
            ]),
            _createVNode(_component_q_separator),
            (_ctx.flowDialog.view==='edit')
              ? (_openBlock(), _createElementBlock("div", {
                  key: 0,
                  class: "fb-layout row no-wrap col"
                }, [
                  _createElementVNode("div", { class: "fb-palette scroll" }, [
                    _createElementVNode("div", { class: "fb-pal-group" }, "Inputs"),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.fieldTypeOptions, (t) => {
                      return (_openBlock(), _createElementBlock("div", {
                        key: t.value,
                        class: "fb-pal-item",
                        onClick: $event => (_ctx.addField(t.value))
                      }, [
                        (t.svg)
                          ? (_openBlock(), _createElementBlock("span", {
                              key: 0,
                              class: "fb-pal-ico",
                              style: _normalizeStyle({color:t.color}),
                              innerHTML: t.svg
                            }, null, 12 /* STYLE, PROPS */, ["innerHTML"]))
                          : (_openBlock(), _createBlock(_component_q_icon, {
                              key: 1,
                              name: t.icon,
                              size: "sm",
                              style: _normalizeStyle({color:t.color})
                            }, null, 8 /* PROPS */, ["name", "style"])),
                        _createElementVNode("span", null, _toDisplayString(t.label), 1 /* TEXT */)
                      ], 8 /* PROPS */, ["onClick"]))
                    }), 128 /* KEYED_FRAGMENT */)),
                    (!_ctx.flowDialog.editing)
                      ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                          _createElementVNode("div", { class: "fb-pal-group q-mt-md" }, "Pre-built"),
                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.flowTemplates, (t) => {
                            return (_openBlock(), _createElementBlock("div", {
                              key: t.value,
                              class: "fb-pal-item",
                              onClick: $event => (_ctx.applyTemplate(t.value))
                            }, [
                              _createVNode(_component_q_icon, {
                                name: "dashboard",
                                size: "sm",
                                class: "fb-pal-tpl"
                              }),
                              _createElementVNode("span", null, _toDisplayString(t.label), 1 /* TEXT */)
                            ], 8 /* PROPS */, ["onClick"]))
                          }), 128 /* KEYED_FRAGMENT */))
                        ], 64 /* STABLE_FRAGMENT */))
                      : _createCommentVNode("v-if", true)
                  ]),
                  _createElementVNode("div", {
                    class: _normalizeClass(["fb-canvas scroll col", _ctx.previewClasses]),
                    style: _normalizeStyle(_ctx.canvasStyle)
                  }, [
                    _createElementVNode("div", { class: "fb-form" }, [
                      _createElementVNode("div", { class: "fb-headerblock" }, [
                        _createElementVNode("div", {
                          class: "fb-banner",
                          style: _normalizeStyle(_ctx.bannerStyle)
                        }, [
                          _createVNode(_component_q_btn, {
                            flat: "",
                            round: "",
                            dense: "",
                            icon: "settings",
                            class: "fb-gear",
                            "aria-label": "Header image settings",
                            onClick: _withModifiers(() => {}, ["stop"])
                          }, {
                            default: _withCtx(() => [
                              _createVNode(_component_q_menu, null, {
                                default: _withCtx(() => [
                                  _createElementVNode("div", {
                                    class: "q-pa-md",
                                    style: {"width":"300px"}
                                  }, [
                                    _createElementVNode("div", { class: "text-subtitle2 q-mb-sm" }, "Header image"),
                                    _createVNode(_component_q_input, {
                                      dense: "",
                                      outlined: "",
                                      modelValue: _ctx.flowDialog.data.headerImage,
                                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.headerImage) = $event),
                                      label: "Image URL",
                                      placeholder: "/ext-assets/forms/assets/banner.png"
                                    }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                                    (_ctx.isExternalHeader)
                                      ? (_openBlock(), _createElementBlock("div", {
                                          key: 0,
                                          class: "text-caption text-warning q-mt-xs"
                                        }, "External URLs are blocked by the LNbits frame CSP — this won't show on hosted pages, only in the embed widget. Upload an image or use an /ext-assets/ path instead."))
                                      : (_openBlock(), _createElementBlock("div", {
                                          key: 1,
                                          class: "text-caption text-grey q-mt-xs"
                                        }, "Hosted pages only render /ext-assets/forms/ paths or data:image/ URIs (LNbits frame CSP).")),
                                    _createElementVNode("div", { class: "row justify-end q-mt-xs" }, [
                                      _createVNode(_component_q_btn, {
                                        flat: "",
                                        dense: "",
                                        "no-caps": "",
                                        size: "sm",
                                        icon: "upload",
                                        label: "Upload",
                                        onClick: _ctx.pickHeaderImage
                                      }, null, 8 /* PROPS */, ["onClick"]),
                                      _createVNode(_component_q_btn, {
                                        flat: "",
                                        dense: "",
                                        "no-caps": "",
                                        size: "sm",
                                        label: "Use sample",
                                        onClick: $event => (_ctx.flowDialog.data.headerImage='/ext-assets/forms/assets/banner.png')
                                      }, null, 8 /* PROPS */, ["onClick"]),
                                      _createVNode(_component_q_btn, {
                                        flat: "",
                                        dense: "",
                                        "no-caps": "",
                                        size: "sm",
                                        label: "Remove",
                                        onClick: $event => (_ctx.flowDialog.data.headerImage='')
                                      }, null, 8 /* PROPS */, ["onClick"])
                                    ])
                                  ])
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            _: 1 /* STABLE */
                          }, 8 /* PROPS */, ["onClick"])
                        ], 4 /* STYLE */),
                        _withDirectives(_createElementVNode("input", {
                          class: "fb-title",
                          "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.title) = $event),
                          placeholder: "This is the title of your form!"
                        }, null, 8 /* PROPS */, ["onUpdate:modelValue"]), [
                          [_vModelText, _ctx.flowDialog.data.title]
                        ]),
                        _withDirectives(_createElementVNode("textarea", {
                          class: "fb-desc",
                          "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.description) = $event),
                          placeholder: "Add a description — shown under the title",
                          rows: "2"
                        }, null, 8 /* PROPS */, ["onUpdate:modelValue"]), [
                          [_vModelText, _ctx.flowDialog.data.description]
                        ])
                      ]),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.flowDialog.data.fields, (field, i) => {
                        return (_openBlock(), _createElementBlock("div", {
                          key: i,
                          class: _normalizeClass(["fb-card", {active: i===_ctx.flowDialog.sel}]),
                          onClick: $event => (_ctx.selectField(i))
                        }, [
                          _createElementVNode("div", { class: "fb-tools" }, [
                            _createVNode(_component_q_btn, {
                              flat: "",
                              round: "",
                              dense: "",
                              size: "sm",
                              icon: "arrow_upward",
                              "aria-label": "Move up",
                              disable: i===0,
                              onClick: _withModifiers($event => (_ctx.moveField(i,-1)), ["stop"])
                            }, null, 8 /* PROPS */, ["disable", "onClick"]),
                            _createVNode(_component_q_btn, {
                              flat: "",
                              round: "",
                              dense: "",
                              size: "sm",
                              icon: "arrow_downward",
                              "aria-label": "Move down",
                              disable: i===_ctx.flowDialog.data.fields.length-1,
                              onClick: _withModifiers($event => (_ctx.moveField(i,1)), ["stop"])
                            }, null, 8 /* PROPS */, ["disable", "onClick"]),
                            _createVNode(_component_q_btn, {
                              flat: "",
                              round: "",
                              dense: "",
                              size: "sm",
                              icon: field.required?'star':'star_border',
                              "aria-label": "Toggle required",
                              class: _normalizeClass({'fb-star-on':field.required}),
                              onClick: _withModifiers($event => (_ctx.toggleRequired(i)), ["stop"])
                            }, null, 8 /* PROPS */, ["icon", "class", "onClick"]),
                            _createVNode(_component_q_btn, {
                              flat: "",
                              round: "",
                              dense: "",
                              size: "sm",
                              icon: "delete",
                              color: "negative",
                              "aria-label": "Delete question",
                              onClick: _withModifiers($event => (_ctx.removeField(i)), ["stop"])
                            }, null, 8 /* PROPS */, ["onClick"]),
                            _createVNode(_component_q_space),
                            _createElementVNode("span", { class: "fb-type" }, [
                              (_ctx.fieldSvg(field.type))
                                ? (_openBlock(), _createElementBlock("span", {
                                    key: 0,
                                    class: "fb-pal-ico xs",
                                    innerHTML: _ctx.fieldSvg(field.type)
                                  }, null, 8 /* PROPS */, ["innerHTML"]))
                                : (_openBlock(), _createBlock(_component_q_icon, {
                                    key: 1,
                                    name: _ctx.fieldIcon(field.type),
                                    size: "xs"
                                  }, null, 8 /* PROPS */, ["name"])),
                              _createTextVNode(" " + _toDisplayString(_ctx.typeLabel(field.type)), 1 /* TEXT */)
                            ])
                          ]),
                          _withDirectives(_createElementVNode("input", {
                            class: "fb-qlabel",
                            "onUpdate:modelValue": $event => ((field.label) = $event),
                            placeholder: "Click here to edit",
                            onClick: _withModifiers(() => {}, ["stop"])
                          }, null, 8 /* PROPS */, ["onUpdate:modelValue", "onClick"]), [
                            [_vModelText, field.label]
                          ]),
                          (field.help)
                            ? (_openBlock(), _createElementBlock("div", {
                                key: 0,
                                class: "fb-qhelp"
                              }, _toDisplayString(field.help), 1 /* TEXT */))
                            : _createCommentVNode("v-if", true),
                          _createElementVNode("div", { class: "fb-input" }, [
                            (['text','email','phone','number','date','nostr_pubkey'].includes(field.type))
                              ? (_openBlock(), _createBlock(_component_q_input, {
                                  key: 0,
                                  outlined: "",
                                  dense: "",
                                  type: field.type==='number'?'number':(field.type==='date'?'date':'text'),
                                  modelValue: _ctx.flowDialog.previewAnswers['f'+i],
                                  "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers['f'+i]) = $event),
                                  placeholder: "Type your answer here"
                                }, null, 8 /* PROPS */, ["type", "modelValue", "onUpdate:modelValue"]))
                              : (field.type==='textarea')
                                ? (_openBlock(), _createBlock(_component_q_input, {
                                    key: 1,
                                    outlined: "",
                                    dense: "",
                                    type: "textarea",
                                    rows: "3",
                                    modelValue: _ctx.flowDialog.previewAnswers['f'+i],
                                    "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers['f'+i]) = $event),
                                    placeholder: "Type your answer here"
                                  }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]))
                                : (field.type==='select')
                                  ? (_openBlock(), _createBlock(_component_q_select, {
                                      key: 2,
                                      outlined: "",
                                      dense: "",
                                      options: _ctx.fieldOptions(field),
                                      modelValue: _ctx.flowDialog.previewAnswers['f'+i],
                                      "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers['f'+i]) = $event),
                                      placeholder: "Choose an option"
                                    }, null, 8 /* PROPS */, ["options", "modelValue", "onUpdate:modelValue"]))
                                  : (field.type==='radio')
                                    ? (_openBlock(), _createBlock(_component_q_option_group, {
                                        key: 3,
                                        options: _ctx.fieldOptions(field).map(o=>({label:o,value:o})),
                                        modelValue: _ctx.flowDialog.previewAnswers['f'+i],
                                        "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers['f'+i]) = $event),
                                        type: "radio"
                                      }, null, 8 /* PROPS */, ["options", "modelValue", "onUpdate:modelValue"]))
                                    : (['checkbox','consent'].includes(field.type))
                                      ? (_openBlock(), _createBlock(_component_q_checkbox, {
                                          key: 4,
                                          modelValue: _ctx.flowDialog.previewAnswers['f'+i],
                                          "onUpdate:modelValue": $event => ((_ctx.flowDialog.previewAnswers['f'+i]) = $event),
                                          label: field.type==='consent'?'I accept':'Yes'
                                        }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "label"]))
                                      : _createCommentVNode("v-if", true)
                          ])
                        ], 10 /* CLASS, PROPS */, ["onClick"]))
                      }), 128 /* KEYED_FRAGMENT */)),
                      (!_ctx.flowDialog.data.fields.length)
                        ? (_openBlock(), _createElementBlock("div", {
                            key: 0,
                            class: "fb-empty"
                          }, "Pick a field type on the left to add your first question — the form can also collect a payment with no questions."))
                        : (_openBlock(), _createElementBlock("div", {
                            key: 1,
                            class: "fb-addhint"
                          }, "Click an input type on the left to add another question"))
                    ])
                  ], 6 /* CLASS, STYLE */),
                  _createElementVNode("div", { class: "fb-side scroll" }, [
                    (_ctx.flowDialog.data.fields[_ctx.flowDialog.sel])
                      ? (_openBlock(), _createElementBlock("div", {
                          key: 0,
                          class: "fb-side-sec"
                        }, [
                          _createElementVNode("div", { class: "fb-side-title" }, "Question"),
                          _createVNode(_component_q_select, {
                            outlined: "",
                            dense: "",
                            "emit-value": "",
                            "map-options": "",
                            modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type,
                            "onUpdate:modelValue": [$event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type) = $event), $event => (_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type==='consent'&&(_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].required=true))],
                            options: _ctx.fieldTypeOptions,
                            label: "Type"
                          }, {
                            option: _withCtx((scope) => [
                              _createVNode(_component_q_item, _normalizeProps(_guardReactiveProps(scope.itemProps)), {
                                default: _withCtx(() => [
                                  _createVNode(_component_q_item_section, { avatar: "" }, {
                                    default: _withCtx(() => [
                                      (scope.opt.svg)
                                        ? (_openBlock(), _createElementBlock("span", {
                                            key: 0,
                                            class: "fb-pal-ico",
                                            style: _normalizeStyle({color:scope.opt.color}),
                                            innerHTML: scope.opt.svg
                                          }, null, 12 /* STYLE, PROPS */, ["innerHTML"]))
                                        : (_openBlock(), _createBlock(_component_q_icon, {
                                            key: 1,
                                            name: scope.opt.icon,
                                            style: _normalizeStyle({color:scope.opt.color})
                                          }, null, 8 /* PROPS */, ["name", "style"]))
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
                            class: "q-mt-sm",
                            outlined: "",
                            dense: "",
                            modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].help,
                            "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].help) = $event),
                            label: "Description (optional)"
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                          _createVNode(_component_q_input, {
                            class: "q-mt-sm",
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
                                class: "q-mt-sm",
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
                            class: "q-mt-sm",
                            modelValue: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].required,
                            "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].required) = $event),
                            label: "Required",
                            disable: _ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type==='consent'
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "disable"]),
                          (_ctx.flowDialog.data.fields[_ctx.flowDialog.sel].type==='nostr_pubkey')
                            ? (_openBlock(), _createElementBlock("div", {
                                key: 1,
                                class: "text-caption text-grey-7 q-mt-sm"
                              }, "One-click Nostr sign-in only works in the embed widget — on the hosted page attendees paste their npub manually."))
                            : _createCommentVNode("v-if", true)
                        ]))
                      : _createCommentVNode("v-if", true),
                    _createVNode(_component_q_expansion_item, {
                      icon: "payments",
                      label: "Payment",
                      group: "fb-side",
                      class: "fb-acc"
                    }, {
                      default: _withCtx(() => [
                        _createElementVNode("div", { class: "q-gutter-sm q-pa-sm" }, [
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
                          _createElementVNode("div", { class: "row items-center no-wrap" }, [
                            _createVNode(_component_q_checkbox, {
                              dense: "",
                              class: "col",
                              modelValue: _ctx.flowDialog.data.requireApproval,
                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.requireApproval) = $event),
                              label: "Require manual approval after payment"
                            }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                            _createVNode(_component_q_icon, {
                              name: "help_outline",
                              size: "xs",
                              color: "grey",
                              class: "cursor-help"
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_q_tooltip, { "max-width": "280px" }, {
                                  default: _withCtx(() => [
                                    _createTextVNode("Payment is collected as usual, but no ticket is issued until you approve the entry in the Submissions list. Use it to vet applicants — rejecting does not refund the payment.")
                                  ]),
                                  _: 1 /* STABLE */
                                })
                              ]),
                              _: 1 /* STABLE */
                            })
                          ]),
                          _createElementVNode("div", { class: "fb-hint" }, "Paid entries wait for your review — approve to issue the ticket.")
                        ])
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(_component_q_expansion_item, {
                      icon: "palette",
                      label: "Appearance",
                      group: "fb-side",
                      class: "fb-acc"
                    }, {
                      default: _withCtx(() => [
                        _createElementVNode("div", { class: "q-gutter-sm q-pa-sm" }, [
                          _createVNode(_component_q_select, {
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
                            outlined: "",
                            dense: "",
                            "emit-value": "",
                            "map-options": "",
                            modelValue: _ctx.flowDialog.data.renderer,
                            "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.renderer) = $event),
                            options: _ctx.rendererOptions,
                            label: "Layout"
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "options"]),
                          _createElementVNode("div", { class: "fb-side-title" }, "Colors"),
                          _createElementVNode("div", { class: "row q-gutter-md" }, [
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.colorKeys, (c) => {
                              return (_openBlock(), _createElementBlock("div", {
                                key: c.key,
                                class: "column items-center"
                              }, [
                                _createVNode(_component_q_btn, {
                                  round: "",
                                  dense: "",
                                  size: "sm",
                                  class: "fb-swatch",
                                  style: _normalizeStyle({background: _ctx.flowDialog.data.colors[c.key] || 'rgba(128,128,128,0.25)'})
                                }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_q_menu, null, {
                                      default: _withCtx(() => [
                                        _createVNode(_component_q_color, {
                                          modelValue: _ctx.flowDialog.data.colors[c.key],
                                          "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.colors[c.key]) = $event)
                                        }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 2 /* DYNAMIC */
                                    }, 1024 /* DYNAMIC_SLOTS */)
                                  ]),
                                  _: 2 /* DYNAMIC */
                                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["style"]),
                                _createElementVNode("div", { class: "text-caption q-mt-xs" }, _toDisplayString(c.label), 1 /* TEXT */)
                              ]))
                            }), 128 /* KEYED_FRAGMENT */))
                          ]),
                          _createElementVNode("div", { class: "text-caption text-grey q-mt-xs" }, "Title, Description and Question fall back to Global if not set."),
                          _createElementVNode("div", { class: "fb-side-title q-mt-md" }, "Title image"),
                          _createElementVNode("div", { class: "row items-center q-gutter-xs no-wrap" }, [
                            _createVNode(_component_q_input, {
                              outlined: "",
                              dense: "",
                              class: "col",
                              modelValue: _ctx.flowDialog.data.headerImage,
                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.headerImage) = $event),
                              placeholder: "/ext-assets/forms/assets/banner.png"
                            }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                            _createVNode(_component_q_btn, {
                              flat: "",
                              dense: "",
                              "no-caps": "",
                              icon: "upload",
                              onClick: $event => (_ctx.pickImage('headerImage'))
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_q_tooltip, null, {
                                  default: _withCtx(() => [
                                    _createTextVNode("Upload image")
                                  ]),
                                  _: 1 /* STABLE */
                                })
                              ]),
                              _: 1 /* STABLE */
                            }, 8 /* PROPS */, ["onClick"])
                          ]),
                          _createElementVNode("div", { class: "fb-side-title q-mt-sm" }, "Background image"),
                          _createElementVNode("div", { class: "row items-center q-gutter-xs no-wrap" }, [
                            _createVNode(_component_q_input, {
                              outlined: "",
                              dense: "",
                              class: "col",
                              modelValue: _ctx.flowDialog.data.bgImage,
                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.bgImage) = $event),
                              placeholder: "/ext-assets/forms/assets/banner.png"
                            }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                            _createVNode(_component_q_btn, {
                              flat: "",
                              dense: "",
                              "no-caps": "",
                              icon: "upload",
                              onClick: $event => (_ctx.pickImage('bgImage'))
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_q_tooltip, null, {
                                  default: _withCtx(() => [
                                    _createTextVNode("Upload image")
                                  ]),
                                  _: 1 /* STABLE */
                                })
                              ]),
                              _: 1 /* STABLE */
                            }, 8 /* PROPS */, ["onClick"])
                          ]),
                          _createElementVNode("div", { class: "fb-side-title q-mt-sm" }, "Thank you screen image"),
                          _createElementVNode("div", { class: "row items-center q-gutter-xs no-wrap" }, [
                            _createVNode(_component_q_input, {
                              outlined: "",
                              dense: "",
                              class: "col",
                              modelValue: _ctx.flowDialog.data.endImage,
                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.endImage) = $event),
                              placeholder: "/ext-assets/forms/assets/banner.png"
                            }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                            _createVNode(_component_q_btn, {
                              flat: "",
                              dense: "",
                              "no-caps": "",
                              icon: "upload",
                              onClick: $event => (_ctx.pickImage('endImage'))
                            }, {
                              default: _withCtx(() => [
                                _createVNode(_component_q_tooltip, null, {
                                  default: _withCtx(() => [
                                    _createTextVNode("Upload image")
                                  ]),
                                  _: 1 /* STABLE */
                                })
                              ]),
                              _: 1 /* STABLE */
                            }, 8 /* PROPS */, ["onClick"])
                          ]),
                          (_ctx.isExtImg(_ctx.flowDialog.data.headerImage) || _ctx.isExtImg(_ctx.flowDialog.data.bgImage) || _ctx.isExtImg(_ctx.flowDialog.data.endImage))
                            ? (_openBlock(), _createElementBlock("div", {
                                key: 0,
                                class: "text-caption text-warning q-mt-xs"
                              }, "External URLs are blocked by the LNbits frame CSP — they won't show on hosted pages, only in the embed widget. Upload an image or use /ext-assets/ paths instead."))
                            : (_openBlock(), _createElementBlock("div", {
                                key: 1,
                                class: "text-caption text-grey q-mt-xs"
                              }, "Hosted pages only render /ext-assets/forms/ paths or data:image/ URIs. Upload inlines a file automatically.")),
                          _createElementVNode("div", { class: "fb-side-title q-mt-md" }, "Card transparency"),
                          _createVNode(_component_q_slider, {
                            modelValue: _ctx.flowDialog.data.cardOpacity,
                            "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.cardOpacity) = $event),
                            min: 0,
                            max: 1,
                            step: 0.05,
                            label: "",
                            "label-always": ""
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                          _createElementVNode("div", { class: "text-caption text-grey" }, "Transparency of form cards (0 = fully transparent, 1 = opaque)."),
                          _createVNode(_component_q_input, {
                            outlined: "",
                            dense: "",
                            class: "q-mt-sm",
                            modelValue: _ctx.flowDialog.data.confirmText,
                            "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.confirmText) = $event),
                            label: "Confirmation text",
                            hint: "Shown after a successful submission"
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(_component_q_expansion_item, {
                      icon: "notifications",
                      label: "Notifications",
                      group: "fb-side",
                      class: "fb-acc"
                    }, {
                      default: _withCtx(() => [
                        _createElementVNode("div", { class: "q-pa-sm" }, [
                          _createElementVNode("div", { class: "fb-hint" }, [
                            _createTextVNode("POST submission data to a webhook when someone submits or pays. For "),
                            _createElementVNode("b", null, "email"),
                            _createTextVNode(" use Web3Forms — free, no signup: get an access key at web3forms.com, use the URL below and paste your key.")
                          ]),
                          _createVNode(_component_q_input, {
                            outlined: "",
                            dense: "",
                            class: "q-mt-sm",
                            modelValue: _ctx.flowDialog.data.notifyUrl,
                            "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.notifyUrl) = $event),
                            label: "Webhook URL",
                            placeholder: "https://api.web3forms.com/submit"
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                          _createVNode(_component_q_input, {
                            outlined: "",
                            dense: "",
                            class: "q-mt-md",
                            modelValue: _ctx.flowDialog.data.notifyKey,
                            "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.notifyKey) = $event),
                            type: "password",
                            label: "Access key / token"
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                          _createElementVNode("div", { class: "fb-hint q-mt-xs" }, "Web3Forms access key, Telegram chat_id, or bearer token — kept private"),
                          _createElementVNode("div", { class: "q-mt-md" }, [
                            _createVNode(_component_q_checkbox, {
                              dense: "",
                              modelValue: _ctx.flowDialog.data.notifyOnSubmit,
                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.notifyOnSubmit) = $event),
                              label: "Notify on submission"
                            }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]),
                            _createVNode(_component_q_checkbox, {
                              dense: "",
                              modelValue: _ctx.flowDialog.data.notifyOnPaid,
                              "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.notifyOnPaid) = $event),
                              label: "Notify when paid"
                            }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _createElementVNode("div", { class: "fb-side-title q-mt-md" }, "Allowed hosts"),
                          _createElementVNode("div", { class: "fb-hint fb-hosts" }, [
                            _createElementVNode("div", null, [
                              _createElementVNode("b", null, "api.web3forms.com"),
                              _createTextVNode(" — email")
                            ]),
                            _createElementVNode("div", null, [
                              _createElementVNode("b", null, "ntfy.sh"),
                              _createTextVNode(" — push")
                            ]),
                            _createElementVNode("div", null, [
                              _createElementVNode("b", null, "hooks.slack.com"),
                              _createTextVNode(" — Slack")
                            ]),
                            _createElementVNode("div", null, [
                              _createElementVNode("b", null, "discord.com"),
                              _createTextVNode(" — Discord")
                            ]),
                            _createElementVNode("div", null, [
                              _createElementVNode("b", null, "api.telegram.org"),
                              _createTextVNode(" — chat_id as key, bot token in URL")
                            ]),
                            _createElementVNode("div", null, [
                              _createElementVNode("b", null, "maker.ifttt.com"),
                              _createTextVNode(" — IFTTT applets")
                            ])
                          ]),
                          _createElementVNode("div", { class: "row items-center q-gutter-sm q-mt-md" }, [
                            _createVNode(_component_q_btn, {
                              outline: "",
                              dense: "",
                              "no-caps": "",
                              size: "sm",
                              icon: "send",
                              label: "Send test",
                              disable: !_ctx.flowDialog.editing || !_ctx.flowDialog.data.notifyUrl,
                              loading: _ctx.notifyTesting,
                              onClick: _ctx.testNotify
                            }, null, 8 /* PROPS */, ["disable", "loading", "onClick"]),
                            (_ctx.notifyResult)
                              ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: _normalizeClass(["fb-hint", _ctx.notifyOk ? 'text-positive' : 'text-negative'])
                                }, _toDisplayString(_ctx.notifyResult), 3 /* TEXT, CLASS */))
                              : _createCommentVNode("v-if", true)
                          ]),
                          (!_ctx.flowDialog.editing)
                            ? (_openBlock(), _createElementBlock("div", {
                                key: 0,
                                class: "fb-hint q-mt-xs"
                              }, "Save the flow first to send a test."))
                            : _createCommentVNode("v-if", true)
                        ])
                      ]),
                      _: 1 /* STABLE */
                    }),
                    _createVNode(_component_q_expansion_item, {
                      icon: "code",
                      label: "Advanced",
                      group: "fb-side",
                      class: "fb-acc"
                    }, {
                      default: _withCtx(() => [
                        _createElementVNode("div", { class: "q-pa-sm" }, [
                          _createVNode(_component_q_input, {
                            outlined: "",
                            dense: "",
                            type: "textarea",
                            rows: "8",
                            modelValue: _ctx.flowDialog.data.customCss,
                            "onUpdate:modelValue": $event => ((_ctx.flowDialog.data.customCss) = $event),
                            label: "Custom CSS",
                            placeholder: _ctx.customCssSample,
                            hint: "Applied to the public page. @import, url() and expression() are stripped for safety.",
                            "input-style": "font-family:monospace;font-size:0.8rem"
                          }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                          _createVNode(_component_q_btn, {
                            flat: "",
                            dense: "",
                            "no-caps": "",
                            size: "sm",
                            icon: "auto_fix_high",
                            label: "Insert example",
                            class: "q-mt-xs",
                            onClick: _ctx.insertCssSample
                          }, null, 8 /* PROPS */, ["onClick"])
                        ])
                      ]),
                      _: 1 /* STABLE */
                    }),
                    (_ctx.formError)
                      ? (_openBlock(), _createElementBlock("div", {
                          key: 1,
                          class: "text-negative q-pa-sm",
                          role: "alert"
                        }, _toDisplayString(_ctx.formError), 1 /* TEXT */))
                      : _createCommentVNode("v-if", true)
                  ])
                ]))
              : (_openBlock(), _createElementBlock("div", {
                  key: 1,
                  class: "col scroll q-pa-lg"
                }, [
                  _createElementVNode("div", {
                    class: _normalizeClass(["form-preview", _ctx.previewClasses]),
                    style: _normalizeStyle(_ctx.canvasStyle)
                  }, [
                    _createVNode(_component_q_card, { class: "q-pa-lg fp-preview-card overflow-hidden" }, {
                      default: _withCtx(() => [
                        (_ctx.flowDialog.data.headerImage)
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 0,
                              class: "form-banner",
                              style: _normalizeStyle(_ctx.bannerStyle)
                            }, null, 4 /* STYLE */))
                          : _createCommentVNode("v-if", true),
                        (_ctx.previewStepper && _ctx.flowDialog.previewStep===-1)
                          ? (_openBlock(), _createElementBlock("div", {
                              key: 1,
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
                          : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
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
                  ], 6 /* CLASS, STYLE */)
                ]))
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
