(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC9hcHAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<app-header></app-header>\n\n\n<div *ngIf=\"settings\" class=\"container-fluid main bg-{{settings.theme}} {{settings.theme === 'dark'?'text-white': ''}} full-height\">\n  <router-outlet></router-outlet>\n</div>\n\n<footer class=\"bg-dark text-white\">\n  <div class=\"container\">\n    <div class=\"row pt-4\">\n      <div class=\"col-md-4 col-12 text-center\">\n        <a href=\"https://senx.io\" target=\"_blank\"rel=\"noopener\">\n          <img src=\"/assets/img/senx-100.png\" class=\"logo\" alt=\"\">\n        </a>\n        <p>Copyright &copy; 2018 SenX S.A.S.</p>\n      </div>\n      <div class=\"col-md-4 col-12\">\n        <ul class=\"list-unstyled\">\n          <li><a href=\"https://senx.io/legal\" target=\"_blank\"rel=\"noopener\">Terms and conditions <i\n            class=\"fa fa-external-link\"\n            aria-hidden=\"true\"></i></a></li>\n          <li><a href=\"https://senx.io\" target=\"_blank\"rel=\"noopener\">SenX <i\n            class=\"fa fa-external-link\"\n            aria-hidden=\"true\"></i></a></li>\n          <li><a href=\"https://blog.senx.io\" target=\"_blank\" aria-label=\"Blog\" rel=\"noopener\">Blog <i\n            class=\"fa fa-external-link\"\n            aria-hidden=\"true\"></i></a></li>\n          <li><a href=\"https://www.warp10.io/\" target=\"_blank\" aria-label=\"Warp 10\" rel=\"noopener\">Warp&nbsp;10<sup>&trade;</sup>&nbsp;<i\n            class=\"fa fa-external-link\" aria-hidden=\"true\"></i>\n          </a></li>\n        </ul>\n      </div>\n      <div class=\"col-md-4 col-12 text-center\">\n        <div class=\"row ftco-footer-social\">\n          <div class=\"col-lg-3 col-md-6 col-sm-6 ftco-footer-widget mb-4\">\n            <a href=\"https://twitter.com/senxhq\" target=\"_blank\" aria-label=\"Twitter\" rel=\"noopener\"\n               tooltip=\"@SenXHQ\">\n              <span><i class=\"fa fa-fw fa-twitter\"></i></span>\n            </a>\n          </div>\n          <div class=\"col-lg-3 col-md-6 col-sm-6 ftco-footer-widget mb-4\">\n            <a href=\"mailto:contact@senx.io\" target=\"_blank\" aria-label=\"Email\" rel=\"noopener\"\n               tooltip=\"contact@senx.io\">\n              <span><i class=\"fa fa-fw fa-envelope\"></i></span>\n            </a>\n          </div>\n          <div class=\"col-lg-3 col-md-6 col-sm-6 ftco-footer-widget mb-4\">\n            <a href=\"https://github.com/senx\" target=\"_blank\" aria-label=\"Github\" rel=\"noopener\"\n               tooltip=\"senx\">\n              <span><i class=\"fa fa-fw fa-github\"></i></span>\n            </a>\n          </div>\n          <div class=\"col-lg-3 col-md-6 col-sm-6 ftco-footer-widget mb-4\">\n            <a href=\"https://www.linkedin.com/company/senx\" target=\"_blank\" aria-label=\"LinkedIn\" rel=\"noopener\"\n               tooltip=\"SenX\">\n              <span><i class=\"fa fa-fw fa-linkedin\"></i></span>\n            </a>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</footer>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var picoevent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! picoevent */ "./node_modules/picoevent/picoevent.es5.js");
/* harmony import */ var _model_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model/settings */ "./src/app/model/settings.ts");
/* harmony import */ var _model_settings_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model/settings-message */ "./src/app/model/settings-message.ts");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = /** @class */ (function () {
    function AppComponent(pico) {
        this.pico = pico;
        this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_2__["Settings"]();
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.channelSubscription = this.pico.listen(_model_settings_message__WEBPACK_IMPORTED_MODULE_3__["SettingsMessage"], function (evt) {
            if (evt.value) {
                _this.settings = evt.value;
            }
            else {
                _this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_2__["Settings"]();
            }
        });
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [picoevent__WEBPACK_IMPORTED_MODULE_1__["PicoEvent"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/service-worker */ "./node_modules/@angular/service-worker/fesm5/service-worker.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _components_header_header_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/header/header.component */ "./src/app/components/header/header.component.ts");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./home/home.component */ "./src/app/home/home.component.ts");
/* harmony import */ var _ngx_prism_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngx-prism/core */ "./node_modules/@ngx-prism/core/dist/index.js");
/* harmony import */ var picoevent__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! picoevent */ "./node_modules/picoevent/picoevent.es5.js");
/* harmony import */ var _senx_warpview_dist_warpview__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @senx/warpview/dist/warpview */ "./node_modules/@senx/warpview/dist/warpview.js");
/* harmony import */ var _senx_warpview_dist_warpview__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_senx_warpview_dist_warpview__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _tiles_welcome_welcome_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./tiles/welcome/welcome.component */ "./src/app/tiles/welcome/welcome.component.ts");
/* harmony import */ var _components_tile_wrapper_tile_wrapper_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/tile-wrapper/tile-wrapper.component */ "./src/app/components/tile-wrapper/tile-wrapper.component.ts");
/* harmony import */ var _directives_ad_directive__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./directives/ad.directive */ "./src/app/directives/ad.directive.ts");
/* harmony import */ var _tiles_plot_plot_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./tiles/plot/plot.component */ "./src/app/tiles/plot/plot.component.ts");
/* harmony import */ var _tiles_map_map_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./tiles/map/map.component */ "./src/app/tiles/map/map.component.ts");
/* harmony import */ var _tiles_text_text_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./tiles/text/text.component */ "./src/app/tiles/text/text.component.ts");
/* harmony import */ var _tiles_bubbles_bubbles_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./tiles/bubbles/bubbles.component */ "./src/app/tiles/bubbles/bubbles.component.ts");
/* harmony import */ var _tiles_default_default_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./tiles/default/default.component */ "./src/app/tiles/default/default.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _tiles_step_step_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./tiles/step/step.component */ "./src/app/tiles/step/step.component.ts");
/* harmony import */ var _tiles_area_area_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./tiles/area/area.component */ "./src/app/tiles/area/area.component.ts");
/* harmony import */ var _tiles_scatter_scatter_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./tiles/scatter/scatter.component */ "./src/app/tiles/scatter/scatter.component.ts");
/* harmony import */ var _tiles_bar_bar_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./tiles/bar/bar.component */ "./src/app/tiles/bar/bar.component.ts");
/* harmony import */ var _tiles_gauge_gauge_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./tiles/gauge/gauge.component */ "./src/app/tiles/gauge/gauge.component.ts");
/* harmony import */ var _tiles_pie_pie_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./tiles/pie/pie.component */ "./src/app/tiles/pie/pie.component.ts");
/* harmony import */ var _tiles_doughnut_doughnut_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./tiles/doughnut/doughnut.component */ "./src/app/tiles/doughnut/doughnut.component.ts");
/* harmony import */ var _tiles_polar_polar_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./tiles/polar/polar.component */ "./src/app/tiles/polar/polar.component.ts");
/* harmony import */ var _tiles_radar_radar_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./tiles/radar/radar.component */ "./src/app/tiles/radar/radar.component.ts");
/* harmony import */ var _tiles_image_image_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./tiles/image/image.component */ "./src/app/tiles/image/image.component.ts");
/* harmony import */ var _tiles_tile_tile_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./tiles/tile/tile.component */ "./src/app/tiles/tile/tile.component.ts");
/* harmony import */ var _tiles_annotation_annotation_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./tiles/annotation/annotation.component */ "./src/app/tiles/annotation/annotation.component.ts");
/* harmony import */ var _tiles_gts_tree_gts_tree_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./tiles/gts-tree/gts-tree.component */ "./src/app/tiles/gts-tree/gts-tree.component.ts");
/* harmony import */ var _tiles_drilldown_drilldown_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./tiles/drilldown/drilldown.component */ "./src/app/tiles/drilldown/drilldown.component.ts");
/* harmony import */ var _tiles_datagrid_datagrid_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./tiles/datagrid/datagrid.component */ "./src/app/tiles/datagrid/datagrid.component.ts");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






































var appRoutes = [
    { path: '', component: _home_home_component__WEBPACK_IMPORTED_MODULE_10__["HomeComponent"] },
    {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
    },
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"],
                _directives_ad_directive__WEBPACK_IMPORTED_MODULE_16__["AdDirective"],
                _components_header_header_component__WEBPACK_IMPORTED_MODULE_9__["HeaderComponent"],
                _home_home_component__WEBPACK_IMPORTED_MODULE_10__["HomeComponent"],
                _tiles_welcome_welcome_component__WEBPACK_IMPORTED_MODULE_14__["WelcomeComponent"],
                _components_tile_wrapper_tile_wrapper_component__WEBPACK_IMPORTED_MODULE_15__["TileWrapperComponent"],
                _tiles_plot_plot_component__WEBPACK_IMPORTED_MODULE_17__["PlotComponent"],
                _tiles_map_map_component__WEBPACK_IMPORTED_MODULE_18__["MapComponent"],
                _tiles_text_text_component__WEBPACK_IMPORTED_MODULE_19__["TextComponent"],
                _tiles_bubbles_bubbles_component__WEBPACK_IMPORTED_MODULE_20__["BubblesComponent"],
                _tiles_default_default_component__WEBPACK_IMPORTED_MODULE_21__["DefaultComponent"],
                _tiles_step_step_component__WEBPACK_IMPORTED_MODULE_23__["StepComponent"],
                _tiles_area_area_component__WEBPACK_IMPORTED_MODULE_24__["AreaComponent"],
                _tiles_scatter_scatter_component__WEBPACK_IMPORTED_MODULE_25__["ScatterComponent"],
                _tiles_bar_bar_component__WEBPACK_IMPORTED_MODULE_26__["BarComponent"],
                _tiles_gauge_gauge_component__WEBPACK_IMPORTED_MODULE_27__["GaugeComponent"],
                _tiles_pie_pie_component__WEBPACK_IMPORTED_MODULE_28__["PieComponent"],
                _tiles_doughnut_doughnut_component__WEBPACK_IMPORTED_MODULE_29__["DoughnutComponent"],
                _tiles_polar_polar_component__WEBPACK_IMPORTED_MODULE_30__["PolarComponent"],
                _tiles_radar_radar_component__WEBPACK_IMPORTED_MODULE_31__["RadarComponent"],
                _tiles_image_image_component__WEBPACK_IMPORTED_MODULE_32__["ImageComponent"],
                _tiles_tile_tile_component__WEBPACK_IMPORTED_MODULE_33__["TileComponent"],
                _tiles_annotation_annotation_component__WEBPACK_IMPORTED_MODULE_34__["AnnotationComponent"],
                _tiles_gts_tree_gts_tree_component__WEBPACK_IMPORTED_MODULE_35__["GtsTreeComponent"],
                _tiles_drilldown_drilldown_component__WEBPACK_IMPORTED_MODULE_36__["DrilldownComponent"],
                _tiles_datagrid_datagrid_component__WEBPACK_IMPORTED_MODULE_37__["DatagridComponent"]
            ],
            imports: [
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__["NgbModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_22__["FormsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(appRoutes, {
                    scrollPositionRestoration: 'enabled',
                    useHash: true,
                    onSameUrlNavigation: 'reload',
                    anchorScrolling: 'enabled'
                }),
                _angular_service_worker__WEBPACK_IMPORTED_MODULE_5__["ServiceWorkerModule"].register('/ngsw-worker.js', { enabled: _environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].production }),
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                picoevent__WEBPACK_IMPORTED_MODULE_12__["PicoEventModule"],
                _ngx_prism_core__WEBPACK_IMPORTED_MODULE_11__["PrismModule"]
            ],
            providers: [],
            entryComponents: [
                _tiles_welcome_welcome_component__WEBPACK_IMPORTED_MODULE_14__["WelcomeComponent"],
                _tiles_plot_plot_component__WEBPACK_IMPORTED_MODULE_17__["PlotComponent"],
                _tiles_map_map_component__WEBPACK_IMPORTED_MODULE_18__["MapComponent"],
                _tiles_text_text_component__WEBPACK_IMPORTED_MODULE_19__["TextComponent"],
                _tiles_bubbles_bubbles_component__WEBPACK_IMPORTED_MODULE_20__["BubblesComponent"],
                _tiles_default_default_component__WEBPACK_IMPORTED_MODULE_21__["DefaultComponent"],
                _tiles_step_step_component__WEBPACK_IMPORTED_MODULE_23__["StepComponent"],
                _tiles_area_area_component__WEBPACK_IMPORTED_MODULE_24__["AreaComponent"],
                _tiles_scatter_scatter_component__WEBPACK_IMPORTED_MODULE_25__["ScatterComponent"],
                _tiles_bar_bar_component__WEBPACK_IMPORTED_MODULE_26__["BarComponent"],
                _tiles_gauge_gauge_component__WEBPACK_IMPORTED_MODULE_27__["GaugeComponent"],
                _tiles_pie_pie_component__WEBPACK_IMPORTED_MODULE_28__["PieComponent"],
                _tiles_doughnut_doughnut_component__WEBPACK_IMPORTED_MODULE_29__["DoughnutComponent"],
                _tiles_polar_polar_component__WEBPACK_IMPORTED_MODULE_30__["PolarComponent"],
                _tiles_radar_radar_component__WEBPACK_IMPORTED_MODULE_31__["RadarComponent"],
                _tiles_image_image_component__WEBPACK_IMPORTED_MODULE_32__["ImageComponent"],
                _tiles_tile_tile_component__WEBPACK_IMPORTED_MODULE_33__["TileComponent"],
                _tiles_annotation_annotation_component__WEBPACK_IMPORTED_MODULE_34__["AnnotationComponent"],
                _tiles_gts_tree_gts_tree_component__WEBPACK_IMPORTED_MODULE_35__["GtsTreeComponent"],
                _tiles_drilldown_drilldown_component__WEBPACK_IMPORTED_MODULE_36__["DrilldownComponent"],
                _tiles_datagrid_datagrid_component__WEBPACK_IMPORTED_MODULE_37__["DatagridComponent"]
            ],
            schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["CUSTOM_ELEMENTS_SCHEMA"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/components/header/header.component.css":
/*!********************************************************!*\
  !*** ./src/app/components/header/header.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC9jb21wb25lbnRzL2hlYWRlci9oZWFkZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/components/header/header.component.html":
/*!*********************************************************!*\
  !*** ./src/app/components/header/header.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<header>\n  <div class=\"collapse bg-dark\" [ngbCollapse]=\"collapse\">\n    <div class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-7 py-4\">\n          <h4 class=\"text-white\">About</h4>\n          <p class=\"text-muted\"><a href=\"https://www.warp10.io\" target=\"_blank\">Warp 10&trade;</a> dedicated\n            visualization components.</p>\n          <p class=\"lead text-muted\">Choose a main theme</p>\n          <div class=\"btn-group btn-group-toggle\" ngbRadioGroup name=\"radioBasic\" [(ngModel)]=\"settings.theme\"\n               (ngModelChange)=\"updateSettings($event)\">\n            <label ngbButtonLabel class=\"btn-primary\">\n              <input ngbButton type=\"radio\" value=\"light\"> Light\n            </label>\n            <label ngbButtonLabel class=\"btn-primary\">\n              <input ngbButton type=\"radio\" value=\"dark\"> Dark\n            </label>\n          </div>\n          <!--<p>\n            <label for=\"autoRefresh\" class=\"text-white\">Auto refresh:</label>\n            <select class=\"form-control\" id=\"autoRefresh\" [ngModelOptions]=\"{standalone: true}\"\n                    [(ngModel)]=\"settings.autorefresh\" (ngModelChange)=\"updateSettings($event)\">\n              <option *ngFor=\"let i of autoRefreshList\" [value]=\"i.val\">{{i.label}}</option>\n            </select>\n          </p>-->\n        </div>\n        <div class=\"col-sm-4 offset-md-1 py-4\">\n          <h4 class=\"text-white\">Contact</h4>\n          <ul class=\"list-unstyled\">\n            <li><a href=\"https://twitter.com/warp10\" class=\"text-white\">Follow on Twitter</a></li>\n            <li><a href=\"#\" class=\"text-white\">GitHub</a></li>\n          </ul>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"navbar navbar-dark bg-dark shadow-sm\">\n    <div class=\"container-fluid d-flex justify-content-between\">\n      <a href=\"/\" class=\"navbar-brand d-flex align-items-center pr-3\">\n        <img src=\"assets/img/warpView.png\" class=\"img-fluid\" height=\"30\" alt=\"Warp View\" style=\"max-height: 40px\">\n      </a>\n      <button class=\"navbar-toggler\" type=\"button\" (click)=\"collapse = !collapse\"\n              [attr.aria-expanded]=\"!collapse\" aria-label=\"Toggle navigation\">\n        <span class=\"navbar-toggler-icon\"></span>\n      </button>\n    </div>\n  </div>\n</header>\n"

/***/ }),

