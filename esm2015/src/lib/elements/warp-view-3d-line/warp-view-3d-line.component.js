import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
export class WarpView3dLineComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            showlegend: false,
            xaxis: {},
            yaxis: {},
            zaxis: {},
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this._type = 'line3d';
        this.LOG = new Logger(WarpView3dLineComponent, this._debug);
    }
    set type(type) {
        this._type = type;
        this.drawChart();
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
        const dataset = [];
        this.LOG.debug(['convert'], data, this._options, this._type);
        GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res)
            .filter(g => (g.v && GTSLib.isGts(g)))
            .forEach((gts, i) => {
            if (gts.v) {
                const label = GTSLib.serializeGtsMetadata(gts);
                const c = ColorLib.getColor(gts.id, this._options.scheme);
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                const series = {
                    mode: 'line',
                    type: 'scatter3d',
                    marker: {
                        color: ColorLib.transparentize(color),
                        size: 3,
                        symbol: 'circle',
                        line: {
                            color,
                            width: 0
                        }
                    },
                    line: {
                        color,
                        width: 1
                    },
                    name: label,
                    x: [],
                    y: [],
                    z: [],
                };
                gts.v.forEach(value => {
                    if (value.length > 2) { // lat lon
                        series.x.push(value[1]);
                        series.y.push(value[2]);
                        series.z.push(value[3]);
                    }
                    else { // time value
                        series.x.push(value[0]);
                        series.y.push(value[1]);
                        series.z.push(1);
                    }
                });
                dataset.push(series);
            }
        });
        return dataset;
    }
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.zaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpView3dLineComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-3d-line',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
            },] }
];
WarpView3dLineComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpView3dLineComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LTNkLWxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycC12aWV3L3Byb2plY3RzL3dhcnB2aWV3LW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctM2QtbGluZS93YXJwLXZpZXctM2QtbGluZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBUS9DLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxpQkFBaUI7SUFxQjVELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFsQnZCLFdBQU0sR0FBaUI7WUFDckIsVUFBVSxFQUFFLEtBQUs7WUFDakIsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFLLEVBQUUsRUFBRTtZQUNULEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFF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SUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQzs7O1lBL0dGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixtOENBQWlEO2dCQUVqRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7YUFDM0M7OztZQWZrQixVQUFVO1lBQXlCLFNBQVM7WUFFdkQsV0FBVztZQUZtQixNQUFNOzs7bUJBa0J6QyxLQUFLLFNBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgTmdab25lLCBPbkluaXQsIFJlbmRlcmVyMiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtXYXJwVmlld0NvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWNvbXBvbmVudCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy0zZC1saW5lJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy0zZC1saW5lLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LTNkLWxpbmUuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3M2RMaW5lQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiBmYWxzZSxcbiAgICB4YXhpczoge30sXG4gICAgeWF4aXM6IHt9LFxuICAgIHpheGlzOiB7fSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHQ6IDEwLFxuICAgICAgYjogMjUsXG4gICAgICByOiAxMCxcbiAgICAgIGw6IDEwXG4gICAgfVxuICB9O1xuICBwcml2YXRlIF90eXBlID0gJ2xpbmUzZCc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3M2RMaW5lQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgdGhpcy5idWlsZEdyYXBoKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgY29uc3QgZGF0YXNldDogUGFydGlhbDxhbnk+W10gPSBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgZGF0YSwgdGhpcy5fb3B0aW9ucywgdGhpcy5fdHlwZSk7XG4gICAgR1RTTGliLmZsYXREZWVwKEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkYXRhLmRhdGEgYXMgYW55W10sIDApLnJlcylcbiAgICAgIC5maWx0ZXIoZyA9PiAoZy52ICYmIEdUU0xpYi5pc0d0cyhnKSkpXG4gICAgICAuZm9yRWFjaCgoZ3RzOiBHVFMsIGkpID0+IHtcbiAgICAgICAgaWYgKGd0cy52KSB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKTtcbiAgICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoZ3RzLmlkLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgICAgY29uc3QgY29sb3IgPSAoKGRhdGEucGFyYW1zIHx8IFtdKVtpXSB8fCB7ZGF0YXNldENvbG9yOiBjfSkuZGF0YXNldENvbG9yIHx8IGM7XG4gICAgICAgICAgY29uc3Qgc2VyaWVzOiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgICAgICAgICBtb2RlOiAnbGluZScsXG4gICAgICAgICAgICB0eXBlOiAnc2NhdHRlcjNkJyxcbiAgICAgICAgICAgIG1hcmtlcjoge1xuICAgICAgICAgICAgICBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpLFxuICAgICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICAgICAgICBzeW1ib2w6ICdjaXJjbGUnLFxuICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbmU6IHtcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHdpZHRoOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogbGFiZWwsXG4gICAgICAgICAgICB4OiBbXSxcbiAgICAgICAgICAgIHk6IFtdLFxuICAgICAgICAgICAgejogW10sXG4gICAgICAgICAgICAvLyAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBndHMudi5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAyKSB7IC8vIGxhdCBsb25cbiAgICAgICAgICAgICAgc2VyaWVzLngucHVzaCh2YWx1ZVsxXSk7XG4gICAgICAgICAgICAgIHNlcmllcy55LnB1c2godmFsdWVbMl0pO1xuICAgICAgICAgICAgICBzZXJpZXMuei5wdXNoKHZhbHVlWzNdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIHRpbWUgdmFsdWVcbiAgICAgICAgICAgICAgc2VyaWVzLngucHVzaCh2YWx1ZVswXSk7XG4gICAgICAgICAgICAgIHNlcmllcy55LnB1c2godmFsdWVbMV0pO1xuICAgICAgICAgICAgICBzZXJpZXMuei5wdXNoKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRhdGFzZXQucHVzaChzZXJpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRHcmFwaCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLnJlc3BvbnNpdmUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgdGhpcy5sYXlvdXQuc2hvd2xlZ2VuZCA9IHRoaXMuc2hvd0xlZ2VuZDtcbiAgICB0aGlzLmxheW91dC55YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnpheGlzLmNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxufVxuIl19