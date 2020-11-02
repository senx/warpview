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
import deepEqual from 'deep-equal';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartLib } from '../../utils/chart-lib';
import { GTSLib } from '../../utils/gts.lib';
export class WarpViewGaugeComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.CHART_MARGIN = 0.05;
        this.lineHeight = 50;
        // tslint:disable-next-line:variable-name
        this._type = 'gauge'; // gauge or bullet
        this.layout = {
            showlegend: false,
            autosize: false,
            autoexpand: false,
            margin: {
                t: 10,
                b: 2,
                r: 10,
                l: 10
            },
        };
        this.LOG = new Logger(WarpViewGaugeComponent, this._debug);
    }
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = ChartLib.mergeDeep(this._options, options);
        }
        this.drawChart();
    }
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this._autoResize = this._type !== 'bullet';
        this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
        // this.layout.autosize = true;
        this.layout.grid = {
            rows: Math.ceil(this.plotlyData.length / 2),
            columns: 2,
            pattern: 'independent',
            xgap: 0.2,
            ygap: 0.2
        };
        this.layout.margin = { t: 25, r: 25, l: 25, b: 25 };
        if (this._type === 'bullet') {
            this.layout.height = 100;
            this.layout.yaxis = {
                automargin: true
            };
            this.layout.grid = { rows: this.plotlyData.length, columns: 1, pattern: 'independent', ygap: 0.5 };
            const count = this.plotlyData.length;
            let calculatedHeight = this.lineHeight * count + this.layout.margin.t + this.layout.margin.b;
            calculatedHeight += this.layout.grid.ygap * calculatedHeight;
            this.el.nativeElement.style.height = calculatedHeight + 'px';
            this.el.nativeElement.style.height = calculatedHeight + 'px';
            this.height = calculatedHeight;
            this.layout.height = this.height;
            this.layout.autosize = false;
        }
        this.loading = false;
    }
    convert(data) {
        this.LOG.debug(['convert'], data);
        let gtsList = data.data;
        const dataList = [];
        let overallMax = this._options.maxValue || Number.MIN_VALUE;
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0) {
            return;
        }
        gtsList = GTSLib.flatDeep(gtsList);
        let dataStruct = [];
        if (GTSLib.isGts(gtsList[0])) {
            gtsList.forEach((gts, i) => {
                let max = Number.MIN_VALUE;
                const values = (gts.v || []);
                const val = values[values.length - 1] || [];
                let value = 0;
                if (val.length > 0) {
                    value = val[val.length - 1];
                }
                if (!!data.params && !!data.params[i] && !!data.params[i].maxValue) {
                    max = data.params[i].maxValue;
                }
                else {
                    if (overallMax < value) {
                        overallMax = value;
                    }
                }
                dataStruct.push({
                    key: GTSLib.serializeGtsMetadata(gts),
                    value,
                    max
                });
            });
        }
        else {
            // custom data format
            gtsList.forEach((gts, i) => {
                let max = Number.MIN_VALUE;
                if (!!data.params && !!data.params[i] && !!data.params[i].maxValue) {
                    max = data.params[i].maxValue;
                }
                else {
                    if (overallMax < gts.value || Number.MIN_VALUE) {
                        overallMax = gts.value || Number.MIN_VALUE;
                    }
                }
                dataStruct.push({
                    key: gts.key || '',
                    value: gts.value || Number.MIN_VALUE,
                    max
                });
            });
        }
        //  dataStruct.reverse();
        this.LOG.debug(['convert', 'dataStruct'], dataStruct);
        this.layout.annotations = [];
        let count = Math.ceil(dataStruct.length / 2);
        if (this._type === 'bullet') {
            count = dataStruct.length;
        }
        const itemHeight = 1 / count;
        let x = 0;
        let y = -1 * itemHeight;
        if (this._type === 'bullet') {
            y = this.CHART_MARGIN;
        }
        dataStruct.forEach((gts, i) => {
            if (this._type === 'bullet') {
                y += itemHeight;
            }
            else {
                if (i % 2 === 0) {
                    y += itemHeight;
                    x = 0;
                }
                else {
                    x = 0.5;
                }
            }
            const c = ColorLib.getColor(i, this._options.scheme);
            const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            const domain = dataStruct.length > 1 ? {
                x: [x + this.CHART_MARGIN, x + 0.5 - this.CHART_MARGIN],
                y: [y - itemHeight + this.CHART_MARGIN, y - this.CHART_MARGIN]
            } : {
                x: [0, 1],
                y: [0, 1]
            };
            if (this._type === 'bullet') {
                domain.x = [0, 1];
                domain.y = [y - itemHeight + this.CHART_MARGIN * 2, y - this.CHART_MARGIN * 2];
                // domain.y = [(i > 0 ? i / dataStruct.length : 0) + this.CHART_MARGIN * 2, (i + 1) / dataStruct.length - this.CHART_MARGIN * 2];
                this.layout.annotations.push({
                    xref: 'x domain',
                    yref: 'y domain',
                    x: 0,
                    xanchor: 'left',
                    y: (i + 1) / count + this.CHART_MARGIN,
                    yanchor: 'top',
                    text: gts.key,
                    showarrow: false,
                    align: 'left',
                    font: {
                        size: 14,
                        color: this.getLabelColor(this.el.nativeElement)
                    }
                });
            }
            dataList.push({
                domain,
                align: 'left',
                value: gts.value,
                delta: {
                    reference: !!data.params && !!data.params[i] && !!data.params[i].delta ? data.params[i].delta + gts.value : 0,
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                title: {
                    text: this._type === 'bullet'
                        || (!!data.params && !!data.params[i] && !!data.params[i].type && data.params[i].type === 'bullet') ? '' : gts.key,
                    align: 'center',
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                number: {
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                type: 'indicator',
                mode: !!data.params && !!data.params[i] && !!data.params[i].delta ? 'number+delta+gauge' : 'gauge+number',
                gauge: {
                    bgcolor: 'transparent',
                    shape: !!data.params && !!data.params[i] && !!data.params[i].type ? data.params[i].type : this._type || 'gauge',
                    bordercolor: this.getGridColor(this.el.nativeElement),
                    axis: {
                        range: [null, overallMax === Number.MIN_VALUE ? gts.max : overallMax],
                        tickcolor: this.getGridColor(this.el.nativeElement),
                        tickfont: { color: this.getGridColor(this.el.nativeElement) }
                    },
                    bar: {
                        color: ColorLib.transparentize(color),
                        thickness: 1,
                        line: {
                            width: 1,
                            color
                        }
                    }
                }
            });
            this.LOG.debug(['convert', 'dataList'], i);
        });
        this.LOG.debug(['convert', 'dataList'], dataList);
        return dataList;
    }
}
WarpViewGaugeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gauge',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height,100%);width:var(--warp-view-chart-width,100%)}"]
            },] }
];
WarpViewGaugeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewGaugeComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWdhdWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWdhdWdlL3dhcnAtdmlldy1nYXVnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFHekQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFTM0MsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGlCQUFpQjtJQXNCM0QsWUFDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUVyQixLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFMbEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQXBCZixpQkFBWSxHQUFHLElBQUks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QUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQzt3QkFDbkQsUUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBQztxQkFDNUQ7b0JBQ0QsR0FBRyxFQUFFO3dCQUNILEtBQUssRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQzt3QkFDckMsU0FBUyxFQUFFLENBQUM7d0JBQ1osSUFBSSxFQUFFOzRCQUNKLEtBQUssRUFBRSxDQUFDOzRCQUNSLEtBQUs7eUJBQ047cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7OztZQXhPRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsdXpDQUErQztnQkFFL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7WUFsQmtCLFVBQVU7WUFBeUIsU0FBUztZQU12RCxXQUFXO1lBTm1CLE1BQU07OzttQkFvQnpDLEtBQUssU0FBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE5nWm9uZSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQgZ2F1Z2UgZnJvbSAnY2FudmFzLWdhdWdlcyc7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi8uLi9tb2RlbC9HVFMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1nYXVnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctZ2F1Z2UuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctZ2F1Z2UuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3R2F1Z2VDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBwcml2YXRlIENIQVJUX01BUkdJTiA9IDAuMDU7XG4gIHByaXZhdGUgbGluZUhlaWdodCA9IDUwO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF90eXBlID0gJ2dhdWdlJzsgLy8gZ2F1Z2Ugb3IgYnVsbGV0XG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIHNob3dsZWdlbmQ6IGZhbHNlLFxuICAgIGF1dG9zaXplOiBmYWxzZSxcbiAgICBhdXRvZXhwYW5kOiBmYWxzZSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHQ6IDEwLFxuICAgICAgYjogMixcbiAgICAgIHI6IDEwLFxuICAgICAgbDogMTBcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0dhdWdlQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB0aGlzLmRlZk9wdGlvbnM7XG4gIH1cblxuICB1cGRhdGUob3B0aW9ucywgcmVmcmVzaCk6IHZvaWQge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25PcHRpb25zJywgJ2JlZm9yZSddLCB0aGlzLl9vcHRpb25zLCBvcHRpb25zKTtcbiAgICBpZiAoIWRlZXBFcXVhbChvcHRpb25zLCB0aGlzLl9vcHRpb25zKSkge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydvcHRpb25zJywgJ2NoYW5nZWQnXSwgb3B0aW9ucyk7XG4gICAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMgYXMgUGFyYW0pIGFzIFBhcmFtO1xuICAgIH1cbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fYXV0b1Jlc2l6ZSA9IHRoaXMuX3R5cGUgIT09ICdidWxsZXQnO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3Bsb3RseURhdGEnXSwgdGhpcy5wbG90bHlEYXRhLCB0aGlzLl90eXBlKTtcbiAgICAvLyB0aGlzLmxheW91dC5hdXRvc2l6ZSA9IHRydWU7XG4gICAgdGhpcy5sYXlvdXQuZ3JpZCA9IHtcbiAgICAgIHJvd3M6IE1hdGguY2VpbCh0aGlzLnBsb3RseURhdGEubGVuZ3RoIC8gMiksXG4gICAgICBjb2x1bW5zOiAyLFxuICAgICAgcGF0dGVybjogJ2luZGVwZW5kZW50JyxcbiAgICAgIHhnYXA6IDAuMixcbiAgICAgIHlnYXA6IDAuMlxuICAgIH07XG4gICAgdGhpcy5sYXlvdXQubWFyZ2luID0ge3Q6IDI1LCByOiAyNSwgbDogMjUsIGI6IDI1fTtcbiAgICBpZiAodGhpcy5fdHlwZSA9PT0gJ2J1bGxldCcpIHtcbiAgICAgIHRoaXMubGF5b3V0LmhlaWdodCA9IDEwMDtcbiAgICAgIHRoaXMubGF5b3V0LnlheGlzID0ge1xuICAgICAgICBhdXRvbWFyZ2luOiB0cnVlXG4gICAgICB9O1xuICAgICAgdGhpcy5sYXlvdXQuZ3JpZCA9IHtyb3dzOiB0aGlzLnBsb3RseURhdGEubGVuZ3RoLCBjb2x1bW5zOiAxLCBwYXR0ZXJuOiAnaW5kZXBlbmRlbnQnLCB5Z2FwOiAwLjV9O1xuICAgICAgY29uc3QgY291bnQgPSB0aGlzLnBsb3RseURhdGEubGVuZ3RoO1xuICAgICAgbGV0IGNhbGN1bGF0ZWRIZWlnaHQgPSB0aGlzLmxpbmVIZWlnaHQgKiBjb3VudCArIHRoaXMubGF5b3V0Lm1hcmdpbi50ICsgdGhpcy5sYXlvdXQubWFyZ2luLmI7XG4gICAgICBjYWxjdWxhdGVkSGVpZ2h0ICs9IHRoaXMubGF5b3V0LmdyaWQueWdhcCAqIGNhbGN1bGF0ZWRIZWlnaHQ7XG4gICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY2FsY3VsYXRlZEhlaWdodCArICdweCc7XG4gICAgICAodGhpcy5lbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxEaXZFbGVtZW50KS5zdHlsZS5oZWlnaHQgPSBjYWxjdWxhdGVkSGVpZ2h0ICsgJ3B4JztcbiAgICAgIHRoaXMuaGVpZ2h0ID0gY2FsY3VsYXRlZEhlaWdodDtcbiAgICAgIHRoaXMubGF5b3V0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgdGhpcy5sYXlvdXQuYXV0b3NpemUgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBhbnlbXSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIGRhdGEpO1xuICAgIGxldCBndHNMaXN0ID0gZGF0YS5kYXRhIGFzIGFueVtdO1xuICAgIGNvbnN0IGRhdGFMaXN0ID0gW107XG4gICAgbGV0IG92ZXJhbGxNYXggPSB0aGlzLl9vcHRpb25zLm1heFZhbHVlIHx8IE51bWJlci5NSU5fVkFMVUU7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2d0c0xpc3QnXSwgZ3RzTGlzdCk7XG4gICAgaWYgKCFndHNMaXN0IHx8IGd0c0xpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGd0c0xpc3QgPSBHVFNMaWIuZmxhdERlZXAoZ3RzTGlzdCk7XG4gICAgbGV0IGRhdGFTdHJ1Y3QgPSBbXTtcbiAgICBpZiAoR1RTTGliLmlzR3RzKGd0c0xpc3RbMF0pKSB7XG4gICAgICBndHNMaXN0LmZvckVhY2goKGd0czogR1RTLCBpKSA9PiB7XG4gICAgICAgIGxldCBtYXg6IG51bWJlciA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IChndHMudiB8fCBbXSk7XG4gICAgICAgIGNvbnN0IHZhbCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV0gfHwgW107XG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhbHVlID0gdmFsW3ZhbC5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISFkYXRhLnBhcmFtcyAmJiAhIWRhdGEucGFyYW1zW2ldICYmICEhZGF0YS5wYXJhbXNbaV0ubWF4VmFsdWUpIHtcbiAgICAgICAgICBtYXggPSBkYXRhLnBhcmFtc1tpXS5tYXhWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3ZlcmFsbE1heCA8IHZhbHVlKSB7XG4gICAgICAgICAgICBvdmVyYWxsTWF4ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRhdGFTdHJ1Y3QucHVzaCh7XG4gICAgICAgICAga2V5OiBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKSxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICBtYXhcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY3VzdG9tIGRhdGEgZm9ybWF0XG4gICAgICBndHNMaXN0LmZvckVhY2goKGd0cywgaSkgPT4ge1xuICAgICAgICBsZXQgbWF4OiBudW1iZXIgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgICBpZiAoISFkYXRhLnBhcmFtcyAmJiAhIWRhdGEucGFyYW1zW2ldICYmICEhZGF0YS5wYXJhbXNbaV0ubWF4VmFsdWUpIHtcbiAgICAgICAgICBtYXggPSBkYXRhLnBhcmFtc1tpXS5tYXhWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3ZlcmFsbE1heCA8IGd0cy52YWx1ZSB8fCBOdW1iZXIuTUlOX1ZBTFVFKSB7XG4gICAgICAgICAgICBvdmVyYWxsTWF4ID0gZ3RzLnZhbHVlIHx8IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRhdGFTdHJ1Y3QucHVzaCh7XG4gICAgICAgICAga2V5OiBndHMua2V5IHx8ICcnLFxuICAgICAgICAgIHZhbHVlOiBndHMudmFsdWUgfHwgTnVtYmVyLk1JTl9WQUxVRSxcbiAgICAgICAgICBtYXhcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gIGRhdGFTdHJ1Y3QucmV2ZXJzZSgpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdkYXRhU3RydWN0J10sIGRhdGFTdHJ1Y3QpO1xuICAgIHRoaXMubGF5b3V0LmFubm90YXRpb25zID0gW107XG4gICAgbGV0IGNvdW50ID0gTWF0aC5jZWlsKGRhdGFTdHJ1Y3QubGVuZ3RoIC8gMik7XG4gICAgaWYgKHRoaXMuX3R5cGUgPT09ICdidWxsZXQnKSB7XG4gICAgICBjb3VudCA9IGRhdGFTdHJ1Y3QubGVuZ3RoO1xuICAgIH1cbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gMSAvIGNvdW50O1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgeSA9IC0xICogaXRlbUhlaWdodDtcblxuICAgIGlmICh0aGlzLl90eXBlID09PSAnYnVsbGV0Jykge1xuICAgICAgeSA9IHRoaXMuQ0hBUlRfTUFSR0lOO1xuICAgIH1cbiAgICBkYXRhU3RydWN0LmZvckVhY2goKGd0cywgaSkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3R5cGUgPT09ICdidWxsZXQnKSB7XG4gICAgICAgIHkgKz0gaXRlbUhlaWdodDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpICUgMiA9PT0gMCkge1xuICAgICAgICAgIHkgKz0gaXRlbUhlaWdodDtcbiAgICAgICAgICB4ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4ID0gMC41O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoaSwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgY29uc3QgY29sb3IgPSAoKGRhdGEucGFyYW1zIHx8IFtdKVtpXSB8fCB7ZGF0YXNldENvbG9yOiBjfSkuZGF0YXNldENvbG9yIHx8IGM7XG4gICAgICBjb25zdCBkb21haW4gPSBkYXRhU3RydWN0Lmxlbmd0aCA+IDEgPyB7XG4gICAgICAgIHg6IFt4ICsgdGhpcy5DSEFSVF9NQVJHSU4sIHggKyAwLjUgLSB0aGlzLkNIQVJUX01BUkdJTl0sXG4gICAgICAgIHk6IFt5IC0gaXRlbUhlaWdodCArIHRoaXMuQ0hBUlRfTUFSR0lOLCB5IC0gdGhpcy5DSEFSVF9NQVJHSU5dXG4gICAgICB9IDoge1xuICAgICAgICB4OiBbMCwgMV0sXG4gICAgICAgIHk6IFswLCAxXVxuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLl90eXBlID09PSAnYnVsbGV0Jykge1xuICAgICAgICBkb21haW4ueCA9IFswLCAxXTtcbiAgICAgICAgZG9tYWluLnkgPSBbeSAtIGl0ZW1IZWlnaHQgKyB0aGlzLkNIQVJUX01BUkdJTiAqIDIsIHkgLSB0aGlzLkNIQVJUX01BUkdJTiAqIDJdO1xuICAgICAgICAvLyBkb21haW4ueSA9IFsoaSA+IDAgPyBpIC8gZGF0YVN0cnVjdC5sZW5ndGggOiAwKSArIHRoaXMuQ0hBUlRfTUFSR0lOICogMiwgKGkgKyAxKSAvIGRhdGFTdHJ1Y3QubGVuZ3RoIC0gdGhpcy5DSEFSVF9NQVJHSU4gKiAyXTtcbiAgICAgICAgdGhpcy5sYXlvdXQuYW5ub3RhdGlvbnMucHVzaCh7XG4gICAgICAgICAgeHJlZjogJ3ggZG9tYWluJyxcbiAgICAgICAgICB5cmVmOiAneSBkb21haW4nLFxuICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgeGFuY2hvcjogJ2xlZnQnLFxuICAgICAgICAgIHk6IChpICsgMSkgLyBjb3VudCArIHRoaXMuQ0hBUlRfTUFSR0lOLFxuICAgICAgICAgIHlhbmNob3I6ICd0b3AnLFxuICAgICAgICAgIHRleHQ6IGd0cy5rZXksXG4gICAgICAgICAgc2hvd2Fycm93OiBmYWxzZSxcbiAgICAgICAgICBhbGlnbjogJ2xlZnQnLFxuICAgICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgIHNpemU6IDE0LFxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0TGFiZWxDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGRhdGFMaXN0LnB1c2goXG4gICAgICAgIHtcbiAgICAgICAgICBkb21haW4sXG4gICAgICAgICAgYWxpZ246ICdsZWZ0JyxcbiAgICAgICAgICB2YWx1ZTogZ3RzLnZhbHVlLFxuICAgICAgICAgIGRlbHRhOiB7XG4gICAgICAgICAgICByZWZlcmVuY2U6ICEhZGF0YS5wYXJhbXMgJiYgISFkYXRhLnBhcmFtc1tpXSAmJiAhIWRhdGEucGFyYW1zW2ldLmRlbHRhID8gZGF0YS5wYXJhbXNbaV0uZGVsdGEgKyBndHMudmFsdWUgOiAwLFxuICAgICAgICAgICAgZm9udDoge2NvbG9yOiB0aGlzLmdldExhYmVsQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLl90eXBlID09PSAnYnVsbGV0J1xuICAgICAgICAgICAgfHwgKCEhZGF0YS5wYXJhbXMgJiYgISFkYXRhLnBhcmFtc1tpXSAmJiAhIWRhdGEucGFyYW1zW2ldLnR5cGUgJiYgZGF0YS5wYXJhbXNbaV0udHlwZSA9PT0gJ2J1bGxldCcpID8gJycgOiBndHMua2V5LFxuICAgICAgICAgICAgYWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgZm9udDoge2NvbG9yOiB0aGlzLmdldExhYmVsQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIG51bWJlcjoge1xuICAgICAgICAgICAgZm9udDoge2NvbG9yOiB0aGlzLmdldExhYmVsQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHR5cGU6ICdpbmRpY2F0b3InLFxuICAgICAgICAgIG1vZGU6ICEhZGF0YS5wYXJhbXMgJiYgISFkYXRhLnBhcmFtc1tpXSAmJiAhIWRhdGEucGFyYW1zW2ldLmRlbHRhID8gJ251bWJlcitkZWx0YStnYXVnZScgOiAnZ2F1Z2UrbnVtYmVyJyxcbiAgICAgICAgICBnYXVnZToge1xuICAgICAgICAgICAgYmdjb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIHNoYXBlOiAhIWRhdGEucGFyYW1zICYmICEhZGF0YS5wYXJhbXNbaV0gJiYgISFkYXRhLnBhcmFtc1tpXS50eXBlID8gZGF0YS5wYXJhbXNbaV0udHlwZSA6IHRoaXMuX3R5cGUgfHwgJ2dhdWdlJyxcbiAgICAgICAgICAgIGJvcmRlcmNvbG9yOiB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpLFxuICAgICAgICAgICAgYXhpczoge1xuICAgICAgICAgICAgICByYW5nZTogW251bGwsIG92ZXJhbGxNYXggPT09IE51bWJlci5NSU5fVkFMVUUgPyBndHMubWF4IDogb3ZlcmFsbE1heF0sXG4gICAgICAgICAgICAgIHRpY2tjb2xvcjogdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KSxcbiAgICAgICAgICAgICAgdGlja2ZvbnQ6IHtjb2xvcjogdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KX1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiYXI6IHtcbiAgICAgICAgICAgICAgY29sb3I6IENvbG9yTGliLnRyYW5zcGFyZW50aXplKGNvbG9yKSxcbiAgICAgICAgICAgICAgdGhpY2tuZXNzOiAxLFxuICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgICAgY29sb3JcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZGF0YUxpc3QnXSwgaSk7XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2RhdGFMaXN0J10sIGRhdGFMaXN0KTtcbiAgICByZXR1cm4gZGF0YUxpc3Q7XG4gIH1cbn1cbiJdfQ==