/***/ "./src/app/components/header/header.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/header/header.component.ts ***!
  \*******************************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var picoevent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! picoevent */ "./node_modules/picoevent/picoevent.es5.js");
/* harmony import */ var _model_settings_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../model/settings-message */ "./src/app/model/settings-message.ts");
/* harmony import */ var _model_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../model/settings */ "./src/app/model/settings.ts");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(pico) {
        this.pico = pico;
        this.collapse = true;
        this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_3__["Settings"]();
        this.autoRefreshList = [
            { val: -1, label: 'off' },
            { val: 5, label: '5s' },
            { val: 10, label: '10s' },
            { val: 30, label: '30s' },
            { val: 60, label: '1m' },
            { val: 300, label: '5m' },
            { val: 600, label: '10m' },
            { val: 1800, label: '30m' },
            { val: 3600, label: '1h' }
        ];
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.channelSubscription = this.pico.listen(_model_settings_message__WEBPACK_IMPORTED_MODULE_2__["SettingsMessage"], function (evt) {
            if (evt.value) {
                _this.settings = evt.value;
            }
            else {
                _this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_3__["Settings"]();
            }
        });
    };
    HeaderComponent.prototype.updateSettings = function (e) {
        this.pico.publish(new _model_settings_message__WEBPACK_IMPORTED_MODULE_2__["SettingsMessage"](this.settings));
    };
    HeaderComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-header',
            template: __webpack_require__(/*! ./header.component.html */ "./src/app/components/header/header.component.html"),
            styles: [__webpack_require__(/*! ./header.component.css */ "./src/app/components/header/header.component.css")]
        }),
        __metadata("design:paramtypes", [picoevent__WEBPACK_IMPORTED_MODULE_1__["PicoEvent"]])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/components/tile-wrapper/tile-wrapper.component.css":
/*!********************************************************************!*\
  !*** ./src/app/components/tile-wrapper/tile-wrapper.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy90aWxlLXdyYXBwZXIvdGlsZS13cmFwcGVyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC9jb21wb25lbnRzL3RpbGUtd3JhcHBlci90aWxlLXdyYXBwZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/components/tile-wrapper/tile-wrapper.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/tile-wrapper/tile-wrapper.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n<div class=\"card mb-4 shadow-sm bg-{{settings.theme}} {{settings.theme === 'dark'?'text-white': ''}}\">\n  <div class=\"card-body\">\n    <h1 class=\"card-title\">{{title}}</h1>\n    <ng-template ad-host></ng-template>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/tile-wrapper/tile-wrapper.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/tile-wrapper/tile-wrapper.component.ts ***!
  \*******************************************************************/
/*! exports provided: TileWrapperComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TileWrapperComponent", function() { return TileWrapperComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _directives_ad_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../directives/ad.directive */ "./src/app/directives/ad.directive.ts");
/* harmony import */ var _model_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../model/settings */ "./src/app/model/settings.ts");
/* harmony import */ var picoevent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! picoevent */ "./node_modules/picoevent/picoevent.es5.js");
/* harmony import */ var _model_settings_message__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../model/settings-message */ "./src/app/model/settings-message.ts");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TileWrapperComponent = /** @class */ (function () {
    function TileWrapperComponent(pico, componentFactoryResolver) {
        this.pico = pico;
        this.componentFactoryResolver = componentFactoryResolver;
        this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_2__["Settings"]();
    }
    Object.defineProperty(TileWrapperComponent.prototype, "component", {
        get: function () {
            // transform value for display
            return this._component;
        },
        set: function (component) {
            console.log('changed');
            this._component = component;
            this.loadComponent();
        },
        enumerable: true,
        configurable: true
    });
    TileWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.channelSubscription = this.pico.listen(_model_settings_message__WEBPACK_IMPORTED_MODULE_4__["SettingsMessage"], function (evt) {
            if (evt.value) {
                _this.settings = evt.value;
            }
            else {
                _this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_2__["Settings"]();
            }
        });
        this.loadComponent();
    };
    TileWrapperComponent.prototype.loadComponent = function () {
        this.adHost.viewContainerRef.clear();
        this.adHost.viewContainerRef.createComponent(this.componentFactoryResolver.resolveComponentFactory(this._component));
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_directives_ad_directive__WEBPACK_IMPORTED_MODULE_1__["AdDirective"]),
        __metadata("design:type", _directives_ad_directive__WEBPACK_IMPORTED_MODULE_1__["AdDirective"])
    ], TileWrapperComponent.prototype, "adHost", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], TileWrapperComponent.prototype, "title", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["Type"]),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Type"]])
    ], TileWrapperComponent.prototype, "component", null);
    TileWrapperComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tile-wrapper',
            template: __webpack_require__(/*! ./tile-wrapper.component.html */ "./src/app/components/tile-wrapper/tile-wrapper.component.html"),
            styles: [__webpack_require__(/*! ./tile-wrapper.component.css */ "./src/app/components/tile-wrapper/tile-wrapper.component.css")]
        }),
        __metadata("design:paramtypes", [picoevent__WEBPACK_IMPORTED_MODULE_3__["PicoEvent"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]])
    ], TileWrapperComponent);
    return TileWrapperComponent;
}());



/***/ }),

/***/ "./src/app/directives/ad.directive.ts":
/*!********************************************!*\
  !*** ./src/app/directives/ad.directive.ts ***!
  \********************************************/
/*! exports provided: AdDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdDirective", function() { return AdDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdDirective = /** @class */ (function () {
    function AdDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    AdDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[ad-host]',
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]])
    ], AdDirective);
    return AdDirective;
}());



/***/ }),

/***/ "./src/app/home/home.component.css":
/*!*****************************************!*\
  !*** ./src/app/home/home.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n.nav-link {\n  text-align: left;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaG9tZS9ob21lLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUg7RUFDRSxpQkFBaUI7Q0FDbEIiLCJmaWxlIjoic3JjL2FwcC9ob21lL2hvbWUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4ubmF2LWxpbmsge1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuIl19 */"

/***/ }),

/***/ "./src/app/home/home.component.html":
/*!******************************************!*\
  !*** ./src/app/home/home.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<main role=\"main\">\n\n  <div class=\"album py-5\">\n    <div class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"col-2\">\n          <div class=\"nav flex-column nav-pills\" role=\"tablist\" aria-orientation=\"vertical\">\n            <button *ngFor=\"let d of demo; index as i\"\n                    class=\"btn btn-link nav-link {{i === selected? 'active': ''}}\"\n                    (click)=\"show(i)\" role=\"tab\">{{d.tabTitle}}\n            </button>\n          </div>\n        </div>\n        <div class=\"col-10\">\n          <div class=\"tab-content\" id=\"v-pills-tabContent\">\n            <app-tile-wrapper [component]=\"demo[selected].component\" [title]=\"demo[selected].tabTitle\"></app-tile-wrapper>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</main>\n"

/***/ }),

/***/ "./src/app/home/home.component.ts":
/*!****************************************!*\
  !*** ./src/app/home/home.component.ts ***!
  \****************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _tiles_welcome_welcome_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tiles/welcome/welcome.component */ "./src/app/tiles/welcome/welcome.component.ts");
/* harmony import */ var _tiles_plot_plot_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tiles/plot/plot.component */ "./src/app/tiles/plot/plot.component.ts");
/* harmony import */ var _tiles_map_map_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tiles/map/map.component */ "./src/app/tiles/map/map.component.ts");
/* harmony import */ var _tiles_text_text_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tiles/text/text.component */ "./src/app/tiles/text/text.component.ts");
/* harmony import */ var _tiles_bubbles_bubbles_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../tiles/bubbles/bubbles.component */ "./src/app/tiles/bubbles/bubbles.component.ts");
/* harmony import */ var _tiles_default_default_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../tiles/default/default.component */ "./src/app/tiles/default/default.component.ts");
/* harmony import */ var picoevent__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! picoevent */ "./node_modules/picoevent/picoevent.es5.js");
/* harmony import */ var _model_settings_message__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../model/settings-message */ "./src/app/model/settings-message.ts");
/* harmony import */ var _model_settings__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../model/settings */ "./src/app/model/settings.ts");
/* harmony import */ var _tiles_step_step_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../tiles/step/step.component */ "./src/app/tiles/step/step.component.ts");
/* harmony import */ var _tiles_area_area_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../tiles/area/area.component */ "./src/app/tiles/area/area.component.ts");
/* harmony import */ var _tiles_scatter_scatter_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../tiles/scatter/scatter.component */ "./src/app/tiles/scatter/scatter.component.ts");
/* harmony import */ var _tiles_bar_bar_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../tiles/bar/bar.component */ "./src/app/tiles/bar/bar.component.ts");
/* harmony import */ var _tiles_gauge_gauge_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../tiles/gauge/gauge.component */ "./src/app/tiles/gauge/gauge.component.ts");
/* harmony import */ var _tiles_pie_pie_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../tiles/pie/pie.component */ "./src/app/tiles/pie/pie.component.ts");
/* harmony import */ var _tiles_doughnut_doughnut_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../tiles/doughnut/doughnut.component */ "./src/app/tiles/doughnut/doughnut.component.ts");
/* harmony import */ var _tiles_polar_polar_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../tiles/polar/polar.component */ "./src/app/tiles/polar/polar.component.ts");
/* harmony import */ var _tiles_radar_radar_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../tiles/radar/radar.component */ "./src/app/tiles/radar/radar.component.ts");
/* harmony import */ var _tiles_image_image_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../tiles/image/image.component */ "./src/app/tiles/image/image.component.ts");
/* harmony import */ var _tiles_tile_tile_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../tiles/tile/tile.component */ "./src/app/tiles/tile/tile.component.ts");
/* harmony import */ var _tiles_annotation_annotation_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../tiles/annotation/annotation.component */ "./src/app/tiles/annotation/annotation.component.ts");
/* harmony import */ var _tiles_gts_tree_gts_tree_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../tiles/gts-tree/gts-tree.component */ "./src/app/tiles/gts-tree/gts-tree.component.ts");
/* harmony import */ var _tiles_drilldown_drilldown_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../tiles/drilldown/drilldown.component */ "./src/app/tiles/drilldown/drilldown.component.ts");
/* harmony import */ var _tiles_datagrid_datagrid_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../tiles/datagrid/datagrid.component */ "./src/app/tiles/datagrid/datagrid.component.ts");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

























var HomeComponent = /** @class */ (function () {
    function HomeComponent(pico) {
        this.pico = pico;
        this.selected = 0;
        this.demo = [
            {
                tabTitle: 'Getting Started',
                component: _tiles_welcome_welcome_component__WEBPACK_IMPORTED_MODULE_1__["WelcomeComponent"]
            },
            {
                tabTitle: 'Tile',
                component: _tiles_tile_tile_component__WEBPACK_IMPORTED_MODULE_20__["TileComponent"]
            },
            {
                tabTitle: 'Plot',
                component: _tiles_plot_plot_component__WEBPACK_IMPORTED_MODULE_2__["PlotComponent"]
            },
            {
                tabTitle: 'Drill Down',
                component: _tiles_drilldown_drilldown_component__WEBPACK_IMPORTED_MODULE_23__["DrilldownComponent"]
            },
            {
                tabTitle: 'Datagrid',
                component: _tiles_datagrid_datagrid_component__WEBPACK_IMPORTED_MODULE_24__["DatagridComponent"]
            },
            {
                tabTitle: 'Annotation',
                component: _tiles_annotation_annotation_component__WEBPACK_IMPORTED_MODULE_21__["AnnotationComponent"]
            },
            {
                tabTitle: 'GTS Tree',
                component: _tiles_gts_tree_gts_tree_component__WEBPACK_IMPORTED_MODULE_22__["GtsTreeComponent"]
            },
            {
                tabTitle: 'Line chart (default)',
                component: _tiles_default_default_component__WEBPACK_IMPORTED_MODULE_6__["DefaultComponent"]
            },
            {
                tabTitle: 'Step chart',
                component: _tiles_step_step_component__WEBPACK_IMPORTED_MODULE_10__["StepComponent"]
            },
            {
                tabTitle: 'Area chart',
                component: _tiles_area_area_component__WEBPACK_IMPORTED_MODULE_11__["AreaComponent"]
            },
            {
                tabTitle: 'Bubbles chart',
                component: _tiles_bubbles_bubbles_component__WEBPACK_IMPORTED_MODULE_5__["BubblesComponent"]
            },
            {
                tabTitle: 'Scatter chart',
                component: _tiles_scatter_scatter_component__WEBPACK_IMPORTED_MODULE_12__["ScatterComponent"]
            },
            {
                tabTitle: 'Bar chart',
                component: _tiles_bar_bar_component__WEBPACK_IMPORTED_MODULE_13__["BarComponent"]
            },
            {
                tabTitle: 'Pie chart',
                component: _tiles_pie_pie_component__WEBPACK_IMPORTED_MODULE_15__["PieComponent"]
            },
            {
                tabTitle: 'Gauge chart',
                component: _tiles_gauge_gauge_component__WEBPACK_IMPORTED_MODULE_14__["GaugeComponent"]
            },
            {
                tabTitle: 'Doughnut chart',
                component: _tiles_doughnut_doughnut_component__WEBPACK_IMPORTED_MODULE_16__["DoughnutComponent"]
            },
            {
                tabTitle: 'Polar chart',
                component: _tiles_polar_polar_component__WEBPACK_IMPORTED_MODULE_17__["PolarComponent"]
            },
            {
                tabTitle: 'Radar chart',
                component: _tiles_radar_radar_component__WEBPACK_IMPORTED_MODULE_18__["RadarComponent"]
            },
            {
                tabTitle: 'Map',
                component: _tiles_map_map_component__WEBPACK_IMPORTED_MODULE_3__["MapComponent"]
            },
            {
                tabTitle: 'Display',
                component: _tiles_text_text_component__WEBPACK_IMPORTED_MODULE_4__["TextComponent"]
            },
            {
                tabTitle: 'Image',
                component: _tiles_image_image_component__WEBPACK_IMPORTED_MODULE_19__["ImageComponent"]
            },
        ];
        this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_9__["Settings"]();
        this.defOpts = {
            gridLineColor: '#000000',
            fontColor: '#000000',
            mapType: 'DEFAULT',
            showControls: false,
            showGTSTree: true,
            foldGTSTree: true,
            autoRefresh: -1
        };
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.channelSubscription = this.pico.listen(_model_settings_message__WEBPACK_IMPORTED_MODULE_8__["SettingsMessage"], function (evt) {
            if (evt.value) {
                _this.settings = evt.value;
            }
            else {
                _this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_9__["Settings"]();
            }
            if (_this.settings.theme === 'dark') {
                _this.defOpts.mapType = 'DEFAULT';
                _this.defOpts.gridLineColor = '#ffffff';
            }
            else {
                _this.defOpts.mapType = 'DEFAULT';
                _this.defOpts.gridLineColor = '#000000';
            }
            if (_this.settings.autorefresh !== _this.defOpts.autoRefresh) {
                _this.defOpts.autoRefresh = _this.settings.autorefresh;
            }
            _this.defOpts = __assign({}, _this.defOpts);
        });
    };
    HomeComponent.prototype.show = function (index) {
        this.selected = index;
    };
    HomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-home',
            template: __webpack_require__(/*! ./home.component.html */ "./src/app/home/home.component.html"),
            styles: [__webpack_require__(/*! ./home.component.css */ "./src/app/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [picoevent__WEBPACK_IMPORTED_MODULE_7__["PicoEvent"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/model/settings-message.ts":
/*!*******************************************!*\
  !*** ./src/app/model/settings-message.ts ***!
  \*******************************************/
/*! exports provided: SettingsMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsMessage", function() { return SettingsMessage; });
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var SettingsMessage = /** @class */ (function () {
    /**
     *
     * @param {Settings} value
     */
    function SettingsMessage(value) {
        this.value = value;
    }
    return SettingsMessage;
}());



/***/ }),

/***/ "./src/app/model/settings.ts":
/*!***********************************!*\
  !*** ./src/app/model/settings.ts ***!
  \***********************************/
/*! exports provided: Settings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Settings", function() { return Settings; });
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var Settings = /** @class */ (function () {
    function Settings() {
        this.theme = 'light';
    }
    return Settings;
}());



/***/ }),

