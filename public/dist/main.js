(function (Vue, Vuetify, VueTheMask, vuex, VueRouter, validator) {
    'use strict';

    Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
    Vuetify = Vuetify && Vuetify.hasOwnProperty('default') ? Vuetify['default'] : Vuetify;
    VueTheMask = VueTheMask && VueTheMask.hasOwnProperty('default') ? VueTheMask['default'] : VueTheMask;
    var vuex__default = 'default' in vuex ? vuex['default'] : vuex;
    VueRouter = VueRouter && VueRouter.hasOwnProperty('default') ? VueRouter['default'] : VueRouter;
    validator = validator && validator.hasOwnProperty('default') ? validator['default'] : validator;

    const MIN_NAME_LENGTH = 5;
    const MAX_NAME_LENGTH = 40;

    const MIN_PASSWORD_LENGTH = 8;

    const passwordTests = [
        {
            title: "At least eight characters",
            description: "Password too short",
            test(password) {
                return password.length >= MIN_PASSWORD_LENGTH;
            }
        },
        {
            title: "At-least one special character",
            description: "Password doesn't contain special characters",
            test(password) {
                return !/^[a-zA-Z0-9_-]+$/.test(password);
            }
        },
        {
            title: "At-least one uppercase letter",
            description: "Password doesn't contain any uppercase characters",
            test(password) {
                return /[A-Z]/.test(password);
            }
        },
        {
            title: "At-least one number",
            description: "Password doesn't contain any numbers",
            test(password) {
                return /[0-9]/.test(password);
            }
        }
    ];

    const testUserName = (name) => {
        const regex = new RegExp(`^[a-zA-Z \\.]{${MIN_NAME_LENGTH},${MAX_NAME_LENGTH}}$`);

        return regex.test(name);
    };

    const LOWERCASE = `abcdefghijklmnopqrstuvwxyz`;
    const UPPERCASE = LOWERCASE.toUpperCase();
    const NUMERIC = `0123456789`;

    const extractDigits = (string) => {
        const digits = new Set(NUMERIC);

        let output = '';

        for (let i = 0; i < string.length; i++) {
            const c = string[i];

            if (digits.has(c)) {
                output += c;
            }
        }

        return output;
    };

    const unique = () => {
        i++;

        return i;
    };

    let i = 0;

    const NS = `/api`;

    const querify = (obj) => {
        const queryComponents = [];

        for (const [key, value] of Object.entries(obj)) {
            if (value === undefined || value === null) {
                throw new Error('Query string value cannot be null or undefined');
            }

            queryComponents.push(`${key}=${encodeURIComponent(value)}`);
        }

        return queryComponents.join('&');
    };

    const get = (subPath, data = {}) => {
        const path = `${NS}/${subPath}`;
        const queryString = querify(data);
        const url =
          (queryString.length > 0) ?
            `${path}?${queryString}` :
            path;
        
        return new Promise((win, fail) => {
            const xhr = new XMLHttpRequest();

            xhr.responseType = 'json';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        win(xhr.response);
                    } else {
                        fail(new Error(`Invalid XHR response: ${xhr.status}`));
                    }
                }
            };

            xhr.open('GET', url, true);

            xhr.send();
        });
    };

    const post = (subPath, data = {}) => {
        const url = `${NS}/${subPath}`;
        
        return new Promise((win, fail) => {
            const xhr = new XMLHttpRequest();

            xhr.responseType = 'json';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        win(xhr.response);
                    } else {
                        fail(new Error(`Invalid XHR response: ${xhr.status}`));
                    }
                }
            };

            xhr.open('POST', url, true);

            xhr.setRequestHeader("Content-type", "application/json");

            xhr.send(JSON.stringify(data));
        });
    };

    var script = {
        data() {
            return {
                // is navigation drawer open (on relevant screen sizes)
                drawer: false,

                navigation: [
                    // logged-in navigation items go here...
                    {
                        title: "Profile",
                        path: '/profile'
                    }
                ]
            }
        },

        methods: {
            logOut() {
                this.drawer = false;

                logOut();

                this.$router.replace('/');
            }
        },

        computed: {
            ...vuex.mapGetters(['loggedIn'])
        }
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        if (typeof shadowMode !== 'boolean') {
            createInjectorSSR = createInjector;
            createInjector = shadowMode;
            shadowMode = false;
        }
        // Vue.extend constructor export interop.
        const options = typeof script === 'function' ? script.options : script;
        // render functions
        if (template && template.render) {
            options.render = template.render;
            options.staticRenderFns = template.staticRenderFns;
            options._compiled = true;
            // functional template
            if (isFunctionalTemplate) {
                options.functional = true;
            }
        }
        // scopedId
        if (scopeId) {
            options._scopeId = scopeId;
        }
        let hook;
        if (moduleIdentifier) {
            // server build
            hook = function (context) {
                // 2.3 injection
                context =
                    context || // cached call
                        (this.$vnode && this.$vnode.ssrContext) || // stateful
                        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                // 2.2 with runInNewContext: true
                if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                    context = __VUE_SSR_CONTEXT__;
                }
                // inject component styles
                if (style) {
                    style.call(this, createInjectorSSR(context));
                }
                // register component module identifier for async chunk inference
                if (context && context._registeredComponents) {
                    context._registeredComponents.add(moduleIdentifier);
                }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
        }
        else if (style) {
            hook = shadowMode
                ? function (context) {
                    style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
                }
                : function (context) {
                    style.call(this, createInjector(context));
                };
        }
        if (hook) {
            if (options.functional) {
                // register for functional component in vue file
                const originalRender = options.render;
                options.render = function renderWithStyleInjection(h, context) {
                    hook.call(context);
                    return originalRender(h, context);
                };
            }
            else {
                // inject component registration as beforeCreate hook
                const existing = options.beforeCreate;
                options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
        }
        return script;
    }

    const isOldIE = typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
        return (id, style) => addStyle(id, style);
    }
    let HEAD;
    const styles = {};
    function addStyle(id, css) {
        const group = isOldIE ? css.media || 'default' : id;
        const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
        if (!style.ids.has(id)) {
            style.ids.add(id);
            let code = css.source;
            if (css.map) {
                // https://developer.chrome.com/devtools/docs/javascript-debugging
                // this makes source maps inside style tags work properly in Chrome
                code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
                // http://stackoverflow.com/a/26603875
                code +=
                    '\n/*# sourceMappingURL=data:application/json;base64,' +
                        btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                        ' */';
            }
            if (!style.element) {
                style.element = document.createElement('style');
                style.element.type = 'text/css';
                if (css.media)
                    style.element.setAttribute('media', css.media);
                if (HEAD === undefined) {
                    HEAD = document.head || document.getElementsByTagName('head')[0];
                }
                HEAD.appendChild(style.element);
            }
            if ('styleSheet' in style.element) {
                style.styles.push(code);
                style.element.styleSheet.cssText = style.styles
                    .filter(Boolean)
                    .join('\n');
            }
            else {
                const index = style.ids.size - 1;
                const textNode = document.createTextNode(code);
                const nodes = style.element.childNodes;
                if (nodes[index])
                    style.element.removeChild(nodes[index]);
                if (nodes.length)
                    style.element.insertBefore(textNode, nodes[index]);
                else
                    style.element.appendChild(textNode);
            }
        }
    }

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "v-app",
        [
          _c(
            "v-app-bar",
            { attrs: { app: "app", dark: "dark", color: "white" } },
            [
              _c("router-link", { attrs: { to: "/" } }, [
                _c("img", {
                  staticClass: "mr-1",
                  attrs: { height: "40", src: _vm._f("image")("logo.png") }
                })
              ]),
              _vm.loggedIn
                ? _c(
                    "v-toolbar-items",
                    { staticClass: "d-none d-md-block" },
                    _vm._l(_vm.navigation, function(route, i) {
                      return _c(
                        "v-btn",
                        {
                          key: i,
                          attrs: { text: "text", color: "black", to: route.path }
                        },
                        [_vm._v(_vm._s(route.title))]
                      )
                    }),
                    1
                  )
                : _vm._e(),
              _c("v-spacer"),
              !_vm.loggedIn
                ? _c(
                    "v-toolbar-items",
                    [
                      _c(
                        "v-btn",
                        { attrs: { text: "text", color: "black", to: "/signup" } },
                        [_vm._v("Sign Up")]
                      ),
                      _c(
                        "v-btn",
                        { attrs: { text: "text", color: "black", to: "/login" } },
                        [_vm._v("Log In")]
                      )
                    ],
                    1
                  )
                : _vm._e(),
              _vm.loggedIn
                ? _c(
                    "v-toolbar-items",
                    { staticClass: "d-none d-md-block" },
                    [
                      _c(
                        "v-btn",
                        {
                          attrs: { text: "text", color: "black" },
                          on: {
                            click: function($event) {
                              return _vm.logOut()
                            }
                          }
                        },
                        [_vm._v("Log Out")]
                      )
                    ],
                    1
                  )
                : _vm._e(),
              _vm.loggedIn
                ? _c(
                    "v-btn",
                    {
                      staticClass: "d-md-none",
                      attrs: { fab: "fab", small: "small" },
                      on: {
                        click: function($event) {
                          _vm.drawer = !_vm.drawer;
                        }
                      }
                    },
                    [_c("v-icon", [_vm._v("menu")])],
                    1
                  )
                : _vm._e()
            ],
            1
          ),
          _c(
            "v-content",
            [
              _vm.loggedIn
                ? _c(
                    "v-navigation-drawer",
                    {
                      attrs: {
                        absolute: "absolute",
                        temporary: "temporary",
                        height: "100%"
                      },
                      model: {
                        value: _vm.drawer,
                        callback: function($$v) {
                          _vm.drawer = $$v;
                        },
                        expression: "drawer"
                      }
                    },
                    [
                      _c(
                        "v-list",
                        _vm._l(_vm.navigation, function(route, i) {
                          return _c(
                            "v-list-item",
                            { key: i, attrs: { to: route.path } },
                            [
                              _c(
                                "v-list-item-content",
                                [
                                  _c("v-list-item-title", [
                                    _vm._v(_vm._s(route.title))
                                  ])
                                ],
                                1
                              )
                            ],
                            1
                          )
                        }),
                        1
                      ),
                      _c("template", { slot: "append" }, [
                        _c(
                          "div",
                          { staticClass: "pa-2" },
                          [
                            _c(
                              "v-btn",
                              {
                                attrs: { block: "block" },
                                on: {
                                  click: function($event) {
                                    return _vm.logOut()
                                  }
                                }
                              },
                              [_vm._v("Log Out")]
                            )
                          ],
                          1
                        )
                      ])
                    ],
                    2
                  )
                : _vm._e(),
              _c(
                "v-container",
                { attrs: { fluid: "fluid" } },
                [
                  _c(
                    "v-layout",
                    {
                      attrs: {
                        "align-center": "align-center",
                        "justify-center": "justify-center"
                      }
                    },
                    [_c("router-view", { key: _vm.$route.fullPath })],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = function (inject) {
        if (!inject) return
        inject("data-v-153b0522_0", { source: "\n\n/*# sourceMappingURL=app.vue.map */", map: {"version":3,"sources":["app.vue"],"names":[],"mappings":";;AAEA,kCAAkC","file":"app.vue","sourcesContent":["\n\n/*# sourceMappingURL=app.vue.map */"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__ = normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        false,
        createInjector,
        undefined,
        undefined
      );

    /* script */

    /* template */

      /* style */
      const __vue_inject_styles__$1 = undefined;
      /* scoped */
      const __vue_scope_id__$1 = undefined;
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = undefined;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$1 = normalizeComponent(
        {},
        __vue_inject_styles__$1,
        {},
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        false,
        undefined,
        undefined,
        undefined
      );

    /* script */

    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("rz-layout-responsive", { attrs: { heading: "Welcome!" } }, [
        _c("h3", [_vm._v("This is the homepage")])
      ])
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$2 = undefined;
      /* scoped */
      const __vue_scope_id__$2 = undefined;
      /* module identifier */
      const __vue_module_identifier__$2 = undefined;
      /* functional template */
      const __vue_is_functional_template__$2 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$2 = normalizeComponent(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$2,
        {},
        __vue_scope_id__$2,
        __vue_is_functional_template__$2,
        __vue_module_identifier__$2,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$1 = {
        data: () => ({
            auth: {
                email: "",
                password: "",
                visible: false
            }
        }),
        methods: {
            submit() {

                logIn({
                    email: this.auth.email,
                    password: this.auth.password,
                })
                .then(() => {
                    this.$router.replace('/profile');
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }
    };

    /* script */
    const __vue_script__$1 = script$1;

    /* template */
    var __vue_render__$2 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "rbp-layout-responsive",
        { attrs: { heading: "Log In", align: "align" } },
        [
          _c(
            "v-form",
            [
              _c("v-text-field", {
                attrs: { label: "Email", "prepend-icon": "person" },
                model: {
                  value: _vm.auth.email,
                  callback: function($$v) {
                    _vm.$set(_vm.auth, "email", $$v);
                  },
                  expression: "auth.email"
                }
              }),
              _c("v-text-field", {
                attrs: {
                  "prepend-icon": "lock",
                  "append-icon": _vm.auth.visible ? "visibility" : "visibility_off",
                  label: "Password",
                  type: _vm.auth.visible ? "text" : "password"
                },
                on: {
                  "click:append": function($event) {
                    _vm.auth.visible = !_vm.auth.visible;
                  }
                },
                model: {
                  value: _vm.auth.password,
                  callback: function($$v) {
                    _vm.$set(_vm.auth, "password", $$v);
                  },
                  expression: "auth.password"
                }
              }),
              _c(
                "v-btn",
                {
                  attrs: { color: "primary" },
                  on: {
                    click: function($event) {
                      return _vm.submit()
                    }
                  }
                },
                [_vm._v("Log In")]
              ),
              _c(
                "router-link",
                { staticClass: "float-right", attrs: { to: "/signup" } },
                [_c("Dont", [_vm._v("have an account? Sign up")])],
                1
              ),
              _c("v-spacer", [_c("p")])
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$2 = [];
    __vue_render__$2._withStripped = true;

      /* style */
      const __vue_inject_styles__$3 = undefined;
      /* scoped */
      const __vue_scope_id__$3 = undefined;
      /* module identifier */
      const __vue_module_identifier__$3 = undefined;
      /* functional template */
      const __vue_is_functional_template__$3 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$3 = normalizeComponent(
        { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
        __vue_inject_styles__$3,
        __vue_script__$1,
        __vue_scope_id__$3,
        __vue_is_functional_template__$3,
        __vue_module_identifier__$3,
        false,
        undefined,
        undefined,
        undefined
      );

    //

    var script$2 = {
        data: () => ({
            auth: {
                valid: true,
                name: "",
                email: "",
                nameRules: testUserName,
                emailRules: [ 
                    v => !!v || "Email is required", 
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                    ],
                password: "",
                passwordRules: passwordTests.map(line => { 
                    return (v) => line.test(v) ? true : line.description ;
                    }),
                confirmPassword: "",
                passwordMatch: [v => !!v],
                phone: "",
                visible: false
            },
            rules: {

            }
        }),
        methods: {
            submit() {
                const data = {
                    name: this.auth.name,
                    email: this.auth.email,
                    password: this.auth.password,
                    phone:
                        extractDigits(this.auth.phone)
                            .slice(-10)
                };
                
                signUp(data)
                    .then(() => {
                        this.$router.replace('/profile');
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    };

    /* script */
    const __vue_script__$2 = script$2;

    /* template */
    var __vue_render__$3 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "rbp-layout-responsive",
        { attrs: { heading: "Sign Up", align: "align" } },
        [
          _c(
            "v-form",
            {
              attrs: { "lazy-validation": "lazy-validation" },
              model: {
                value: _vm.valid,
                callback: function($$v) {
                  _vm.valid = $$v;
                },
                expression: "valid"
              }
            },
            [
              _c("v-text-field", {
                attrs: { "prepend-icon": "person", label: "Full Name" },
                model: {
                  value: _vm.auth.name,
                  callback: function($$v) {
                    _vm.$set(_vm.auth, "name", $$v);
                  },
                  expression: "auth.name"
                }
              }),
              _c("v-text-field", {
                attrs: {
                  "prepend-icon": "person",
                  label: "Email",
                  rule: _vm.auth.emailRules
                },
                model: {
                  value: _vm.auth.email,
                  callback: function($$v) {
                    _vm.$set(_vm.auth, "email", $$v);
                  },
                  expression: "auth.email"
                }
              }),
              _c(
                "v-row",
                [
                  _c(
                    "v-col",
                    { attrs: { cols: "12", sm: "6" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          "prepend-icon": "lock",
                          "append-icon": _vm.auth.visible
                            ? "visibility"
                            : "visibility_off",
                          label: "Password",
                          type: _vm.auth.visible ? "text" : "password",
                          rules: _vm.auth.passwordRules
                        },
                        on: {
                          "click:append": function($event) {
                            _vm.auth.visible = !_vm.auth.visible;
                          }
                        },
                        model: {
                          value: _vm.auth.password,
                          callback: function($$v) {
                            _vm.$set(_vm.auth, "password", $$v);
                          },
                          expression: "auth.password"
                        }
                      })
                    ],
                    1
                  ),
                  _c(
                    "v-col",
                    { attrs: { cols: "12", sm: "6" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          "prepend-icon": "lock",
                          "append-icon": _vm.auth.visible
                            ? "visibility"
                            : "visibility_off",
                          label: "Confirm Password",
                          type: _vm.auth.visible ? "text" : "password",
                          rules: _vm.auth.passwordMatch
                        },
                        on: {
                          "click:append": function($event) {
                            _vm.auth.visible = !_vm.auth.visible;
                          }
                        },
                        model: {
                          value: _vm.auth.confirmPassword,
                          callback: function($$v) {
                            _vm.$set(_vm.auth, "confirmPassword", $$v);
                          },
                          expression: "auth.confirmPassword"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _c(
                "v-cols",
                { attrs: { cols: "12", sm: "6" } },
                [
                  _c("v-text-field", {
                    directives: [
                      {
                        name: "mask",
                        rawName: "v-mask",
                        value: "+1(###)-###-####",
                        expression: "'+1(###)-###-####'"
                      }
                    ],
                    attrs: { "prepend-icon": "phone", label: "Phone Number" },
                    model: {
                      value: _vm.auth.phone,
                      callback: function($$v) {
                        _vm.$set(_vm.auth, "phone", $$v);
                      },
                      expression: "auth.phone"
                    }
                  })
                ],
                1
              ),
              _c(
                "v-btn",
                {
                  attrs: { color: "success" },
                  on: {
                    click: function($event) {
                      return _vm.submit()
                    }
                  }
                },
                [_vm._v("Sign Up")]
              ),
              _c(
                "router-link",
                { staticClass: "float-right", attrs: { to: "/login" } },
                [_vm._v("Log in instead")]
              ),
              _c("v-spacer", [_c("p")])
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$3 = [];
    __vue_render__$3._withStripped = true;

      /* style */
      const __vue_inject_styles__$4 = undefined;
      /* scoped */
      const __vue_scope_id__$4 = undefined;
      /* module identifier */
      const __vue_module_identifier__$4 = undefined;
      /* functional template */
      const __vue_is_functional_template__$4 = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$4 = normalizeComponent(
        { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
        __vue_inject_styles__$4,
        __vue_script__$2,
        __vue_scope_id__$4,
        __vue_is_functional_template__$4,
        __vue_module_identifier__$4,
        false,
        undefined,
        undefined,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //


    var script$3 = {
        props: ['heading']
    };

    /* script */
    const __vue_script__$3 = script$3;

    /* template */
    var __vue_render__$4 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "v-container",
        {
          attrs: {
            fluid: "fluid",
            row: "row",
            "justify-center": "justify-center",
            "align-center": "align-center"
          }
        },
        [
          _c(
            "v-flex",
            {
              attrs: {
                xl8: "xl8",
                lg8: "lg8",
                md8: "md8",
                sm10: "sm10",
                xs12: "xs12",
                "align-center": "align-center"
              }
            },
            [
              _c(
                "v-card",
                { staticClass: "rbp-layout-responsive__content" },
                [
                  !!_vm.heading
                    ? _c("v-card-title", [_c("h3", [_vm._v(_vm._s(_vm.heading))])])
                    : _vm._e(),
                  _c("v-card-text", [_vm._t("default")], 2)
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$4 = [];
    __vue_render__$4._withStripped = true;

      /* style */
      const __vue_inject_styles__$5 = function (inject) {
        if (!inject) return
        inject("data-v-edb7d99a_0", { source: ".rbp-layout-responsive__content[data-v-edb7d99a] {\n  max-width: 800px;\n  margin-left: auto;\n  margin-right: auto;\n}\n", map: {"version":3,"sources":["/home/gabe/Projects/canduma/web/vue/layouts/responsive.vue","responsive.vue"],"names":[],"mappings":"AAUA;EACA,gBAAA;EACA,iBAAA;EACA,kBAAA;ACTA","file":"responsive.vue","sourcesContent":["<template lang=\"pug\">\n    v-container(fluid row justify-center align-center)\n        v-flex(xl8 lg8 md8 sm10 xs12 align-center)\n            v-card.rbp-layout-responsive__content\n                v-card-title(v-if=\"!!heading\")\n                    h3 {{heading}}\n                v-card-text\n                    slot\n</template>\n<style lang=\"stylus\" scoped>\n    .rbp-layout-responsive__content {\n        max-width: 800px;\n        margin-left: auto;\n        margin-right: auto;\n    }\n</style>\n<script>\n\n    export default {\n        props: ['heading']\n    }\n\n</script>",".rbp-layout-responsive__content {\n  max-width: 800px;\n  margin-left: auto;\n  margin-right: auto;\n}\n"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$5 = "data-v-edb7d99a";
      /* module identifier */
      const __vue_module_identifier__$5 = undefined;
      /* functional template */
      const __vue_is_functional_template__$5 = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$5 = normalizeComponent(
        { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
        __vue_inject_styles__$5,
        __vue_script__$3,
        __vue_scope_id__$5,
        __vue_is_functional_template__$5,
        __vue_module_identifier__$5,
        false,
        createInjector,
        undefined,
        undefined
      );

    // later we can add element imports here...

    // TODO: fragment pages into separate files to be loaded on-demand
    const pages = {
        Profile: __vue_component__$1,
        Index: __vue_component__$2,
        Login: __vue_component__$3,
        Signup: __vue_component__$4
    };

    const layouts = {
        Responsive: __vue_component__$5
    };

    const elements = {
        // declare elements here
    };

    const routes = [
        {name: 'index', path: '/', component: pages.Index},
        {name: 'login', path: '/login', component: pages.Login},
        {name: 'signup', path: '/signup', component: pages.Signup},
        {name: 'profile', path: '/profile', component: pages.Profile}
    ];

    const loggedOutRoutes = ['index', 'login', 'signup'];

    const router = new VueRouter({routes});

    router.beforeEach((destination, origin, next) => {
        waitForLogin()
            .then(() => {

                next();
            }, (err) => {
                // TODO: save desired route for post-login

                if (loggedOutRoutes.includes(destination.name)) {
                    next();
                } else {
                    router.push('/login');
                }
            });
    });

    const createSession = (user = null) => {
        return {
            user

            // TODO: maybe add more stuff here?
        }
    };

    const session = {
        ...createSession() // create null session
    };

    const states = {
        INDETERMINATE: unique(),
        LOGGED_OUT: unique(),
        LOGGED_IN: unique()
    };

    const waitForLogin = () => {
        if (store.state.loggedInStatus === states.INDETERMINATE) {
            return new Promise((win, fail) => {
            });
        } else {
            return new Promise((win, fail) => {
                if (store.state.loggedInStatus === states.LOGGED_IN) {
                    win();
                } else {
                    fail();
                }
            });
        }
    };

    const unauthenticate = () => {

        localStorage.removeItem('user');

        store.dispatch('endSession');

        Object.assign(session, createSession()); // remove session
    };

    const authenticate = (user, fromSession = false) => {

        if (!fromSession) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        store.dispatch('startSession', {user});

        Object.assign(session, createSession(user));
    };

    const logIn = (params) => {
        return post('auth/login', params)
            .then(({err, user}) => {
                if (err) {
                    return {err, success: false};
                } else {
                    authenticate(user);

                    return {err: null, success: true};
                }
            });
    };

    const logOut = () => {

        post('auth/logout')
            .then(({success}) => {
                if (success) {
                    unauthenticate();
                }
            });
    };

    const signUp = (params) => {
        return post('auth/signup', params)
            .then(({err, user}) => {

                if (err) {
                    return {err, success: false};
                } else {
                    authenticate(user);

                    return {err: null, success: true};
                }
            });
    };

    const resolveLoggedInStatus = () => {
        
        get('profile/get-profile')
            .then(({success, user}) => {

                if (success) {
                    authenticate(user);
                } else {
                    unauthenticate();
                }
            })
            .catch(() => {
                unauthenticate();
            });
    };

    const store = new vuex__default.Store({
        state: {
            user: null,

            loggedInStatus: states.INDETERMINATE
        },

        mutations: {
            SET_SESSION(state, user) {
                state.user = user;
            },

            UNSET_SESSION(state) {
                state.user = null;
            },

            SET_LOGGED_IN_STATUS(state, status) {
                state.loggedInStatus = status;
            },
        },

        getters: {
            loggedIn(state) {
                return state.user !== null;
            }
        },

        actions: {

            startSession(ctxt, {session, user}) {
                ctxt.dispatch('setLoggedInStatus', states.LOGGED_IN);

                ctxt.commit('SET_SESSION', user);
            },

            endSession(ctxt) {
                ctxt.dispatch('setLoggedInStatus', states.LOGGED_OUT);

                ctxt.commit('UNSET_SESSION');
            },

            setLoggedInStatus(ctxt, status) {
                ctxt.commit('SET_LOGGED_IN_STATUS', status);
            }
        }
    });

    // the namespace to use for your custom elements
    const ns = 'Rbp';

    Vue.use(vuex__default);
    Vue.use(Vuetify);
    Vue.use(VueTheMask);

    Vue.filter('image', (subPath) => {
        return `assets/images/${subPath}`;
    });

    // register the layouts as global components
    Object.entries(layouts)
        .forEach(([name, component]) => {
            Vue.component(`${ns}Layout${name}`, component);
        });

    // register the layouts as global components
    Object.entries(elements)
        .forEach(([name, component]) => {
            Vue.component(`${ns}${name}`, component);
        });


    window.onload = () => {
        const app = new Vue({
            el: '#app-mount',

            router,
            store,

            vuetify: new Vuetify(),

            render(renderer) {

                return renderer(__vue_component__);
            },

            created() {

                resolveLoggedInStatus();
            }
        });
    };

}(Vue, Vuetify, VueTheMask, Vuex, VueRouter, validator));
