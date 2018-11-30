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
                _tiles_gts_tree_gts_tree_component__WEBPACK_IMPORTED_MODULE_35__["GtsTreeComponent"]
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
                _tiles_gts_tree_gts_tree_component__WEBPACK_IMPORTED_MODULE_35__["GtsTreeComponent"]
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

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<header>\n  <div class=\"collapse bg-dark\" [ngbCollapse]=\"collapse\">\n    <div class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-7 py-4\">\n          <h4 class=\"text-white\">About</h4>\n          <p class=\"text-muted\"><a href=\"https://www.warp10.io\" target=\"_blank\">Warp 10&trade;</a> dedicated\n            visualization components.</p>\n          <p class=\"lead text-muted\">Choose a main theme</p>\n          <div class=\"btn-group btn-group-toggle\" ngbRadioGroup name=\"radioBasic\" [(ngModel)]=\"settings.theme\"\n               (ngModelChange)=\"updateSettings($event)\">\n            <label ngbButtonLabel class=\"btn-primary\">\n              <input ngbButton type=\"radio\" value=\"light\"> Light\n            </label>\n            <label ngbButtonLabel class=\"btn-primary\">\n              <input ngbButton type=\"radio\" value=\"dark\"> Dark\n            </label>\n          </div>\n          <!--<p>\n            <label for=\"autoRefresh\" class=\"text-white\">Auto refresh:</label>\n            <select class=\"form-control\" id=\"autoRefresh\" [ngModelOptions]=\"{standalone: true}\"\n                    [(ngModel)]=\"settings.autorefresh\" (ngModelChange)=\"updateSettings($event)\">\n              <option *ngFor=\"let i of autoRefreshList\" [value]=\"i.val\">{{i.label}}</option>\n            </select>\n          </p>-->\n        </div>\n        <div class=\"col-sm-4 offset-md-1 py-4\">\n          <h4 class=\"text-white\">Contact</h4>\n          <ul class=\"list-unstyled\">\n            <li><a href=\"https://twitter.com/warp10\" class=\"text-white\">Follow on Twitter</a></li>\n            <li><a href=\"#\" class=\"text-white\">GitHub</a></li>\n          </ul>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"navbar navbar-dark bg-dark shadow-sm\">\n    <div class=\"container-fluid d-flex justify-content-between\">\n      <a href=\"/\" class=\"navbar-brand d-flex align-items-center\">\n        <img width=\"30\" height=\"30\" class=\"mr-3\"\n             src=\"data:image/png;base64,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\"/>\n        <strong>Warp View</strong>\n      </a>\n      <button class=\"navbar-toggler\" type=\"button\" (click)=\"collapse = !collapse\"\n              [attr.aria-expanded]=\"!collapse\" aria-label=\"Toggle navigation\">\n        <span class=\"navbar-toggler-icon\"></span>\n      </button>\n    </div>\n  </div>\n</header>\n"

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
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"annotation\"\n                    chart-title=\"Annotation\">\n      << your warpscript >>\n</warp-view-tile>";
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.tostring 0 0 0 ] MAP 'values' STORE\n{ 'data' $values }";
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
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"area\"\n                    chart-title=\"Area\">\n      << your warpscript >>\n</warp-view-tile>";
        this.warpscript = "@training/dataset0\n[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\nfalse RESETS\n[ SWAP mapper.delta 1 0 0 ] MAP 'values' STORE\n{ 'data' $values }";
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
        this.warpscript = "@training/dataset0\n                    [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH\n                    false RESETS\n                    [ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE\n                    [ SWAP mapper.delta 1 0 0 ] MAP 'values' STORE\n                    { 'data' $values }";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\"\n                    type=\"bar\"\n                    show-legend=\"false\"\n                    chart-title=\"Bar\">\n<< your warpscript >>\n</warp-view-tile>\n";
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
        this.warpscript = "@training/dataset0\n                    [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -30 ] FETCH\n                    false RESETS\n                    [ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE\n      10 LTTB\n      <% DROP 'gts' STORE { $gts NAME $gts VALUES <% DROP 'val' STORE [ RAND 100 * RAND 100 * RAND 100 * ]\n      %>\n      LMAP\n      }\n      %> LMAP 'values' STORE\n      { 'data' $values }";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\"\n                    type=\"bubble\"\n                    show-legend=\"false\"\n                    chart-title=\"Bubbles\">\n<< your warpscript >>\n</warp-view-tile>\n";
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
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\"\n                    show-legend=\"false\"\n                    chart-title=\"Default\">\n<< your warpscript >>\n</warp-view-tile>";
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
        this.warpscript = "@training/dataset0\n                    [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n                    <% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP 'values' STORE\n                    { 'data' $values }";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"pie\" show-legend=\"false\" chart-title=\"Pie\">\n<< your warpscript >>\n</warp-view-tile>\n";
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
        this.warpscript = "@training/dataset0\n                    [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n                    <% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP 'values' STORE\n                    { 'data' $values }";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"gauge\" show-legend=\"false\" chart-title=\"Gauge\">\n<< your warpscript >>\n</warp-view-tile>\n";
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
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"gts-tree\"\n                    chart-title=\"GTS Tree\">\n      << your warpscript >>\n</warp-view-tile>";
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
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" unit=\"\u00B0C\" type=\"image\"\n                    chart-title=\"Image\">\n<< your warpscript >>\n</warp-view-tile>";
        this.warpscript = "//draw tangents along the curve\n                    300 200 '2D3' PGraphics\n                    255 Pbackground\n                    16 PtextSize\n\n                    50 'x1' STORE\n                    50 'y1' STORE\n                    200 'x2' STORE\n                    130 'y2' STORE\n\n                    100 'cx1' STORE\n                    40 'cy1' STORE\n\n                    110 'cx2' STORE\n                    140 'cy2' STORE\n\n\n                    4 PstrokeWeight\n                    $x1 $y1 Ppoint //first anchor\n                    $x2 $y2 Ppoint //second anchor\n\n                    2 PstrokeWeight\n                    $x1 $y1 $cx1 $cy1 Pline\n                    $x2 $y2 $cx2 $cy2 Pline\n\n                    2 PstrokeWeight\n                    0xffff0000 Pstroke\n                    $x1 $y1 $cx1 $cy1 $cx2 $cy2 $x2 $y2 Pbezier\n\n                    0 10\n                    <%\n                    10.0 / 't' STORE\n\n                    $x1 $cx1 $cx2 $x2 $t PbezierPoint 'x' STORE\n                    $y1 $cy1 $cy2 $y2 $t PbezierPoint 'y' STORE\n                    $x1 $cx1 $cx2 $x2 $t PbezierTangent 'tx' STORE\n                    $y1 $cy1 $cy2 $y2 $t PbezierTangent 'ty' STORE\n                    $ty $tx ATAN2 PI 2.0 / - 'angle' STORE\n                    0xff009f00 Pstroke\n                    $x\n                    $y\n                    $x $angle COS 12 * +\n                    $y $angle SIN 12 * +\n                    Pline\n\n                    0x9f009f00 Pfill\n                    PnoStroke\n                    'CENTER' PellipseMode\n                    $x $y 5 5 Pellipse\n\n                    %> FOR\n                    \n                    Pencode";
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
        this.warpscript = "'{\"data\":[{\"c\":\"\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.45877850241959,-0.01000002957880497,1000,8.090169943749475],[1460540131224657,51.49510562885553,-0.02000005915760994,1000,3.0901699437494745],[1460540121224657,51.49510562885553,-0.030000004917383194,1000,-3.0901699437494736],[1460540111224657,51.45877850241959,-0.040000034496188164,1000,-8.090169943749473],[1460540101224657,51.39999998733401,-0.050000064074993134,1000,-10.0],[1460540091224657,51.341221472248435,-0.06000000983476639,1000,-8.090169943749475],[1460540081224657,51.3048943458125,-0.07000003941357136,1000,-3.0901699437494754],[1460540071224657,51.3048943458125,-0.08000006899237633,1000,3.0901699437494723],[1460540061224657,51.341221472248435,-0.09000001475214958,1000,8.090169943749473],[1460540051224657,51.39999998733401,-0.10000004433095455,1000,10.0]]},{\"c\":\"\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.49999998975545,-0.10000004433095455,10],[1460540131224657,51.45999999716878,-0.09000001475214958,9],[1460540121224657,51.41999996267259,-0.08000006899237633,8],[1460540111224657,51.39999998733401,-0.07000003941357136,7],[1460540101224657,51.439999979920685,-0.06000000983476639,6],[1460540091224657,51.47999997250736,-0.050000064074993134,8],[1460540081224657,51.49999998975545,-0.030000004917383194,10],[1460540071224657,51.51999996509403,-0.02000005915760994,9],[1460540061224657,51.539999982342124,-0.01000002957880497,8],[1460540051224657,51.55999999959022,0.0,9]]},{\"c\":\"\",\"l\":{},\"a\":{},\"v\":[[1460540141224657,51.49999998975545,-0.10000004433095455,\"a\"],[1460540131224657,51.45999999716878,-0.09000001475214958,\"b\"],[1460540121224657,51.41999996267259,-0.08000006899237633,\"c\"],[1460540111224657,51.39999998733401,-0.07000003941357136,\"d\"]]},{\"c\":\"\",\"l\":{},\"a\":{},\"v\":[[1460540136224657,51.439999979920685,0.05999992601573467,true],[1460540116224657,51.47999997250736,0.04999998025596142,false],[1460540096224657,51.49999998975545,0.02999992109835148,true],[1460540076224657,51.51999996509403,0.019999975338578224,false],[1460540056224657,51.539999982342124,0.009999945759773254,true]]},{\"positions\":[[51.5,-0.22],[51.46,-0.3],[51.42,-0.2]]},{\"positions\":[[51.2,-0.12,42],[51.36,-0.0,21],[51.32,-0.2,84]]},{\"positions\":[[51.2,-0.52,42],[51.36,-0.4,21],[51.32,-0.6,84]]},{\"positions\":[[51.1,-0.52,42,10],[51.56,-0.4,21,30],[51.42,-0.6,84,40],[51.3,-0.82,42,1],[51.76,-0.7,21,20],[51.62,-0.9,84,45]]}],\"params\":[{\"color\":\"#ff1010\",\"key\":\"Path A\"},{\"color\":\"#1010ff\",\"key\":\"Path B\"},{\"key\":\"Annotations (text)\",\"render\":\"marker\",\"marker\":\"fuel\"},{\"key\":\"Annotations (boolean)\",\"baseRadius\":5},{\"key\":\"fuel\",\"render\":\"marker\"},{\"key\":\"points\",\"render\":\"dots\",\"color\":\"#ffa\",\"borderColor\":\"#f00\",\"baseRadius\":5},{\"key\":\"points\",\"render\":\"weightedDots\",\"color\":\"#aaf\",\"borderColor\":\"#f00\",\"maxValue\":100,\"minValue\":0,\"baseRadius\":5,\"numSteps\":10},{\"key\":\"coloredWeightedDots\",\"render\":\"coloredWeightedDots\",\"maxValue\":100,\"minValue\":0,\"baseRadius\":5,\"maxColorValue\":50,\"minColorValue\":0,\"numColorSteps\":10,\"startColor\":\"#ff0000\",\"endColor\":\"#00ff00\"}]}' JSON->";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"map\" chart-title=\"Map\">\n<< your warpscript >>\n</warp-view-tile>\n  ";
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
        this.warpscript = "@training/dataset0\n                    [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH\n                    <% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP 'values' STORE\n                    { 'data' $values }";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"pie\" show-legend=\"false\" chart-title=\"Pie\">\n<< your warpscript >>\n</warp-view-tile>\n";
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
        this.warpscript = "@training/dataset0\n      // warp.store.hbase.puts.committed is the number of datapoints committed to\n      // HBase since the restart of the Store daemon\n      [ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 10 d ] FETCH\n      [ SWAP mapper.rate 1 0 0 ] MAP\n      // Keep only 1000 datapoints per GTS\n      1000 LTTB\n      DUP\n      // Detect 5 anomalies per GTS using an ESD (Extreme Studentized Deviate) Test\n      5 false ESDTEST\n      // Convert the ticks identified by ESDTEST into an annotation GTS\n      <%\n      DROP \t\t// excude element index\n      NEWGTS \t// create a new GTS\n      SWAP \t\t// get timestamp list\n      <% NaN NaN NaN 'anomaly' ADDVALUE %> FOREACH // for each timestamp\n      %> LMAP\n      2 ->LIST // Put our GTS in a list\n      ZIP // merge into a list of GTS\n      // Now rename and relabel the anomaly GTS\n      <%\n      DROP \t\t\t\t// exclude element index\n      LIST-> \t\t\t\t// flatten list\n      DROP  \t\t\t\t// exclude number of elements of our list\n      SWAP  \t\t\t\t// put our fetched GTS on the top\n      DUP  \t\t\t\t// duplicate the GTS\n      NAME \t\t\t\t// get the className of the GTS\n      ':anomaly' + 'name' STORE  \t// suffix the name\n      DUP LABELS 'labels' STORE \t// duplicate the GTS and get labels\n      SWAP  \t\t\t\t// put the anomaly GTS on the top of the stack\n      $name RENAME   \t\t\t// rename the GTS\n      $labels RELABEL  \t\t// put labels\n      2 ->LIST   \t\t\t\t// put both GTS in a list\n      %> LMAP";
        this.sample = "<warp-view-tile url=\"warp 10 url\" responsive=\"true\" type=\"plot\" gts-filter=\"anomaly\" chart-title=\"Plot sample\">\n<< your warpscript >>\n</warp-view-tile>";
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

module.exports = "<!--\n  ~  Copyright 2018  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n<p>This a collection of charting web components dedicated to\n  <a href=\"https://www.warp10.io\" target=\"_blank\">Warp&nbsp;10™</a></p>\n\n<img src=\"assets/img/warpView.png\" class=\"img-fluid\" style=\"max-width: 600px\" alt=\"Warp View\">\n<h2>Installation</h2>\n<ngx-prism language=\"bash\">npm i @senx/warpview --save</ngx-prism>\n<ngx-prism language=\"bash\">yarn add @senx/warpview</ngx-prism>\n<ngx-prism language=\"bash\">bower install senx-warpview --save</ngx-prism>\n\n<h2>Sample</h2>\n<warp-view-toggle text-1=\"Date\" text-2=\"Timestamp\"></warp-view-toggle>\n<ngx-prism language=\"markup\">{{sample}}</ngx-prism>\n\n"

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