/***/ "./src/app/tiles/annotation/annotation.component.css":
/*!***********************************************************!*\
  !*** ./src/app/tiles/annotation/annotation.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvYW5ub3RhdGlvbi9hbm5vdGF0aW9uLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy9hbm5vdGF0aW9uL2Fubm90YXRpb24uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/annotation/annotation.component.html":
/*!************************************************************!*\
  !*** ./src/app/tiles/annotation/annotation.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\"  type=\"annotation\"\n                chart-title=\"Annotation\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Area chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-annotation responsive=\"true\" unit=\"°C\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>hidden-data</td>\n    <td><code>string[]</code></td>\n    <td>List of concatenated class names and labels to hide. (ie: <code>com.class.name&#123;label=a,label=b&#125;</code>\n    </td>\n    <td></td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n\n<p>You can either pass the <a href=\"https://www.warp10.io/content/03_Documentation/04_WarpScript/01_Concepts\" rel=\"noopener\" target=\"_blank\">JSON representation of the stack</a>, or pass the first element of the stack.</p>\n\n<p>GTS values must be strings or booleans</p>\n\n<h4>A GTS List</h4>\n<ngx-prism language=\"javascript\" code='[{\n  \"c\": \"class.name\",\n  \"l\": { \"label1\": \"label value\"},\n  \"a\": { \"attribute1\": \"attribute value\"},\n  \"v\" : [[0,0,0,\"4\"], [0,\"2\"]]\n  }, ... ]' ></ngx-prism>\n\n<h4>An object holder</h4>\n<p></p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,\"4\"], [0,\"2\"]]\n   }, ...],\n   \"globalParams\": { \"timeMode\" : \"timestamp\" }\n}]' ></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n  <li>\n    <strong>globalParams</strong>: options to override (see options below)\n  </li>\n</ul>\n\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n\t\"timeMode\": \"timestamp\",\n\t\"gridLineColor\": \"#001155\",\n\t\"showRangeSelector\": false\n}'></ngx-prism>\n<ul>\n  <li>\n    <strong>timeMode</strong>: Scale either 'timestamp' or 'date', default is 'date'\n  </li>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n  <li>\n    <strong>showRangeSelector</strong>: Show the range selector on the bottom of the chart, default is true\n  </li>\n</ul>\n<h3>Events</h3>\n<h4>pointHover</h4>\n<p>Emit mouse position</p>\n<ngx-prism language=\"javascript\" code='{\n\t\"x\": 123,\n\t\"y\": 456\n}'></ngx-prism>\n<h4>boundsDidChange</h4>\n<p>Emit the selected time range</p>\n\n<ngx-prism language=\"javascript\" code='{\n\t\"bounds\": {\n\t\t\"min\": 1234567898,\n\t\t\"max\": 1234569000\n\t}\n}'></ngx-prism>\n"

/***/ }),

/***/ "./src/app/tiles/annotation/annotation.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/tiles/annotation/annotation.component.ts ***!
  \**********************************************************/
/*! exports provided: AnnotationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotationComponent", function() { return AnnotationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AnnotationComponent = /** @class */ (function () {
    function AnnotationComponent() {
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"annotation\"\n                    chart-title=\"Annotation\">\n@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.tostring 0 0 0 ] MAP\n</warp-view-tile>";
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.tostring 0 0 0 ] MAP";
    }
    AnnotationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-annotation',
            template: __webpack_require__(/*! ./annotation.component.html */ "./src/app/tiles/annotation/annotation.component.html"),
            styles: [__webpack_require__(/*! ./annotation.component.css */ "./src/app/tiles/annotation/annotation.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AnnotationComponent);
    return AnnotationComponent;
}());



/***/ }),

/***/ "./src/app/tiles/area/area.component.css":
/*!***********************************************!*\
  !*** ./src/app/tiles/area/area.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvYXJlYS9hcmVhLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy9hcmVhL2FyZWEuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/area/area.component.html":
/*!************************************************!*\
  !*** ./src/app/tiles/area/area.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\" type=\"area\"\n                chart-title=\"Area\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Area chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-chart type=\"area\" responsive=\"true\" unit=\"°C\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>Interaction model</h3>\n\n<ul>\n  <li>Alt + Mouse wheel : Zoom</li>\n  <li>Click + drag : Select to zoom</li>\n  <li>Shift + Click : Pan</li>\n  <li>Double Click : Restore</li>\n</ul>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n  <li>--warp-view-chart-label-color : Chart labels font color</li>\n  <li>--warp-view-chart-legend-bg : Legend popup background color</li>\n  <li>--warp-view-chart-legend-color : Legend popup font color</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>type</td>\n    <td><code>string</code></td>\n    <td>'line'</td>\n    <td>Possible values are: 'line', 'area', 'step'</td>\n  </tr>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>standalone</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>If used with warp-view-annotation</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>hidden-data</td>\n    <td><code>string[]</code></td>\n    <td>List of concatenated class names and labels to hide. (ie: <code>com.class.name&#123;label=a,label=b&#125;</code>\n    </td>\n    <td></td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n\n<p>You can either pass the <a href=\"https://www.warp10.io/content/03_Documentation/04_WarpScript/01_Concepts\" rel=\"noopener\" target=\"_blank\">JSON representation of the stack</a>, or pass the first element of the stack.</p>\n\n<h4>A GTS List</h4>\n<ngx-prism language=\"javascript\" code='[{\n  \"c\": \"class.name\",\n  \"l\": { \"label1\": \"label value\"},\n  \"a\": { \"attribute1\": \"attribute value\"},\n  \"v\" : [[0,0,0,4], [0,2]]\n  }, ... ]' ></ngx-prism>\n\n<h4>An object holder</h4>\n<p></p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,4], [0,2]]\n   }, ...],\n   \"globalParams\": { \"time\" : \"timestamp\" }\n}]' ></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n  <li>\n    <strong>globalParams</strong>: options to override (see options below)\n  </li>\n</ul>\n\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n\t\"timeMode\": \"timestamp\",\n\t\"gridLineColor\": \"#001155\",\n\t\"showRangeSelector\": false\n}'></ngx-prism>\n<ul>\n  <li>\n    <strong>timeMode</strong>: Scale either 'timestamp' or 'date', default is 'date'\n  </li>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n  <li>\n    <strong>showRangeSelector</strong>: Show the range selector on the bottom of the chart, default is true\n  </li>\n</ul>\n<h3>Events</h3>\n<h4>pointHover</h4>\n<p>Emit mouse position</p>\n<ngx-prism language=\"javascript\" code='{\n\t\"x\": 123,\n\t\"y\": 456\n}'></ngx-prism>\n<h4>boundsDidChange</h4>\n<p>Emit the selected time range</p>\n\n<ngx-prism language=\"javascript\" code='{\n\t\"bounds\": {\n\t\t\"min\": 1234567898,\n\t\t\"max\": 1234569000\n\t}\n}'></ngx-prism>\n"

/***/ }),

/***/ "./src/app/tiles/area/area.component.ts":
/*!**********************************************!*\
  !*** ./src/app/tiles/area/area.component.ts ***!
  \**********************************************/
/*! exports provided: AreaComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AreaComponent", function() { return AreaComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AreaComponent = /** @class */ (function () {
    function AreaComponent() {
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"area\"\n                    chart-title=\"Area\">\n@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.delta 1 0 0 ] MAP\n</warp-view-tile>";
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.delta 1 0 0 ] MAP";
    }
    AreaComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-area',
            template: __webpack_require__(/*! ./area.component.html */ "./src/app/tiles/area/area.component.html"),
            styles: [__webpack_require__(/*! ./area.component.css */ "./src/app/tiles/area/area.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AreaComponent);
    return AreaComponent;
}());



/***/ }),

/***/ "./src/app/tiles/bar/bar.component.css":
/*!*********************************************!*\
  !*** ./src/app/tiles/bar/bar.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvYmFyL2Jhci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHIiwiZmlsZSI6InNyYy9hcHAvdGlsZXMvYmFyL2Jhci5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAxOCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbiJdfQ== */"

/***/ }),

/***/ "./src/app/tiles/bar/bar.component.html":
/*!**********************************************!*\
  !*** ./src/app/tiles/bar/bar.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\"\n                type=\"bar\"\n                show-legend=\"false\"\n                chart-title=\"Bar\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Bar chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-bar responsive=\"true\" unit=\"°C\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n</ul>\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>showLegend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,4], [0,2]]\n   }]\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"gridLineColor\": \"#ffee77\"\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/bar/bar.component.ts":
/*!********************************************!*\
  !*** ./src/app/tiles/bar/bar.component.ts ***!
  \********************************************/
/*! exports provided: BarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BarComponent", function() { return BarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BarComponent = /** @class */ (function () {
    function BarComponent() {
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE\n[ SWAP mapper.delta 1 0 0 ] MAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\"\n                    type=\"bar\"\n                    show-legend=\"false\"\n                    chart-title=\"Bar\">\n@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE\n[ SWAP mapper.delta 1 0 0 ] MAP\n</warp-view-tile>\n";
    }
    BarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-bar',
            template: __webpack_require__(/*! ./bar.component.html */ "./src/app/tiles/bar/bar.component.html"),
            styles: [__webpack_require__(/*! ./bar.component.css */ "./src/app/tiles/bar/bar.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], BarComponent);
    return BarComponent;
}());



/***/ }),

/***/ "./src/app/tiles/bubbles/bubbles.component.css":
/*!*****************************************************!*\
  !*** ./src/app/tiles/bubbles/bubbles.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvYnViYmxlcy9idWJibGVzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy9idWJibGVzL2J1YmJsZXMuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/bubbles/bubbles.component.html":
/*!******************************************************!*\
  !*** ./src/app/tiles/bubbles/bubbles.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\"\n                type=\"bubble\"\n                show-legend=\"false\"\n                chart-title=\"Bubbles\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Bubble chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-bubble responsive=\"true\" unit=\"°C\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n</ul>\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,4], [0,2]]\n   }, ... ],\n   \"globalParams\": { \"gridLineColor\" : \"#666000\" }\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n  <li>\n    <strong>globalParams</strong>: options to override (see options below)\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"gridLineColor\": \"#ffee77\"\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/bubbles/bubbles.component.ts":
/*!****************************************************!*\
  !*** ./src/app/tiles/bubbles/bubbles.component.ts ***!
  \****************************************************/
/*! exports provided: BubblesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BubblesComponent", function() { return BubblesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BubblesComponent = /** @class */ (function () {
    function BubblesComponent() {
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -30 ] FETCH\nfalse RESETS\n[ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE\n10 LTTB\n<% \n  DROP 'gts' STORE { \n    $gts NAME \n    $gts VALUES \n    <% \n      DROP 'val' STORE [ RAND 100 * RAND 100 * RAND 100 * ]  \n    %> LMAP\n  }\n%> LMAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\"\n                    type=\"bubble\"\n                    show-legend=\"false\"\n                    chart-title=\"Bubbles\">\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -30 ] FETCH\nfalse RESETS\n[ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE\n10 LTTB\n<%\n  DROP 'gts' STORE { \n    $gts NAME\n    $gts VALUES\n    <%\n      DROP 'val' STORE [ RAND 100 * RAND 100 * RAND 100 * ]\n    %> LMAP\n  }\n%> LMAP\n</warp-view-tile>\n";
    }
    BubblesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-bubbles',
            template: __webpack_require__(/*! ./bubbles.component.html */ "./src/app/tiles/bubbles/bubbles.component.html"),
            styles: [__webpack_require__(/*! ./bubbles.component.css */ "./src/app/tiles/bubbles/bubbles.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], BubblesComponent);
    return BubblesComponent;
}());



/***/ }),

