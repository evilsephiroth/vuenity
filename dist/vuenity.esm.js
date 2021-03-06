function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var LoggingService = /*#__PURE__*/function () {
  function LoggingService() {
    _classCallCheck(this, LoggingService);
  }

  _createClass(LoggingService, [{
    key: "warnUnityContentRemoveNotAvailable",
    value: function warnUnityContentRemoveNotAvailable(additionalDetails) {
      this.warn("Your version of Unity does not support unloading the WebGL Player.", "This prevents VueUnityWebGL from unmounting this component properly.", "Please consider updating to Unity 2019.1 or newer, or reload the page", "to free the WebGL Player from the memory. See the follow link for more details:", "https://github.com/elraccoone/react-unity-webgl/issues/22", additionalDetails);
    }
  }, {
    key: "errorUnityLoaderNotFound",
    value: function errorUnityLoaderNotFound(additionalDetails) {
      this.error("Unable to use the Unity Loader, please make sure you've imported", "the Unity Loader the correct way. You might have entered an incorrect", "path to the UnityLoader.js. The path is not relative to your bundle,", "but to your index html file. See the follow link for more details: ", "https://github.com/elraccoone/react-unity-webgl/issues/31", additionalDetails);
    }
  }, {
    key: "warn",
    value: function warn() {
      var arguments$1 = arguments;

      for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
        messages[_key] = arguments$1[_key];
      }

      // eslint-disable-next-line
      console.warn(messages.filter(function (_) {
        return typeof _ !== "undefined";
      }).join(" "));
    }
  }, {
    key: "error",
    value: function error() {
      var arguments$1 = arguments;

      for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        messages[_key2] = arguments$1[_key2];
      }

      // eslint-disable-next-line
      console.error(messages.filter(function (_) {
        return typeof _ !== "undefined";
      }).join(" "));
    }
  }]);

  return LoggingService;
}();

var loggingService = new LoggingService();

var _default = /*#__PURE__*/function () {
  function _default() {
    _classCallCheck(this, _default);

    this.documentHead = document.getElementsByTagName("head")[0];
  }

  _createClass(_default, [{
    key: "append",
    value: function append(source, onLoad) {
      var _this = this;

      if (typeof this.unityLoaderScript !== "undefined") { if (source === this.unityLoaderScript.src) {
        return onLoad();
      } else {
        this.unityLoaderScript.remove();
      } }
      window.fetch(source).then(function (_response) {
        if (_response.status >= 400) { return loggingService.errorUnityLoaderNotFound(_response.status); }

        _response.text().then(function (_text) {
          if (_text.trim().charAt(0) === "<") { return loggingService.errorUnityLoaderNotFound("error doc"); }
          _this.unityLoaderScript = document.createElement("script");
          _this.unityLoaderScript.type = "text/javascript";
          _this.unityLoaderScript.async = true;
          _this.unityLoaderScript.src = source;

          _this.unityLoaderScript.onload = function () {
            if (typeof window.UnityLoader === "undefined") { return loggingService.errorUnityLoaderNotFound(); }
            onLoad();
          };

          _this.documentHead.appendChild(_this.unityLoaderScript);
        })["catch"](function (_reason) {
          return loggingService.errorUnityLoaderNotFound(_reason);
        });
      })["catch"](function (_reason) {
        return loggingService.errorUnityLoaderNotFound(_reason);
      });
    }
  }]);

  return _default;
}();

