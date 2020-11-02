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
import { Component, ElementRef, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { Timsort } from '../../utils/timsort';
export class WarpViewBarComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            showlegend: false,
            xaxis: {},
            yaxis: {
                exponentformat: 'none',
                fixedrange: true,
                showline: true
            },
            margin: {
                t: 10,
                b: 40,
                r: 10,
                l: 50
            }
        };
        this.LOG = new Logger(WarpViewBarComponent, this._debug);
    }
    ngOnInit() {
        this.drawChart();
    }
    update(options) {
        this.drawChart();
    }
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    }
    convert(data) {
        let gtsList = [];
        if (GTSLib.isArray(data.data)) {
            data.data = GTSLib.flatDeep(data.data);
            this.LOG.debug(['convert', 'isArray']);
            if (data.data.length > 0 && GTSLib.isGts(data.data[0])) {
                this.LOG.debug(['convert', 'isArray 2']);
                gtsList = GTSLib.flattenGtsIdArray(data.data, 0).res;
            }
            else {
                this.LOG.debug(['convert', 'isArray 3']);
                gtsList = data.data;
            }
        }
        else {
            this.LOG.debug(['convert', 'not array']);
            gtsList = [data.data];
        }
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        const dataset = [];
        gtsList.forEach((gts, i) => {
            this.LOG.debug(['convert', 'gts item'], gts);
            if (gts.v) {
                Timsort.sort(gts.v, (a, b) => a[0] - b[0]);
                const label = GTSLib.serializeGtsMetadata(gts);
                const c = ColorLib.getColor(gts.id || i, this._options.scheme);
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                const series = {
                    type: 'bar',
                    mode: 'lines+markers',
                    name: label,
                    text: label,
                    orientation: this._options.horizontal ? 'h' : 'v',
                    x: [],
                    y: [],
                    hoverinfo: 'none',
                    marker: {
                        color: ColorLib.transparentize(color),
                        line: {
                            color,
                            width: 1
                        }
                    }
                };
                gts.v.forEach(value => {
                    const ts = value[0];
                    if (!this._options.horizontal) {
                        series.y.push(value[value.length - 1]);
                        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                            series.x.push(ts);
                        }
                        else {
                            series.x.push(GTSLib.toISOString(ts, this.divider, this._options.timeZone));
                        }
                    }
                    else {
                        series.x.push(value[value.length - 1]);
                        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                            series.y.push(ts);
                        }
                        else {
                            series.y.push(GTSLib.toISOString(ts, this.divider, this._options.timeZone));
                        }
                    }
                });
                dataset.push(series);
            }
            else {
                this._options.timeMode = 'custom';
                this.LOG.debug(['convert', 'gts'], gts);
                (gts.columns || []).forEach((label, index) => {
                    const c = ColorLib.getColor(gts.id || index, this._options.scheme);
                    const color = ((data.params || [])[index] || { datasetColor: c }).datasetColor || c;
                    const series = {
                        type: 'bar',
                        mode: 'lines+markers',
                        name: label,
                        text: label,
                        orientation: this._options.horizontal ? 'h' : 'v',
                        x: [],
                        y: [],
                        hoverinfo: 'none',
                        marker: {
                            color: ColorLib.transparentize(color),
                            line: {
                                color,
                                width: 1
                            }
                        }
                    };
                    if (this._options.horizontal) {
                        (gts.rows || []).forEach(r => {
                            series.y.unshift(r[0]);
                            series.x.push(r[index + 1]);
                        });
                    }
                    else {
                        (gts.rows || []).forEach(r => {
                            series.x.push(r[0]);
                            series.y.push(r[index + 1]);
                        });
                    }
                    dataset.push(series);
                });
            }
        });
        this.LOG.debug(['convert', 'dataset'], dataset, this._options.horizontal);
        return dataset;
    }
    buildGraph() {
        this.LOG.debug(['buildGraph', 'this.layout'], this.responsive);
        this.LOG.debug(['buildGraph', 'this.layout'], this.layout);
        this.LOG.debug(['buildGraph', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this._showLegend;
        this.layout.barmode = this._options.stacked ? 'stack' : 'group';
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpViewBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-bar',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                 [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                 className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                 [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                 [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block;height:100%}:host .modebar-group path{fill:var(--warp-view-font-color)}:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
            },] }
];
WarpViewBarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1iYXIvd2FycC12aWV3LWJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFVLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUd6RCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRS9DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBUTVDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxpQkFBaUI7SUFrQnpELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFwQnZCLFdBQU0sR0FBaUI7WUFDckIsVUFBVSxFQUFFLEtBQUs7WUFDakIsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFL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QUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNoRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQzs7O1lBbEtGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsdytDQUE2QztnQkFFN0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7WUFoQmtCLFVBQVU7WUFBa0IsU0FBUztZQU9oRCxXQUFXO1lBUFksTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIE5nWm9uZSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge1RpbXNvcnR9IGZyb20gJy4uLy4uL3V0aWxzL3RpbXNvcnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1iYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1iYXIuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3QmFyQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIHNob3dsZWdlbmQ6IGZhbHNlLFxuICAgIHhheGlzOiB7fSxcbiAgICB5YXhpczoge1xuICAgICAgZXhwb25lbnRmb3JtYXQ6ICdub25lJyxcbiAgICAgIGZpeGVkcmFuZ2U6IHRydWUsXG4gICAgICBzaG93bGluZTogdHJ1ZVxuICAgIH0sXG4gICAgbWFyZ2luOiB7XG4gICAgICB0OiAxMCxcbiAgICAgIGI6IDQwLFxuICAgICAgcjogMTAsXG4gICAgICBsOiA1MFxuICAgIH1cbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdCYXJDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0pOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3Q2hhcnQoKSB7XG4gICAgaWYgKCF0aGlzLmluaXRDaGFydCh0aGlzLmVsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBsb3RseUNvbmZpZy5zY3JvbGxab29tID0gdHJ1ZTtcbiAgICB0aGlzLmJ1aWxkR3JhcGgoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICBsZXQgZ3RzTGlzdCA9IFtdO1xuICAgIGlmIChHVFNMaWIuaXNBcnJheShkYXRhLmRhdGEpKSB7XG4gICAgICBkYXRhLmRhdGEgPSBHVFNMaWIuZmxhdERlZXAoZGF0YS5kYXRhIGFzIGFueVtdKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdpc0FycmF5J10pO1xuICAgICAgaWYgKGRhdGEuZGF0YS5sZW5ndGggPiAwICYmIEdUU0xpYi5pc0d0cyhkYXRhLmRhdGFbMF0pKSB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdpc0FycmF5IDInXSk7XG4gICAgICAgIGd0c0xpc3QgPSBHVFNMaWIuZmxhdHRlbkd0c0lkQXJyYXkoZGF0YS5kYXRhIGFzIGFueVtdLCAwKS5yZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnaXNBcnJheSAzJ10pO1xuICAgICAgICBndHNMaXN0ID0gZGF0YS5kYXRhIGFzIGFueVtdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnbm90IGFycmF5J10pO1xuICAgICAgZ3RzTGlzdCA9IFtkYXRhLmRhdGFdO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZ3RzTGlzdCddLCBndHNMaXN0KTtcbiAgICBjb25zdCBkYXRhc2V0ID0gW107XG4gICAgZ3RzTGlzdC5mb3JFYWNoKChndHMsIGkpID0+IHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdndHMgaXRlbSddLCBndHMpO1xuICAgICAgaWYgKGd0cy52KSB7XG4gICAgICAgIFRpbXNvcnQuc29ydChndHMudiwgKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKTtcbiAgICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCB8fCBpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbaV0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICBjb25zdCBzZXJpZXM6IFBhcnRpYWw8YW55PiA9IHtcbiAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICBtb2RlOiAnbGluZXMrbWFya2VycycsXG4gICAgICAgICAgbmFtZTogbGFiZWwsXG4gICAgICAgICAgdGV4dDogbGFiZWwsXG4gICAgICAgICAgb3JpZW50YXRpb246IHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCA/ICdoJyA6ICd2JyxcbiAgICAgICAgICB4OiBbXSxcbiAgICAgICAgICB5OiBbXSxcbiAgICAgICAgICBob3ZlcmluZm86ICdub25lJyxcbiAgICAgICAgICBtYXJrZXI6IHtcbiAgICAgICAgICAgIGNvbG9yOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciksXG4gICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICB3aWR0aDogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZ3RzLnYuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgY29uc3QgdHMgPSB2YWx1ZVswXTtcbiAgICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgc2VyaWVzLnkucHVzaCh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICAgICAgICBzZXJpZXMueC5wdXNoKHRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlcmllcy54LnB1c2goR1RTTGliLnRvSVNPU3RyaW5nKHRzLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VyaWVzLngucHVzaCh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICAgICAgICBzZXJpZXMueS5wdXNoKHRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlcmllcy55LnB1c2goR1RTTGliLnRvSVNPU3RyaW5nKHRzLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYXRhc2V0LnB1c2goc2VyaWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPSAnY3VzdG9tJztcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2d0cyddLCBndHMpO1xuICAgICAgICAoZ3RzLmNvbHVtbnMgfHwgW10pLmZvckVhY2goKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihndHMuaWQgfHwgaW5kZXgsIHRoaXMuX29wdGlvbnMuc2NoZW1lKTtcbiAgICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2luZGV4XSB8fCB7ZGF0YXNldENvbG9yOiBjfSkuZGF0YXNldENvbG9yIHx8IGM7XG4gICAgICAgICAgY29uc3Qgc2VyaWVzOiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgIG1vZGU6ICdsaW5lcyttYXJrZXJzJyxcbiAgICAgICAgICAgIG5hbWU6IGxhYmVsLFxuICAgICAgICAgICAgdGV4dDogbGFiZWwsXG4gICAgICAgICAgICBvcmllbnRhdGlvbjogdGhpcy5fb3B0aW9ucy5ob3Jpem9udGFsID8gJ2gnIDogJ3YnLFxuICAgICAgICAgICAgeDogW10sXG4gICAgICAgICAgICB5OiBbXSxcbiAgICAgICAgICAgIGhvdmVyaW5mbzogJ25vbmUnLFxuICAgICAgICAgICAgbWFya2VyOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciksXG4gICAgICAgICAgICAgIGxpbmU6IHtcbiAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICB3aWR0aDogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICAoZ3RzLnJvd3MgfHwgW10pLmZvckVhY2gociA9PiB7XG4gICAgICAgICAgICAgIHNlcmllcy55LnVuc2hpZnQoclswXSk7XG4gICAgICAgICAgICAgIHNlcmllcy54LnB1c2gocltpbmRleCArIDFdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoZ3RzLnJvd3MgfHwgW10pLmZvckVhY2gociA9PiB7XG4gICAgICAgICAgICAgIHNlcmllcy54LnB1c2goclswXSk7XG4gICAgICAgICAgICAgIHNlcmllcy55LnB1c2gocltpbmRleCArIDFdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkYXRhc2V0LnB1c2goc2VyaWVzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2RhdGFzZXQnXSwgZGF0YXNldCwgdGhpcy5fb3B0aW9ucy5ob3Jpem9udGFsKTtcbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRHcmFwaCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2J1aWxkR3JhcGgnLCAndGhpcy5sYXlvdXQnXSwgdGhpcy5yZXNwb25zaXZlKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2J1aWxkR3JhcGgnLCAndGhpcy5sYXlvdXQnXSwgdGhpcy5sYXlvdXQpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnYnVpbGRHcmFwaCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgdGhpcy5sYXlvdXQuc2hvd2xlZ2VuZCA9IHRoaXMuX3Nob3dMZWdlbmQ7XG4gICAgdGhpcy5sYXlvdXQuYmFybW9kZSA9IHRoaXMuX29wdGlvbnMuc3RhY2tlZCA/ICdzdGFjaycgOiAnZ3JvdXAnO1xuICAgIHRoaXMubGF5b3V0LnlheGlzLmNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC54YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==