/***/ "./src/app/tiles/datagrid/datagrid.component.html":
/*!********************************************************!*\
  !*** ./src/app/tiles/datagrid/datagrid.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" type=\"datagrid\"\n                height=\"800\"\n                chart-title=\"Datagrid\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Drilldown component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-datagrid responsive=\"true\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-font-color: Main font color</li>\n  <li>--warp-view-datagrid-cell-padding: Pagination cell padding</li>\n  <li>--warp-view-datagrid-odd-bg-color: Table odd row background color</li>\n  <li>--warp-view-datagrid-odd-color: Table odd row font color</li>\n  <li>--warp-view-datagrid-even-bg-color: Table even row background color</li>\n  <li>--warp-view-datagrid-even-color: Table even row font color</li>\n\n  <li>--warp-view-pagination-border-color: Pagination cell border color</li>\n  <li>--warp-view-pagination-bg-color: Pagination cell background color</li>\n  <li>--warp-view-pagination-active-color: Pagination active cell font color</li>\n  <li>--warp-view-pagination-active-border-color: Pagination active cell border color</li>\n  <li>--warp-view-pagination-active-bg-color: Pagination active cell background color</li>\n\n  <li>--warp-view-pagination-disabled-color: Pagination disabled cell font color</li>\n  <li>--warp-view-pagination-hover-color: Pagination hover cell font color</li>\n  <li>--warp-view-pagination-hover-border-color: Pagination hover cell border color</li>\n  <li>--warp-view-pagination-hover-bg-color: Pagination hover cell background color</li>\n\n  <li>--gts-classname-font-color: GTS class name font color</li>\n  <li>--gts-labelname-font-color: GTS label and attribute name font color</li>\n  <li>--gts-labelvalue-font-color: GTS label and attribute value font color</li>\n  <li>--gts-separator-font-color: GTS label/value separator font color</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>elems-count</td>\n    <td><code>number</code></td>\n    <td>Number of item per page</td>\n    <td></td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n\n<p>You can either pass the <a href=\"https://www.warp10.io/content/03_Documentation/04_WarpScript/01_Concepts\"\n                              rel=\"noopener\" target=\"_blank\">JSON representation of the stack</a>, or pass the first\n  element of the stack.</p>\n\n<h4>A GTS List</h4>\n<ngx-prism language=\"javascript\" code='[{\n  \"c\": \"class.name\",\n  \"l\": { \"label1\": \"label value\"},\n  \"a\": { \"attribute1\": \"attribute value\"},\n  \"v\" : [[0,0,0,\"4\"], [0,\"2\"]]\n  }, ... ]'></ngx-prism>\n\n<h4>An object holder</h4>\n<p></p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,\"4\"], [0,\"2\"]]\n   }, ...],\n   \"globalParams\": { }\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n  <li>\n    <strong>globalParams</strong>: options to override (see options below)\n  </li>\n</ul>\n\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n\t\"timeMode\": date\"\n}'></ngx-prism>\n<ul>\n  <li>\n    <strong>timeMode</strong>: Scale either 'timestamp' or 'date', default is 'date'\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/datagrid/datagrid.component.scss":
/*!********************************************************!*\
  !*** ./src/app/tiles/datagrid/datagrid.component.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n:host {\n  --warp-view-tile-height: 700px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycHZpZXctZGVtby9zcmMvYXBwL3RpbGVzL2RhdGFncmlkL2RhdGFncmlkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0g7RUFDRSwrQkFBd0IsRUFDekIiLCJmaWxlIjoic3JjL2FwcC90aWxlcy9kYXRhZ3JpZC9kYXRhZ3JpZC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuOmhvc3Qge1xuICAtLXdhcnAtdmlldy10aWxlLWhlaWdodDogNzAwcHg7XG59XG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/datagrid/datagrid.component.ts":
/*!******************************************************!*\
  !*** ./src/app/tiles/datagrid/datagrid.component.ts ***!
  \******************************************************/
/*! exports provided: DatagridComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DatagridComponent", function() { return DatagridComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DatagridComponent = /** @class */ (function () {
    function DatagridComponent() {
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"datagrid\"\n                    chart-title=\"Datagrid\">\n @training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 1 h ] FETCH\n</warp-view-tile>";
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 1 h ] FETCH";
    }
    DatagridComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-datagrid',
            template: __webpack_require__(/*! ./datagrid.component.html */ "./src/app/tiles/datagrid/datagrid.component.html"),
            styles: [__webpack_require__(/*! ./datagrid.component.scss */ "./src/app/tiles/datagrid/datagrid.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], DatagridComponent);
    return DatagridComponent;
}());



/***/ }),

/***/ "./src/app/tiles/default/default.component.css":
/*!*****************************************************!*\
  !*** ./src/app/tiles/default/default.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvZGVmYXVsdC9kZWZhdWx0LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy9kZWZhdWx0L2RlZmF1bHQuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/default/default.component.html":
/*!******************************************************!*\
  !*** ./src/app/tiles/default/default.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\"\n                show-legend=\"false\"\n                chart-title=\"Default\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n<h2>Line chart component</h2>\n<ngx-prism language=\"markup\" code='<warp-view-chart type=\"line\" responsive=\"true\" unit=\"°C\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>Interaction model</h3>\n\n<ul>\n  <li>Alt + Mouse wheel : Zoom</li>\n  <li>Click + drag : Select to zoom</li>\n  <li>Shift + Click : Pan</li>\n  <li>Double Click : Restore</li>\n</ul>\n\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n  <li>--warp-view-chart-label-color : Chart labels font color</li>\n  <li>--warp-view-chart-legend-bg : Legend popup background color</li>\n  <li>--warp-view-chart-legend-color : Legend popup font color</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>type</td>\n    <td><code>string</code></td>\n    <td>'line'</td>\n    <td>Possible values are: 'line', 'area', 'step'</td>\n  </tr>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>standalone</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>If used with warp-view-annotation</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>hidden-data</td>\n    <td><code>string[]</code></td>\n    <td>List of concatenated class names and labels to hide. (ie: <code>com.class.name&#123;label=a,label=b&#125;</code>\n    </td>\n    <td></td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n\n<p>You can either pass the <a href=\"https://www.warp10.io/content/03_Documentation/04_WarpScript/01_Concepts\" rel=\"noopener\" target=\"_blank\">JSON representation of the stack</a>, or pass the first element of the stack.</p>\n\n<h4>A GTS List</h4>\n<ngx-prism language=\"javascript\" code='[{\n  \"c\": \"class.name\",\n  \"l\": { \"label1\": \"label value\"},\n  \"a\": { \"attribute1\": \"attribute value\"},\n  \"v\" : [[0,0,0,4], [0,2]]\n  }, ... ]' ></ngx-prism>\n\n<h4>An object holder</h4>\n<p></p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,4], [0,2]]\n   }, ...],\n   \"globalParams\": { \"timeMode\" : \"timestamp\" }\n}]' ></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n  <li>\n    <strong>globalParams</strong>: options to override (see options below)\n  </li>\n</ul>\n\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n\t\"timeMode\": \"timestamp\",\n\t\"gridLineColor\": \"#001155\",\n\t\"showRangeSelector\": false\n}'></ngx-prism>\n<ul>\n  <li>\n    <strong>timeMode</strong>: Scale either 'timestamp' or 'date', default is 'date'\n  </li>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n  <li>\n    <strong>showRangeSelector</strong>: Show the range selector on the bottom of the chart, default is true\n  </li>\n</ul>\n<h3>Events</h3>\n<h4>pointHover</h4>\n<p>Emit mouse position</p>\n<ngx-prism language=\"javascript\" code='{\n\t\"x\": 123,\n\t\"y\": 456\n}'></ngx-prism>\n<h4>boundsDidChange</h4>\n<p>Emit the selected time range</p>\n\n<ngx-prism language=\"javascript\" code='{\n\t\"bounds\": {\n\t\t\"min\": 1234567898,\n\t\t\"max\": 1234569000\n\t}\n}'></ngx-prism>\n"

/***/ }),

/***/ "./src/app/tiles/default/default.component.ts":
/*!****************************************************!*\
  !*** ./src/app/tiles/default/default.component.ts ***!
  \****************************************************/
/*! exports provided: DefaultComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultComponent", function() { return DefaultComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DefaultComponent = /** @class */ (function () {
    function DefaultComponent() {
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.delta 1 0 0 ] MAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\"\n                    show-legend=\"false\"\n                    chart-title=\"Default\">\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.delta 1 0 0 ] MAP\n</warp-view-tile>";
    }
    DefaultComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-default',
            template: __webpack_require__(/*! ./default.component.html */ "./src/app/tiles/default/default.component.html"),
            styles: [__webpack_require__(/*! ./default.component.css */ "./src/app/tiles/default/default.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DefaultComponent);
    return DefaultComponent;
}());



/***/ }),

/***/ "./src/app/tiles/doughnut/doughnut.component.css":
/*!*******************************************************!*\
  !*** ./src/app/tiles/doughnut/doughnut.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvZG91Z2hudXQvZG91Z2hudXQuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRyIsImZpbGUiOiJzcmMvYXBwL3RpbGVzL2RvdWdobnV0L2RvdWdobnV0LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDE4ICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIl19 */"

/***/ }),

/***/ "./src/app/tiles/doughnut/doughnut.component.html":
/*!********************************************************!*\
  !*** ./src/app/tiles/doughnut/doughnut.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" type=\"doughnut\" show-legend=\"false\" chart-title=\"Doughnut\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Doughnut chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-pie responsive=\"true\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n</ul>\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [[\"key\", 54], [\"key 2\", 45]]\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as tuples.\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"type\": \"doughnut\"\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>type</strong>: chart type, possible values are 'pie', 'gauge' and 'doughnut'\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/doughnut/doughnut.component.ts":
/*!******************************************************!*\
  !*** ./src/app/tiles/doughnut/doughnut.component.ts ***!
  \******************************************************/
/*! exports provided: DoughnutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DoughnutComponent", function() { return DoughnutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DoughnutComponent = /** @class */ (function () {
    function DoughnutComponent() {
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n<% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"pie\" show-legend=\"false\" chart-title=\"Pie\">\n@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n<% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP\n</warp-view-tile>\n";
    }
    DoughnutComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-doughnut',
            template: __webpack_require__(/*! ./doughnut.component.html */ "./src/app/tiles/doughnut/doughnut.component.html"),
            styles: [__webpack_require__(/*! ./doughnut.component.css */ "./src/app/tiles/doughnut/doughnut.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DoughnutComponent);
    return DoughnutComponent;
}());



/***/ }),

/***/ "./src/app/tiles/drilldown/drilldown.component.css":
/*!*********************************************************!*\
  !*** ./src/app/tiles/drilldown/drilldown.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvZHJpbGxkb3duL2RyaWxsZG93bi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHIiwiZmlsZSI6InNyYy9hcHAvdGlsZXMvZHJpbGxkb3duL2RyaWxsZG93bi5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAxOCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbiJdfQ== */"

/***/ }),

/***/ "./src/app/tiles/drilldown/drilldown.component.html":
/*!**********************************************************!*\
  !*** ./src/app/tiles/drilldown/drilldown.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" type=\"drilldown\"\n                chart-title=\"Drilldown\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Drilldown component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-drilldown responsive=\"true\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n\n<h3>CSS vars</h3>\n<ul>\n  <li>--gts-stack-font-color: GTS stack level font color</li>\n  <li>--gts-classname-font-color: GTS class name font color</li>\n  <li>--gts-labelname-font-color: GTS label and attribute name font color</li>\n  <li>--gts-labelvalue-font-color: GTS label and attribute value font color</li>\n  <li>--gts-separator-font-color: GTS label/value separator font color</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>hidden-data</td>\n    <td><code>string[]</code></td>\n    <td>List of concatenated class names and labels to hide. (ie: <code>com.class.name&#123;label=a,label=b&#125;</code>\n    </td>\n    <td></td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n\n<p>You can either pass the <a href=\"https://www.warp10.io/content/03_Documentation/04_WarpScript/01_Concepts\"\n                              rel=\"noopener\" target=\"_blank\">JSON representation of the stack</a>, or pass the first\n  element of the stack.</p>\n\n<p>GTS values must be numeric</p>\n\n<h4>A GTS List</h4>\n<ngx-prism language=\"javascript\" code='[{\n  \"c\": \"class.name\",\n  \"l\": { \"label1\": \"label value\"},\n  \"a\": { \"attribute1\": \"attribute value\"},\n  \"v\" : [[0,0,0,\"4\"], [0,\"2\"]]\n  }, ... ]'></ngx-prism>\n\n<h4>An object holder</h4>\n<p></p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,\"4\"], [0,\"2\"]]\n   }, ...],\n   \"globalParams\": { }\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n  <li>\n    <strong>globalParams</strong>: options to override (see options below)\n  </li>\n</ul>\n\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n\t\"minColor\": \"#ffffff\",\n\t\"maxColor\": \"#333333\"\n}'></ngx-prism>\n<ul>\n  <li>\n    <strong>minColor</strong>: Minimum color for the heatmap. Default is \"#ffffff\"\n  </li>\n  <li>\n    <strong>maxColor</strong>: Maximum color for the heatmap. Default is \"#333333\"\n  </li>\n</ul>\n<h3>Events</h3>\n\n<h4>handler</h4>\n<p>Emit the clicked spot data</p>\n\n<ngx-prism language=\"javascript\" code='{\n  color?: string,\n  id?: number,\n  name: string,\n  total: number,\n  date?: Moment\n}'></ngx-prism>\n<h4>onChange</h4>\n<p>Emit when the view changes</p>\n\n<ngx-prism language=\"javascript\" code='{\n  overview: string,\n  start: Moment,\n  end: Moment\n}'></ngx-prism>\n"

/***/ }),

/***/ "./src/app/tiles/drilldown/drilldown.component.ts":
/*!********************************************************!*\
  !*** ./src/app/tiles/drilldown/drilldown.component.ts ***!
  \********************************************************/
/*! exports provided: DrilldownComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrilldownComponent", function() { return DrilldownComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DrilldownComponent = /** @class */ (function () {
    function DrilldownComponent() {
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"drilldown\"\n                    chart-title=\"Drilldown\">\n @training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 700 d ] FETCH\nfalse RESETS\n[ SWAP mapper.delta 1 0 0 ] MAP\n[ SWAP bucketizer.mean $NOW 1 h 0 ] BUCKETIZE\n[ NaN NaN NaN 0 ] FILLVALUE\n</warp-view-tile>";
        this.warpscript = " @training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 700 d ] FETCH\nfalse RESETS\n[ SWAP mapper.delta 1 0 0 ] MAP\n[ SWAP bucketizer.mean $NOW 1 h 0 ] BUCKETIZE\n[ NaN NaN NaN 0 ] FILLVALUE";
    }
    DrilldownComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drilldown',
            template: __webpack_require__(/*! ./drilldown.component.html */ "./src/app/tiles/drilldown/drilldown.component.html"),
            styles: [__webpack_require__(/*! ./drilldown.component.css */ "./src/app/tiles/drilldown/drilldown.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DrilldownComponent);
    return DrilldownComponent;
}());



/***/ }),

/***/ "./src/app/tiles/gauge/gauge.component.css":
/*!*************************************************!*\
  !*** ./src/app/tiles/gauge/gauge.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvZ2F1Z2UvZ2F1Z2UuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRyIsImZpbGUiOiJzcmMvYXBwL3RpbGVzL2dhdWdlL2dhdWdlLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDE4ICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIl19 */"

/***/ }),

/***/ "./src/app/tiles/gauge/gauge.component.html":
/*!**************************************************!*\
  !*** ./src/app/tiles/gauge/gauge.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" type=\"gauge\" show-legend=\"false\" chart-title=\"Gauge\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Gauge chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-pie responsive=\"true\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n</ul>\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [[\"key\", 54], [\"key 2\", 45]]\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as tuples.\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"type\": \"gauge\"\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>type</strong>: chart type, possible values are 'pie', 'gauge' and 'doughnut'\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/gauge/gauge.component.ts":
/*!************************************************!*\
  !*** ./src/app/tiles/gauge/gauge.component.ts ***!
  \************************************************/
