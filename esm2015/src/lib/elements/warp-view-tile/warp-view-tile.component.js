/*
 *  Copyright 2020  SenX S.A.S.
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
 *
 */
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewChild } from '@angular/core';
import { GTSLib } from '../../utils/gts.lib';
import { HttpErrorHandler } from '../../services/http-error-handler.service';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Warp10Service } from '../../services/warp10.service';
import { Logger } from '../../utils/logger';
import { WarpViewResultTileComponent } from '../warp-view-result-tile/warp-view-result-tile.component';
export class WarpViewTileComponent extends WarpViewComponent {
    constructor(el, sizeService, renderer, ngZone, warp10Service) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.sizeService = sizeService;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.warp10Service = warp10Service;
        this.warpscriptResult = new EventEmitter();
        this.execStatus = new EventEmitter();
        this.execError = new EventEmitter();
        this.type = 'line';
        this.url = '';
        this.isAlone = false; // used by plot to manage its keyboard events
        this.loaderMessage = '';
        this.loading = false;
        this._gtsFilter = '';
        this._warpScript = '';
        this.execUrl = '';
        this.timeUnit = 'us';
        this.LOG = new Logger(WarpViewTileComponent, this._debug);
    }
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
    }
    set warpscript(warpScript) {
        if (!!warpScript && this._warpScript !== warpScript) {
            this._warpScript = warpScript;
            this.execute(true);
        }
    }
    get warpscript() {
        return this._warpScript;
    }
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    ngAfterViewInit() {
        this._warpScript = this._warpScript || this.warpRef.nativeElement.textContent.trim();
        this.LOG.debug(['ngAfterViewInit', 'warpScript'], this._warpScript);
        this.el.nativeElement.style.opacity = '1';
        if (this.warpRef.nativeElement.textContent.trim() !== '') {
            this.execute(false);
        }
    }
    update(options) {
        this.LOG.debug(['update', 'options'], options);
    }
    /* Listeners */
    // @HostListener('keydown', ['$event'])
    handleKeyDown(event) {
        if (event.key === 'r') {
            this.execute(false);
        }
    }
    /** detect some VSCode special modifiers in the beginnig of the code:
     * @endpoint xxxURLxxx
     * @timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     */
    detectWarpScriptSpecialComments() {
        // analyse the first warpScript lines starting with //
        const extraParamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
        const warpscriptLines = this._warpScript.split('\n');
        for (let l = 1; l < warpscriptLines.length; l++) {
            const currentLine = warpscriptLines[l];
            if (currentLine === '' || currentLine.search('//') >= 0) {
                // find and extract
                let lineOnMatch;
                const re = RegExp(extraParamsPattern);
                while (lineOnMatch = re.exec(currentLine)) {
                    const parameterName = lineOnMatch[1];
                    const parameterValue = lineOnMatch[2];
                    switch (parameterName) {
                        case 'endpoint': //        // @endpoint http://mywarp10server/api/v0/exec
                            this.execUrl = parameterValue;
                            break;
                        case 'timeUnit':
                            this.timeUnit = parameterValue.toLowerCase(); // set the time unit for graphs
                            break;
                        default:
                            break;
                    }
                }
            }
            else {
                break; // no more comments at the beginning of the file
            }
        }
    }
    execute(isRefresh) {
        if (!!this._warpScript && this._warpScript.trim() !== '') {
            this.LOG.debug(['execute'], isRefresh);
            this.error = undefined;
            this.loading = !isRefresh;
            this.execResult = undefined;
            this.loaderMessage = 'Requesting data';
            this.execUrl = this.url;
            this.detectWarpScriptSpecialComments();
            this.LOG.debug(['execute', 'warpScript'], this._warpScript);
            this.warp10Service.exec(this._warpScript, this.execUrl).subscribe((response) => {
                this.loading = false;
                this.LOG.debug(['execute'], response);
                if (response.body) {
                    try {
                        const body = response.body;
                        this.warpscriptResult.emit(body);
                        const headers = response.headers;
                        this.status = `Your script execution took
 ${GTSLib.formatElapsedTime(parseInt(headers.get('x-warp10-elapsed'), 10))}
 serverside, fetched
 ${headers.get('x-warp10-fetched')} datapoints and performed
 ${headers.get('x-warp10-ops')}  WarpScript operations.`;
                        this.execStatus.emit({
                            message: this.status,
                            ops: parseInt(headers.get('x-warp10-ops'), 10),
                            elapsed: parseInt(headers.get('x-warp10-elapsed'), 10),
                            fetched: parseInt(headers.get('x-warp10-fetched'), 10),
                        });
                        if (this._autoRefresh !== this._options.autoRefresh) {
                            this._autoRefresh = this._options.autoRefresh;
                            if (this.timer) {
                                window.clearInterval(this.timer);
                            }
                            if (this._autoRefresh && this._autoRefresh > 0) {
                                this.timer = window.setInterval(() => {
                                    this.execute(true);
                                }, this._autoRefresh * 1000);
                            }
                        }
                        setTimeout(() => {
                            this.execResult = body;
                            this.resultTile.setResult(this.execResult, isRefresh);
                            this._options.bounds = {};
                            this._options = Object.assign({}, this._options);
                            this.loading = false;
                        });
                    }
                    catch (e) {
                        this.LOG.error(['execute'], e);
                        this.loading = false;
                    }
                }
                else {
                    this.LOG.error(['execute'], response);
                    this.error = response;
                    this.loading = false;
                    this.execError.emit(response);
                }
            }, e => {
                this.loading = false;
                this.execError.emit(e);
                this.LOG.error(['execute'], e);
            });
        }
    }
    convert(data) {
        return [];
    }
    chartDrawn(event) {
        this.chartDraw.emit(event);
    }
    onWarpViewNewOptions(opts) {
        this._options = opts;
    }
}
WarpViewTileComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-tile',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\">\n  <div class=\"tilewrapper\">\n    <h1 *ngIf=\"chartTitle\">{{chartTitle}}</h1>\n    <div [ngClass]=\"{'tile': true,'notitle':  !chartTitle || chartTitle === ''}\">\n      <warpview-spinner *ngIf=\"loading\" message=\"Requesting data\"></warpview-spinner>\n      <div *ngIf=\"_options.showErrors && error\" style=\"height: calc(100% - 30px); width: 100%\">\n        <warpview-display [responsive]=\"true\" [debug]=\"debug\" [options]=\"_options\"\n                          [data]=\"{ data: error,  globalParams: {\n  timeMode:  'custom', bgColor: '#D32C2E', fontColor: '#ffffff'}}\"></warpview-display>\n      </div>\n      <div *ngIf=\"!error\" style=\"height: 100%; width: 100%; padding-bottom: 20px\" [hidden]=\"loading\">\n        <warpview-result-tile #resultTile\n                              (warpViewNewOptions)=\"onWarpViewNewOptions($event)\"\n                              [debug]=\"debug\" [type]=\"type\"\n                              [unit]=\"unit\" [options]=\"_options\"\n                              (chartDraw)=\"chartDrawn($event)\"\n                              [showLegend]=\"showLegend\"></warpview-result-tile>\n      </div>\n    </div>\n  </div>\n  <small *ngIf=\"_options.showStatus\" class=\"status\">{{status}}</small>\n</div>\n\n<div #warpRef style=\"display: none\">\n  <ng-content></ng-content>\n</div>\n",
                providers: [HttpErrorHandler],
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host,warp-view-tile,warpview-tile{max-height:var(--warp-view-tile-height,100%);min-height:var(--warp-view-tile-height,100%);min-width:var(--warp-view-tile-width,100%);overflow:auto;width:var(--warp-view-tile-width,100%)}:host .error,warp-view-tile .error,warpview-tile .error{color:#dc3545;font-weight:700;text-align:center;width:100%}:host .wrapper,warp-view-tile .wrapper,warpview-tile .wrapper{height:var(--warp-view-tile-height,100%);min-height:50px;opacity:1;position:relative;width:var(--warp-view-tile-width,100%)}:host .wrapper .status,warp-view-tile .wrapper .status,warpview-tile .wrapper .status{background-color:hsla(0,0%,100%,.7);bottom:0;color:#000;font-size:11px;padding:1px 5px;position:absolute;z-index:999}:host .wrapper.full,warp-view-tile .wrapper.full,warpview-tile .wrapper.full{display:flex;flex-direction:column;height:100%;justify-content:space-around;width:100%}:host .wrapper .tilewrapper,warp-view-tile .wrapper .tilewrapper,warpview-tile .wrapper .tilewrapper{height:100%;width:100%}:host .wrapper .tilewrapper .tile,warp-view-tile .wrapper .tilewrapper .tile,warpview-tile .wrapper .tilewrapper .tile{height:calc(var(--warp-view-tile-height, 100%) - 40px);overflow-x:hidden;overflow-y:auto;position:relative;width:100%}:host .wrapper .tilewrapper .notitle,warp-view-tile .wrapper .tilewrapper .notitle,warpview-tile .wrapper .tilewrapper .notitle{height:100%}:host .wrapper .tilewrapper h1,warp-view-tile .wrapper .tilewrapper h1,warpview-tile .wrapper .tilewrapper h1{color:var(--warp-view-font-color);font-size:20px;margin:0;padding:5px}:host .wrapper .tilewrapper h1 small,warp-view-tile .wrapper .tilewrapper h1 small,warpview-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
            },] }
];
WarpViewTileComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: SizeService },
    { type: Renderer2 },
    { type: NgZone },
    { type: Warp10Service }
];
WarpViewTileComponent.propDecorators = {
    warpRef: [{ type: ViewChild, args: ['warpRef', { static: true },] }],
    resultTile: [{ type: ViewChild, args: ['resultTile',] }],
    warpscriptResult: [{ type: Output, args: ['warpscriptResult',] }],
    execStatus: [{ type: Output, args: ['execStatus',] }],
    execError: [{ type: Output, args: ['execError',] }],
    type: [{ type: Input, args: ['type',] }],
    chartTitle: [{ type: Input, args: ['chartTitle',] }],
    url: [{ type: Input, args: ['url',] }],
    isAlone: [{ type: Input, args: ['isAlone',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    warpscript: [{ type: Input }],
    handleKeyDown: [{ type: HostListener, args: ['document:keyup', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXRpbGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycC12aWV3L3Byb2plY3RzL3dhcnB2aWV3LW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctdGlsZS93YXJwLXZpZXctdGlsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzVELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUUxQyxPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSwwREFBMEQsQ0FBQztBQVFyRyxNQUFNLE9BQU8scUJBQXNCLFNBQVEsaUJBQWlCO0lBeUMxRCxZQUNTLEVBQWMsRUFDZCxXQUF3QixFQUN4QixRQUFtQixFQUNuQixNQUFjLEVBQ2IsYUFBNEI7UUFFcEMsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTmxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixhQUFRLEdBQVIsUUFBUSxD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QUFFLENBQUMsZ0JBQWdCLENBQUM7O2FBQzlCOzs7WUExQkMsVUFBVTtZQWVKLFdBQVc7WUFSakIsU0FBUztZQUhULE1BQU07WUFZQSxhQUFhOzs7c0JBWWxCLFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO3lCQUNuQyxTQUFTLFNBQUMsWUFBWTsrQkFFdEIsTUFBTSxTQUFDLGtCQUFrQjt5QkFDekIsTUFBTSxTQUFDLFlBQVk7d0JBQ25CLE1BQU0sU0FBQyxXQUFXO21CQUVsQixLQUFLLFNBQUMsTUFBTTt5QkFDWixLQUFLLFNBQUMsWUFBWTtrQkFDbEIsS0FBSyxTQUFDLEtBQUs7c0JBQ1gsS0FBSyxTQUFDLFNBQVM7d0JBQ2YsS0FBSyxTQUFDLFdBQVc7eUJBSWpCLEtBQUs7NEJBc0RMLFlBQVksU0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0h0dHBFcnJvckhhbmRsZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2h0dHAtZXJyb3ItaGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtXYXJwMTBTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy93YXJwMTAuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7SHR0cFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1dhcnBWaWV3UmVzdWx0VGlsZUNvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LXJlc3VsdC10aWxlL3dhcnAtdmlldy1yZXN1bHQtdGlsZS5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy10aWxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy10aWxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXRpbGUuY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbSHR0cEVycm9ySGFuZGxlcl1cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdUaWxlQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKCd3YXJwUmVmJywge3N0YXRpYzogdHJ1ZX0pIHdhcnBSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3Jlc3VsdFRpbGUnKSByZXN1bHRUaWxlOiBXYXJwVmlld1Jlc3VsdFRpbGVDb21wb25lbnQ7XG5cbiAgQE91dHB1dCgnd2FycHNjcmlwdFJlc3VsdCcpIHdhcnBzY3JpcHRSZXN1bHQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnZXhlY1N0YXR1cycpIGV4ZWNTdGF0dXMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnZXhlY0Vycm9yJykgZXhlY0Vycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQElucHV0KCd0eXBlJykgdHlwZSA9ICdsaW5lJztcbiAgQElucHV0KCdjaGFydFRpdGxlJykgY2hhcnRUaXRsZTtcbiAgQElucHV0KCd1cmwnKSB1cmwgPSAnJztcbiAgQElucHV0KCdpc0Fsb25lJykgaXNBbG9uZSA9IGZhbHNlOyAvLyB1c2VkIGJ5IHBsb3QgdG8gbWFuYWdlIGl0cyBrZXlib2FyZCBldmVudHNcbiAgQElucHV0KCdndHNGaWx0ZXInKSBzZXQgZ3RzRmlsdGVyKGd0c0ZpbHRlcjogc3RyaW5nKSB7XG4gICAgdGhpcy5fZ3RzRmlsdGVyID0gZ3RzRmlsdGVyO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHdhcnBzY3JpcHQod2FycFNjcmlwdDogc3RyaW5nKSB7XG4gICAgaWYgKCEhd2FycFNjcmlwdCAmJiB0aGlzLl93YXJwU2NyaXB0ICE9PSB3YXJwU2NyaXB0KSB7XG4gICAgICB0aGlzLl93YXJwU2NyaXB0ID0gd2FycFNjcmlwdDtcbiAgICAgIHRoaXMuZXhlY3V0ZSh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgd2FycHNjcmlwdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl93YXJwU2NyaXB0O1xuICB9XG5cbiAgbG9hZGVyTWVzc2FnZSA9ICcnO1xuICBlcnJvcjogYW55O1xuICBzdGF0dXM6IHN0cmluZztcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBleGVjUmVzdWx0OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSB0aW1lcjogYW55O1xuICBwcml2YXRlIF9hdXRvUmVmcmVzaDtcbiAgcHJpdmF0ZSBfZ3RzRmlsdGVyID0gJyc7XG4gIHByaXZhdGUgX3dhcnBTY3JpcHQgPSAnJztcbiAgcHJpdmF0ZSBleGVjVXJsID0gJyc7XG4gIHByaXZhdGUgdGltZVVuaXQgPSAndXMnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHdhcnAxMFNlcnZpY2U6IFdhcnAxMFNlcnZpY2UsXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3VGlsZUNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgdGhpcy5kZWZPcHRpb25zO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3dhcnBTY3JpcHQgPSB0aGlzLl93YXJwU2NyaXB0IHx8IHRoaXMud2FycFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCcsICd3YXJwU2NyaXB0J10sIHRoaXMuX3dhcnBTY3JpcHQpO1xuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIGlmICh0aGlzLndhcnBSZWYubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudC50cmltKCkgIT09ICcnKSB7XG4gICAgICB0aGlzLmV4ZWN1dGUoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zOiBQYXJhbSk6IHZvaWQge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlJywgJ29wdGlvbnMnXSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKiBMaXN0ZW5lcnMgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5dXAnLCBbJyRldmVudCddKVxuICAvLyBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdyJykge1xuICAgICAgdGhpcy5leGVjdXRlKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvKiogZGV0ZWN0IHNvbWUgVlNDb2RlIHNwZWNpYWwgbW9kaWZpZXJzIGluIHRoZSBiZWdpbm5pZyBvZiB0aGUgY29kZTpcbiAgICogQGVuZHBvaW50IHh4eFVSTHh4eFxuICAgKiBAdGltZVVuaXQgbnNcbiAgICogd2FybmluZyA6IHRoZSBmaXJzdCBsaW5lIGlzIGVtcHR5ICh0byBjb25maXJtIHdpdGggb3RoZXIgYnJvd3NlcnMpXG4gICAqL1xuICBwcml2YXRlIGRldGVjdFdhcnBTY3JpcHRTcGVjaWFsQ29tbWVudHMoKSB7XG4gICAgLy8gYW5hbHlzZSB0aGUgZmlyc3Qgd2FycFNjcmlwdCBsaW5lcyBzdGFydGluZyB3aXRoIC8vXG4gICAgY29uc3QgZXh0cmFQYXJhbXNQYXR0ZXJuID0gL1xccypcXC9cXC9cXHMqQChcXHcqKVxccyooLiopJC9nO1xuICAgIGNvbnN0IHdhcnBzY3JpcHRMaW5lcyA9IHRoaXMuX3dhcnBTY3JpcHQuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAobGV0IGwgPSAxOyBsIDwgd2FycHNjcmlwdExpbmVzLmxlbmd0aDsgbCsrKSB7XG4gICAgICBjb25zdCBjdXJyZW50TGluZSA9IHdhcnBzY3JpcHRMaW5lc1tsXTtcbiAgICAgIGlmIChjdXJyZW50TGluZSA9PT0gJycgfHwgY3VycmVudExpbmUuc2VhcmNoKCcvLycpID49IDApIHtcbiAgICAgICAgLy8gZmluZCBhbmQgZXh0cmFjdFxuICAgICAgICBsZXQgbGluZU9uTWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsO1xuICAgICAgICBjb25zdCByZSA9IFJlZ0V4cChleHRyYVBhcmFtc1BhdHRlcm4pO1xuICAgICAgICB3aGlsZSAobGluZU9uTWF0Y2ggPSByZS5leGVjKGN1cnJlbnRMaW5lKSkge1xuICAgICAgICAgIGNvbnN0IHBhcmFtZXRlck5hbWUgPSBsaW5lT25NYXRjaFsxXTtcbiAgICAgICAgICBjb25zdCBwYXJhbWV0ZXJWYWx1ZSA9IGxpbmVPbk1hdGNoWzJdO1xuICAgICAgICAgIHN3aXRjaCAocGFyYW1ldGVyTmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnZW5kcG9pbnQnOiAgICAgICAgLy8gICAgICAgIC8vIEBlbmRwb2ludCBodHRwOi8vbXl3YXJwMTBzZXJ2ZXIvYXBpL3YwL2V4ZWNcbiAgICAgICAgICAgICAgdGhpcy5leGVjVXJsID0gcGFyYW1ldGVyVmFsdWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGltZVVuaXQnOlxuICAgICAgICAgICAgICB0aGlzLnRpbWVVbml0ID0gcGFyYW1ldGVyVmFsdWUudG9Mb3dlckNhc2UoKTsgICAvLyBzZXQgdGhlIHRpbWUgdW5pdCBmb3IgZ3JhcGhzXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhazsgLy8gbm8gbW9yZSBjb21tZW50cyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaWxlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBleGVjdXRlKGlzUmVmcmVzaDogYm9vbGVhbikge1xuICAgIGlmICghIXRoaXMuX3dhcnBTY3JpcHQgJiYgdGhpcy5fd2FycFNjcmlwdC50cmltKCkgIT09ICcnKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2V4ZWN1dGUnXSwgaXNSZWZyZXNoKTtcbiAgICAgIHRoaXMuZXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmxvYWRpbmcgPSAhaXNSZWZyZXNoO1xuICAgICAgdGhpcy5leGVjUmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5sb2FkZXJNZXNzYWdlID0gJ1JlcXVlc3RpbmcgZGF0YSc7XG4gICAgICB0aGlzLmV4ZWNVcmwgPSB0aGlzLnVybDtcbiAgICAgIHRoaXMuZGV0ZWN0V2FycFNjcmlwdFNwZWNpYWxDb21tZW50cygpO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydleGVjdXRlJywgJ3dhcnBTY3JpcHQnXSwgdGhpcy5fd2FycFNjcmlwdCk7XG4gICAgICB0aGlzLndhcnAxMFNlcnZpY2UuZXhlYyh0aGlzLl93YXJwU2NyaXB0LCB0aGlzLmV4ZWNVcmwpLnN1YnNjcmliZSgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+IHwgc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2V4ZWN1dGUnXSwgcmVzcG9uc2UpO1xuICAgICAgICBpZiAoKHJlc3BvbnNlIGFzIEh0dHBSZXNwb25zZTxzdHJpbmc+KS5ib2R5KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSAocmVzcG9uc2UgYXMgSHR0cFJlc3BvbnNlPHN0cmluZz4pLmJvZHk7XG4gICAgICAgICAgICB0aGlzLndhcnBzY3JpcHRSZXN1bHQuZW1pdChib2R5KTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSAocmVzcG9uc2UgYXMgSHR0cFJlc3BvbnNlPHN0cmluZz4pLmhlYWRlcnM7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IGBZb3VyIHNjcmlwdCBleGVjdXRpb24gdG9va1xuICR7R1RTTGliLmZvcm1hdEVsYXBzZWRUaW1lKHBhcnNlSW50KGhlYWRlcnMuZ2V0KCd4LXdhcnAxMC1lbGFwc2VkJyksIDEwKSl9XG4gc2VydmVyc2lkZSwgZmV0Y2hlZFxuICR7aGVhZGVycy5nZXQoJ3gtd2FycDEwLWZldGNoZWQnKX0gZGF0YXBvaW50cyBhbmQgcGVyZm9ybWVkXG4gJHtoZWFkZXJzLmdldCgneC13YXJwMTAtb3BzJyl9ICBXYXJwU2NyaXB0IG9wZXJhdGlvbnMuYDtcbiAgICAgICAgICAgIHRoaXMuZXhlY1N0YXR1cy5lbWl0KHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICAgIG9wczogcGFyc2VJbnQoaGVhZGVycy5nZXQoJ3gtd2FycDEwLW9wcycpLCAxMCksXG4gICAgICAgICAgICAgIGVsYXBzZWQ6IHBhcnNlSW50KGhlYWRlcnMuZ2V0KCd4LXdhcnAxMC1lbGFwc2VkJyksIDEwKSxcbiAgICAgICAgICAgICAgZmV0Y2hlZDogcGFyc2VJbnQoaGVhZGVycy5nZXQoJ3gtd2FycDEwLWZldGNoZWQnKSwgMTApLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fYXV0b1JlZnJlc2ggIT09IHRoaXMuX29wdGlvbnMuYXV0b1JlZnJlc2gpIHtcbiAgICAgICAgICAgICAgdGhpcy5fYXV0b1JlZnJlc2ggPSB0aGlzLl9vcHRpb25zLmF1dG9SZWZyZXNoO1xuICAgICAgICAgICAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0aGlzLl9hdXRvUmVmcmVzaCAmJiB0aGlzLl9hdXRvUmVmcmVzaCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLl9hdXRvUmVmcmVzaCAqIDEwMDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5leGVjUmVzdWx0ID0gYm9keTtcbiAgICAgICAgICAgICAgdGhpcy5yZXN1bHRUaWxlLnNldFJlc3VsdCh0aGlzLmV4ZWNSZXN1bHQsIGlzUmVmcmVzaCk7XG4gICAgICAgICAgICAgIHRoaXMuX29wdGlvbnMuYm91bmRzID0ge307XG4gICAgICAgICAgICAgIHRoaXMuX29wdGlvbnMgPSB7Li4udGhpcy5fb3B0aW9uc307XG4gICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5MT0cuZXJyb3IoWydleGVjdXRlJ10sIGUpO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuTE9HLmVycm9yKFsnZXhlY3V0ZSddLCByZXNwb25zZSk7XG4gICAgICAgICAgdGhpcy5lcnJvciA9IHJlc3BvbnNlO1xuICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZXhlY0Vycm9yLmVtaXQocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9LCBlID0+IHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXhlY0Vycm9yLmVtaXQoZSk7XG4gICAgICAgIHRoaXMuTE9HLmVycm9yKFsnZXhlY3V0ZSddLCBlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjaGFydERyYXduKGV2ZW50KSB7XG4gICAgdGhpcy5jaGFydERyYXcuZW1pdChldmVudCk7XG4gIH1cblxuICBvbldhcnBWaWV3TmV3T3B0aW9ucyhvcHRzOiBhbnkpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0cztcbiAgfVxufVxuIl19