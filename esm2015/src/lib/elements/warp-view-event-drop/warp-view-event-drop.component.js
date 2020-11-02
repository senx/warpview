import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import deepEqual from 'deep-equal';
import { ChartLib } from '../../utils/chart-lib';
import { ColorLib } from '../../utils/color-lib';
import * as d3 from 'd3';
import eventDrops from 'event-drops';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
import { select } from 'd3-selection';
export class WarpViewEventDropComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.pointHover = new EventEmitter();
        this.warpViewChartResize = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.boundsDidChange = new EventEmitter();
        this.visibility = [];
        this.maxTick = Number.MIN_VALUE;
        this.minTick = Number.MAX_VALUE;
        this.visibleGtsId = [];
        this._type = 'drops';
        this.eventConf = {
            d3,
            axis: {
                verticalGrid: true,
                tickPadding: 6,
            },
            indicator: false,
            label: {
                text: row => row.name,
            },
            drop: {
                date: d => new Date(d.date),
                color: d => d.color,
                onMouseOver: g => {
                    this.LOG.debug(['onMouseOver'], g);
                    this.pointHover.emit({
                        x: d3.event.offsetX,
                        y: d3.event.offsetY
                    });
                    const t = d3
                        .select(this.toolTip.nativeElement);
                    t.transition()
                        .duration(200)
                        .style('opacity', 1)
                        .style('pointer-events', 'auto');
                    t.html(`<div class="tooltip-body">
<b class="tooltip-date">${this._options.timeMode === 'timestamp'
                        ? g.date
                        : (moment(g.date.valueOf()).utc().toISOString() || '')}</b>
<div><i class="chip"  style="background-color: ${ColorLib.transparentize(g.color, 0.7)};border: 2px solid ${g.color};"></i>
${GTSLib.formatLabel(g.name)}: <span class="value">${g.value}</span>
</div></div>`)
                        .style('left', `${d3.event.offsetX - 30}px`)
                        .style('top', `${d3.event.offsetY + 20}px`);
                },
                onMouseOut: () => {
                    select(this.toolTip.nativeElement)
                        .transition()
                        .duration(500)
                        .style('opacity', 0)
                        .style('pointer-events', 'none');
                },
            },
        };
        this.LOG = new Logger(WarpViewEventDropComponent, this._debug);
    }
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    set hiddenData(hiddenData) {
        const previousVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
        this._hiddenData = hiddenData;
        this.visibility = [];
        this.visibleGtsId.forEach(id => this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)));
        this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
        const newVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
        if (previousVisibility !== newVisibility) {
            this.drawChart();
            this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
        }
    }
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    ngOnDestroy() {
        if (!!this.elemChart) {
            select(this.elemChart.nativeElement).remove();
        }
    }
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = ChartLib.mergeDeep(this._options, options);
        }
        this.drawChart();
    }
    updateBounds(min, max) {
        this.LOG.debug(['updateBounds'], min, max, this._options);
        this._options.bounds.minDate = min;
        this._options.bounds.maxDate = max;
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.eventConf['range'] = { start: min, end: max };
        }
        else {
            this.eventConf['range'] = {
                start: moment.tz(moment.utc(this.minTick / this.divider), this._options.timeZone).toDate(),
                end: moment.tz(moment.utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
            };
        }
        this.eventConf = Object.assign({}, this.eventConf);
        this.LOG.debug(['updateBounds'], this.eventConf);
    }
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.loading = false;
        this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
        if (this.elemChart.nativeElement) {
            setTimeout(() => select(this.elemChart.nativeElement).data([this.plotlyData]).call(eventDrops(this.eventConf)));
            this.loading = false;
            this.chartDraw.emit();
        }
    }
    convert(data) {
        this.LOG.debug(['convert'], data);
        let labelsSize = 0;
        const gtsList = GTSLib.flatDeep(data.data);
        const dataList = [];
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
            return;
        }
        gtsList.forEach((gts, i) => {
            const c = ColorLib.getColor(gts.id || i, this._options.scheme);
            const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            const gtsName = GTSLib.serializeGtsMetadata(gts);
            labelsSize = Math.max(gtsName.length * 8);
            const dataSet = { name: gtsName, color, data: [] };
            const size = (gts.v || []).length;
            for (let v = 0; v < size; v++) {
                const point = (gts.v || [])[v];
                const ts = point[0];
                this.minTick = Math.min(this.minTick, ts);
                this.maxTick = Math.max(this.maxTick, ts);
                let value = point[point.length - 1];
                if (isNaN(value)) {
                    value = 1;
                }
                dataSet.data.push({
                    date: moment.tz(moment.utc(ts / this.divider), this._options.timeZone).toDate(),
                    color,
                    value,
                    name: dataSet.name
                });
            }
            dataList.push(dataSet);
        });
        this.LOG.debug(['convert', 'dataList'], dataList);
        this.eventConf.label['width'] = labelsSize;
        this.eventConf['range'] = {
            start: moment.tz(moment.utc(this.minTick / this.divider), this._options.timeZone).toDate(),
            end: moment.tz(moment.utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
        };
        return dataList;
    }
}
WarpViewEventDropComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-event-drop',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div #toolTip class=\"wv-tooltip trimmed\"></div>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div #elemChart style=\"width: 100%;height: 100%\"></div>\n  <div *ngIf=\"!loading && !noData\">\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */@import url(/home/xavier/workspace/warp-view/node_modules/event-drops/dist/style.css);:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host,warp-view-event-drop,warpview-event-drop{display:block;height:100%;width:100%}:host g.bound text,:host text.line-label,warp-view-event-drop g.bound text,warp-view-event-drop text.line-label,warpview-event-drop g.bound text,warpview-event-drop text.line-label{fill:var(--warp-view-font-color)!important}:host #chartContainer,warp-view-event-drop #chartContainer,warpview-event-drop #chartContainer{height:100%;position:relative;width:100%}:host div.chart,warp-view-event-drop div.chart,warpview-event-drop div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .wv-tooltip,warp-view-event-drop .wv-tooltip,warpview-event-drop .wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;font-size:10px;height:auto!important;line-height:1.4rem;min-width:100px;opacity:0;padding:10px;pointer-events:none;position:absolute;width:auto;z-index:999}:host .wv-tooltip .chip,warp-view-event-drop .wv-tooltip .chip,warpview-event-drop .wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}"]
            },] }
];
WarpViewEventDropComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewEventDropComponent.propDecorators = {
    elemChart: [{ type: ViewChild, args: ['elemChart', { static: true },] }],
    type: [{ type: Input, args: ['type',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    pointHover: [{ type: Output, args: ['pointHover',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }],
    boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWV2ZW50LWRyb3AuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycC12aWV3L3Byb2plY3RzL3dhcnB2aWV3LW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZXZlbnQtZHJvcC93YXJwLXZpZXctZXZlbnQtZHJvcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUcvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDekIsT0FBTyxVQUFVLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLE1BQU0sTUFBTSxpQkFBaUIsQ0FBQztBQUNyQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBUXBDLE1BQU0sT0FBTywwQkFBMkIsU0FBUSxpQkFBaUI7SUFnRi9ELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFB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Q0FBQyxDQUFDLE1BQU0sRUFBRTtZQUMxRixHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFO1NBQ3pGLENBQUM7UUFDRixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDOzs7WUEzTEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLDgrQkFBb0Q7Z0JBRXBELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0Qzs7O1lBOUJDLFVBQVU7WUFPVixTQUFTO1lBS0gsV0FBVztZQVRqQixNQUFNOzs7d0JBNkJMLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO21CQUVyQyxLQUFLLFNBQUMsTUFBTTt5QkFNWixLQUFLLFNBQUMsWUFBWTt5QkFlbEIsTUFBTSxTQUFDLFlBQVk7a0NBQ25CLE1BQU0sU0FBQyxxQkFBcUI7d0JBQzVCLE1BQU0sU0FBQyxXQUFXOzhCQUNsQixNQUFNLFNBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcbmltcG9ydCBldmVudERyb3BzIGZyb20gJ2V2ZW50LWRyb3BzJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7c2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1ldmVudC1kcm9wJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1ldmVudC1kcm9wLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWV2ZW50LWRyb3AuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0V2ZW50RHJvcENvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBAVmlld0NoaWxkKCdlbGVtQ2hhcnQnLCB7c3RhdGljOiB0cnVlfSkgZWxlbUNoYXJ0OiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuXG4gIEBJbnB1dCgnaGlkZGVuRGF0YScpIHNldCBoaWRkZW5EYXRhKGhpZGRlbkRhdGE6IG51bWJlcltdKSB7XG4gICAgY29uc3QgcHJldmlvdXNWaXNpYmlsaXR5ID0gSlNPTi5zdHJpbmdpZnkodGhpcy52aXNpYmlsaXR5KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAncHJldmlvdXNWaXNpYmlsaXR5J10sIHByZXZpb3VzVmlzaWJpbGl0eSk7XG4gICAgdGhpcy5faGlkZGVuRGF0YSA9IGhpZGRlbkRhdGE7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gW107XG4gICAgdGhpcy52aXNpYmxlR3RzSWQuZm9yRWFjaChpZCA9PiB0aGlzLnZpc2liaWxpdHkucHVzaChoaWRkZW5EYXRhLmluZGV4T2YoaWQpIDwgMCAmJiAoaWQgIT09IC0xKSkpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YScsICdoaWRkZW5keWdyYXBoZnVsbHYnXSwgdGhpcy52aXNpYmlsaXR5KTtcbiAgICBjb25zdCBuZXdWaXNpYmlsaXR5ID0gSlNPTi5zdHJpbmdpZnkodGhpcy52aXNpYmlsaXR5KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAnanNvbiddLCBwcmV2aW91c1Zpc2liaWxpdHksIG5ld1Zpc2liaWxpdHkpO1xuICAgIGlmIChwcmV2aW91c1Zpc2liaWxpdHkgIT09IG5ld1Zpc2liaWxpdHkpIHtcbiAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbmR5Z3JhcGh0cmlnJywgJ2Rlc3Ryb3knXSwgJ3JlZHJhdyBieSB2aXNpYmlsaXR5IGNoYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIEBPdXRwdXQoJ3BvaW50SG92ZXInKSBwb2ludEhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3Q2hhcnRSZXNpemUnKSB3YXJwVmlld0NoYXJ0UmVzaXplID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2NoYXJ0RHJhdycpIGNoYXJ0RHJhdyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdib3VuZHNEaWRDaGFuZ2UnKSBib3VuZHNEaWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcml2YXRlIHZpc2liaWxpdHk6IGJvb2xlYW5bXSA9IFtdO1xuICBwcml2YXRlIG1heFRpY2sgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICBwcml2YXRlIG1pblRpY2sgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICBwcml2YXRlIHZpc2libGVHdHNJZCA9IFtdO1xuICBwcml2YXRlIF90eXBlID0gJ2Ryb3BzJztcbiAgcHJpdmF0ZSBldmVudENvbmYgPSB7XG4gICAgZDMsXG4gICAgYXhpczoge1xuICAgICAgdmVydGljYWxHcmlkOiB0cnVlLFxuICAgICAgdGlja1BhZGRpbmc6IDYsXG4gICAgfSxcbiAgICBpbmRpY2F0b3I6IGZhbHNlLFxuICAgIGxhYmVsOiB7XG4gICAgICB0ZXh0OiByb3cgPT4gcm93Lm5hbWUsXG4gICAgfSxcbiAgICBkcm9wOiB7XG4gICAgICBkYXRlOiBkID0+IG5ldyBEYXRlKGQuZGF0ZSksXG4gICAgICBjb2xvcjogZCA9PiBkLmNvbG9yLFxuICAgICAgb25Nb3VzZU92ZXI6IGcgPT4ge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uTW91c2VPdmVyJ10sIGcpO1xuICAgICAgICB0aGlzLnBvaW50SG92ZXIuZW1pdCh7XG4gICAgICAgICAgeDogZDMuZXZlbnQub2Zmc2V0WCxcbiAgICAgICAgICB5OiBkMy5ldmVudC5vZmZzZXRZXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0ID0gZDNcbiAgICAgICAgICAuc2VsZWN0KHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgdC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oMjAwKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyk7XG4gICAgICAgIHQuaHRtbChgPGRpdiBjbGFzcz1cInRvb2x0aXAtYm9keVwiPlxuPGIgY2xhc3M9XCJ0b29sdGlwLWRhdGVcIj4ke3RoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnXG4gICAgICAgICAgPyBnLmRhdGVcbiAgICAgICAgICA6IChtb21lbnQoZy5kYXRlLnZhbHVlT2YoKSkudXRjKCkudG9JU09TdHJpbmcoKSB8fCAnJyl9PC9iPlxuPGRpdj48aSBjbGFzcz1cImNoaXBcIiAgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAke0NvbG9yTGliLnRyYW5zcGFyZW50aXplKGcuY29sb3IsIDAuNyl9O2JvcmRlcjogMnB4IHNvbGlkICR7Zy5jb2xvcn07XCI+PC9pPlxuJHtHVFNMaWIuZm9ybWF0TGFiZWwoZy5uYW1lKX06IDxzcGFuIGNsYXNzPVwidmFsdWVcIj4ke2cudmFsdWV9PC9zcGFuPlxuPC9kaXY+PC9kaXY+YFxuICAgICAgICApXG4gICAgICAgICAgLnN0eWxlKCdsZWZ0JywgYCR7ZDMuZXZlbnQub2Zmc2V0WCAtIDMwfXB4YClcbiAgICAgICAgICAuc3R5bGUoJ3RvcCcsIGAke2QzLmV2ZW50Lm9mZnNldFkgKyAyMH1weGApO1xuICAgICAgfSxcbiAgICAgIG9uTW91c2VPdXQ6ICgpID0+IHtcbiAgICAgICAgc2VsZWN0KHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50KVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG4gICAgICB9LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3RXZlbnREcm9wQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHRoaXMuZGVmT3B0aW9ucztcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICghIXRoaXMuZWxlbUNoYXJ0KSB7XG4gICAgICBzZWxlY3QodGhpcy5lbGVtQ2hhcnQubmF0aXZlRWxlbWVudCkucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnMsIHJlZnJlc2gpOiB2b2lkIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uT3B0aW9ucycsICdiZWZvcmUnXSwgdGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgaWYgKCFkZWVwRXF1YWwob3B0aW9ucywgdGhpcy5fb3B0aW9ucykpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb3B0aW9ucycsICdjaGFuZ2VkJ10sIG9wdGlvbnMpO1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zLCBvcHRpb25zIGFzIFBhcmFtKSBhcyBQYXJhbTtcbiAgICB9XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHVwZGF0ZUJvdW5kcyhtaW4sIG1heCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sIG1pbiwgbWF4LCB0aGlzLl9vcHRpb25zKTtcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5taW5EYXRlID0gbWluO1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzLm1heERhdGUgPSBtYXg7XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgdGhpcy5ldmVudENvbmZbJ3JhbmdlJ10gPSB7c3RhcnQ6IG1pbiwgZW5kOiBtYXh9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmV2ZW50Q29uZlsncmFuZ2UnXSA9IHtcbiAgICAgICAgc3RhcnQ6IG1vbWVudC50eihtb21lbnQudXRjKHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlciksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvRGF0ZSgpLFxuICAgICAgICBlbmQ6IG1vbWVudC50eihtb21lbnQudXRjKHRoaXMubWF4VGljayAvIHRoaXMuZGl2aWRlciksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvRGF0ZSgpLFxuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5ldmVudENvbmYgPSB7Li4udGhpcy5ldmVudENvbmZ9O1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sIHRoaXMuZXZlbnRDb25mKTtcbiAgfVxuXG4gIGRyYXdDaGFydCgpIHtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3Bsb3RseURhdGEnXSwgdGhpcy5wbG90bHlEYXRhLCB0aGlzLl90eXBlKTtcbiAgICBpZiAodGhpcy5lbGVtQ2hhcnQubmF0aXZlRWxlbWVudCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBzZWxlY3QodGhpcy5lbGVtQ2hhcnQubmF0aXZlRWxlbWVudCkuZGF0YShbdGhpcy5wbG90bHlEYXRhXSkuY2FsbChldmVudERyb3BzKHRoaXMuZXZlbnRDb25mKSkpO1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogYW55W10ge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCBkYXRhKTtcbiAgICBsZXQgbGFiZWxzU2l6ZSA9IDA7XG4gICAgY29uc3QgZ3RzTGlzdCA9IEdUU0xpYi5mbGF0RGVlcChkYXRhLmRhdGEgYXMgYW55W10pO1xuICAgIGNvbnN0IGRhdGFMaXN0ID0gW107XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2d0c0xpc3QnXSwgZ3RzTGlzdCk7XG4gICAgaWYgKCFndHNMaXN0IHx8IGd0c0xpc3QubGVuZ3RoID09PSAwIHx8IGd0c0xpc3RbMF0ubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBndHNMaXN0LmZvckVhY2goKGd0cywgaSkgPT4ge1xuICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCB8fCBpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgIGNvbnN0IGd0c05hbWUgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKTtcbiAgICAgIGxhYmVsc1NpemUgPSBNYXRoLm1heChndHNOYW1lLmxlbmd0aCAqIDgpO1xuICAgICAgY29uc3QgZGF0YVNldCA9IHtuYW1lOiBndHNOYW1lLCBjb2xvciwgZGF0YTogW119O1xuICAgICAgY29uc3Qgc2l6ZSA9IChndHMudiB8fCBbXSkubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgdiA9IDA7IHYgPCBzaXplOyB2KyspIHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSAoZ3RzLnYgfHwgW10pW3ZdO1xuICAgICAgICBjb25zdCB0cyA9IHBvaW50WzBdO1xuICAgICAgICB0aGlzLm1pblRpY2sgPSBNYXRoLm1pbih0aGlzLm1pblRpY2ssIHRzKTtcbiAgICAgICAgdGhpcy5tYXhUaWNrID0gTWF0aC5tYXgodGhpcy5tYXhUaWNrLCB0cyk7XG4gICAgICAgIGxldCB2YWx1ZSA9IHBvaW50W3BvaW50Lmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAoaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGRhdGFTZXQuZGF0YS5wdXNoKHtcbiAgICAgICAgICBkYXRlOiBtb21lbnQudHoobW9tZW50LnV0Yyh0cyAvIHRoaXMuZGl2aWRlciksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvRGF0ZSgpLFxuICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgIG5hbWU6IGRhdGFTZXQubmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGRhdGFMaXN0LnB1c2goZGF0YVNldCk7XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2RhdGFMaXN0J10sIGRhdGFMaXN0KTtcbiAgICB0aGlzLmV2ZW50Q29uZi5sYWJlbCBbJ3dpZHRoJ10gPSBsYWJlbHNTaXplO1xuICAgIHRoaXMuZXZlbnRDb25mICBbJ3JhbmdlJ10gPSB7XG4gICAgICBzdGFydDogbW9tZW50LnR6KG1vbWVudC51dGModGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9EYXRlKCksXG4gICAgICBlbmQ6IG1vbWVudC50eihtb21lbnQudXRjKHRoaXMubWF4VGljayAvIHRoaXMuZGl2aWRlciksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvRGF0ZSgpLFxuICAgIH07XG4gICAgcmV0dXJuIGRhdGFMaXN0O1xuICB9XG59XG4iXX0=