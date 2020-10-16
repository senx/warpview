(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "TUjb":
/*!*********************************************************************************************************!*\
  !*** /home/xavier/workspace/warpview-editor/node_modules/@giwisoft/wc-tabs/dist/esm/wc-tabs_3.entry.js ***!
  \*********************************************************************************************************/
/*! exports provided: wc_tabs, wc_tabs_content, wc_tabs_header */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wc_tabs", function() { return WCTabs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wc_tabs_content", function() { return StcTabContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wc_tabs_header", function() { return StcTabHeader; });
/* harmony import */ var _home_xavier_workspace_warpview_editor_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /home/xavier/workspace/warpview-editor/node_modules/@babel/runtime/regenerator */ "VtSi");
/* harmony import */ var _home_xavier_workspace_warpview_editor_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! /home/xavier/workspace/warpview-editor/node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "QsI/");
/* harmony import */ var _home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! /home/xavier/workspace/warpview-editor/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "zygG");
/* harmony import */ var _home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! /home/xavier/workspace/warpview-editor/node_modules/@babel/runtime/helpers/esm/classCallCheck */ "9fIP");
/* harmony import */ var _home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! /home/xavier/workspace/warpview-editor/node_modules/@babel/runtime/helpers/esm/createClass */ "MMYH");
/* harmony import */ var _index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./index-e1039881.js */ "smsy");






var wcTabsCss = ":host{height:100%;height:-moz-available;height:-webkit-fill-available;height:stretch;width:100%;width:-moz-available;width:-webkit-fill-available;width:stretch;overflow:hidden;overflow-y:auto;display:flex;flex-direction:column}:host .wc-tabs-headers-wrapper{display:flex}:host .wc-tabs-headers-wrapper .wc-tabs-header{border-bottom:1px solid var(--wc-tab-header-border-color, #dee2e6);display:flex}:host .wc-tabs-content{height:100%;width:100%;display:block;overflow-x:hidden;overflow-y:auto;padding:0}";

var WCTabs = /*#__PURE__*/function () {
  function WCTabs(hostRef) {
    Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, WCTabs);

    Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["r"])(this, hostRef);
    this.selection = -1;
    this.selectedIndice = -1;
  }

  Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(WCTabs, [{
    key: "onExternalSelection",
    value: function onExternalSelection(newValue, _oldValue) {
      if (newValue != this.selectedIndice) {
        this.selectGroupFromIndice(newValue);
        this.selectedIndice = newValue;
      }
    }
  }, {
    key: "selectGroupFromIndice",
    value: function selectGroupFromIndice(i) {
      this.selectGroup(this.tabGroup[i % this.tabGroup.length]);
    } // noinspection JSUnusedGlobalSymbols

  }, {
    key: "componentDidLoad",
    value: function componentDidLoad() {
      var _this = this;

      this.createGroup().then(function () {
        if (_this.selection >= 0) {
          _this.selectGroupFromIndice(_this.selection);
        } else {
          var _this$tabGroup = Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_this.tabGroup, 1),
              group = _this$tabGroup[0];

          _this.selectGroup(group);
        }
      });
    }
  }, {
    key: "onSelectedTab",
    value: function onSelectedTab(event) {
      if (this.tabGroup) {
        var group = this.tabGroup.find(function (group) {
          return group.header.id === event.detail.id;
        });
        this.selectGroup(group);
      }
    }
  }, {
    key: "createGroup",
    value: function createGroup() {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.tabsHeader = [];
        _this2.tabsContent = [];
        var headers = [];
        var contents = [];
        var tabsHeaderEl = Array.from(_this2.host.querySelectorAll('wc-tabs-header'));
        tabsHeaderEl.map(function (el) {
          return headers.push(el.getChild());
        });
        var tabsContentEl = Array.from(_this2.host.querySelectorAll('wc-tabs-content'));
        tabsContentEl.map(function (el) {
          return contents.push(el.getChild());
        });
        Promise.all(headers).then(function (rh) {
          rh.map(function (h) {
            return _this2.tabsHeader.push(h);
          });
          Promise.all(contents).then(function (rc) {
            rc.map(function (c) {
              return _this2.tabsContent.push(c);
            });
            _this2.tabGroup = _this2.tabsHeader.map(function (header) {
              var content = _this2.tabsContent.find(function (content) {
                return content.name === header.name;
              });

              return {
                header: header,
                content: content
              };
            });
            resolve();
          });
        });
      });
    }
  }, {
    key: "selectGroup",
    value: function selectGroup(group) {
      this.tabGroup.forEach(function (t) {
        t.header.unselect();
        t.content.unselect();
      });
      group.header.select();
      group.content.select();
    }
  }, {
    key: "render",
    value: function render() {
      // noinspection JSXNamespaceValidation
      return [Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("div", {
        class: "wc-tabs-headers-wrapper"
      }, Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("div", {
        class: "wc-tabs-header"
      }, Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("slot", {
        name: "header"
      }))), Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("div", {
        class: "wc-tabs-content"
      }, Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("slot", {
        name: "content"
      }))];
    }
  }, {
    key: "host",
    get: function get() {
      return Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["g"])(this);
    }
  }], [{
    key: "watchers",
    get: function get() {
      return {
        "selection": ["onExternalSelection"]
      };
    }
  }]);

  return WCTabs;
}();