/*! exports provided: GaugeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GaugeComponent", function() { return GaugeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var GaugeComponent = /** @class */ (function () {
    function GaugeComponent() {
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n<% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"gauge\" show-legend=\"false\" chart-title=\"Gauge\">\n@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n<% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP\n</warp-view-tile>\n";
    }
    GaugeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-gauge',
            template: __webpack_require__(/*! ./gauge.component.html */ "./src/app/tiles/gauge/gauge.component.html"),
            styles: [__webpack_require__(/*! ./gauge.component.css */ "./src/app/tiles/gauge/gauge.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], GaugeComponent);
    return GaugeComponent;
}());



/***/ }),

/***/ "./src/app/tiles/gts-tree/gts-tree.component.css":
/*!*******************************************************!*\
  !*** ./src/app/tiles/gts-tree/gts-tree.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvZ3RzLXRyZWUvZ3RzLXRyZWUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRyIsImZpbGUiOiJzcmMvYXBwL3RpbGVzL2d0cy10cmVlL2d0cy10cmVlLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDE4ICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIl19 */"

/***/ }),

/***/ "./src/app/tiles/gts-tree/gts-tree.component.html":
/*!********************************************************!*\
  !*** ./src/app/tiles/gts-tree/gts-tree.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\"  type=\"gts-tree\"\n                chart-title=\"GTS Tree\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Area chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-gts-tree data=\"WarpScript result\" options=\"options\" />'></ngx-prism>\n\n<h3>CSS vars</h3>\n<ul>\n  <li>--gts-tree-expanded-icon : Expanded icon in a css url form (ie: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAA...) or url(http://path/to/img.png) )</li>\n  <li>--gts-tree-collapsed-icon : Collapsed icon in a css url form (ie: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAA...) or url(http://path/to/img.png) )</li>\n  <li>--gts-stack-font-color: GTS stack level font color</li>\n  <li>--gts-classname-font-color: GTS class name font color</li>\n  <li>--gts-labelname-font-color: GTS label and attribute name font color</li>\n  <li>--gts-labelvalue-font-color: GTS label and attribute value font color</li>\n  <li>--gts-separator-font-color: GTS label/value separator font color</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>gts-filter</td>\n    <td><code>string</code></td>\n    <td></td>\n    <td>GTS Selector regular expression to filter displayed GTS</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n\n<p>You can either pass the <a href=\"https://www.warp10.io/content/03_Documentation/04_WarpScript/01_Concepts\" rel=\"noopener\" target=\"_blank\">JSON representation of the stack</a>, or pass the first element of the stack.</p>\n\n<p>GTS values must be strings or booleans</p>\n\n<h4>A GTS List</h4>\n<ngx-prism language=\"javascript\" code='[{\n  \"c\": \"class.name\",\n  \"l\": { \"label1\": \"label value\"},\n  \"a\": { \"attribute1\": \"attribute value\"},\n  \"v\" : [[0,0,0,\"4\"], [0,\"2\"]]\n  }, ... ]' ></ngx-prism>\n\n<h4>An object holder</h4>\n<p></p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,\"4\"], [0,\"2\"]]\n   }, ...],\n   \"globalParams\": { \"timeMode\" : \"timestamp\" }\n}]' ></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n  <li>\n    <strong>globalParams</strong>: options to override (see options below)\n  </li>\n</ul>\n\n<h3>Events</h3>\n<h4>warpViewSelectedGTS</h4>\n<p>Emit selected GTS.</p>\n<ngx-prism language=\"javascript\" code='{\n  \"selected\": true,\n  \"gts\": {\n   \"c\": \"class.name\",\n   \"l\": { \"label1\": \"label value\"},\n   \"a\": { \"attribute1\": \"attribute value\"},\n   \"v\" : [[0,0,0,true], [0,\"a\"]]\n  },\n  \"label\": \"class.name{label1=label value}\"\n}'></ngx-prism>\n"

/***/ }),

/***/ "./src/app/tiles/gts-tree/gts-tree.component.ts":
/*!******************************************************!*\
  !*** ./src/app/tiles/gts-tree/gts-tree.component.ts ***!
  \******************************************************/
/*! exports provided: GtsTreeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GtsTreeComponent", function() { return GtsTreeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var GtsTreeComponent = /** @class */ (function () {
    function GtsTreeComponent() {
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"gts-tree\"\n                    chart-title=\"GTS Tree\">\n@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n</warp-view-tile>";
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH";
    }
    GtsTreeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-gts-tree',
            template: __webpack_require__(/*! ./gts-tree.component.html */ "./src/app/tiles/gts-tree/gts-tree.component.html"),
            styles: [__webpack_require__(/*! ./gts-tree.component.css */ "./src/app/tiles/gts-tree/gts-tree.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], GtsTreeComponent);
    return GtsTreeComponent;
}());



/***/ }),

/***/ "./src/app/tiles/image/image.component.css":
/*!*************************************************!*\
  !*** ./src/app/tiles/image/image.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvaW1hZ2UvaW1hZ2UuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRyIsImZpbGUiOiJzcmMvYXBwL3RpbGVzL2ltYWdlL2ltYWdlLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDE4ICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIl19 */"

/***/ }),

/***/ "./src/app/tiles/image/image.component.html":
/*!**************************************************!*\
  !*** ./src/app/tiles/image/image.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"false\" unit=\"°C\" type=\"image\"\n                width=\"300\" height=\"200\"\n                chart-title=\"Image\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n<h2>Image component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-image responsive=\"true\" data=\"data\" options=\"options\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Font color (title and value)</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": \"data:image/png;base64,iVBOR[...]ky1P3\"\n}]'></ngx-prism>\n<ul>\n  <li>\n    <strong>data</strong>: Base 64 image to be displayed (could be array of)\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"bgColor\": \"#ffee77\",\n  \"fontColor\": \"#994477\"\n}'></ngx-prism>\n<ul>\n  <li>\n    <strong>bgColor</strong>: Background color (Default: transparent)\n  </li>\n  <li>\n    <strong>fontColor</strong>: Font color for title, unit and value\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/image/image.component.ts":
/*!************************************************!*\
  !*** ./src/app/tiles/image/image.component.ts ***!
  \************************************************/
/*! exports provided: ImageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageComponent", function() { return ImageComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ImageComponent = /** @class */ (function () {
    function ImageComponent() {
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"image\"\n                    chart-title=\"Image\">\n//draw tangents along the curve\n300 200 '2D3' PGraphics\n255 Pbackground\n16 PtextSize\n\n50 'x1' STORE\n50 'y1' STORE\n200 'x2' STORE\n130 'y2' STORE\n\n100 'cx1' STORE\n40 'cy1' STORE\n\n110 'cx2' STORE\n140 'cy2' STORE\n\n\n4 PstrokeWeight\n$x1 $y1 Ppoint //first anchor\n$x2 $y2 Ppoint //second anchor\n\n2 PstrokeWeight\n$x1 $y1 $cx1 $cy1 Pline\n$x2 $y2 $cx2 $cy2 Pline\n\n2 PstrokeWeight\n0xffff0000 Pstroke\n$x1 $y1 $cx1 $cy1 $cx2 $cy2 $x2 $y2 Pbezier\n\n0 10\n<%\n10.0 / 't' STORE\n\n$x1 $cx1 $cx2 $x2 $t PbezierPoint 'x' STORE\n$y1 $cy1 $cy2 $y2 $t PbezierPoint 'y' STORE\n$x1 $cx1 $cx2 $x2 $t PbezierTangent 'tx' STORE\n$y1 $cy1 $cy2 $y2 $t PbezierTangent 'ty' STORE\n$ty $tx ATAN2 PI 2.0 / - 'angle' STORE\n0xff009f00 Pstroke\n$x\n$y\n$x $angle COS 12 * +\n$y $angle SIN 12 * +\nPline\n\n0x9f009f00 Pfill\nPnoStroke\n'CENTER' PellipseMode\n$x $y 5 5 Pellipse\n\n%> FOR\n\nPencode\n</warp-view-tile>";
        this.warpscript = "//draw tangents along the curve\n300 200 '2D3' PGraphics\n255 Pbackground\n16 PtextSize\n\n50 'x1' STORE\n50 'y1' STORE\n200 'x2' STORE\n130 'y2' STORE\n\n100 'cx1' STORE\n40 'cy1' STORE\n\n110 'cx2' STORE\n140 'cy2' STORE\n\n\n4 PstrokeWeight\n$x1 $y1 Ppoint //first anchor\n$x2 $y2 Ppoint //second anchor\n\n2 PstrokeWeight\n$x1 $y1 $cx1 $cy1 Pline\n$x2 $y2 $cx2 $cy2 Pline\n\n2 PstrokeWeight\n0xffff0000 Pstroke\n$x1 $y1 $cx1 $cy1 $cx2 $cy2 $x2 $y2 Pbezier\n\n0 10\n<%\n10.0 / 't' STORE\n\n$x1 $cx1 $cx2 $x2 $t PbezierPoint 'x' STORE\n$y1 $cy1 $cy2 $y2 $t PbezierPoint 'y' STORE\n$x1 $cx1 $cx2 $x2 $t PbezierTangent 'tx' STORE\n$y1 $cy1 $cy2 $y2 $t PbezierTangent 'ty' STORE\n$ty $tx ATAN2 PI 2.0 / - 'angle' STORE\n0xff009f00 Pstroke\n$x\n$y\n$x $angle COS 12 * +\n$y $angle SIN 12 * +\nPline\n\n0x9f009f00 Pfill\nPnoStroke\n'CENTER' PellipseMode\n$x $y 5 5 Pellipse\n\n%> FOR\n\nPencode";
    }
    ImageComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-image',
            template: __webpack_require__(/*! ./image.component.html */ "./src/app/tiles/image/image.component.html"),
            styles: [__webpack_require__(/*! ./image.component.css */ "./src/app/tiles/image/image.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ImageComponent);
    return ImageComponent;
}());



/***/ }),

/***/ "./src/app/tiles/map/map.component.css":
/*!*********************************************!*\
  !*** ./src/app/tiles/map/map.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvbWFwL21hcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHIiwiZmlsZSI6InNyYy9hcHAvdGlsZXMvbWFwL21hcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAxOCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbiJdfQ== */"

/***/ }),

/***/ "./src/app/tiles/map/map.component.html":
/*!**********************************************!*\
  !*** ./src/app/tiles/map/map.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" type=\"map\" [options]=\"{ mapType: mapType}\"\n                chart-title=\"Map\">\n  {{warpscript}}\n</warp-view-tile>\n\n<form class=\"form-inline m-2\">\n  <div class=\"form-group\">\n    <label for=\"mapStyles\">Map style: </label>\n    <select class=\"form-control ml-2 bg-{{settings.theme}} {{settings.theme === 'dark'?'text-white': ''}}\"\n            id=\"mapStyles\" [ngModelOptions]=\"{standalone: true}\" [(ngModel)]=\"mapType\">\n      <option *ngFor=\"let i of mapStyles\" [value]=\"i.val\">{{i.label}}</option>\n    </select>\n  </div>\n</form>\n\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n<h2>warp-view-map</h2>\n<p>Warp-view-map is a <a href=\"https://stenciljs.com/\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">StencilJs</a>\n  web-component based on <a href=\"https://leafletjs.com/\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">Leaflet</a>.\n  Map pins are from <a href=\"https://www.mapbox.com/maki-icons/\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">MapBox</a>\n  and heatmap plugin module is <a href=\"https://github.com/Vivien-/types-leaflet-heat\"\n                                  rel=\"nofollow noreferrer noopener\" target=\"_blank\">Leaflet.heat</a>.</p>\n\n<p>In this app, the dark theme inverses map colors.</p>\n<h3>Attributs :</h3>\n<ul>\n  <li>\n    <p><code>map-title</code> <em>string</em> (optional) : title displayed on top left of the map</p>\n  </li>\n  <li>\n    <p><code>width</code> <em>string</em> (optional) : width of the map, default <em>100%</em></p>\n  </li>\n  <li>\n    <p><code>height</code> <em>string</em> (optional) : height of the map, default <em>800px</em></p>\n  </li>\n  <li>\n    <p><code>start-lat</code> <em>number</em> (optional) : starting latitude, default <em>30</em></p>\n  </li>\n  <li>\n    <p><code>start-long</code> <em>number</em> (optional) : starting longitude, default <em>0</em></p>\n  </li>\n  <li>\n    <p><code>start-zoom</code> <em>number</em> (optional) : starting zoom, default <em>3</em></p>\n  </li>\n  <li>\n    <p><code>dots-limit</code> <em>number</em> (optional) : limit at which points are clustered for performance reasons,\n      default <em>1000</em></p>\n  </li>\n  <li>\n    <p><code>data</code> <em>object</em> (optional) : data to display, see syntax below</p>\n  </li>\n  <li>\n    <p><code>heat-radius</code> <em>number</em> (optional) : radius of heat-point, default <em>25</em></p>\n  </li>\n  <li>\n    <p><code>heat-blur</code> <em>number</em> (optional) : amount of blur, default <em>15</em></p>\n  </li>\n  <li>\n    <p><code>heat-opacity</code> <em>number</em> (optional) : opacity of heat-point, default <em>0.5</em></p>\n  </li>\n  <li>\n    <p><code>heat-controls</code> <em>boolean</em> (optional) : display controls to modify heat radius, blur and\n      opacity, default <em>false</em></p>\n  </li>\n  <li>\n    <p><code>heat-data</code> <em>string</em> (optional) : heat-data to display, see syntax below</p>\n  </li>\n</ul>\n<h3>Data syntax :</h3>\n<p>Data is map composed of two properties :</p>\n<ul>\n  <li>\n    <code>data</code>: a list of GTS or positions to plot\n  </li>\n  <li>\n    <code>params</code>: a list of visualisation parameters for each GTS or positions to plot\n  </li>\n</ul>\n<p>Each item in <code>data</code> array matches to an item in <code>params</code> array.</p>\n<h4><code>data</code> :</h4>\n<ul>\n  <li>\n    <p>GTS have standard GTS JSON syntax as following : <code>&#123;\"c\":\"\",\"l\":&#123;&#125;,\"a\":&#123;&#125;,\"v\":[[1460540141224657,51.45877850241959,-0.01000002957880497,1000,8.090169943749475],[1460540131224657,51.49510562885553,-0.02000005915760994,1000,3.0901699437494745]]&#125;</code>.<br>\n      Each datapoint of a GTS need to have at least a date, latitude and longitude.</p>\n  </li>\n  <li>\n    <p>Positions are a map with <code>positions</code> key and a list of positions and values :</p>\n    <ul>\n      <li>positions only : <code>&#123;\"positions\":[[51.5,-0.22],[51.46,-0.3],[51.42,-0.2]]&#125;</code>\n      </li>\n      <li>positions and one value used as dot radius : <code>&#123;\"positions\":[[51.2,-0.12,10],[51.36,-0.0,21],[51.32,-0.2,15]]&#125;</code>\n      </li>\n      <li>positions and two values used as dot radius and dot fill color : <code>&#123;\"positions\":[[51.1,-0.52,42,10],[51.56,-0.4,21,30],[51.42,-0.6,84,40],[51.3,-0.82,42,1],[51.76,-0.7,21,20]]&#125;</code>\n      </li>\n    </ul>\n    <p>Each position need to have at least latitude and longitude</p>\n  </li>\n</ul>\n<p>Each information of a point are accessible in a popup by clicking on associate marker.</p>\n<h4><code>params</code> :</h4>\n<h5>For GTS :</h5>\n<ul>\n  <li>\n    <code>key</code> : specify render type\n    <ul>\n      <li>\n        <code>path</code> : display line between positions, usefull for a trajectory\n        <ul>\n          <li>\n            <code>color</code> (optional) : path color\n          </li>\n          <li>\n            <code>displayDots</code> (optional) : true or false, display dots at datapoints\n          </li>\n        </ul>\n      </li>\n      <li>\n        <code>point</code> : display dots or markers (to specify with \"render\")\n        <ul>\n          <li>\n            <code>render</code> :\n            <ul>\n              <li>\n                <code>dot</code>\n                <ul>\n                  <li><code>radius</code></li>\n                  <li>\n                    <code>fillColor</code> (optional)\n                  </li>\n                  <li>\n                    <code>fillOpacity</code> (optional)\n                  </li>\n                  <li>\n                    <code>edgeColor</code> (optional)\n                  </li>\n                  <li>\n                    <code>edgeOpacity</code> (optional)\n                  </li>\n                  <li>\n                    <code>weight</code> (optional) : edge thickness\n                  </li>\n                </ul>\n              </li>\n              <li>\n                <code>marker</code>\n                <ul>\n                  <li>\n                    <code>marker</code> : name of the marker icon, see <a href=\"https://www.mapbox.com/maki-icons/\"\n                                                                          rel=\"nofollow noreferrer noopener\"\n                                                                          target=\"_blank\">Maki</a>. It can also be a\n                    letter or a two digits number.\n                  </li>\n                  <li>\n                    <code>color</code> (optional)\n                  </li>\n                </ul>\n              </li>\n            </ul>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  </li>\n  <li>\n    <code>legend</code> (optional) : text of your choice\n  </li>\n</ul>\n<h5>For positions :</h5>\n<ul>\n  <li><code>radius</code></li>\n  <li>\n    <code>fillColor</code> (optional)\n  </li>\n  <li>\n    <code>fillOpacity</code> (optional)\n  </li>\n  <li>\n    <code>edgeColor</code> (optional)\n  </li>\n  <li>\n    <code>edgeOpacity</code> (optional)\n  </li>\n  <li>\n    <code>weight</code> (optional) : edge thickness\n  </li>\n  <li>\n    <code>legend</code> (optional) : text of your choice\n  </li>\n</ul>\n<h3>Heat-data syntax :</h3>\n<p>Heat-data is an array of positions with for each an intensity value between 0 and 1 : <code>[[51.5,-0.3, 0.5],\n  [51.6,-0.3, 0.7], [51.3, -0.3, 1]]</code>.</p>\n<h3>Example :</h3>\n<ngx-prism language=\"markup\" [code]=\"sample2\"></ngx-prism>\n"

/***/ }),

