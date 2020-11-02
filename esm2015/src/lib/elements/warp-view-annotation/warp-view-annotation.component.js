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
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ChartLib } from '../../utils/chart-lib';
import moment from 'moment-timezone';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartBounds } from '../../model/chartBounds';
export class WarpViewAnnotationComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.pointHover = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.boundsDidChange = new EventEmitter();
        this.displayExpander = true;
        this.layout = {
            showlegend: false,
            hovermode: 'closest',
            xaxis: {
                gridwidth: 1,
                fixedrange: false,
                autorange: false,
                automargin: false,
                showticklabels: true,
                showgrid: false
            },
            autosize: false,
            autoexpand: false,
            yaxis: {
                showticklabels: false,
                fixedrange: true,
                dtick: 1,
                gridwidth: 1,
                tick0: 0,
                nticks: 2,
                rangemode: 'tozero',
                tickson: 'boundaries',
                automargin: true,
                showline: false,
                zeroline: true
            },
            margin: {
                t: 30,
                b: 2,
                r: 10,
                l: 10
            },
        };
        this.marginLeft = 50;
        this.expanded = false;
        // tslint:disable-next-line:variable-name
        this._type = 'line';
        this.visibility = [];
        this._standalone = true;
        this.maxTick = Number.MIN_VALUE;
        this.minTick = Number.MAX_VALUE;
        this.visibleGtsId = [];
        this.gtsId = [];
        this.dataHashset = {};
        this.lineHeight = 30;
        this.chartBounds = new ChartBounds();
        this._autoResize = false;
        this.LOG = new Logger(WarpViewAnnotationComponent, this._debug);
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
            const visible = [];
            const hidden = [];
            this.gtsId.forEach((id, i) => {
                if (this._hiddenData.indexOf(id) > -1) {
                    hidden.push(i);
                }
                else {
                    visible.push(i);
                }
            });
            if (visible.length > 0) {
                this.graph.restyleChart({ visible: true }, visible);
            }
            if (hidden.length > 0) {
                this.graph.restyleChart({ visible: false }, hidden);
            }
            this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
        }
    }
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    set standalone(isStandalone) {
        if (this._standalone !== isStandalone) {
            this._standalone = isStandalone;
            this.drawChart();
        }
    }
    get standalone() {
        return this._standalone;
    }
    handleKeyDown($event) {
        if ($event.key === 'Control') {
            this.trimmed = setInterval(() => {
                if (!!this.toolTip.nativeElement.querySelector('#tooltip-body')) {
                    this.toolTip.nativeElement.querySelector('#tooltip-body').classList.add('full');
                }
            }, 100);
        }
    }
    handleKeyup($event) {
        this.LOG.debug(['document:keyup'], $event);
        if ($event.key === 'Control') {
            if (!!this.toolTip.nativeElement.querySelector('#tooltip-body')) {
                if (this.trimmed) {
                    clearInterval(this.trimmed);
                }
                this.toolTip.nativeElement.querySelector('#tooltip-body').classList.remove('full');
            }
        }
    }
    update(options, refresh) {
        if (!!options) {
            this._options = ChartLib.mergeDeep(this._options, options);
        }
        this.drawChart(refresh);
    }
    updateBounds(min, max, marginLeft) {
        this.LOG.debug(['updateBounds'], min, max, this._options);
        this._options.bounds.minDate = min;
        this._options.bounds.maxDate = max;
        this.layout.xaxis.autorange = false;
        this.LOG.debug(['updateBounds'], GTSLib.toISOString(min, this.divider, this._options.timeZone), GTSLib.toISOString(max, this.divider, this._options.timeZone));
        this.minTick = min;
        this.maxTick = max;
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.tick0 = min / this.divider;
            this.layout.xaxis.range = [min / this.divider, max / this.divider];
        }
        else {
            this.layout.xaxis.tick0 = GTSLib.toISOString(min, this.divider, this._options.timeZone);
            this.layout.xaxis.range = [
                GTSLib.toISOString(min, this.divider, this._options.timeZone),
                GTSLib.toISOString(max, this.divider, this._options.timeZone)
            ];
        }
        this.layout.margin.l = marginLeft;
        this.marginLeft = marginLeft;
        this.layout = Object.assign({}, this.layout);
        this.LOG.debug(['updateBounds'], Object.assign({}, this.layout.xaxis.range));
    }
    drawChart(reparseNewData = false) {
        this.layout.margin.l = !!this._standalone ? 10 : 50;
        this.layout.margin.b = !!this._standalone ? 50 : 1;
        this.height = this.lineHeight + this.layout.margin.t + this.layout.margin.b;
        if (!this.initChart(this.el)) {
            return;
        }
        this.el.nativeElement.style.display = 'block';
        this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
        this.LOG.debug(['drawChart', 'hiddenData'], this._hiddenData);
        this.LOG.debug(['drawChart', 'this._options.bounds'], this._options.bounds);
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
        this.layout.yaxis.showline = !!this._standalone;
        this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.autorange = !!this._standalone;
        this.layout.xaxis.showticklabels = !!this._standalone;
        this.displayExpander = (this.plotlyData.length > 1);
        const count = this.plotlyData.filter(d => d.y.length > 0).length;
        const calculatedHeight = (this.expanded ? this.lineHeight * count : this.lineHeight) + this.layout.margin.t + this.layout.margin.b;
        this.el.nativeElement.style.height = calculatedHeight + 'px';
        this.height = calculatedHeight;
        this.layout.height = this.height;
        this.LOG.debug(['drawChart', 'height'], this.height, count, calculatedHeight, this.expanded);
        this.layout.yaxis.range = [0, this.expanded ? count : 1];
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.tick0 = this.minTick;
            this.layout.xaxis.range = [this.minTick, this.maxTick];
            this.layout.xaxis.type = 'linear';
        }
        else {
            this.layout.xaxis.tick0 =
                GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
            this.layout.xaxis.range = [
                GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
                GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
            ];
            this.layout.xaxis.type = 'date';
        }
        this.plotlyConfig.scrollZoom = true;
        this.layout.xaxis.showgrid = false;
        setTimeout(() => {
            this.plotlyConfig = Object.assign({}, this.plotlyConfig);
            this.layout = Object.assign({}, this.layout);
            this.loading = false;
        });
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig, this.plotlyData);
    }
    relayout(data) {
        if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
            this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
            this.chartBounds.msmin = data['xaxis.range'][0];
            this.chartBounds.msmax = data['xaxis.range'][1];
            this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf();
            this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf();
        }
        else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
            this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
            this.chartBounds.msmin = data['xaxis.range[0]'];
            this.chartBounds.msmax = data['xaxis.range[1]'];
            this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf();
            this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf();
        }
        else if (data['xaxis.autorange']) {
            this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data);
            this.chartBounds.tsmin = this.minTick / this.divider;
            this.chartBounds.tsmax = this.maxTick / this.divider;
        }
        this.emitNewBounds(moment.utc(this.chartBounds.tsmin).valueOf(), moment.utc(this.chartBounds.msmax).valueOf());
    }
    hover(data) {
        this.LOG.debug(['hover'], data);
        const tooltip = this.toolTip.nativeElement;
        this.pointHover.emit({
            x: data.event.offsetX,
            y: data.event.offsetY
        });
        let x = data.xvals[0];
        if (!!data.points[0]) {
            x = data.points[0].x;
        }
        const layout = this.el.nativeElement.getBoundingClientRect();
        const count = this.plotlyData.filter(d => d.y.length > 0).length;
        tooltip.style.opacity = '1';
        tooltip.style.display = 'block';
        tooltip.style.paddingLeft = (this._standalone ? 0 : 40) + 'px';
        tooltip.style.top = ((this.expanded ? count - 1 - (data.points[0].y + 0.5) : -1) * (this.lineHeight) + this.layout.margin.t) + 6 + 'px';
        tooltip.classList.remove('right', 'left');
        tooltip.innerHTML = `<div class="tooltip-body trimmed" id="tooltip-body">
<span class="tooltip-date">${this._options.timeMode === 'timestamp'
            ? x
            : (moment.utc(x).toISOString().replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '') || '')}</span>
<ul>
<li>${GTSLib.formatLabel(data.points[0].data.name)}: <span class="value">${data.points[0].text}</span></li>
</ul>
      </div>`;
        if (data.event.offsetX > layout.width / 2) {
            tooltip.classList.add('left');
        }
        else {
            tooltip.classList.add('right');
        }
        tooltip.style.pointerEvents = 'none';
    }
    unhover() {
        this.toolTip.nativeElement.style.display = 'none';
    }
    afterPlot(div) {
        this.loading = false;
        this.chartBounds.tsmin = this.minTick;
        this.chartBounds.tsmax = this.maxTick;
        this.chartDraw.emit(this.chartBounds);
        this.LOG.debug(['afterPlot'], this.chartBounds, div);
    }
    emitNewBounds(min, max) {
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.boundsDidChange.emit({ bounds: { min, max }, source: 'annotation' });
        }
        else {
            this.boundsDidChange.emit({
                bounds: {
                    min: moment.tz(min, this._options.timeZone).valueOf(),
                    max: moment.tz(max, this._options.timeZone).valueOf()
                },
                source: 'annotation'
            });
        }
    }
    convert(data) {
        const dataset = [];
        let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res);
        this.maxTick = Number.NEGATIVE_INFINITY;
        this.minTick = Number.POSITIVE_INFINITY;
        this.visibleGtsId = [];
        this.gtsId = [];
        const nonPlottable = gtsList.filter(g => g.v && GTSLib.isGtsToPlot(g));
        gtsList = gtsList.filter(g => g.v && !GTSLib.isGtsToPlot(g));
        let timestampMode = true;
        const tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
        gtsList.forEach((gts) => {
            const ticks = gts.v.map(t => t[0]);
            const size = gts.v.length;
            timestampMode = timestampMode && (ticks[0] > -tsLimit && ticks[0] < tsLimit);
            timestampMode = timestampMode && (ticks[size - 1] > -tsLimit && ticks[size - 1] < tsLimit);
        });
        if (timestampMode || this._options.timeMode === 'timestamp') {
            this.layout.xaxis.type = 'linear';
        }
        else {
            this.layout.xaxis.type = 'date';
        }
        gtsList.forEach((gts, i) => {
            if (gts.v) {
                const size = gts.v.length;
                const label = GTSLib.serializeGtsMetadata(gts);
                const c = ColorLib.getColor(gts.id, this._options.scheme);
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                const series = {
                    type: 'scattergl',
                    mode: 'markers',
                    name: label,
                    x: [],
                    y: [],
                    text: [],
                    hoverinfo: 'none',
                    connectgaps: false,
                    visible: !(this._hiddenData.filter(h => h === gts.id).length > 0),
                    line: { color },
                    marker: {
                        symbol: 'line-ns-open',
                        color,
                        size: 20,
                        width: 5,
                    }
                };
                this.visibleGtsId.push(gts.id);
                this.gtsId.push(gts.id);
                if (timestampMode || this._options.timeMode && this._options.timeMode === 'timestamp') {
                    this.layout.xaxis.type = 'linear';
                }
                else {
                    this.layout.xaxis.type = 'date';
                }
                const ticks = [];
                series.text = [];
                series.y = [];
                if (size > 0) {
                    this.minTick = gts.v[0][0];
                    this.maxTick = gts.v[0][0];
                    for (let v = 0; v < size; v++) {
                        const val = gts.v[v];
                        const t = val[0];
                        ticks.push(t);
                        series.text.push(val[val.length - 1]);
                        series.y.push((this.expanded ? i : 0) + 0.5);
                        this.minTick = (t < this.minTick) ? t : this.minTick;
                        this.maxTick = (t > this.maxTick) ? t : this.maxTick;
                    }
                }
                if (timestampMode || this._options.timeMode === 'timestamp') {
                    series.x = ticks;
                }
                else {
                    series.x = ticks.map(t => GTSLib.toISOString(t, this.divider, this._options.timeZone));
                }
                if (series.x.length > 0) {
                    dataset.push(series);
                }
            }
        });
        this.LOG.debug(['convert'], 'forEach value end', this.minTick, this.maxTick);
        if (nonPlottable.length > 0) {
            nonPlottable.forEach(g => {
                g.v.forEach(value => {
                    const ts = value[0];
                    if (ts < this.minTick) {
                        this.minTick = ts;
                    }
                    if (ts > this.maxTick) {
                        this.maxTick = ts;
                    }
                });
            });
            // if there is not any plottable data, we must add a fake one with id -1. This one will always be hidden.
            if (0 === gtsList.length) {
                if (!this.dataHashset[this.minTick]) {
                    this.dataHashset[this.minTick] = [0];
                }
                if (!this.dataHashset[this.maxTick]) {
                    this.dataHashset[this.maxTick] = [0];
                }
                this.visibility.push(false);
                this.visibleGtsId.push(-1);
            }
        }
        const x = { tick0: undefined, range: [] };
        if (timestampMode || this._options.timeMode && this._options.timeMode === 'timestamp') {
            x.tick0 = this.minTick;
            x.range = [this.minTick, this.maxTick];
        }
        else {
            x.tick0 = GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
            x.range = [
                GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
                GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
            ];
        }
        this.layout.xaxis = x;
        this.noData = dataset.length === 0;
        return dataset;
    }
    toggle() {
        this.expanded = !this.expanded;
        this.drawChart();
    }
    setRealBounds(chartBounds) {
        this.minTick = chartBounds.tsmin;
        this.maxTick = chartBounds.tsmax;
        this._options.bounds = this._options.bounds || {};
        this._options.bounds.minDate = this.minTick;
        this._options.bounds.maxDate = this.maxTick;
        const x = {
            tick0: undefined,
            range: [],
        };
        if (this._options.showRangeSelector) {
            x.rangeslider = {
                bgcolor: 'transparent',
                thickness: 40 / this.height
            };
        }
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            x.tick0 = this.minTick / this.divider;
            x.range = [this.minTick, this.maxTick];
        }
        else {
            x.tick0 = GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
            x.range = [
                GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
                GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
            ];
        }
        this.layout.xaxis = x;
        this.layout = Object.assign({}, this.layout);
    }
}
WarpViewAnnotationComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-annotation',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <button *ngIf=\"displayExpander && plotlyData && plotlyData.length > 1\" class=\"expander\" (click)=\"toggle()\"\n          title=\"collapse/expand\">+/-\n  </button>\n  <div #toolTip class=\"wv-tooltip\"></div>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div *ngIf=\"!loading && !noData\">\n    <div class=\"upperLine\" [ngStyle]=\"{left: standalone? '10px': marginLeft + 'px'}\" *ngIf=\"standalone || !expanded\"></div>\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot($event)\"\n                     (relayout)=\"relayout($event)\" className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover()\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host{display:block}:host .expander{left:0;position:absolute;top:0;width:35px;z-index:9}:host #chartContainer{height:auto;position:relative}:host #chartContainer div.upperLine{border-bottom:1px solid var(--warp-view-chart-grid-color,#8e8e8e);height:0;left:0;position:absolute;right:10px;top:30px}:host .date{display:block;height:20px;left:40px;line-height:20px;position:absolute;text-align:right;top:0;vertical-align:middle}:host .chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .wv-tooltip{margin-left:10px;position:absolute;top:-1000px;width:calc(100% - 50px);z-index:999}:host .wv-tooltip .tooltip-body{background-color:hsla(0,0%,100%,.8);color:var(--warp-view-annotationtooltip-font-color);height:50px;line-height:20px;margin:1px;max-width:100%;overflow:visible;padding-left:10px;padding-right:10px;vertical-align:middle;width:auto}:host .wv-tooltip .tooltip-body ul{list-style:none;margin-top:10px;padding-top:0}:host .wv-tooltip .tooltip-body.trimmed{max-width:49%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .wv-tooltip .tooltip-body.full{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .wv-tooltip .tooltip-body .timestamp{font-size:1rem}:host .wv-tooltip .tooltip-body .value{color:var(--warp-view-annotationtooltip-value-font-color)}:host .wv-tooltip .tooltip-body .tooltip-date{display:block;font-size:.8rem;font-weight:700;height:.8rem;line-height:.8rem;padding-top:5px;text-align:left;vertical-align:middle;width:100%}:host .wv-tooltip .tooltip-body .round{background-color:#bbb;border:2px solid #454545;border-radius:50%;display:inline-block;height:5px;margin-bottom:auto;margin-right:5px;margin-top:auto;vertical-align:middle;width:5px}:host .wv-tooltip.left .tooltip-body{float:left;text-align:left}:host .wv-tooltip.left .tooltip-body .tooltip-date{text-align:left}:host .wv-tooltip.right .tooltip-body{float:right;text-align:right}:host .wv-tooltip.right .tooltip-body .tooltip-date{text-align:right}"]
            },] }
];
WarpViewAnnotationComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewAnnotationComponent.propDecorators = {
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    type: [{ type: Input, args: ['type',] }],
    standalone: [{ type: Input, args: ['standalone',] }],
    pointHover: [{ type: Output, args: ['pointHover',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }],
    boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }],
    handleKeyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }, { type: HostListener, args: ['document:keydown', ['$event'],] }],
    handleKeyup: [{ type: HostListener, args: ['keyup', ['$event'],] }, { type: HostListener, args: ['document:keyup', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWFubm90YXRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycC12aWV3L3Byb2plY3RzL3dhcnB2aWV3LW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctYW5ub3RhdGlvbi93YXJwLXZpZXctYW5ub3RhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckksT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFekQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBRXJDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFRcEQsTUFBTSxPQUFPLDJCQUE0QixTQUFRLGlCQUFpQjtJQThIaEUsWUFDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUVyQixLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFMbEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEs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U0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLDBxREFBb0Q7Z0JBRXBELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTOzthQUMzQzs7O1lBbEJrQixVQUFVO1lBQXFELFNBQVM7WUFTbkYsV0FBVztZQVQrQyxNQUFNOzs7eUJBcUJyRSxLQUFLLFNBQUMsWUFBWTttQkE2QmxCLEtBQUssU0FBQyxNQUFNO3lCQUtaLEtBQUssU0FBQyxZQUFZO3lCQVdsQixNQUFNLFNBQUMsWUFBWTt3QkFDbkIsTUFBTSxTQUFDLFdBQVc7OEJBQ2xCLE1BQU0sU0FBQyxpQkFBaUI7NEJBbUR4QixZQUFZLFNBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQ2xDLFlBQVksU0FBQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzswQkFXM0MsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUNoQyxZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE5nWm9uZSwgT3V0cHV0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge0NoYXJ0Qm91bmRzfSBmcm9tICcuLi8uLi9tb2RlbC9jaGFydEJvdW5kcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWFubm90YXRpb24nLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWFubm90YXRpb24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctYW5ub3RhdGlvbi5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdBbm5vdGF0aW9uQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQge1xuXG4gIEBJbnB1dCgnaGlkZGVuRGF0YScpIHNldCBoaWRkZW5EYXRhKGhpZGRlbkRhdGE6IG51bWJlcltdKSB7XG4gICAgY29uc3QgcHJldmlvdXNWaXNpYmlsaXR5ID0gSlNPTi5zdHJpbmdpZnkodGhpcy52aXNpYmlsaXR5KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAncHJldmlvdXNWaXNpYmlsaXR5J10sIHByZXZpb3VzVmlzaWJpbGl0eSk7XG4gICAgdGhpcy5faGlkZGVuRGF0YSA9IGhpZGRlbkRhdGE7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gW107XG4gICAgdGhpcy52aXNpYmxlR3RzSWQuZm9yRWFjaChpZCA9PiB0aGlzLnZpc2liaWxpdHkucHVzaChoaWRkZW5EYXRhLmluZGV4T2YoaWQpIDwgMCAmJiAoaWQgIT09IC0xKSkpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YScsICdoaWRkZW5keWdyYXBoZnVsbHYnXSwgdGhpcy52aXNpYmlsaXR5KTtcbiAgICBjb25zdCBuZXdWaXNpYmlsaXR5ID0gSlNPTi5zdHJpbmdpZnkodGhpcy52aXNpYmlsaXR5KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAnanNvbiddLCBwcmV2aW91c1Zpc2liaWxpdHksIG5ld1Zpc2liaWxpdHkpO1xuICAgIGlmIChwcmV2aW91c1Zpc2liaWxpdHkgIT09IG5ld1Zpc2liaWxpdHkpIHtcbiAgICAgIGNvbnN0IHZpc2libGUgPSBbXTtcbiAgICAgIGNvbnN0IGhpZGRlbiA9IFtdO1xuICAgICAgdGhpcy5ndHNJZC5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faGlkZGVuRGF0YS5pbmRleE9mKGlkKSA+IC0xKSB7XG4gICAgICAgICAgaGlkZGVuLnB1c2goaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlzaWJsZS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICh2aXNpYmxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5ncmFwaC5yZXN0eWxlQ2hhcnQoe3Zpc2libGU6IHRydWV9LCB2aXNpYmxlKTtcbiAgICAgIH1cbiAgICAgIGlmIChoaWRkZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh7dmlzaWJsZTogZmFsc2V9LCBoaWRkZW4pO1xuICAgICAgfVxuICAgICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5keWdyYXBodHJpZycsICdkZXN0cm95J10sICdyZWRyYXcgYnkgdmlzaWJpbGl0eSBjaGFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ3R5cGUnKSBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgQElucHV0KCdzdGFuZGFsb25lJykgc2V0IHN0YW5kYWxvbmUoaXNTdGFuZGFsb25lOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX3N0YW5kYWxvbmUgIT09IGlzU3RhbmRhbG9uZSkge1xuICAgICAgdGhpcy5fc3RhbmRhbG9uZSA9IGlzU3RhbmRhbG9uZTtcbiAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHN0YW5kYWxvbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YW5kYWxvbmU7XG4gIH1cblxuICBAT3V0cHV0KCdwb2ludEhvdmVyJykgcG9pbnRIb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdjaGFydERyYXcnKSBjaGFydERyYXcgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnYm91bmRzRGlkQ2hhbmdlJykgYm91bmRzRGlkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgZGlzcGxheUV4cGFuZGVyID0gdHJ1ZTtcbiAgbGF5b3V0OiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgc2hvd2xlZ2VuZDogZmFsc2UsXG4gICAgaG92ZXJtb2RlOiAnY2xvc2VzdCcsXG4gICAgeGF4aXM6IHtcbiAgICAgIGdyaWR3aWR0aDogMSxcbiAgICAgIGZpeGVkcmFuZ2U6IGZhbHNlLFxuICAgICAgYXV0b3JhbmdlOiBmYWxzZSxcbiAgICAgIGF1dG9tYXJnaW46IGZhbHNlLFxuICAgICAgc2hvd3RpY2tsYWJlbHM6IHRydWUsXG4gICAgICBzaG93Z3JpZDogZmFsc2VcbiAgICB9LFxuICAgIGF1dG9zaXplOiBmYWxzZSxcbiAgICBhdXRvZXhwYW5kOiBmYWxzZSxcbiAgICB5YXhpczoge1xuICAgICAgc2hvd3RpY2tsYWJlbHM6IGZhbHNlLFxuICAgICAgZml4ZWRyYW5nZTogdHJ1ZSxcbiAgICAgIGR0aWNrOiAxLFxuICAgICAgZ3JpZHdpZHRoOiAxLFxuICAgICAgdGljazA6IDAsXG4gICAgICBudGlja3M6IDIsXG4gICAgICByYW5nZW1vZGU6ICd0b3plcm8nLFxuICAgICAgdGlja3NvbjogJ2JvdW5kYXJpZXMnLFxuICAgICAgYXV0b21hcmdpbjogdHJ1ZSxcbiAgICAgIHNob3dsaW5lOiBmYWxzZSxcbiAgICAgIHplcm9saW5lOiB0cnVlXG4gICAgfSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHQ6IDMwLFxuICAgICAgYjogMixcbiAgICAgIHI6IDEwLFxuICAgICAgbDogMTBcbiAgICB9LFxuICB9O1xuICBtYXJnaW5MZWZ0ID0gNTA7XG4gIGV4cGFuZGVkID0gZmFsc2U7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX3R5cGUgPSAnbGluZSc7XG4gIHByaXZhdGUgdmlzaWJpbGl0eTogYm9vbGVhbltdID0gW107XG4gIHByaXZhdGUgX3N0YW5kYWxvbmUgPSB0cnVlO1xuICBwcml2YXRlIHRyaW1tZWQ7XG4gIHByaXZhdGUgbWF4VGljayA9IE51bWJlci5NSU5fVkFMVUU7XG4gIHByaXZhdGUgbWluVGljayA9IE51bWJlci5NQVhfVkFMVUU7XG4gIHByaXZhdGUgdmlzaWJsZUd0c0lkID0gW107XG4gIHByaXZhdGUgZ3RzSWQgPSBbXTtcbiAgcHJpdmF0ZSBkYXRhSGFzaHNldCA9IHt9O1xuICBwcml2YXRlIGxpbmVIZWlnaHQgPSAzMDtcbiAgcHJpdmF0ZSBjaGFydEJvdW5kczogQ2hhcnRCb3VuZHMgPSBuZXcgQ2hhcnRCb3VuZHMoKTtcblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5ZG93bicsIFsnJGV2ZW50J10pXG4gIGhhbmRsZUtleURvd24oJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCRldmVudC5rZXkgPT09ICdDb250cm9sJykge1xuICAgICAgdGhpcy50cmltbWVkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAoISF0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjdG9vbHRpcC1ib2R5JykpIHtcbiAgICAgICAgICB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjdG9vbHRpcC1ib2R5JykuY2xhc3NMaXN0LmFkZCgnZnVsbCcpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5dXAnLCBbJyRldmVudCddKVxuICBoYW5kbGVLZXl1cCgkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RvY3VtZW50OmtleXVwJ10sICRldmVudCk7XG4gICAgaWYgKCRldmVudC5rZXkgPT09ICdDb250cm9sJykge1xuICAgICAgaWYgKCEhdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignI3Rvb2x0aXAtYm9keScpKSB7XG4gICAgICAgIGlmICh0aGlzLnRyaW1tZWQpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudHJpbW1lZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignI3Rvb2x0aXAtYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLl9hdXRvUmVzaXplID0gZmFsc2U7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3QW5ub3RhdGlvbkNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtLCByZWZyZXNoOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKCEhb3B0aW9ucykge1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zLCBvcHRpb25zKSBhcyBQYXJhbTtcbiAgICB9XG4gICAgdGhpcy5kcmF3Q2hhcnQocmVmcmVzaCk7XG4gIH1cblxuICB1cGRhdGVCb3VuZHMobWluLCBtYXgsIG1hcmdpbkxlZnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCBtaW4sIG1heCwgdGhpcy5fb3B0aW9ucyk7XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IG1pbjtcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gbWF4O1xuICAgIHRoaXMubGF5b3V0LnhheGlzLmF1dG9yYW5nZSA9IGZhbHNlO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sIEdUU0xpYi50b0lTT1N0cmluZyhtaW4sIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSksXG4gICAgICBHVFNMaWIudG9JU09TdHJpbmcobWF4LCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpKTtcbiAgICB0aGlzLm1pblRpY2sgPSBtaW47XG4gICAgdGhpcy5tYXhUaWNrID0gbWF4O1xuICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50aWNrMCA9IG1pbiAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW21pbiAvIHRoaXMuZGl2aWRlciwgbWF4IC8gdGhpcy5kaXZpZGVyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBHVFNMaWIudG9JU09TdHJpbmcobWluLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMucmFuZ2UgPSBbXG4gICAgICAgIEdUU0xpYi50b0lTT1N0cmluZyhtaW4sIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSksXG4gICAgICAgIEdUU0xpYi50b0lTT1N0cmluZyhtYXgsIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSlcbiAgICAgIF07XG4gICAgfVxuICAgIHRoaXMubGF5b3V0Lm1hcmdpbi5sID0gbWFyZ2luTGVmdDtcbiAgICB0aGlzLm1hcmdpbkxlZnQgPSBtYXJnaW5MZWZ0O1xuICAgIHRoaXMubGF5b3V0ID0gey4uLnRoaXMubGF5b3V0fTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCB7Li4udGhpcy5sYXlvdXQueGF4aXMucmFuZ2V9KTtcbiAgfVxuXG4gIGRyYXdDaGFydChyZXBhcnNlTmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5sYXlvdXQubWFyZ2luLmwgPSAhIXRoaXMuX3N0YW5kYWxvbmUgPyAxMCA6IDUwO1xuICAgIHRoaXMubGF5b3V0Lm1hcmdpbi5iID0gISF0aGlzLl9zdGFuZGFsb25lID8gNTAgOiAxO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5saW5lSGVpZ2h0ICsgdGhpcy5sYXlvdXQubWFyZ2luLnQgKyB0aGlzLmxheW91dC5tYXJnaW4uYjtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseURhdGEnXSwgdGhpcy5wbG90bHlEYXRhKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICdoaWRkZW5EYXRhJ10sIHRoaXMuX2hpZGRlbkRhdGEpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMuX29wdGlvbnMuYm91bmRzJ10sIHRoaXMuX29wdGlvbnMuYm91bmRzKTtcbiAgICB0aGlzLmxheW91dC55YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuZ3JpZGNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC55YXhpcy5zaG93bGluZSA9ICEhdGhpcy5fc3RhbmRhbG9uZTtcbiAgICB0aGlzLmxheW91dC55YXhpcy56ZXJvbGluZWNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC54YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuZ3JpZGNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC54YXhpcy5hdXRvcmFuZ2UgPSAhIXRoaXMuX3N0YW5kYWxvbmU7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuc2hvd3RpY2tsYWJlbHMgPSAhIXRoaXMuX3N0YW5kYWxvbmU7XG4gICAgdGhpcy5kaXNwbGF5RXhwYW5kZXIgPSAodGhpcy5wbG90bHlEYXRhLmxlbmd0aCA+IDEpO1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5wbG90bHlEYXRhLmZpbHRlcihkID0+IGQueS5sZW5ndGggPiAwKS5sZW5ndGg7XG4gICAgY29uc3QgY2FsY3VsYXRlZEhlaWdodCA9ICh0aGlzLmV4cGFuZGVkID8gdGhpcy5saW5lSGVpZ2h0ICogY291bnQgOiB0aGlzLmxpbmVIZWlnaHQpICsgdGhpcy5sYXlvdXQubWFyZ2luLnQgKyB0aGlzLmxheW91dC5tYXJnaW4uYjtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY2FsY3VsYXRlZEhlaWdodCArICdweCc7XG4gICAgdGhpcy5oZWlnaHQgPSBjYWxjdWxhdGVkSGVpZ2h0O1xuICAgIHRoaXMubGF5b3V0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ2hlaWdodCddLCB0aGlzLmhlaWdodCwgY291bnQsIGNhbGN1bGF0ZWRIZWlnaHQsIHRoaXMuZXhwYW5kZWQpO1xuICAgIHRoaXMubGF5b3V0LnlheGlzLnJhbmdlID0gWzAsIHRoaXMuZXhwYW5kZWQgPyBjb3VudCA6IDFdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSB0aGlzLm1pblRpY2s7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy5yYW5nZSA9IFt0aGlzLm1pblRpY2ssIHRoaXMubWF4VGlja107XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2xpbmVhcic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnRpY2swID1cbiAgICAgICAgR1RTTGliLnRvSVNPU3RyaW5nKHRoaXMubWluVGljaywgdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKTtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW1xuICAgICAgICBHVFNMaWIudG9JU09TdHJpbmcodGhpcy5taW5UaWNrLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLFxuICAgICAgICBHVFNMaWIudG9JU09TdHJpbmcodGhpcy5tYXhUaWNrLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpXG4gICAgICBdO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudHlwZSA9ICdkYXRlJztcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuc2hvd2dyaWQgPSBmYWxzZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucGxvdGx5Q29uZmlnID0gey4uLnRoaXMucGxvdGx5Q29uZmlnfTtcbiAgICAgIHRoaXMubGF5b3V0ID0gey4uLnRoaXMubGF5b3V0fTtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMucGxvdGx5Q29uZmlnJ10sIHRoaXMucGxvdGx5Q29uZmlnLCB0aGlzLnBsb3RseURhdGEpO1xuICB9XG5cbiAgcmVsYXlvdXQoZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGFbJ3hheGlzLnJhbmdlJ10gJiYgZGF0YVsneGF4aXMucmFuZ2UnXS5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsncmVsYXlvdXQnLCAndXBkYXRlQm91bmRzJywgJ3hheGlzLnJhbmdlJ10sIGRhdGFbJ3hheGlzLnJhbmdlJ10pO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy5tc21pbiA9IGRhdGFbJ3hheGlzLnJhbmdlJ11bMF07XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4ID0gZGF0YVsneGF4aXMucmFuZ2UnXVsxXTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtaW4pLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gbW9tZW50LnR6KG1vbWVudCh0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4KSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpO1xuICAgIH0gZWxzZSBpZiAoZGF0YVsneGF4aXMucmFuZ2VbMF0nXSAmJiBkYXRhWyd4YXhpcy5yYW5nZVsxXSddKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3JlbGF5b3V0JywgJ3VwZGF0ZUJvdW5kcycsICd4YXhpcy5yYW5nZVt4XSddLCBkYXRhWyd4YXhpcy5yYW5nZVswXSddKTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMubXNtaW4gPSBkYXRhWyd4YXhpcy5yYW5nZVswXSddO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy5tc21heCA9IGRhdGFbJ3hheGlzLnJhbmdlWzFdJ107XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gbW9tZW50LnR6KG1vbWVudCh0aGlzLmNoYXJ0Qm91bmRzLm1zbWluKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IG1vbWVudC50eihtb21lbnQodGhpcy5jaGFydEJvdW5kcy5tc21heCksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKTtcbiAgICB9IGVsc2UgaWYgKGRhdGFbJ3hheGlzLmF1dG9yYW5nZSddKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3JlbGF5b3V0JywgJ3VwZGF0ZUJvdW5kcycsICdhdXRvcmFuZ2UnXSwgZGF0YSk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gdGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IHRoaXMubWF4VGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICB9XG4gICAgdGhpcy5lbWl0TmV3Qm91bmRzKG1vbWVudC51dGModGhpcy5jaGFydEJvdW5kcy50c21pbikudmFsdWVPZigpLCBtb21lbnQudXRjKHRoaXMuY2hhcnRCb3VuZHMubXNtYXgpLnZhbHVlT2YoKSk7XG4gIH1cblxuICBob3ZlcihkYXRhOiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hvdmVyJ10sIGRhdGEpO1xuICAgIGNvbnN0IHRvb2x0aXAgPSB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnBvaW50SG92ZXIuZW1pdCh7XG4gICAgICB4OiBkYXRhLmV2ZW50Lm9mZnNldFgsXG4gICAgICB5OiBkYXRhLmV2ZW50Lm9mZnNldFlcbiAgICB9KTtcbiAgICBsZXQgeCA9IGRhdGEueHZhbHNbMF07XG4gICAgaWYgKCEhZGF0YS5wb2ludHNbMF0pIHtcbiAgICAgIHggPSBkYXRhLnBvaW50c1swXS54O1xuICAgIH1cbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLnBsb3RseURhdGEuZmlsdGVyKGQgPT4gZC55Lmxlbmd0aCA+IDApLmxlbmd0aDtcbiAgICB0b29sdGlwLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgdG9vbHRpcC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0b29sdGlwLnN0eWxlLnBhZGRpbmdMZWZ0ID0gKHRoaXMuX3N0YW5kYWxvbmUgPyAwIDogNDApICsgJ3B4JztcbiAgICB0b29sdGlwLnN0eWxlLnRvcCA9IChcbiAgICAgICh0aGlzLmV4cGFuZGVkID8gY291bnQgLSAxIC0gKGRhdGEucG9pbnRzWzBdLnkgKyAwLjUpIDogLTEpICogKHRoaXMubGluZUhlaWdodCkgKyB0aGlzLmxheW91dC5tYXJnaW4udFxuICAgICkgKyA2ICsgJ3B4JztcbiAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ3JpZ2h0JywgJ2xlZnQnKTtcbiAgICB0b29sdGlwLmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwidG9vbHRpcC1ib2R5IHRyaW1tZWRcIiBpZD1cInRvb2x0aXAtYm9keVwiPlxuPHNwYW4gY2xhc3M9XCJ0b29sdGlwLWRhdGVcIj4ke3RoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnXG4gICAgICA/IHhcbiAgICAgIDogKG1vbWVudC51dGMoeCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdaJywgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSA9PT0gJ1VUQycgPyAnWicgOiAnJykgfHwgJycpfTwvc3Bhbj5cbjx1bD5cbjxsaT4ke0dUU0xpYi5mb3JtYXRMYWJlbChkYXRhLnBvaW50c1swXS5kYXRhLm5hbWUpfTogPHNwYW4gY2xhc3M9XCJ2YWx1ZVwiPiR7ZGF0YS5wb2ludHNbMF0udGV4dH08L3NwYW4+PC9saT5cbjwvdWw+XG4gICAgICA8L2Rpdj5gO1xuICAgIGlmIChkYXRhLmV2ZW50Lm9mZnNldFggPiBsYXlvdXQud2lkdGggLyAyKSB7XG4gICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ2xlZnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCdyaWdodCcpO1xuICAgIH1cbiAgICB0b29sdGlwLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gIH1cblxuICB1bmhvdmVyKCkge1xuICAgIHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICBhZnRlclBsb3QoZGl2KSB7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jaGFydEJvdW5kcy50c21pbiA9IHRoaXMubWluVGljaztcbiAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gdGhpcy5tYXhUaWNrO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQodGhpcy5jaGFydEJvdW5kcyk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydhZnRlclBsb3QnXSwgdGhpcy5jaGFydEJvdW5kcywgZGl2KTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdE5ld0JvdW5kcyhtaW4sIG1heCkge1xuICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICB0aGlzLmJvdW5kc0RpZENoYW5nZS5lbWl0KHtib3VuZHM6IHttaW4sIG1heH0sIHNvdXJjZTogJ2Fubm90YXRpb24nfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYm91bmRzRGlkQ2hhbmdlLmVtaXQoe1xuICAgICAgICBib3VuZHM6IHtcbiAgICAgICAgICBtaW46IG1vbWVudC50eihtaW4sIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKSxcbiAgICAgICAgICBtYXg6IG1vbWVudC50eihtYXgsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKVxuICAgICAgICB9LFxuICAgICAgICBzb3VyY2U6ICdhbm5vdGF0aW9uJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogUGFydGlhbDxhbnk+W10ge1xuICAgIGNvbnN0IGRhdGFzZXQ6IFBhcnRpYWw8YW55PltdID0gW107XG4gICAgbGV0IGd0c0xpc3QgPSBHVFNMaWIuZmxhdERlZXAoR1RTTGliLmZsYXR0ZW5HdHNJZEFycmF5KGRhdGEuZGF0YSBhcyBhbnlbXSwgMCkucmVzKTtcbiAgICB0aGlzLm1heFRpY2sgPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG4gICAgdGhpcy5taW5UaWNrID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHRoaXMudmlzaWJsZUd0c0lkID0gW107XG4gICAgdGhpcy5ndHNJZCA9IFtdO1xuICAgIGNvbnN0IG5vblBsb3R0YWJsZSA9IGd0c0xpc3QuZmlsdGVyKGcgPT4gZy52ICYmIEdUU0xpYi5pc0d0c1RvUGxvdChnKSk7XG4gICAgZ3RzTGlzdCA9IGd0c0xpc3QuZmlsdGVyKGcgPT4gZy52ICYmICFHVFNMaWIuaXNHdHNUb1Bsb3QoZykpO1xuICAgIGxldCB0aW1lc3RhbXBNb2RlID0gdHJ1ZTtcbiAgICBjb25zdCB0c0xpbWl0ID0gMTAwICogR1RTTGliLmdldERpdmlkZXIodGhpcy5fb3B0aW9ucy50aW1lVW5pdCk7XG4gICAgZ3RzTGlzdC5mb3JFYWNoKChndHM6IEdUUykgPT4ge1xuICAgICAgY29uc3QgdGlja3MgPSBndHMudi5tYXAodCA9PiB0WzBdKTtcbiAgICAgIGNvbnN0IHNpemUgPSBndHMudi5sZW5ndGg7XG4gICAgICB0aW1lc3RhbXBNb2RlID0gdGltZXN0YW1wTW9kZSAmJiAodGlja3NbMF0gPiAtdHNMaW1pdCAmJiB0aWNrc1swXSA8IHRzTGltaXQpO1xuICAgICAgdGltZXN0YW1wTW9kZSA9IHRpbWVzdGFtcE1vZGUgJiYgKHRpY2tzW3NpemUgLSAxXSA+IC10c0xpbWl0ICYmIHRpY2tzW3NpemUgLSAxXSA8IHRzTGltaXQpO1xuICAgIH0pO1xuICAgIGlmICh0aW1lc3RhbXBNb2RlIHx8IHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2xpbmVhcic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnZGF0ZSc7XG4gICAgfVxuICAgIGd0c0xpc3QuZm9yRWFjaCgoZ3RzOiBHVFMsIGkpID0+IHtcbiAgICAgIGlmIChndHMudikge1xuICAgICAgICBjb25zdCBzaXplID0gZ3RzLnYubGVuZ3RoO1xuICAgICAgICBjb25zdCBsYWJlbCA9IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShndHMpO1xuICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoZ3RzLmlkLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbaV0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICBjb25zdCBzZXJpZXM6IFBhcnRpYWw8YW55PiA9IHtcbiAgICAgICAgICB0eXBlOiAnc2NhdHRlcmdsJyxcbiAgICAgICAgICBtb2RlOiAnbWFya2VycycsXG4gICAgICAgICAgbmFtZTogbGFiZWwsXG4gICAgICAgICAgeDogW10sXG4gICAgICAgICAgeTogW10sXG4gICAgICAgICAgdGV4dDogW10sXG4gICAgICAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgY29ubmVjdGdhcHM6IGZhbHNlLFxuICAgICAgICAgIHZpc2libGU6ICEodGhpcy5faGlkZGVuRGF0YS5maWx0ZXIoaCA9PiBoID09PSBndHMuaWQpLmxlbmd0aCA+IDApLFxuICAgICAgICAgIGxpbmU6IHtjb2xvcn0sXG4gICAgICAgICAgbWFya2VyOiB7XG4gICAgICAgICAgICBzeW1ib2w6ICdsaW5lLW5zLW9wZW4nLFxuICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICBzaXplOiAyMCxcbiAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy52aXNpYmxlR3RzSWQucHVzaChndHMuaWQpO1xuICAgICAgICB0aGlzLmd0c0lkLnB1c2goZ3RzLmlkKTtcbiAgICAgICAgaWYgKHRpbWVzdGFtcE1vZGUgfHwgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2RhdGUnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRpY2tzID0gW107XG4gICAgICAgIHNlcmllcy50ZXh0ID0gW107XG4gICAgICAgIHNlcmllcy55ID0gW107XG4gICAgICAgIGlmIChzaXplID4gMCkge1xuICAgICAgICAgIHRoaXMubWluVGljayA9IGd0cy52WzBdWzBdO1xuICAgICAgICAgIHRoaXMubWF4VGljayA9IGd0cy52WzBdWzBdO1xuICAgICAgICAgIGZvciAobGV0IHYgPSAwOyB2IDwgc2l6ZTsgdisrKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBndHMudlt2XTtcbiAgICAgICAgICAgIGNvbnN0IHQgPSB2YWxbMF07XG4gICAgICAgICAgICB0aWNrcy5wdXNoKHQpO1xuICAgICAgICAgICAgc2VyaWVzLnRleHQucHVzaCh2YWxbdmFsLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIHNlcmllcy55LnB1c2goKHRoaXMuZXhwYW5kZWQgPyBpIDogMCkgKyAwLjUpO1xuICAgICAgICAgICAgdGhpcy5taW5UaWNrID0gKHQgPCB0aGlzLm1pblRpY2spID8gdCA6IHRoaXMubWluVGljaztcbiAgICAgICAgICAgIHRoaXMubWF4VGljayA9ICh0ID4gdGhpcy5tYXhUaWNrKSA/IHQgOiB0aGlzLm1heFRpY2s7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aW1lc3RhbXBNb2RlIHx8IHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgICAgc2VyaWVzLnggPSB0aWNrcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXJpZXMueCA9IHRpY2tzLm1hcCh0ID0+IEdUU0xpYi50b0lTT1N0cmluZyh0LCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VyaWVzLngubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRhdGFzZXQucHVzaChzZXJpZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sICdmb3JFYWNoIHZhbHVlIGVuZCcsIHRoaXMubWluVGljaywgdGhpcy5tYXhUaWNrKTtcbiAgICBpZiAobm9uUGxvdHRhYmxlLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vblBsb3R0YWJsZS5mb3JFYWNoKGcgPT4ge1xuICAgICAgICBnLnYuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgY29uc3QgdHMgPSB2YWx1ZVswXTtcbiAgICAgICAgICBpZiAodHMgPCB0aGlzLm1pblRpY2spIHtcbiAgICAgICAgICAgIHRoaXMubWluVGljayA9IHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHMgPiB0aGlzLm1heFRpY2spIHtcbiAgICAgICAgICAgIHRoaXMubWF4VGljayA9IHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIG5vdCBhbnkgcGxvdHRhYmxlIGRhdGEsIHdlIG11c3QgYWRkIGEgZmFrZSBvbmUgd2l0aCBpZCAtMS4gVGhpcyBvbmUgd2lsbCBhbHdheXMgYmUgaGlkZGVuLlxuICAgICAgaWYgKDAgPT09IGd0c0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIGlmICghdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1pblRpY2tdKSB7XG4gICAgICAgICAgdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1pblRpY2tdID0gWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1heFRpY2tdKSB7XG4gICAgICAgICAgdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1heFRpY2tdID0gWzBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlzaWJpbGl0eS5wdXNoKGZhbHNlKTtcbiAgICAgICAgdGhpcy52aXNpYmxlR3RzSWQucHVzaCgtMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHggPSB7dGljazA6IHVuZGVmaW5lZCwgcmFuZ2U6IFtdfTtcbiAgICBpZiAodGltZXN0YW1wTW9kZSB8fCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICB4LnRpY2swID0gdGhpcy5taW5UaWNrO1xuICAgICAgeC5yYW5nZSA9IFt0aGlzLm1pblRpY2ssIHRoaXMubWF4VGlja107XG4gICAgfSBlbHNlIHtcbiAgICAgIHgudGljazAgPSBHVFNMaWIudG9JU09TdHJpbmcodGhpcy5taW5UaWNrLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpO1xuICAgICAgeC5yYW5nZSA9IFtcbiAgICAgICAgR1RTTGliLnRvSVNPU3RyaW5nKHRoaXMubWluVGljaywgdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKSxcbiAgICAgICAgR1RTTGliLnRvSVNPU3RyaW5nKHRoaXMubWF4VGljaywgdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKVxuICAgICAgXTtcbiAgICB9XG4gICAgdGhpcy5sYXlvdXQueGF4aXMgPSB4O1xuICAgIHRoaXMubm9EYXRhID0gZGF0YXNldC5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgdGhpcy5leHBhbmRlZCA9ICF0aGlzLmV4cGFuZGVkO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBzZXRSZWFsQm91bmRzKGNoYXJ0Qm91bmRzOiBDaGFydEJvdW5kcykge1xuICAgIHRoaXMubWluVGljayA9IGNoYXJ0Qm91bmRzLnRzbWluO1xuICAgIHRoaXMubWF4VGljayA9IGNoYXJ0Qm91bmRzLnRzbWF4O1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzID0gdGhpcy5fb3B0aW9ucy5ib3VuZHMgfHwge307XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IHRoaXMubWluVGljaztcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gdGhpcy5tYXhUaWNrO1xuICAgIGNvbnN0IHg6IGFueSA9IHtcbiAgICAgIHRpY2swOiB1bmRlZmluZWQsXG4gICAgICByYW5nZTogW10sXG4gICAgfTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5zaG93UmFuZ2VTZWxlY3Rvcikge1xuICAgICAgeC5yYW5nZXNsaWRlciA9IHtcbiAgICAgICAgYmdjb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgdGhpY2tuZXNzOiA0MCAvIHRoaXMuaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgeC50aWNrMCA9IHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHgucmFuZ2UgPSBbdGhpcy5taW5UaWNrLCB0aGlzLm1heFRpY2tdO1xuICAgIH0gZWxzZSB7XG4gICAgICB4LnRpY2swID0gR1RTTGliLnRvSVNPU3RyaW5nKHRoaXMubWluVGljaywgdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKTtcbiAgICAgIHgucmFuZ2UgPSBbXG4gICAgICAgIEdUU0xpYi50b0lTT1N0cmluZyh0aGlzLm1pblRpY2ssIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSksXG4gICAgICAgIEdUU0xpYi50b0lTT1N0cmluZyh0aGlzLm1heFRpY2ssIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSlcbiAgICAgIF07XG4gICAgfVxuICAgIHRoaXMubGF5b3V0LnhheGlzID0geDtcbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gIH1cbn1cbiJdfQ==