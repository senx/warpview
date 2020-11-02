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
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ColorLib } from '../../utils/color-lib';
import deepEqual from 'deep-equal';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartLib } from '../../utils/chart-lib';
import { GTSLib } from '../../utils/gts.lib';
export class WarpViewPieComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.chartDraw = new EventEmitter();
        this._type = 'pie';
        this.layout = {
            showlegend: true,
            legend: {
                orientation: 'h',
                bgcolor: 'transparent',
            },
            orientation: 270,
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this.LOG = new Logger(WarpViewPieComponent, this._debug);
    }
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = ChartLib.mergeDeep(this._options, options);
        }
        this.drawChart();
    }
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
        this.layout.legend.font = {
            color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
        };
        this.layout.textfont = {
            color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
        };
        this.loading = false;
    }
    convert(data) {
        const gtsList = GTSLib.flatDeep(data.data);
        const plotData = [];
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        const pieData = {
            values: [],
            labels: [],
            marker: {
                colors: [],
                line: {
                    width: 3,
                    color: [],
                }
            },
            textfont: {
                color: this.getLabelColor(this.el.nativeElement)
            },
            hoverlabel: {
                bgcolor: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-bg', '#000000'),
                bordercolor: 'grey',
                font: {
                    color: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-color', '#ffffff')
                }
            },
            type: 'pie'
        };
        const dataList = [];
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0) {
            return;
        }
        const dataStruct = [];
        if (GTSLib.isGts(gtsList[0])) {
            gtsList.forEach((gts, i) => {
                const values = (gts.v || []);
                const val = values[values.length - 1] || [];
                let value = 0;
                if (val.length > 0) {
                    value = val[val.length - 1];
                }
                dataStruct.push({
                    key: GTSLib.serializeGtsMetadata(gts),
                    value
                });
            });
        }
        else {
            // custom data format
            gtsList.forEach((gts, i) => {
                dataStruct.push({
                    key: gts.key || '',
                    value: gts.value || Number.MIN_VALUE
                });
            });
        }
        this.LOG.debug(['convert', 'dataStruct'], dataStruct);
        dataStruct.forEach((d, i) => {
            const c = ColorLib.getColor(i, this._options.scheme);
            const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            pieData.values.push(d.value);
            pieData.labels.push(d.key);
            pieData.marker.colors.push(ColorLib.transparentize(color));
            pieData.marker.line.color.push(color);
            if (this._type === 'donut') {
                pieData.hole = 0.5;
            }
            if (this.unit) {
                pieData.title = {
                    text: this.unit
                };
            }
        });
        if (pieData.values.length > 0) {
            plotData.push(pieData);
        }
        this.noData = plotData.length === 0;
        return plotData;
    }
}
WarpViewPieComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-pie',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
            },] }
];
WarpViewPieComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewPieComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXBpZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1waWUvd2FycC12aWV3LXBpZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQVUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUV6RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRS9DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQVMzQyxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsaUJBQWlCO0lBa0N6RCxZQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBRXJCLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUxsQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBL0JGLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWpELFVBQUssR0FBRyxLQUFLLENBQUM7UUFDdEIsV0FBTSxHQUFpQjtZQUNyQixVQUFVLEVBQUUsSUFBSTtZQUNoQixNQUFNLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLEdBQUc7Z0JBQ2hCLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1lBQ0QsV0FBVyxFQUFFLEdBQUc7WUFDaEIsTUFBTSxFQUFFO2dCQUNOLENBQUMsRUFBRSxFQUFFO2dCQUNMLENBQUMsRUFBRSxFQUFFO2dCQUNMLENBQUMsRUFBRSxFQUFFO2dCQUNMLENBQUMsRUFBRSxFQUFFO2FBQ047U0FDRixDQUFDO1FBa0JBLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUF4Q0QsSUFBbUIsSUFBSSxDQUFDLElBQVk7UUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFvQkQsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQWdCLENBQVUsQ0FBQztTQUM5RTtRQUNELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBWUQsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ25ELENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzVCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUc7WUFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxDQUFDO1NBQ2pGLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRztZQUNyQixLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLENBQUM7U0FDakYsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFUyxPQUFPLENBQUMsSUFBZTtRQUMvQixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFhLENBQUMsQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBRyxFQUFvQixDQUFDO1FBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFHO1lBQ2QsTUFBTSxFQUFFLEVBQUU7WUFDVixNQUFNLEVBQUUsRUFBRTtZQUNWLE1BQU0sRUFBRTtnQkFDTixNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLENBQUM7b0JBQ1IsS0FBSyxFQUFFLEVBQUU7aUJBQ1Y7YUFDRjtZQUNELFFBQVEsRUFBRTtnQkFDUixLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQzthQUNqRDtZQUNELFVBQVUsRUFBRTtnQkFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSw2QkFBNkIsRUFBRSxTQUFTLENBQUM7Z0JBQzFGLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZ0NBQWdDLEVBQUUsU0FBUyxDQUFDO2lCQUM1RjthQUNGO1lBQ0QsSUFBSSxFQUFFLEtBQUs7U0FDTCxDQUFDO1FBQ1QsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEMsT0FBTztTQUNSO1FBQ0QsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBUSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM5QixNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ2xCLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDZCxHQUFHLEVBQUUsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztvQkFDckMsS0FBSztpQkFDTixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxxQkFBcUI7WUFDckIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekIsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDZCxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFO29CQUNsQixLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUztpQkFDckMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0IsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyRCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLFlBQVksRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7WUFDOUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLE9BQU8sRUFBRTtnQkFDMUIsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7YUFDcEI7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsT0FBTyxDQUFDLEtBQUssR0FBRztvQkFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7aUJBQ2hCLENBQUM7YUFDSDtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN4QjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7UUFDcEMsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQzs7O1lBbEpGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsNjFDQUE2QztnQkFFN0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7WUFqQmtCLFVBQVU7WUFBK0MsU0FBUztZQUs3RSxXQUFXO1lBTGlDLE1BQU07OzttQkFvQnZELEtBQUssU0FBQyxNQUFNO3dCQUtaLE1BQU0sU0FBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdab25lLCBPbkluaXQsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vLi4vbW9kZWwvR1RTJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctcGllJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1waWUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctcGllLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1BpZUNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoJ3R5cGUnKSBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgQE91dHB1dCgnY2hhcnREcmF3JykgY2hhcnREcmF3ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHJpdmF0ZSBfdHlwZSA9ICdwaWUnO1xuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiB0cnVlLFxuICAgIGxlZ2VuZDoge1xuICAgICAgb3JpZW50YXRpb246ICdoJyxcbiAgICAgIGJnY29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgfSxcbiAgICBvcmllbnRhdGlvbjogMjcwLFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMTAsXG4gICAgICBiOiAyNSxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogMTBcbiAgICB9XG4gIH07XG5cbiAgdXBkYXRlKG9wdGlvbnMsIHJlZnJlc2gpOiB2b2lkIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uT3B0aW9ucycsICdiZWZvcmUnXSwgdGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgaWYgKCFkZWVwRXF1YWwob3B0aW9ucywgdGhpcy5fb3B0aW9ucykpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb3B0aW9ucycsICdjaGFuZ2VkJ10sIG9wdGlvbnMpO1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zLCBvcHRpb25zIGFzIFBhcmFtKSBhcyBQYXJhbTtcbiAgICB9XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1BpZUNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgdGhpcy5kZWZPcHRpb25zO1xuICB9XG5cbiAgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5sYXlvdXQnXSwgdGhpcy5sYXlvdXQpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMucGxvdGx5Q29uZmlnJ10sIHRoaXMucGxvdGx5Q29uZmlnKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseURhdGEnXSwgdGhpcy5wbG90bHlEYXRhKTtcbiAgICB0aGlzLmxheW91dC5sZWdlbmQuZm9udCA9IHtcbiAgICAgIGNvbG9yOiB0aGlzLmdldENTU0NvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy0td2FycC12aWV3LWZvbnQtY29sb3InLCAnIzAwMCcpXG4gICAgfTtcbiAgICB0aGlzLmxheW91dC50ZXh0Zm9udCA9IHtcbiAgICAgIGNvbG9yOiB0aGlzLmdldENTU0NvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy0td2FycC12aWV3LWZvbnQtY29sb3InLCAnIzAwMCcpXG4gICAgfTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICBjb25zdCBndHNMaXN0ID0gR1RTTGliLmZsYXREZWVwKGRhdGEuZGF0YSBhcyBhbnlbXSk7XG4gICAgY29uc3QgcGxvdERhdGEgPSBbXSBhcyBQYXJ0aWFsPGFueT5bXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZ3RzTGlzdCddLCBndHNMaXN0KTtcbiAgICBjb25zdCBwaWVEYXRhID0ge1xuICAgICAgdmFsdWVzOiBbXSxcbiAgICAgIGxhYmVsczogW10sXG4gICAgICBtYXJrZXI6IHtcbiAgICAgICAgY29sb3JzOiBbXSxcbiAgICAgICAgbGluZToge1xuICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgIGNvbG9yOiBbXSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRleHRmb250OiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmdldExhYmVsQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KVxuICAgICAgfSxcbiAgICAgIGhvdmVybGFiZWw6IHtcbiAgICAgICAgYmdjb2xvcjogdGhpcy5nZXRDU1NDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctLXdhcnAtdmlldy1jaGFydC1sZWdlbmQtYmcnLCAnIzAwMDAwMCcpLFxuICAgICAgICBib3JkZXJjb2xvcjogJ2dyZXknLFxuICAgICAgICBmb250OiB7XG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q1NTQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLS13YXJwLXZpZXctY2hhcnQtbGVnZW5kLWNvbG9yJywgJyNmZmZmZmYnKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdHlwZTogJ3BpZSdcbiAgICB9IGFzIGFueTtcbiAgICBjb25zdCBkYXRhTGlzdCA9IFtdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdndHNMaXN0J10sIGd0c0xpc3QpO1xuICAgIGlmICghZ3RzTGlzdCB8fCBndHNMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkYXRhU3RydWN0ID0gW107XG4gICAgaWYgKEdUU0xpYi5pc0d0cyhndHNMaXN0WzBdKSkge1xuICAgICAgZ3RzTGlzdC5mb3JFYWNoKChndHM6IEdUUywgaSkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSAoZ3RzLnYgfHwgW10pO1xuICAgICAgICBjb25zdCB2YWwgPSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdIHx8IFtdO1xuICAgICAgICBsZXQgdmFsdWUgPSAwO1xuICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbFt2YWwubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgZGF0YVN0cnVjdC5wdXNoKHtcbiAgICAgICAgICBrZXk6IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShndHMpLFxuICAgICAgICAgIHZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGN1c3RvbSBkYXRhIGZvcm1hdFxuICAgICAgZ3RzTGlzdC5mb3JFYWNoKChndHMsIGkpID0+IHtcbiAgICAgICAgZGF0YVN0cnVjdC5wdXNoKHtcbiAgICAgICAgICBrZXk6IGd0cy5rZXkgfHwgJycsXG4gICAgICAgICAgdmFsdWU6IGd0cy52YWx1ZSB8fCBOdW1iZXIuTUlOX1ZBTFVFXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdkYXRhU3RydWN0J10sIGRhdGFTdHJ1Y3QpO1xuICAgIGRhdGFTdHJ1Y3QuZm9yRWFjaCgoZDogYW55LCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbaV0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICBwaWVEYXRhLnZhbHVlcy5wdXNoKGQudmFsdWUpO1xuICAgICAgICBwaWVEYXRhLmxhYmVscy5wdXNoKGQua2V5KTtcbiAgICAgICAgcGllRGF0YS5tYXJrZXIuY29sb3JzLnB1c2goQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpKTtcbiAgICAgICAgcGllRGF0YS5tYXJrZXIubGluZS5jb2xvci5wdXNoKGNvbG9yKTtcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09ICdkb251dCcpIHtcbiAgICAgICAgICBwaWVEYXRhLmhvbGUgPSAwLjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudW5pdCkge1xuICAgICAgICAgIHBpZURhdGEudGl0bGUgPSB7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLnVuaXRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHBpZURhdGEudmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHBsb3REYXRhLnB1c2gocGllRGF0YSk7XG4gICAgfVxuICAgIHRoaXMubm9EYXRhID0gcGxvdERhdGEubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBwbG90RGF0YTtcbiAgfVxufVxuIl19