/***/ "./src/app/tiles/map/map.component.ts":
/*!********************************************!*\
  !*** ./src/app/tiles/map/map.component.ts ***!
  \********************************************/
/*! exports provided: MapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapComponent", function() { return MapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _model_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/settings */ "./src/app/model/settings.ts");
/* harmony import */ var _model_settings_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../model/settings-message */ "./src/app/model/settings-message.ts");
/* harmony import */ var picoevent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! picoevent */ "./node_modules/picoevent/picoevent.es5.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MapComponent = /** @class */ (function () {
    /**
     *
     * @param {PicoEvent} pico
     */
    function MapComponent(pico) {
        this.pico = pico;
        this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_1__["Settings"]();
        this.mapStyles = [
            { val: 'DEFAULT', label: 'defalut' },
            { val: 'TOPO', label: 'Topographic' },
            { val: 'ESRI', label: 'ESRI' },
            { val: 'SATELLITE', label: 'Satellite' },
            { val: 'OCEANS', label: 'Oceans' },
            { val: 'GRAY', label: 'Gray' },
            { val: 'GRAYSCALE', label: 'Gray scale' },
            { val: 'WATERCOLOR', label: 'Water color' }
        ];
        this.mapType = 'DEFAULT';
        this.warpscript = "'{\"data\":[{\"c\":\"A\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.45877850241959,-0.01000002957880497,1000,8.090169943749475],[1460540131224657,51.49510562885553,-0.02000005915760994,1000,3.0901699437494745],[1460540121224657,51.49510562885553,-0.030000004917383194,1000,-3.0901699437494736],[1460540111224657,51.45877850241959,-0.040000034496188164,1000,-8.090169943749473],[1460540101224657,51.39999998733401,-0.050000064074993134,1000,-10.0],[1460540091224657,51.341221472248435,-0.06000000983476639,1000,-8.090169943749475],[1460540081224657,51.3048943458125,-0.07000003941357136,1000,-3.0901699437494754],[1460540071224657,51.3048943458125,-0.08000006899237633,1000,3.0901699437494723],[1460540061224657,51.341221472248435,-0.09000001475214958,1000,8.090169943749473],[1460540051224657,51.39999998733401,-0.10000004433095455,1000,10.0]]},{\"c\":\"B\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.49999998975545,-0.10000004433095455,10],[1460540131224657,51.45999999716878,-0.09000001475214958,9],[1460540121224657,51.41999996267259,-0.08000006899237633,8],[1460540111224657,51.39999998733401,-0.07000003941357136,7],[1460540101224657,51.439999979920685,-0.06000000983476639,6],[1460540091224657,51.47999997250736,-0.050000064074993134,8],[1460540081224657,51.49999998975545,-0.030000004917383194,10],[1460540071224657,51.51999996509403,-0.02000005915760994,9],[1460540061224657,51.539999982342124,-0.01000002957880497,8],[1460540051224657,51.55999999959022,0.0,9]]},{\"c\":\"D\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.49999998975545,-0.10000004433095455,\"a\"],[1460540131224657,51.45999999716878,-0.09000001475214958,\"b\"],[1460540121224657,51.41999996267259,-0.08000006899237633,\"c\"],[1460540111224657,51.39999998733401,-0.07000003941357136,\"d\"]]},{\"c\":\"E\",\"l\":{},\"a\":{},\"v\":[[1460540136224657,51.439999979920685,0.05999992601573467,true],[1460540116224657,51.47999997250736,0.04999998025596142,false],[1460540096224657,51.49999998975545,0.02999992109835148,true],[1460540076224657,51.51999996509403,0.019999975338578224,false],[1460540056224657,51.539999982342124,0.009999945759773254,true]]},{\"positions\":[[51.5,-0.22],[51.46,-0.3],[51.42,-0.2]]},{\"positions\":[[51.2,-0.12,42],[51.36,-0.0,21],[51.32,-0.2,84]]},{\"positions\":[[51.2,-0.52,42],[51.36,-0.4,21],[51.32,-0.6,84]]},{\"positions\":[[51.1,-0.52,42,10],[51.56,-0.4,21,30],[51.42,-0.6,84,40],[51.3,-0.82,42,1],[51.76,-0.7,21,20],[51.62,-0.9,84,45]]}],\"params\":[{\"key\":\"Path A\"},{\"key\":\"Path B\"},{\"key\":\"Annotations (text)\",\"render\":\"marker\",\"marker\":\"lodging\"},{\"key\":\"Annotations (boolean)\",\"baseRadius\":5},{\"key\":\"Test\",\"render\":\"marker\"},{\"key\":\"points 2\",\"render\":\"dots\",\"color\":\"#ffa\",\"borderColor\":\"#f00\",\"baseRadius\":5},{\"key\":\"points\",\"render\":\"weightedDots\",\"color\":\"#aaf\",\"borderColor\":\"#f00\",\"maxValue\":100,\"minValue\":0,\"baseRadius\":5,\"numSteps\":10},{\"key\":\"coloredWeightedDots\",\"render\":\"coloredWeightedDots\",\"maxValue\":100,\"minValue\":0,\"baseRadius\":5,\"maxColorValue\":50,\"minColorValue\":0,\"numColorSteps\":10,\"startColor\":\"#ff0000\",\"endColor\":\"#00ff00\"}]}'\n                    JSON->";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"map\" chart-title=\"Map\">\n'{\"data\":[{\"c\":\"A\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.45877850241959,-0.01000002957880497,1000,8.090169943749475],[1460540131224657,51.49510562885553,-0.02000005915760994,1000,3.0901699437494745],[1460540121224657,51.49510562885553,-0.030000004917383194,1000,-3.0901699437494736],[1460540111224657,51.45877850241959,-0.040000034496188164,1000,-8.090169943749473],[1460540101224657,51.39999998733401,-0.050000064074993134,1000,-10.0],[1460540091224657,51.341221472248435,-0.06000000983476639,1000,-8.090169943749475],[1460540081224657,51.3048943458125,-0.07000003941357136,1000,-3.0901699437494754],[1460540071224657,51.3048943458125,-0.08000006899237633,1000,3.0901699437494723],[1460540061224657,51.341221472248435,-0.09000001475214958,1000,8.090169943749473],[1460540051224657,51.39999998733401,-0.10000004433095455,1000,10.0]]},{\"c\":\"B\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.49999998975545,-0.10000004433095455,10],[1460540131224657,51.45999999716878,-0.09000001475214958,9],[1460540121224657,51.41999996267259,-0.08000006899237633,8],[1460540111224657,51.39999998733401,-0.07000003941357136,7],[1460540101224657,51.439999979920685,-0.06000000983476639,6],[1460540091224657,51.47999997250736,-0.050000064074993134,8],[1460540081224657,51.49999998975545,-0.030000004917383194,10],[1460540071224657,51.51999996509403,-0.02000005915760994,9],[1460540061224657,51.539999982342124,-0.01000002957880497,8],[1460540051224657,51.55999999959022,0.0,9]]},{\"c\":\"D\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.49999998975545,-0.10000004433095455,\"a\"],[1460540131224657,51.45999999716878,-0.09000001475214958,\"b\"],[1460540121224657,51.41999996267259,-0.08000006899237633,\"c\"],[1460540111224657,51.39999998733401,-0.07000003941357136,\"d\"]]},{\"c\":\"E\",\"l\":{},\"a\":{},\"v\":[[1460540136224657,51.439999979920685,0.05999992601573467,true],[1460540116224657,51.47999997250736,0.04999998025596142,false],[1460540096224657,51.49999998975545,0.02999992109835148,true],[1460540076224657,51.51999996509403,0.019999975338578224,false],[1460540056224657,51.539999982342124,0.009999945759773254,true]]},{\"positions\":[[51.5,-0.22],[51.46,-0.3],[51.42,-0.2]]},{\"positions\":[[51.2,-0.12,42],[51.36,-0.0,21],[51.32,-0.2,84]]},{\"positions\":[[51.2,-0.52,42],[51.36,-0.4,21],[51.32,-0.6,84]]},{\"positions\":[[51.1,-0.52,42,10],[51.56,-0.4,21,30],[51.42,-0.6,84,40],[51.3,-0.82,42,1],[51.76,-0.7,21,20],[51.62,-0.9,84,45]]}],\"params\":[{\"key\":\"Path A\"},{\"key\":\"Path B\"},{\"key\":\"Annotations (text)\",\"render\":\"marker\",\"marker\":\"lodging\"},{\"key\":\"Annotations (boolean)\",\"baseRadius\":5},{\"key\":\"Test\",\"render\":\"marker\"},{\"key\":\"points 2\",\"render\":\"dots\",\"color\":\"#ffa\",\"borderColor\":\"#f00\",\"baseRadius\":5},{\"key\":\"points\",\"render\":\"weightedDots\",\"color\":\"#aaf\",\"borderColor\":\"#f00\",\"maxValue\":100,\"minValue\":0,\"baseRadius\":5,\"numSteps\":10},{\"key\":\"coloredWeightedDots\",\"render\":\"coloredWeightedDots\",\"maxValue\":100,\"minValue\":0,\"baseRadius\":5,\"maxColorValue\":50,\"minColorValue\":0,\"numColorSteps\":10,\"startColor\":\"#ff0000\",\"endColor\":\"#00ff00\"}]}'\n                    JSON->\n</warp-view-tile>";
        this.sample2 = "<warp-view-map data=\n  '[{\n\"gts\":[\n{\"c\":\"\",\"l\":{},\"a\":{},\"v\":[\n[1460540141224657,51.45877850241959,-0.01000002957880497,1000,8.090169943749475],\n[1460540131224657,51.49510562885553,-0.02000005915760994,1000,3.0901699437494745],\n[1460540121224657,51.49510562885553,-0.030000004917383194,1000,-3.0901699437494736],\n[1460540111224657,51.45877850241959,-0.040000034496188164,1000,-8.090169943749473],\n[1460540101224657,51.39999998733401,-0.050000064074993134,1000,-10.0],\n[1460540091224657,51.341221472248435,-0.06000000983476639,1000,-8.090169943749475],\n[1460540081224657,51.3048943458125,-0.07000003941357136,1000,-3.0901699437494754],\n[1460540071224657,51.3048943458125,-0.08000006899237633,1000,3.0901699437494723],\n[1460540061224657,51.341221472248435,-0.09000001475214958,1000,8.090169943749473],\n[1460540051224657,51.39999998733401,-0.10000004433095455,1000,10.0]\n]},\n{\"c\":\"\",\"l\":{},\"a\":{},\"v\":[\n[1460540141224657,51.49999998975545,-0.10000004433095455,10],\n[1460540131224657,51.45999999716878,-0.09000001475214958,9],\n[1460540121224657,51.41999996267259,-0.08000006899237633,8],\n[1460540111224657,51.39999998733401,-0.07000003941357136,7],\n[1460540101224657,51.439999979920685,-0.06000000983476639,6],\n[1460540091224657,51.47999997250736,-0.050000064074993134,8],\n[1460540081224657,51.49999998975545,-0.030000004917383194,10],\n[1460540071224657,51.51999996509403,-0.02000005915760994,9],\n[1460540061224657,51.539999982342124,-0.01000002957880497,8],\n[1460540051224657,51.55999999959022,0.0,9]\n]},\n{\"c\":\"\",\"l\":{},\"a\":{},\"v\":[\n[1460540141224657,51.49999998975545,-0.10000004433095455,\"a\"],\n[1460540131224657,51.45999999716878,-0.09000001475214958,\"b\"],\n[1460540121224657,51.41999996267259,-0.08000006899237633,\"c\"],\n[1460540111224657,51.39999998733401,-0.07000003941357136,\"d\"]\n]},\n{\"c\":\"\",\"l\":{},\"a\":{},\"v\":[\n[1460540136224657,51.439999979920685,0.05999992601573467,true],\n[1460540116224657,51.47999997250736,0.04999998025596142,false],\n[1460540096224657,51.49999998975545,0.02999992109835148,true],\n[1460540076224657,51.51999996509403,0.019999975338578224,false],\n[1460540056224657,51.539999982342124,0.009999945759773254,true]\n]},\n{\"positions\":[[51.5,-0.22],[51.46,-0.3],[51.42,-0.2]]},\n{\"positions\":[[51.2,-0.52,42],[51.36,-0.4,21],[51.32,-0.6,84]]},\n{\"positions\":[[51.1,-0.52,42,10],[51.56,-0.4,21,30],[51.42,-0.6,84,40],[51.3,-0.82,42,1],[51.76,-0.7,21,20],[51.62,-0.9,84,45]\n]}],\n\"params\":[\n{\"color\":\"#ff1010\", \"key\":\"path\", \"legend\":\"A\", \"displayDots\": true},\n{\"color\":\"#1010ff\", \"key\":\"path\", \"legend\":\"B\"},\n{\"key\":\"point\", \"render\":\"marker\", \"marker\":\"fuel\", \"color\":\"#ff0000\"},\n{\"key\":\"point\", \"render\":\"dot\", \"radius\":5, \"fillColor\":\"#ff0000\", \"fillOpacity\":\"0.9\"},\n{\"edgeColor\":\"#ffa\", \"radius\":20, \"fillColor\":\"#0f0\"},\n{\"fillColor\":\"#00f\"},\n{}\n]}]'\nheat-controls=true heat-data=\"[[51.4,-0.3, 0.3], [51.4,-0.32, 0.6], [51.1,-0.32, 0.4], [51.1,-0.315, 0.5], [51.105,-0.31, 0.9], [51.5,-0.3, 0.5], [51.6,-0.3, 0.7], [51.3, -0.3, 1]]\"\n/>";
    }
    /**
     *
     */
    MapComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.channelSubscription = this.pico.listen(_model_settings_message__WEBPACK_IMPORTED_MODULE_2__["SettingsMessage"], function (evt) {
            if (evt.value) {
                _this.settings = evt.value;
            }
            else {
                _this.settings = new _model_settings__WEBPACK_IMPORTED_MODULE_1__["Settings"]();
            }
        });
    };
    MapComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-map',
            template: __webpack_require__(/*! ./map.component.html */ "./src/app/tiles/map/map.component.html"),
            styles: [__webpack_require__(/*! ./map.component.css */ "./src/app/tiles/map/map.component.css")]
        }),
        __metadata("design:paramtypes", [picoevent__WEBPACK_IMPORTED_MODULE_3__["PicoEvent"]])
    ], MapComponent);
    return MapComponent;
}());