//
var script = {
  name: "vuenity",
  props: ["unityContent", "width", "height"],
  data: function data() {
    return {
      unityLoaderService: new _default(),
      onWindowResizeBinding: this.onWindowResize.bind(this),
      state: {}
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.unityContent.setComponentInstance(this);
    window.addEventListener("resize", this.onWindowResizeBinding);
    this.unityLoaderService.append(this.unityContent.unityLoaderJsPath, function () {
      _this.unityContent.setUnityInstance( // eslint-disable-next-line
      UnityLoader.instantiate("__VueUnityWebGL_".concat(_this.unityContent.uniqueID, "__"), _this.unityContent.buildJsonPath, {
        onProgress: _this.onProgress.bind(_this),
        Module: _this.unityContent.unityConfig.modules,
        width: "100%",
        height: "100%"
      }));
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.unityContent.remove();
    window.removeEventListener("resize", this.onWindowResizeBinding);
  },
  methods: {
    onProgress: function onProgress(unityInstance, progression) {
      this.unityContent.triggerUnityEvent("progress", progression);
      if (progression == 1) { this.unityContent.triggerUnityEvent("loaded"); }
    },
    onWindowResize: function onWindowResize() {
      if (this.unityContent.unityConfig.adjustOnWindowResize === true) {
        this.unityContent.triggerUnityEvent("resized");
        this.adjustCanvasToContainer();
      }
    },
    adjustCanvasToContainer: function adjustCanvasToContainer() {
      var width = this.$refs.wrapper.offsetWidth;
      var height = this.$refs.wrapper.offsetHeight;
      var canvas = this.$refs.wrapper.getElementsByTagName("canvas")[0];

      if (canvas !== null) {
        if (canvas.height !== height) { canvas.height = height; }
        if (canvas.width !== width) { canvas.width = width; }
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}

var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      ref: "wrapper",
      attrs: {
        id: "__VueUnityWebGL_" + this.unityContent.uniqueID + "__",
        width: _vm.width || "800px",
        height: _vm.height || "600px"
      }
    },
    [_c("div", { attrs: { id: "unityPlayer" } })]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-381b3a7a_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"vuenity.vue"}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    browser,
    undefined,
    undefined
  );

var UnityContent = /*#__PURE__*/function () {
  function UnityContent(buildJsonPath, unityLoaderJsPath, unityConfig) {
    _classCallCheck(this, UnityContent);

    var _unityConfig = unityConfig || {};

    this.buildJsonPath = buildJsonPath;
    this.unityLoaderJsPath = unityLoaderJsPath;
    this.uniqueID = ++UnityContent.uniqueID;
    this.unityEvents = [];
    this.unityConfig = {
      modules: _unityConfig.modules || {},
      unityVersion: _unityConfig.unityVersion || "undefined",
      adjustOnWindowResize: _unityConfig.adjustOnWindowResize,
      id: _unityConfig.id || "nill"
    };
    if (typeof window.VueUnityWebGL === "undefined") { window.VueUnityWebGL = {}; }
  }

  _createClass(UnityContent, [{
    key: "setComponentInstance",
    value: function setComponentInstance(unityComponentInstance) {
      this.unityComponent = unityComponentInstance;
    }
  }, {
    key: "setUnityInstance",
    value: function setUnityInstance(unityInstance) {
      this.unityInstance = unityInstance;
    }
  }, {
    key: "setFullscreen",
    value: function setFullscreen(fullscreen) {
      if (this.unityInstance != null) {
        this.unityInstance.SetFullscreen(fullscreen === true ? 1 : 0);
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this = this;

      if (typeof this.unityInstance !== "undefined" && typeof this.unityInstance.Quit === "function") { return this.unityInstance.Quit(function () {
        _this.triggerUnityEvent("quitted");

        _this.unityInstance = undefined;
      }); }
      return loggingService.warnUnityContentRemoveNotAvailable();
    }
  }, {
    key: "send",
    value: function send(gameObjectName, methodName, parameter) {
      if (this.unityInstance != null) {
        if (typeof parameter === "undefined") {
          this.unityInstance.SendMessage(gameObjectName, methodName);
        } else {
          this.unityInstance.SendMessage(gameObjectName, methodName, parameter);
        }
      }
    }
  }, {
    key: "on",
    value: function on(eventName, eventCallback) {
      this.unityEvents.push({
        eventName: eventName,
        eventCallback: eventCallback
      });

      window.VueUnityWebGL[eventName] = function (parameter) {
        return eventCallback(parameter);
      };
    }
  }, {
    key: "triggerUnityEvent",
    value: function triggerUnityEvent(eventName, eventValue) {
      for (var _i = 0; _i < this.unityEvents.length; _i++) {
        if (this.unityEvents[_i].eventName === eventName) { this.unityEvents[_i].eventCallback(eventValue); }
      }
    }
  }]);

  return UnityContent;
}();

_defineProperty(UnityContent, "uniqueID", 0);

function install(Vue) {
  if (install.installed) { return; }
  install.installed = true;
  Vue.component("Vuenity", __vue_component__);
}
var plugin = {
  install: install
};
var GlobalVue = null;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}
 //export { UnityContent } from "./unity-content";

export default __vue_component__;
export { UnityContent, __vue_component__ as Vuenity, install };