WCTabs.style = wcTabsCss;
var wcTabsContentCss = "wc-tabs-content{height:100%}wc-tabs-content .wc-tab-content{display:none;height:100%}wc-tabs-content .wc-tab-content-selected{display:block}wc-tabs-content .wc-tab-content-responsive{height:100%;width:100%}";

var StcTabContent = /*#__PURE__*/function () {
  function StcTabContent(hostRef) {
    Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, StcTabContent);

    Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["r"])(this, hostRef);
    this.responsive = false;
    this.isSelected = false;
  }
  /**
   *
   * @returns {Promise<IWcTabContentData>}
   */


  Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(StcTabContent, [{
    key: "getChild",
    value: function () {
      var _getChild = Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var _this3 = this;

        return _home_xavier_workspace_warpview_editor_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", new Promise(function (resolve) {
                  return resolve({
                    select: _this3.select.bind(_this3),
                    unselect: _this3.unselect.bind(_this3),
                    name: _this3.name
                  });
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getChild() {
        return _getChild.apply(this, arguments);
      }

      return getChild;
    }()
    /**
     *
     */

  }, {
    key: "unselect",
    value: function unselect() {
      this.isSelected = false;
    }
    /**
     *
     */

  }, {
    key: "select",
    value: function select() {
      this.isSelected = true;
    }
  }, {
    key: "render",
    value: function render() {
      var classes = {
        'wc-tab-content': true,
        'wc-tab-content-selected': this.isSelected,
        'wc-tab-content-responsive': this.responsive
      };
      return Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("div", {
        class: classes
      }, Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("slot", null));
    }
  }]);

  return StcTabContent;
}();

StcTabContent.style = wcTabsContentCss;

var Utils = /*#__PURE__*/function () {
  function Utils() {
    Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, Utils);
  }

  Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(Utils, null, [{
    key: "isUndefined",

    /**
     *
     * @param value
     * @returns {boolean}
     */
    value: function isUndefined(value) {
      return value === undefined || value === 'undefined';
    }
    /**
     *
     * @returns {string}
     */

  }, {
    key: "generateId",
    value: function generateId() {
      return Math.random().toString(36).substr(2, 10);
    }
  }]);

  return Utils;
}();

var wcTabsHeaderCss = ":host .wc-tab-header{padding:0.5rem 1rem;cursor:pointer;display:flex;justify-content:center;align-items:center;background-color:var(--wc-tab-header-bg-color, transparent);color:var(--wc-tab-header-color, #007bff);text-decoration:none;border-top-left-radius:0.25rem;border-top-right-radius:0.25rem;border-color:1px solid var(--wc-tab-header-border-color, #dee2e6) var(--wc-tab-header-border-color, #dee2e6) transparent;margin-bottom:-1px}@media (max-width: 599px){:host .wc-tab-header{min-width:100px}}:host .wc-tab-header-selected{color:var(--wc-tab-header-selected-color, #495057);background-color:var(--wc-tab-header-selected-bg-color, #fff);border-color:var(--wc-tab-header-selected-border-color, #dee2e6) var(--wc-tab-header-selected-border-color, #dee2e6) var(--wc-tab-header-selected-bg-color, #fff)}:host .wc-tab-header-disabled{pointer-events:none;cursor:default;color:var(--wc-tab-header-disabled-color, #6c757d);background-color:var(--wc-tab-header-disabled-bg-color, transparent);border-color:var(--wc-tab-header-disabled-border-color, #dee2e6) var(--wc-tab-header-disabled-border-color, #dee2e6) var(--wc-tab-header-disabled-bg-color, #fff)}";

var StcTabHeader = /*#__PURE__*/function () {
  function StcTabHeader(hostRef) {
    Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, StcTabHeader);

    Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["r"])(this, hostRef);
    this.tabSelect = Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["c"])(this, "tabSelect", 7);
    this.id = Utils.generateId();
    this.isSelected = false;
  }

  Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(StcTabHeader, [{
    key: "getChild",
    value: function () {
      var _getChild2 = Object(_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_home_xavier_workspace_warpview_editor_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        var _this4 = this;

        return _home_xavier_workspace_warpview_editor_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(function (resolve) {
                  return resolve({
                    select: _this4.handleSelect.bind(_this4),
                    unselect: _this4.unselect.bind(_this4),
                    name: _this4.name,
                    id: _this4.id
                  });
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getChild() {
        return _getChild2.apply(this, arguments);
      }

      return getChild;
    }()
    /**
     *
     */

  }, {
    key: "unselect",
    value: function unselect() {
      this.isSelected = false;
    }
    /**
     *
     */

  }, {
    key: "handleSelect",
    value: function handleSelect() {
      this.isSelected = true;
    }
    /**
     *
     */

  }, {
    key: "onClick",
    value: function onClick() {
      var _this5 = this;

      if (!this.disabled) {
        this.getChild().then(function (child) {
          return _this5.tabSelect.emit(child);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var classes = {
        'wc-tab-header': true,
        'wc-tab-header-selected': this.isSelected,
        'wc-tab-header-disabled': this.disabled
      }; // noinspection JSXNamespaceValidation

      return Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("div", {
        class: classes,
        onClick: this.onClick.bind(this)
      }, Object(_index_e1039881_js__WEBPACK_IMPORTED_MODULE_5__["h"])("slot", null));
    }
  }]);

  return StcTabHeader;
}();

StcTabHeader.style = wcTabsHeaderCss;


/***/ })

}]);