/***/ }),

/***/ "./src/app/tiles/pie/pie.component.css":
/*!*********************************************!*\
  !*** ./src/app/tiles/pie/pie.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvcGllL3BpZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHIiwiZmlsZSI6InNyYy9hcHAvdGlsZXMvcGllL3BpZS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAxOCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbiJdfQ== */"

/***/ }),

/***/ "./src/app/tiles/pie/pie.component.html":
/*!**********************************************!*\
  !*** ./src/app/tiles/pie/pie.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" type=\"pie\" show-legend=\"false\" chart-title=\"Pie\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Pie chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-pie responsive=\"true\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n</ul>\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [[\"key\", 54], [\"key 2\", 45]]\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as tuples.\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"type\": \"pie\"\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>type</strong>: chart type, possible values are 'pie', 'gauge' and 'doughnut'\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/pie/pie.component.ts":
/*!********************************************!*\
  !*** ./src/app/tiles/pie/pie.component.ts ***!
  \********************************************/
/*! exports provided: PieComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PieComponent", function() { return PieComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PieComponent = /** @class */ (function () {
    function PieComponent() {
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n<% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"pie\" show-legend=\"false\" chart-title=\"Pie\">\n@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n<% \n  DROP \n  'gts' STORE \n  [ $gts NAME $gts VALUES 0 GET ] \n%> LMAP\n</warp-view-tile>\n";
    }
    PieComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-pie',
            template: __webpack_require__(/*! ./pie.component.html */ "./src/app/tiles/pie/pie.component.html"),
            styles: [__webpack_require__(/*! ./pie.component.css */ "./src/app/tiles/pie/pie.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], PieComponent);
    return PieComponent;
}());



/***/ }),

/***/ "./src/app/tiles/plot/plot.component.css":
/*!***********************************************!*\
  !*** ./src/app/tiles/plot/plot.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n:host {\n  --warp-view-tile-height: 700px;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvcGxvdC9wbG90LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUg7RUFDRSwrQkFBK0I7Q0FDaEMiLCJmaWxlIjoic3JjL2FwcC90aWxlcy9wbG90L3Bsb3QuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG46aG9zdCB7XG4gIC0td2FycC12aWV3LXRpbGUtaGVpZ2h0OiA3MDBweDtcbn1cbiJdfQ== */"

/***/ }),

/***/ "./src/app/tiles/plot/plot.component.html":
/*!************************************************!*\
  !*** ./src/app/tiles/plot/plot.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n<p>Composition of warp-view-gts-tree, warp-view-annotation, warp-view-toggle, warp-view-chart and warp-view-map.</p>\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" type=\"plot\"\n                gts-filter=\"anomaly\"\n                chart-title=\"Plot sample\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n<h3>CSS vars</h3>\n\n<p>See CSS vars of embedded components</p>\n\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>chart-title</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Main title</td>\n  </tr>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>gts-filter</td>\n    <td><code>string</code></td>\n    <td></td>\n    <td>GTS Selector regular expression to filter displayed GTS</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options (see options of embedded components)</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n\n<h3>Events</h3>\n<h4>warpViewSelectedGTS</h4>\n<p>Emit selected GTS.</p>\n<ngx-prism language=\"javascript\" code='{\n  \"selected\": true,\n  \"gts\": {\n   \"c\": \"class.name\",\n   \"l\": { \"label1\": \"label value\"},\n   \"a\": { \"attribute1\": \"attribute value\"},\n   \"v\" : [[0,0,0,true], [0,\"a\"]]\n  },\n  \"label\": \"class.name{label1=label value}\"\n}'></ngx-prism>\n"

/***/ }),

/***/ "./src/app/tiles/plot/plot.component.ts":
/*!**********************************************!*\
  !*** ./src/app/tiles/plot/plot.component.ts ***!
  \**********************************************/
/*! exports provided: PlotComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlotComponent", function() { return PlotComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PlotComponent = /** @class */ (function () {
    function PlotComponent() {
        this.warpscript = "@training/dataset0\n// warp.store.hbase.puts.committed is the number of datapoints committed to\n// HBase since the restart of the Store daemon\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 10 d ] FETCH\n[ SWAP mapper.rate 1 0 0 ] MAP\n// Keep only 1000 datapoints per GTS\n1000 LTTB\nDUP\n// Detect 5 anomalies per GTS using an ESD (Extreme Studentized Deviate) Test\n5 false ESDTEST\n// Convert the ticks identified by ESDTEST into an annotation GTS\n<%\nDROP \t\t// excude element index\nNEWGTS \t// create a new GTS\nSWAP \t\t// get timestamp list\n<% NaN NaN NaN 'anomaly' ADDVALUE %> FOREACH // for each timestamp\n%> LMAP\n2 ->LIST // Put our GTS in a list\nZIP // merge into a list of GTS\n// Now rename and relabel the anomaly GTS\n<%\nDROP \t\t\t\t// exclude element index\nLIST-> \t\t\t\t// flatten list\nDROP  \t\t\t\t// exclude number of elements of our list\nSWAP  \t\t\t\t// put our fetched GTS on the top\nDUP  \t\t\t\t// duplicate the GTS\nNAME \t\t\t\t// get the className of the GTS\n':anomaly' + 'name' STORE  \t// suffix the name\nDUP LABELS 'labels' STORE \t// duplicate the GTS and get labels\nSWAP  \t\t\t\t// put the anomaly GTS on the top of the stack\n$name RENAME   \t\t\t// rename the GTS\n$labels RELABEL  \t\t// put labels\n2 ->LIST   \t\t\t\t// put both GTS in a list\n%> LMAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"plot\" gts-filter=\"anomaly\" chart-title=\"Plot sample\">\n@training/dataset0\n// warp.store.hbase.puts.committed is the number of datapoints committed to\n// HBase since the restart of the Store daemon\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 10 d ] FETCH\n[ SWAP mapper.rate 1 0 0 ] MAP\n// Keep only 1000 datapoints per GTS\n1000 LTTB\nDUP\n// Detect 5 anomalies per GTS using an ESD (Extreme Studentized Deviate) Test\n5 false ESDTEST\n// Convert the ticks identified by ESDTEST into an annotation GTS\n<%\n  DROP \t\t// excude element index\n  NEWGTS \t// create a new GTS\n  SWAP \t\t// get timestamp list\n  <% NaN NaN NaN 'anomaly' ADDVALUE %> FOREACH // for each timestamp\n%> LMAP\n2 ->LIST // Put our GTS in a list\nZIP // merge into a list of GTS\n// Now rename and relabel the anomaly GTS\n<%\n  DROP \t\t\t\t// exclude element index\n  LIST-> \t\t\t\t// flatten list\n  DROP  \t\t\t\t// exclude number of elements of our list\n  SWAP  \t\t\t\t// put our fetched GTS on the top\n  DUP  \t\t\t\t// duplicate the GTS\n  NAME \t\t\t\t// get the className of the GTS\n  ':anomaly' + 'name' STORE  \t// suffix the name\n  DUP LABELS 'labels' STORE \t// duplicate the GTS and get labels\n  SWAP  \t\t\t\t// put the anomaly GTS on the top of the stack\n  $name RENAME   \t\t\t// rename the GTS\n  $labels RELABEL  \t\t// put labels\n  2 ->LIST   \t\t\t\t// put both GTS in a list\n%> LMAP\n</warp-view-tile>";
    }
    PlotComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-plot',
            template: __webpack_require__(/*! ./plot.component.html */ "./src/app/tiles/plot/plot.component.html"),
            styles: [__webpack_require__(/*! ./plot.component.css */ "./src/app/tiles/plot/plot.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], PlotComponent);
    return PlotComponent;
}());



/***/ }),

/***/ "./src/app/tiles/polar/polar.component.css":
/*!*************************************************!*\
  !*** ./src/app/tiles/polar/polar.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvcG9sYXIvcG9sYXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRyIsImZpbGUiOiJzcmMvYXBwL3RpbGVzL3BvbGFyL3BvbGFyLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDE4ICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIl19 */"

/***/ }),

/***/ "./src/app/tiles/polar/polar.component.html":
/*!**************************************************!*\
  !*** ./src/app/tiles/polar/polar.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\"\n                type=\"polar\"\n                show-legend=\"false\"\n                chart-title=\"Polar\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Polar chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-polar responsive=\"true\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n</ul>\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,4], [0,2]]\n   }]\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"gridLineColor\": \"#ffee77\"\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/polar/polar.component.ts":
/*!************************************************!*\
  !*** ./src/app/tiles/polar/polar.component.ts ***!
  \************************************************/
/*! exports provided: PolarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PolarComponent", function() { return PolarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PolarComponent = /** @class */ (function () {
    function PolarComponent() {
        this.warpscript = "@training/dataset0\n                    [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n                    <% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"polar\" unit=\"\u00B0C\" show-legend=\"false\" chart-title=\"Polar\">\n<< your warpscript >>\n</warp-view-tile>\n";
    }
    PolarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-polar',
            template: __webpack_require__(/*! ./polar.component.html */ "./src/app/tiles/polar/polar.component.html"),
            styles: [__webpack_require__(/*! ./polar.component.css */ "./src/app/tiles/polar/polar.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], PolarComponent);
    return PolarComponent;
}());



/***/ }),

/***/ "./src/app/tiles/radar/radar.component.css":
/*!*************************************************!*\
  !*** ./src/app/tiles/radar/radar.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvcmFkYXIvcmFkYXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRyIsImZpbGUiOiJzcmMvYXBwL3RpbGVzL3JhZGFyL3JhZGFyLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDE4ICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIl19 */"

/***/ }),

/***/ "./src/app/tiles/radar/radar.component.html":
/*!**************************************************!*\
  !*** ./src/app/tiles/radar/radar.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\"\n                type=\"radar\"\n                show-legend=\"false\"\n                chart-title=\"Radar\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Radar chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-radar responsive=\"true\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n</ul>\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\":[\n    { \"data A\":[{\"a\":0},{\"b\":3},{\"c\":0},{\"d\":1},{\"e\":4}] },\n    { \"data B\":[{\"a\":1},{\"b\":1},{\"c\":4},{\"d\":2},{\"e\":3}] }\n  ]\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"gridLineColor\": \"#ffee77\"\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/radar/radar.component.ts":
/*!************************************************!*\
  !*** ./src/app/tiles/radar/radar.component.ts ***!
  \************************************************/
/*! exports provided: RadarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RadarComponent", function() { return RadarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var RadarComponent = /** @class */ (function () {
    function RadarComponent() {
        this.warpscript = " @training/dataset0\n                    [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -5 ] FETCH\n                    'list' STORE\n                    $list\n                    <%\n                    DROP 'gts' STORE\n                    $gts LABELS 'rack' GET 'rack' STORE\n\n                    {\n                    $rack $gts VALUES <%\n                    'index' STORE 'val' STORE\n                    { $index TOSTRING $val 5 % }\n                    %> LMAP\n                    }\n                    %> LMAP\n                    STOP 'values' STORE\n                    { 'data' $values }";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"radar\" unit=\"\u00B0C\" show-legend=\"false\" chart-title=\"Radar\">\n<< your warpscript >>\n</warp-view-tile>\n";
    }
    RadarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-radar',
            template: __webpack_require__(/*! ./radar.component.html */ "./src/app/tiles/radar/radar.component.html"),
            styles: [__webpack_require__(/*! ./radar.component.css */ "./src/app/tiles/radar/radar.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], RadarComponent);
    return RadarComponent;
}());



/***/ }),

/***/ "./src/app/tiles/scatter/scatter.component.css":
/*!*****************************************************!*\
  !*** ./src/app/tiles/scatter/scatter.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvc2NhdHRlci9zY2F0dGVyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy9zY2F0dGVyL3NjYXR0ZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/scatter/scatter.component.html":
/*!******************************************************!*\
  !*** ./src/app/tiles/scatter/scatter.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\"\n                type=\"scatter\"\n                show-legend=\"false\"\n                chart-title=\"Scatter\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Scatter chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-scatter responsive=\"true\" unit=\"°C\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n</ul>\n<h3>Attributes</h3>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,4], [0,2]]\n   }]\n}]'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"gridLineColor\": \"#ffee77\"\n}'></ngx-prism>\n\n<ul>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/scatter/scatter.component.ts":
/*!****************************************************!*\
  !*** ./src/app/tiles/scatter/scatter.component.ts ***!
  \****************************************************/
/*! exports provided: ScatterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScatterComponent", function() { return ScatterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ScatterComponent = /** @class */ (function () {
    function ScatterComponent() {
        this.warpscript = "@training/dataset0\n                    [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\n                    false RESETS\n                    [ SWAP mapper.delta 1 0 0 ] MAP 'values' STORE\n                    { 'data' $values }";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\"\n                    type=\"scatter\"\n                    show-legend=\"false\"\n                    chart-title=\"Scatter\">\n<< your warpscript >>\n</warp-view-tile>";
    }
    ScatterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-scatter',
            template: __webpack_require__(/*! ./scatter.component.html */ "./src/app/tiles/scatter/scatter.component.html"),
            styles: [__webpack_require__(/*! ./scatter.component.css */ "./src/app/tiles/scatter/scatter.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ScatterComponent);
    return ScatterComponent;
}());



/***/ }),

/***/ "./src/app/tiles/step/step.component.css":
/*!***********************************************!*\
  !*** ./src/app/tiles/step/step.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvc3RlcC9zdGVwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy9zdGVwL3N0ZXAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/step/step.component.html":
/*!************************************************!*\
  !*** ./src/app/tiles/step/step.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\" type=\"step\"\n                chart-title=\"Step\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n\n<h2>Step chart component</h2>\n<ngx-prism language=\"markup\"\n           code='<warp-view-chart type=\"step\" responsive=\"true\" unit=\"°C\" data=\"WarpScript result\" options=\"options\" show-legend=\"true\"/>'></ngx-prism>\n<h3>Interaction model</h3>\n\n<ul>\n  <li>Alt + Mouse wheel : Zoom</li>\n  <li>Click + drag : Select to zoom</li>\n  <li>Shift + Click : Pan</li>\n  <li>Double Click : Restore</li>\n</ul>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Title font color</li>\n  <li>--warp-view-chart-label-color : Chart labels font color</li>\n  <li>--warp-view-chart-legend-bg : Legend popup background color</li>\n  <li>--warp-view-chart-legend-color : Legend popup font color</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>type</td>\n    <td><code>string</code></td>\n    <td>'line'</td>\n    <td>Possible values are: 'line', 'area', 'step'</td>\n  </tr>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>standalone</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>If used with warp-view-annotation</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>hidden-data</td>\n    <td><code>string[]</code></td>\n    <td>List of concatenated class names and labels to hide. (ie: <code>com.class.name&#123;label=a,label=b&#125;</code>\n    </td>\n    <td></td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n\n<p>You can either pass the <a href=\"https://www.warp10.io/content/03_Documentation/04_WarpScript/01_Concepts\" rel=\"noopener\" target=\"_blank\">JSON representation of the stack</a>, or pass the first element of the stack.</p>\n\n<h4>A GTS List</h4>\n<ngx-prism language=\"javascript\" code='[{\n  \"c\": \"class.name\",\n  \"l\": { \"label1\": \"label value\"},\n  \"a\": { \"attribute1\": \"attribute value\"},\n  \"v\" : [[0,0,0,4], [0,2]]\n  }, ... ]' ></ngx-prism>\n\n<h4>An object holder</h4>\n<p></p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,4], [0,2]]\n   }, ...],\n   \"globalParams\": { \"timeMode\" : \"timestamp\" }\n}]' ></ngx-prism>\n\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed as a GTS list.\n  </li>\n  <li>\n    <strong>globalParams</strong>: options to override (see options below)\n  </li>\n</ul>\n\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n\t\"timeMode\": \"timestamp\",\n\t\"gridLineColor\": \"#001155\",\n\t\"showRangeSelector\": false\n}'></ngx-prism>\n<ul>\n  <li>\n    <strong>timeMode</strong>: Scale either 'timestamp' or 'date', default is 'date'\n  </li>\n  <li>\n    <strong>gridLineColor</strong>: Grid line color and axis labels color. Default: #8e8e8e\n  </li>\n  <li>\n    <strong>showRangeSelector</strong>: Show the range selector on the bottom of the chart, default is true\n  </li>\n</ul>\n<h3>Events</h3>\n<h4>pointHover</h4>\n<p>Emit mouse position</p>\n<ngx-prism language=\"javascript\" code='{\n\t\"x\": 123,\n\t\"y\": 456\n}'></ngx-prism>\n<h4>boundsDidChange</h4>\n<p>Emit the selected time range</p>\n\n<ngx-prism language=\"javascript\" code='{\n\t\"bounds\": {\n\t\t\"min\": 1234567898,\n\t\t\"max\": 1234569000\n\t}\n}'></ngx-prism>\n"

/***/ }),

/***/ "./src/app/tiles/step/step.component.ts":
/*!**********************************************!*\
  !*** ./src/app/tiles/step/step.component.ts ***!
  \**********************************************/
/*! exports provided: StepComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StepComponent", function() { return StepComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StepComponent = /** @class */ (function () {
    function StepComponent() {
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"step\"\n                    chart-title=\"Step\">\n      << your warpscript >>\n</warp-view-tile>";
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.delta 1 0 0 ] MAP 'values' STORE\n{ 'data' $values }";
    }
    StepComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-step',
            template: __webpack_require__(/*! ./step.component.html */ "./src/app/tiles/step/step.component.html"),
            styles: [__webpack_require__(/*! ./step.component.css */ "./src/app/tiles/step/step.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], StepComponent);
    return StepComponent;
}());



/***/ }),

/***/ "./src/app/tiles/text/text.component.css":
/*!***********************************************!*\
  !*** ./src/app/tiles/text/text.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvdGV4dC90ZXh0LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy90ZXh0L3RleHQuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/text/text.component.html":
/*!************************************************!*\
  !*** ./src/app/tiles/text/text.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\" type=\"text\"\n                chart-title=\"Text\">\n  {{warpscript}}\n</warp-view-tile>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n<h2>Display component</h2>\n<p>Displays alphanumeric value</p>\n<ngx-prism language=\"markup\"\n           code='<warp-view-display responsive=\"true\" unit=\"°C\" data=\"data\" options=\"options\"/>'></ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-chart-width : Width</li>\n  <li>--warp-view-chart-height : Height</li>\n  <li>--warp-view-font-color : Font color (title and value)</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>width</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed width</td>\n  </tr>\n  <tr>\n    <td>height</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Fixed height</td>\n  </tr>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>data</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of data to display</td>\n  </tr>\n  </tbody>\n</table>\n<h3>Data format</h3>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": 42\n}]'></ngx-prism>\n<ul>\n  <li>\n    <strong>data</strong>: data to be displayed\n  </li>\n</ul>\n<h3>Option format</h3>\n<ngx-prism language=\"javascript\" code='{\n  \"bgColor\": \"#ffee77\",\n  \"fontColor\": \"#994477\"\n}'></ngx-prism>\n<ul>\n  <li>\n    <strong>bgColor</strong>: Background color (Default: transparent)\n  </li>\n  <li>\n    <strong>fontColor</strong>: Font color for title, unit and value\n  </li>\n</ul>\n"

/***/ }),

/***/ "./src/app/tiles/text/text.component.ts":
/*!**********************************************!*\
  !*** ./src/app/tiles/text/text.component.ts ***!
  \**********************************************/
/*! exports provided: TextComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextComponent", function() { return TextComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TextComponent = /** @class */ (function () {
    function TextComponent() {
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"text\"\n                    chart-title=\"Text\">\n      { 'data' 42 'globalParams' { 'bgColor' 'darkblue' 'fontColor' 'cyan' } }\n    </warp-view-tile>";
        this.warpscript = "{ 'data' 42 'globalParams' { 'bgColor' 'darkblue' 'fontColor' 'cyan' } }";
    }
    TextComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-text',
            template: __webpack_require__(/*! ./text.component.html */ "./src/app/tiles/text/text.component.html"),
            styles: [__webpack_require__(/*! ./text.component.css */ "./src/app/tiles/text/text.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], TextComponent);
    return TextComponent;
}());



/***/ }),

/***/ "./src/app/tiles/tile/tile.component.css":
/*!***********************************************!*\
  !*** ./src/app/tiles/tile/tile.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvdGlsZS90aWxlLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy90aWxlL3RpbGUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/tile/tile.component.html":
/*!************************************************!*\
  !*** ./src/app/tiles/tile/tile.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<h2>WarpView Tile</h2>\n\n<warp-view-tile url=\"https://warp.senx.io/api/v0/exec\" responsive=\"true\" unit=\"°C\"\n                show-legend=\"false\"\n                chart-title=\"Default\">\n{{ warpscript }}\n</warp-view-tile>\n\n<ngx-prism language=\"markup\">{{tileSample}}</ngx-prism>\n<h3>CSS vars</h3>\n<ul>\n  <li>--warp-view-tile-height : Height</li>\n  <li>--warp-view-tile-width : Width</li>\n</ul>\n<h3>Attributes</h3>\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>options</td>\n    <td><code>object</code></td>\n    <td></td>\n    <td>Serialized JSON representation of display options</td>\n  </tr>\n  <tr>\n    <td>unit</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Unit used</td>\n  </tr>\n  <tr>\n    <td>type</td>\n    <td><code>type</code></td>\n    <td>'line'</td>\n    <td>Chart type, possible value are are: 'line', 'scatter', 'step', 'area', 'bubble', 'pie', 'gauge', 'doughnut',\n      'polar', 'radar', 'bar', 'text', 'image', 'plot', 'annotation', 'gts-tree'\n    </td>\n  </tr>\n  <tr>\n    <td>chart-title</td>\n    <td><code>string</code></td>\n    <td>''</td>\n    <td>Main title</td>\n  </tr>\n  <tr>\n    <td>show-legend</td>\n    <td><code>boolean</code></td>\n    <td>true</td>\n    <td>Shows a legend</td>\n  </tr>\n  <tr>\n    <td>responsive</td>\n    <td><code>boolean</code></td>\n    <td>false</td>\n    <td>Fit the parent space</td>\n  </tr>\n  <tr>\n    <td>url</td>\n    <td><code>string</code></td>\n    <td></td>\n    <td>URL of the Warp 10 endpoint</td>\n  </tr>\n  <tr>\n    <td>gts-filter</td>\n    <td><code>string</code></td>\n    <td></td>\n    <td>GTS Selector regular expression to filter displayed GTS</td>\n  </tr>\n  </tbody>\n</table>\n\n<h3>Options</h3>\n\n<ngx-prism language=\"javascript\">{{ '{ \"autoRefresh\": 5 }' }}</ngx-prism>\n\n<table class=\"table table-striped table-sm\">\n  <thead class=\"thead-dark\">\n  <tr>\n    <th>Name</th>\n    <th>Type</th>\n    <th>Default</th>\n    <th>Description</th>\n  </tr>\n  </thead>\n  <tbody>\n  <tr>\n    <td>autoRefresh</td>\n    <td><code>number</code></td>\n    <td>-1</td>\n    <td>Auto refresh data by posting WarpScript, in seconds. -1 to disable</td>\n  </tr>\n  </tbody>\n</table>\n\n<h3>Data format produced by WarpScript</h3>\n\n<p>Depending of the visualization, refer to the appropriate component.</p>\n\n<p>You can either pass the <a href=\"https://www.warp10.io/content/03_Documentation/04_WarpScript/01_Concepts\" rel=\"noopener\" target=\"_blank\">JSON representation of the stack</a>, or pass the first element of the stack.</p>\n\n<h4>A GTS List</h4>\n<ngx-prism language=\"javascript\" code='[{\n  \"c\": \"class.name\",\n  \"l\": { \"label1\": \"label value\"},\n  \"a\": { \"attribute1\": \"attribute value\"},\n  \"v\" : [[0,0,0,true], [0,\"a\"]]\n  }, ... ]' ></ngx-prism>\n\n<h4>An object holder</h4>\n<p></p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [{\n    \"c\": \"class.name\",\n    \"l\": { \"label1\": \"label value\"},\n    \"a\": { \"attribute1\": \"attribute value\"},\n    \"v\" : [[0,0,0,true], [0,\"a\"]]\n   }, ...],\n   \"globalParams\": {}\n}]' ></ngx-prism>\n<p>or</p>\n<ngx-prism language=\"javascript\" code='[{\n  \"data\": [\n    [\"key\", 54],\n    [\"key 2\", 45]\n  ]\n}]'></ngx-prism>\n\n\n<h3>Global params</h3>\n\n<p>The <i>globalParams</i> JSON Object can hold every items described in <i>options</i> of each component. It will override attributes passed in <i>options</i>.</p>\n"

/***/ }),

/***/ "./src/app/tiles/tile/tile.component.ts":
/*!**********************************************!*\
  !*** ./src/app/tiles/tile/tile.component.ts ***!
  \**********************************************/
/*! exports provided: TileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TileComponent", function() { return TileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TileComponent = /** @class */ (function () {
    function TileComponent() {
        this.warpscript = "@training/dataset0\n  [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\n  false RESETS\n  [ SWAP mapper.delta 1 0 0 ] MAP";
        this.tileSample = "<warp-view-tile url=\"warp 10 url\">\n  << your warpscript >>\n</warp-view-tile>";
    }
    TileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tile',
            template: __webpack_require__(/*! ./tile.component.html */ "./src/app/tiles/tile/tile.component.html"),
            styles: [__webpack_require__(/*! ./tile.component.css */ "./src/app/tiles/tile/tile.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], TileComponent);
    return TileComponent;
}());



/***/ }),

/***/ "./src/app/tiles/welcome/welcome.component.css":
/*!*****************************************************!*\
  !*** ./src/app/tiles/welcome/welcome.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGlsZXMvd2VsY29tZS93ZWxjb21lLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0ciLCJmaWxlIjoic3JjL2FwcC90aWxlcy93ZWxjb21lL3dlbGNvbWUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTggIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4iXX0= */"

/***/ }),

/***/ "./src/app/tiles/welcome/welcome.component.html":
/*!******************************************************!*\
  !*** ./src/app/tiles/welcome/welcome.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n<p>This a collection of charting web components dedicated to\n  <a href=\"https://www.warp10.io\" target=\"_blank\">Warp&nbsp;10™</a></p>\n\n<img src=\"assets/img/warpView.png\" class=\"img-fluid\" style=\"max-width: 600px\" alt=\"Warp View\">\n<h2>Installation</h2>\n<a href=\"https://www.npmjs.com/package/@senx/warpview\" target=\"_blank\"><img src=\"https://badge.fury.io/js/%40senx%2Fwarpview@2x.png\" alt=\"npm version\" height=\"18\"></a>\n<ngx-prism language=\"bash\">npm i @senx/warpview --save</ngx-prism>\n<ngx-prism language=\"bash\">yarn add @senx/warpview</ngx-prism>\n<ngx-prism language=\"bash\">bower install senx-warpview --save</ngx-prism>\n\n<h2>Sample</h2>\n<warp-view-toggle text-1=\"Date\" text-2=\"Timestamp\"></warp-view-toggle>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n"

/***/ }),

/***/ "./src/app/tiles/welcome/welcome.component.ts":
/*!****************************************************!*\
  !*** ./src/app/tiles/welcome/welcome.component.ts ***!
  \****************************************************/
/*! exports provided: WelcomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WelcomeComponent", function() { return WelcomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var WelcomeComponent = /** @class */ (function () {
    function WelcomeComponent() {
        this.sample = "<html>\n  <head>\n    <title>Test</title>\n    <script src=\"https://unpkg.com/@senx/warpview@x.x.x/dist/warpview.js\"></script>\n  </head>\n  <body>\n    <warp-view-toggle text-1=\"Date\" text-2=\"Timestamp\"></warp-view-toggle>\n  </body>\n</html>";
    }
    WelcomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-welcome',
            template: __webpack_require__(/*! ./welcome.component.html */ "./src/app/tiles/welcome/welcome.component.html"),
            styles: [__webpack_require__(/*! ./welcome.component.css */ "./src/app/tiles/welcome/welcome.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], WelcomeComponent);
    return WelcomeComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/xavier/workspace/warpview-demo/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map