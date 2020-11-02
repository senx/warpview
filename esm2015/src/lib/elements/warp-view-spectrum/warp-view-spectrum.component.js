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
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ColorLib } from '../../utils/color-lib';
import { GTSLib } from '../../utils/gts.lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
export class WarpViewSpectrumComponent extends WarpViewComponent {
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
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 50
            }
        };
        this._type = 'histogram2d';
        this.visibility = [];
        this.visibilityStatus = 'unknown';
        this.maxTick = 0;
        this.minTick = 0;
        this.visibleGtsId = [];
        this.LOG = new Logger(WarpViewSpectrumComponent, this._debug);
    }
    set type(type) {
        this._type = type;
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
        const type = this._options.histo || { histnorm: 'density', histfunc: 'count' };
        const dataset = [];
        this.LOG.debug(['convert'], this._options);
        this.visibility = [];
        let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray([data.data], 0).res) || [];
        this.maxTick = Number.NEGATIVE_INFINITY;
        this.minTick = Number.POSITIVE_INFINITY;
        this.visibleGtsId = [];
        const nonPlottable = gtsList.filter(g => {
            this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
            return (g.v && !GTSLib.isGtsToPlot(g));
        });
        gtsList = gtsList.filter(g => {
            return (g.v && GTSLib.isGtsToPlot(g));
        });
        // initialize visibility status
        if (this.visibilityStatus === 'unknown') {
            this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
        }
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.type = 'linear';
        }
        else {
            this.layout.xaxis.type = 'date';
        }
        gtsList.forEach((gts, i) => {
            if (gts.v && GTSLib.isGtsToPlot(gts)) {
                const label = GTSLib.serializeGtsMetadata(gts);
                const c = ColorLib.getColor(i, this._options.scheme);
                const color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
                const series = {
                    type: this._type,
                    histnorm: type.histnorm || 'density',
                    histfunc: type.histfunc || 'count',
                    contours: {
                        showlabels: true,
                        labelfont: {
                            color: 'white'
                        }
                    },
                    colorbar: {
                        tickcolor: this.getGridColor(this.el.nativeElement),
                        thickness: 0,
                        tickfont: {
                            color: this.getLabelColor(this.el.nativeElement)
                        },
                        x: 1 + gts.id / 20,
                        xpad: 0
                    },
                    showscale: this.showLegend,
                    colorscale: ColorLib.getColorGradient(gts.id, this._options.scheme),
                    autocolorscale: false,
                    name: label,
                    text: label,
                    x: [],
                    y: [],
                    line: { color },
                    hoverinfo: 'none',
                    connectgaps: false,
                    visible: this._hiddenData.filter(h => h === gts.id).length >= 0,
                };
                gts.v.forEach(value => {
                    const ts = value[0];
                    series.y.push(value[value.length - 1]);
                    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                        series.x.push(ts);
                    }
                    else {
                        series.x.push(GTSLib.toISOString(ts, this.divider, this._options.timeZone));
                    }
                });
                dataset.push(series);
            }
        });
        this.LOG.debug(['convert', 'dataset'], dataset);
        return dataset;
    }
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpViewSpectrumComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-spectrum',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .executionErrorText{background:#faebd7;border:2px solid red;border-radius:3px;color:red;padding:10px;position:absolute;top:-30px}"]
            },] }
];
WarpViewSpectrumComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewSpectrumComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LXNwZWN0cnVtL3dhcnAtdmlldy1zcGVjdHJ1bS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUFrQixpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRzFFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQVExQyxNQUFNLE9BQU8seUJBQTBCLFNBQVEsaUJBQWlCO0lBeUI5RCxZQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBRXJCLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUxsQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBdEJ2QixXQUFNLEdBQWlCO1lBQ3JCLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLEtBQUssRUFBRSxFQUFFO1lBQ1QsS0FBSyxFQUFFLEVBQUU7WUFDVCxN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QUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDOzs7WUE1SUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLDg2Q0FBa0Q7Z0JBRWxELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTOzthQUMzQzs7O1lBZmtCLFVBQVU7WUFBaUIsU0FBUztZQU8vQyxXQUFXO1lBUG1CLE1BQU07OzttQkFrQnpDLEtBQUssU0FBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE5nWm9uZSwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1Zpc2liaWxpdHlTdGF0ZSwgV2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctc3BlY3RydW0nLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1NwZWN0cnVtQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQge1xuXG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiBmYWxzZSxcbiAgICB4YXhpczoge30sXG4gICAgeWF4aXM6IHt9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMTAsXG4gICAgICBiOiAyNSxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogNTBcbiAgICB9XG4gIH07XG4gIHByaXZhdGUgX3R5cGUgPSAnaGlzdG9ncmFtMmQnO1xuICBwcml2YXRlIHZpc2liaWxpdHk6IGJvb2xlYW5bXSA9IFtdO1xuICBwcml2YXRlIHZpc2liaWxpdHlTdGF0dXM6IFZpc2liaWxpdHlTdGF0ZSA9ICd1bmtub3duJztcbiAgcHJpdmF0ZSBtYXhUaWNrID0gMDtcbiAgcHJpdmF0ZSBtaW5UaWNrID0gMDtcbiAgcHJpdmF0ZSB2aXNpYmxlR3RzSWQgPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdTcGVjdHJ1bUNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgdGhpcy5idWlsZEdyYXBoKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgY29uc3QgdHlwZSA9IHRoaXMuX29wdGlvbnMuaGlzdG8gfHwge2hpc3Rub3JtOiAnZGVuc2l0eScsIGhpc3RmdW5jOiAnY291bnQnfTtcbiAgICBjb25zdCBkYXRhc2V0OiBQYXJ0aWFsPGFueT5bXSA9IFtdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCB0aGlzLl9vcHRpb25zKTtcbiAgICB0aGlzLnZpc2liaWxpdHkgPSBbXTtcbiAgICBsZXQgZ3RzTGlzdCA9IEdUU0xpYi5mbGF0RGVlcChHVFNMaWIuZmxhdHRlbkd0c0lkQXJyYXkoW2RhdGEuZGF0YV0gYXMgYW55W10sIDApLnJlcykgfHwgW107XG4gICAgdGhpcy5tYXhUaWNrID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIHRoaXMubWluVGljayA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB0aGlzLnZpc2libGVHdHNJZCA9IFtdO1xuICAgIGNvbnN0IG5vblBsb3R0YWJsZSA9IGd0c0xpc3QuZmlsdGVyKGcgPT4ge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIEdUU0xpYi5pc0d0c1RvUGxvdChnKSk7XG4gICAgICByZXR1cm4gKGcudiAmJiAhR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICB9KTtcbiAgICBndHNMaXN0ID0gZ3RzTGlzdC5maWx0ZXIoZyA9PiB7XG4gICAgICByZXR1cm4gKGcudiAmJiBHVFNMaWIuaXNHdHNUb1Bsb3QoZykpO1xuICAgIH0pO1xuICAgIC8vIGluaXRpYWxpemUgdmlzaWJpbGl0eSBzdGF0dXNcbiAgICBpZiAodGhpcy52aXNpYmlsaXR5U3RhdHVzID09PSAndW5rbm93bicpIHtcbiAgICAgIHRoaXMudmlzaWJpbGl0eVN0YXR1cyA9IGd0c0xpc3QubGVuZ3RoID4gMCA/ICdwbG90dGFibGVTaG93bicgOiAnbm90aGluZ1Bsb3R0YWJsZSc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudHlwZSA9ICdkYXRlJztcbiAgICB9XG4gICAgZ3RzTGlzdC5mb3JFYWNoKChndHM6IEdUUywgaSkgPT4ge1xuICAgICAgaWYgKGd0cy52ICYmIEdUU0xpYi5pc0d0c1RvUGxvdChndHMpKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbZ3RzLmlkXSB8fCB7ZGF0YXNldENvbG9yOiBjfSkuZGF0YXNldENvbG9yIHx8IGM7XG4gICAgICAgIGNvbnN0IHNlcmllczogUGFydGlhbDxhbnk+ID0ge1xuICAgICAgICAgIHR5cGU6IHRoaXMuX3R5cGUsXG4gICAgICAgICAgaGlzdG5vcm06IHR5cGUuaGlzdG5vcm0gfHwgJ2RlbnNpdHknLFxuICAgICAgICAgIGhpc3RmdW5jOiB0eXBlLmhpc3RmdW5jIHx8ICdjb3VudCcsXG4gICAgICAgICAgY29udG91cnM6IHtcbiAgICAgICAgICAgIHNob3dsYWJlbHM6IHRydWUsXG4gICAgICAgICAgICBsYWJlbGZvbnQ6IHtcbiAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbG9yYmFyOiB7XG4gICAgICAgICAgICB0aWNrY29sb3I6IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCksXG4gICAgICAgICAgICB0aGlja25lc3M6IDAsXG4gICAgICAgICAgICB0aWNrZm9udDoge1xuICAgICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRMYWJlbENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB4OiAxICsgZ3RzLmlkIC8gMjAsXG4gICAgICAgICAgICB4cGFkOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93c2NhbGU6IHRoaXMuc2hvd0xlZ2VuZCxcbiAgICAgICAgICBjb2xvcnNjYWxlOiBDb2xvckxpYi5nZXRDb2xvckdyYWRpZW50KGd0cy5pZCwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpLFxuICAgICAgICAgIGF1dG9jb2xvcnNjYWxlOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgICB0ZXh0OiBsYWJlbCxcbiAgICAgICAgICB4OiBbXSxcbiAgICAgICAgICB5OiBbXSxcbiAgICAgICAgICBsaW5lOiB7Y29sb3J9LFxuICAgICAgICAgIGhvdmVyaW5mbzogJ25vbmUnLFxuICAgICAgICAgIGNvbm5lY3RnYXBzOiBmYWxzZSxcbiAgICAgICAgICB2aXNpYmxlOiB0aGlzLl9oaWRkZW5EYXRhLmZpbHRlcihoID0+IGggPT09IGd0cy5pZCkubGVuZ3RoID49IDAsXG4gICAgICAgIH07XG4gICAgICAgIGd0cy52LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgIGNvbnN0IHRzID0gdmFsdWVbMF07XG4gICAgICAgICAgc2VyaWVzLnkucHVzaCh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgICAgIHNlcmllcy54LnB1c2godHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXJpZXMueC5wdXNoKEdUU0xpYi50b0lTT1N0cmluZyh0cywgdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2RhdGFzZXQnXSwgZGF0YXNldCk7XG5cbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRHcmFwaCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLnJlc3BvbnNpdmUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgdGhpcy5sYXlvdXQuc2hvd2xlZ2VuZCA9IHRoaXMuc2hvd0xlZ2VuZDtcbiAgICB0aGlzLmxheW91dC55YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG59XG4iXX0=