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
import { __awaiter } from "tslib";
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
import { ChartBounds } from '../../model/chartBounds';
import { ColorLib } from '../../utils/color-lib';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Timsort } from '../../utils/timsort';
export class WarpViewChartComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.standalone = true;
        this.boundsDidChange = new EventEmitter();
        this.pointHover = new EventEmitter();
        this.warpViewChartResize = new EventEmitter();
        // tslint:disable-next-line:variable-name
        this._type = 'line';
        this.visibility = [];
        this.maxTick = 0;
        this.minTick = 0;
        this.visibleGtsId = [];
        this.gtsId = [];
        this.dataHashset = {};
        this.chartBounds = new ChartBounds();
        this.visibilityStatus = 'unknown';
        this.afterBoundsUpdate = false;
        this.maxPlottable = 10000;
        this.parsing = false;
        this.unhighliteCurve = new Subject();
        this.highliteCurve = new Subject();
        this.layout = {
            showlegend: false,
            autosize: true,
            hovermode: 'x',
            hoverdistance: 20,
            xaxis: {
                font: {}
            },
            yaxis: {
                exponentformat: 'none',
                fixedrange: true,
                automargin: true,
                showline: true,
                font: {}
            },
            margin: {
                t: 0,
                b: 30,
                r: 10,
                l: 50
            },
        };
        this.LOG = new Logger(WarpViewChartComponent, this._debug);
    }
    set hiddenData(hiddenData) {
        const previousVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
        this._hiddenData = hiddenData;
        this.visibility = [];
        this.visibleGtsId.forEach(id => this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)));
        this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
        const newVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility, this._hiddenData);
        if (previousVisibility !== newVisibility) {
            const visible = [];
            const hidden = [];
            (this.gtsId || []).forEach((id, i) => {
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
            this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change', visible, hidden);
        }
    }
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    update(options, refresh) {
        this.drawChart(refresh);
    }
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    getTimeClip() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.LOG.debug(['getTimeClip'], this.chartBounds);
                resolve(this.chartBounds);
            });
        });
    }
    resize(newHeight) {
        this.LOG.debug(['resize'], newHeight);
        this.height = newHeight;
        this.layout.height = this.height;
        if (this._options.showRangeSelector) {
            this.layout.xaxis.rangeslider = {
                bgcolor: 'transparent',
                thickness: 40 / this.height
            };
        }
    }
    drawChart(reparseNewData = false) {
        this.LOG.debug(['drawChart', 'this.layout', 'this.options'], this.layout, this._options, (this._options.bounds || {}).minDate);
        if (!this.initChart(this.el)) {
            this.LOG.debug(['drawChart', 'initChart', 'empty'], this._options);
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
        this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
        this.layout.margin.t = this.standalone ? 20 : 10;
        this.layout.showlegend = this._showLegend;
        if (!this._responsive) {
            this.layout.width = this.width;
            this.layout.height = this.height;
        }
        this.LOG.debug(['drawChart', 'this.options'], this.layout, this._options);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        if (!!this._options.showRangeSelector) {
            this.resize(this.height);
        }
        else {
            this.layout.margin.b = 30;
        }
        this.layout = Object.assign({}, this.layout);
        this.highliteCurve.pipe(throttleTime(200)).subscribe(value => {
            this.graph.restyleChart({ opacity: 0.4 }, value.off);
            this.graph.restyleChart({ opacity: 1 }, value.on);
        });
        this.unhighliteCurve.pipe(throttleTime(200)).subscribe(value => {
            this.graph.restyleChart({ opacity: 1 }, value);
        });
        this.loading = false;
    }
    emitNewBounds(min, max, marginLeft) {
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.boundsDidChange.emit({ bounds: { min, max, marginLeft }, source: 'chart' });
            this._options.bounds = this._options.bounds || {};
            this._options.bounds.minDate = min;
            this._options.bounds.maxDate = max;
        }
        else {
            const minDate = moment.tz(min, this._options.timeZone).valueOf();
            const maxDate = moment.tz(max, this._options.timeZone).valueOf();
            this._options.bounds = this._options.bounds || {};
            this._options.bounds.minDate = minDate;
            this._options.bounds.maxDate = maxDate;
            this.boundsDidChange.emit({ bounds: { min: minDate, max: maxDate, marginLeft }, source: 'chart' });
        }
    }
    initChart(el) {
        const res = super.initChart(el);
        const x = {
            tick0: undefined,
            range: [],
        };
        this.LOG.debug(['initChart', 'updateBounds'], this.chartBounds, this._options.bounds);
        const min = (this._options.bounds || {}).minDate || this.chartBounds.tsmin || this.minTick;
        const max = (this._options.bounds || {}).maxDate || this.chartBounds.tsmax || this.maxTick;
        this.LOG.debug(['initChart', 'updateBounds'], [min, max]);
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            x.tick0 = min;
            x.range = [min, max];
        }
        else {
            x.tick0 = GTSLib.toISOString(min, this.divider, this._options.timeZone);
            x.range = [
                GTSLib.toISOString(min, this.divider, this._options.timeZone),
                GTSLib.toISOString(max, this.divider, this._options.timeZone)
            ];
        }
        this.layout.xaxis = x;
        if (!!res) {
            this.resize(this.height);
        }
        return res;
    }
    convert(data) {
        this.parsing = !this._options.isRefresh;
        this.chartBounds.tsmin = undefined;
        this.chartBounds.tsmax = undefined;
        const dataset = [];
        this.LOG.debug(['convert'], this._options.timeMode);
        this.LOG.debug(['convert', 'this._hiddenData'], this._hiddenData);
        this.LOG.debug(['convert', 'this._options.timezone'], this._options.timeZone);
        if (GTSLib.isArray(data.data)) {
            let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res);
            this.maxTick = Number.NEGATIVE_INFINITY;
            this.minTick = Number.POSITIVE_INFINITY;
            this.visibleGtsId = [];
            this.gtsId = [];
            const nonPlottable = gtsList.filter(g => (g.v && !GTSLib.isGtsToPlot(g)));
            gtsList = gtsList.filter(g => g.v && GTSLib.isGtsToPlot(g));
            // initialize visibility status
            if (this.visibilityStatus === 'unknown') {
                this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
            }
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
                if (gts.v && GTSLib.isGtsToPlot(gts)) {
                    Timsort.sort(gts.v, (a, b) => a[0] - b[0]);
                    const size = gts.v.length;
                    const label = GTSLib.serializeGtsMetadata(gts);
                    const c = ColorLib.getColor(gts.id, this._options.scheme);
                    const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                    const type = ((data.params || [])[i] || { type: this._type }).type || this._type;
                    const series = {
                        type: type === 'spline' ? 'scatter' : 'scattergl',
                        mode: type === 'scatter' ? 'markers' : size > this.maxPlottable ? 'lines' : 'lines+markers',
                        // name: label,
                        text: label,
                        x: [],
                        y: [],
                        line: { color },
                        hoverinfo: 'none',
                        connectgaps: false,
                        visible: !(this._hiddenData.filter(h => h === gts.id).length > 0),
                    };
                    if (type === 'scatter' || size < this.maxPlottable) {
                        series.marker = {
                            size: 3,
                            color: new Array(size).fill(color),
                            line: { color, width: 3 },
                            opacity: new Array(size).fill(this._type === 'scatter' || this._options.showDots ? 1 : 0)
                        };
                    }
                    switch (type) {
                        case 'spline':
                            series.line.shape = 'spline';
                            break;
                        case 'area':
                            series.fill = 'tozeroy';
                            series.fillcolor = ColorLib.transparentize(color, 0.3);
                            break;
                        case 'step':
                            series.line.shape = 'hvh';
                            break;
                        case 'step-before':
                            series.line.shape = 'vh';
                            break;
                        case 'step-after':
                            series.line.shape = 'hv';
                            break;
                    }
                    this.visibleGtsId.push(gts.id);
                    this.gtsId.push(gts.id);
                    //  this.LOG.debug(['convert'], 'forEach value');
                    const ticks = gts.v.map(t => t[0]);
                    const values = gts.v.map(t => t[t.length - 1]);
                    if (size > 0) {
                        this.minTick = this.minTick || ticks[0];
                        this.maxTick = this.maxTick || ticks[0];
                        for (let v = 1; v < size; v++) {
                            const val = ticks[v];
                            this.minTick = val <= this.minTick ? val : this.minTick;
                            this.maxTick = val >= this.maxTick ? val : this.maxTick;
                        }
                    }
                    if (timestampMode || this._options.timeMode === 'timestamp') {
                        series.x = ticks;
                    }
                    else {
                        series.x = ticks.map(t => GTSLib.toISOString(t, this.divider, this._options.timeZone));
                    }
                    series.y = values;
                    dataset.push(series);
                }
            });
            if (nonPlottable.length > 0 && gtsList.length === 0) {
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
        }
        this.LOG.debug(['convert'], 'end', dataset);
        this.noData = dataset.length === 0;
        this.parsing = false;
        return dataset;
    }
    afterPlot(plotlyInstance) {
        super.afterPlot(plotlyInstance);
        this.marginLeft = parseInt(this.graph.plotEl.nativeElement.querySelector('g.bglayer > rect').getAttribute('x'), 10);
        this.LOG.debug(['afterPlot', 'marginLeft'], this.marginLeft);
        if (this.chartBounds.tsmin !== this.minTick || this.chartBounds.tsmax !== this.maxTick) {
            this.chartBounds.tsmin = this.minTick;
            this.chartBounds.tsmax = this.maxTick;
            this.chartBounds.marginLeft = this.marginLeft;
            this.chartDraw.emit(this.chartBounds);
            if (this.afterBoundsUpdate || this.standalone) {
                this.LOG.debug(['afterPlot', 'updateBounds'], this.minTick, this.maxTick);
                this.emitNewBounds(this.minTick, this.maxTick, this.marginLeft);
                this.loading = false;
                this.afterBoundsUpdate = false;
            }
        }
        else {
            this.loading = false;
        }
    }
    relayout(data) {
        let change = false;
        if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
            if (this.chartBounds.msmin !== data['xaxis.range'][0] || this.chartBounds.msmax !== data['xaxis.range'][1]) {
                this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
                change = true;
                this.chartBounds.msmin = data['xaxis.range'][0];
                this.chartBounds.msmax = data['xaxis.range'][1];
                this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
                this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
            }
        }
        else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
            if (this.chartBounds.msmin !== data['xaxis.range[0]'] || this.chartBounds.msmax !== data['xaxis.range[1]']) {
                this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
                change = true;
                this.chartBounds.msmin = data['xaxis.range[0]'];
                this.chartBounds.msmax = data['xaxis.range[1]'];
                this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
                this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
            }
        }
        else if (data['xaxis.autorange']) {
            if (this.chartBounds.tsmin !== this.minTick || this.chartBounds.tsmax !== this.maxTick) {
                this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data, this.minTick, this.maxTick);
                change = true;
                this.chartBounds.tsmin = this.minTick;
                this.chartBounds.tsmax = this.maxTick;
            }
        }
        if (change) {
            this.LOG.debug(['relayout', 'updateBounds'], this.chartBounds);
            this.emitNewBounds(this.chartBounds.tsmin, this.chartBounds.tsmax, this.marginLeft);
        }
        this.loading = false;
        this.afterBoundsUpdate = false;
    }
    sliderChange($event) {
        this.LOG.debug(['sliderChange'], $event);
    }
    updateBounds(min, max) {
        this.LOG.debug(['updateBounds'], min, max, this._options);
        min = min || this.minTick / this.divider;
        max = max || this.maxTick / this.divider;
        this.layout.xaxis.autorange = false;
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.range = [min, max];
            this.layout.xaxis.tick0 = min;
        }
        else {
            this.layout.xaxis.range = [
                GTSLib.toISOString(min, this.divider, this._options.timeZone),
                GTSLib.toISOString(max, this.divider, this._options.timeZone)
            ];
            this.layout.xaxis.tick0 = GTSLib.toISOString(min, this.divider, this._options.timeZone);
        }
        this.layout = Object.assign({}, this.layout);
        this.LOG.debug(['updateBounds'], this.layout);
        this.afterBoundsUpdate = true;
    }
    setRealBounds(chartBounds) {
        this.afterBoundsUpdate = true;
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
    hover(data) {
        this.LOG.debug(['hover'], data);
        let delta = Number.MAX_VALUE;
        // tslint:disable-next-line:no-shadowed-variable
        let point;
        const curves = [];
        this.toolTip.nativeElement.style.display = 'block';
        if (data.points[0] && data.points[0].data.orientation !== 'h') {
            const y = (data.yvals || [''])[0];
            data.points.forEach(p => {
                curves.push(p.curveNumber);
                const d = Math.abs(p.y - y);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            });
        }
        else {
            const x = (data.xvals || [''])[0];
            data.points.forEach(p => {
                curves.push(p.curveNumber);
                const d = Math.abs(p.x - x);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            });
        }
        super.hover(data, point);
        if (point && this.highlighted !== point.curveNumber) {
            this.highliteCurve.next({ on: [point.curveNumber], off: curves });
            this.highlighted = point.curveNumber;
        }
        this.pointHover.emit(data.event);
        /*setTimeout(() => {
          let pn = -1;
          let tn = -1;
          let color = [];
          let line = {};
          let opacity = [];
          data.points.forEach(p => {
            if (!!p.data.marker) {
              color = p.data.marker.color;
              opacity = p.data.marker.opacity;
              line = p.data.marker.line;
              pn = p.pointNumber;
              tn = p.curveNumber;
              if (pn >= 0) {
                color[pn] = 'transparent';
                opacity[pn] = 1;
                const update = {marker: {color, opacity, line, size: 15}};
                this.graph.restyleChart(update, [tn]);
                this.LOG.debug(['hover'], 'restyleChart inner', update, [tn]);
              }
            }
          });
        })*/
    }
    unhover(data) {
        let delta = Number.MAX_VALUE;
        // tslint:disable-next-line:no-shadowed-variable
        let point;
        if (data.points[0] && data.points[0].data.orientation !== 'h') {
            const y = (data.yvals || [''])[0];
            data.points.forEach(p => {
                const d = Math.abs(p.y - y);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            });
        }
        else {
            const x = (data.xvals || [''])[0];
            data.points.forEach(p => {
                const d = Math.abs(p.x - x);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            });
        }
        if (!!point && this.highlighted !== point.curveNumber) {
            this.unhighliteCurve.next([this.highlighted]);
            this.highlighted = undefined;
        }
        super.unhover(data, point);
        /*setTimeout(() => {
          let pn = -1;
          let tn = -1;
          let color = [];
          let line = {};
          let opacity = [];
          data.points.forEach(p => {
            if (!!p.data.marker) {
              pn = p.pointNumber;
              tn = p.curveNumber;
              color = p.data.marker.color;
              opacity = p.data.marker.opacity;
              line = p.data.marker.line;
              if (pn >= 0) {
                color[pn] = p.data.line.color;
                opacity[pn] = this._options.showDots ? 1 : 0;
                const update = {marker: {color, opacity, line, size: 15}};
                this.graph.restyleChart(update, [tn]);
              }
            }
          });
        })*/
    }
}
WarpViewChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-chart',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <p class=\"noData\" *ngIf=\"parsing\">Parsing data</p>\n  <div *ngIf=\"!loading && !noData\" >\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\"\n                     (afterPlot)=\"afterPlot($event)\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     (sliderChange)=\"sliderChange($event)\" (unhover)=\"unhover($event)\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .executionErrorText{background:#faebd7;border:2px solid red;border-radius:3px;color:red;padding:10px;position:absolute;top:-30px}"]
            },] }
];
WarpViewChartComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewChartComponent.propDecorators = {
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    type: [{ type: Input, args: ['type',] }],
    standalone: [{ type: Input, args: ['standalone',] }],
    boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }],
    pointHover: [{ type: Output, args: ['pointHover',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWNoYXJ0L3dhcnAtdmlldy1jaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFVLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHL0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFrQixpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBUTVDLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxpQkFBaUI7SUFxRjNELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUs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ICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdab25lLCBPbkluaXQsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi8uLi9tb2RlbC9HVFMnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHtDaGFydEJvdW5kc30gZnJvbSAnLi4vLi4vbW9kZWwvY2hhcnRCb3VuZHMnO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCB7VmlzaWJpbGl0eVN0YXRlLCBXYXJwVmlld0NvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWNvbXBvbmVudCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rocm90dGxlVGltZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtUaW1zb3J0fSBmcm9tICcuLi8uLi91dGlscy90aW1zb3J0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctY2hhcnQnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0NoYXJ0Q29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgnaGlkZGVuRGF0YScpIHNldCBoaWRkZW5EYXRhKGhpZGRlbkRhdGE6IG51bWJlcltdKSB7XG4gICAgY29uc3QgcHJldmlvdXNWaXNpYmlsaXR5ID0gSlNPTi5zdHJpbmdpZnkodGhpcy52aXNpYmlsaXR5KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAncHJldmlvdXNWaXNpYmlsaXR5J10sIHByZXZpb3VzVmlzaWJpbGl0eSk7XG4gICAgdGhpcy5faGlkZGVuRGF0YSA9IGhpZGRlbkRhdGE7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gW107XG4gICAgdGhpcy52aXNpYmxlR3RzSWQuZm9yRWFjaChpZCA9PiB0aGlzLnZpc2liaWxpdHkucHVzaChoaWRkZW5EYXRhLmluZGV4T2YoaWQpIDwgMCAmJiAoaWQgIT09IC0xKSkpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YScsICdoaWRkZW5keWdyYXBoZnVsbHYnXSwgdGhpcy52aXNpYmlsaXR5KTtcbiAgICBjb25zdCBuZXdWaXNpYmlsaXR5ID0gSlNPTi5zdHJpbmdpZnkodGhpcy52aXNpYmlsaXR5KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAnanNvbiddLCBwcmV2aW91c1Zpc2liaWxpdHksIG5ld1Zpc2liaWxpdHksIHRoaXMuX2hpZGRlbkRhdGEpO1xuICAgIGlmIChwcmV2aW91c1Zpc2liaWxpdHkgIT09IG5ld1Zpc2liaWxpdHkpIHtcbiAgICAgIGNvbnN0IHZpc2libGUgPSBbXTtcbiAgICAgIGNvbnN0IGhpZGRlbiA9IFtdO1xuICAgICAgKHRoaXMuZ3RzSWQgfHwgW10pLmZvckVhY2goKGlkLCBpKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9oaWRkZW5EYXRhLmluZGV4T2YoaWQpID4gLTEpIHtcbiAgICAgICAgICBoaWRkZW4ucHVzaChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2aXNpYmxlLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHZpc2libGUubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh7dmlzaWJsZTogdHJ1ZX0sIHZpc2libGUpO1xuICAgICAgfVxuICAgICAgaWYgKGhpZGRlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHt2aXNpYmxlOiBmYWxzZX0sIGhpZGRlbik7XG4gICAgICB9XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbmR5Z3JhcGh0cmlnJywgJ2Rlc3Ryb3knXSwgJ3JlZHJhdyBieSB2aXNpYmlsaXR5IGNoYW5nZScsIHZpc2libGUsIGhpZGRlbik7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIEBJbnB1dCgnc3RhbmRhbG9uZScpIHN0YW5kYWxvbmUgPSB0cnVlO1xuICBAT3V0cHV0KCdib3VuZHNEaWRDaGFuZ2UnKSBib3VuZHNEaWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgncG9pbnRIb3ZlcicpIHBvaW50SG92ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnd2FycFZpZXdDaGFydFJlc2l6ZScpIHdhcnBWaWV3Q2hhcnRSZXNpemUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF90eXBlID0gJ2xpbmUnO1xuICBwcml2YXRlIHZpc2liaWxpdHk6IGJvb2xlYW5bXSA9IFtdO1xuICBwcml2YXRlIG1heFRpY2sgPSAwO1xuICBwcml2YXRlIG1pblRpY2sgPSAwO1xuICBwcml2YXRlIHZpc2libGVHdHNJZCA9IFtdO1xuICBwcml2YXRlIGd0c0lkID0gW107XG4gIHByaXZhdGUgZGF0YUhhc2hzZXQgPSB7fTtcbiAgcHJpdmF0ZSBjaGFydEJvdW5kczogQ2hhcnRCb3VuZHMgPSBuZXcgQ2hhcnRCb3VuZHMoKTtcbiAgcHJpdmF0ZSB2aXNpYmlsaXR5U3RhdHVzOiBWaXNpYmlsaXR5U3RhdGUgPSAndW5rbm93bic7XG4gIHByaXZhdGUgYWZ0ZXJCb3VuZHNVcGRhdGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBtYXJnaW5MZWZ0OiBudW1iZXI7XG4gIHByaXZhdGUgbWF4UGxvdHRhYmxlID0gMTAwMDA7XG4gIHBhcnNpbmcgPSBmYWxzZTtcbiAgdW5oaWdobGl0ZUN1cnZlID0gbmV3IFN1YmplY3Q8bnVtYmVyW10+KCk7XG4gIGhpZ2hsaXRlQ3VydmUgPSBuZXcgU3ViamVjdDx7IG9uOiBudW1iZXJbXSwgb2ZmOiBudW1iZXJbXSB9PigpO1xuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiBmYWxzZSxcbiAgICBhdXRvc2l6ZTogdHJ1ZSxcbiAgICBob3Zlcm1vZGU6ICd4JyxcbiAgICBob3ZlcmRpc3RhbmNlOiAyMCxcbiAgICB4YXhpczoge1xuICAgICAgZm9udDoge31cbiAgICB9LFxuICAgIHlheGlzOiB7XG4gICAgICBleHBvbmVudGZvcm1hdDogJ25vbmUnLFxuICAgICAgZml4ZWRyYW5nZTogdHJ1ZSxcbiAgICAgIGF1dG9tYXJnaW46IHRydWUsXG4gICAgICBzaG93bGluZTogdHJ1ZSxcbiAgICAgIGZvbnQ6IHt9XG4gICAgfSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHQ6IDAsXG4gICAgICBiOiAzMCxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogNTBcbiAgICB9LFxuICB9O1xuICBwcml2YXRlIGhpZ2hsaWdodGVkOiBhbnk7XG5cbiAgdXBkYXRlKG9wdGlvbnMsIHJlZnJlc2gpOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaGFydChyZWZyZXNoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0NoYXJ0Q29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB0aGlzLmRlZk9wdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0VGltZUNsaXAoKTogUHJvbWlzZTxDaGFydEJvdW5kcz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxDaGFydEJvdW5kcz4ocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2dldFRpbWVDbGlwJ10sIHRoaXMuY2hhcnRCb3VuZHMpO1xuICAgICAgcmVzb2x2ZSh0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZXNpemUobmV3SGVpZ2h0OiBudW1iZXIpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3Jlc2l6ZSddLCBuZXdIZWlnaHQpO1xuICAgIHRoaXMuaGVpZ2h0ID0gbmV3SGVpZ2h0O1xuICAgIHRoaXMubGF5b3V0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIGlmICh0aGlzLl9vcHRpb25zLnNob3dSYW5nZVNlbGVjdG9yKSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy5yYW5nZXNsaWRlciA9IHtcbiAgICAgICAgYmdjb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgdGhpY2tuZXNzOiA0MCAvIHRoaXMuaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGRyYXdDaGFydChyZXBhcnNlTmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5sYXlvdXQnLCAndGhpcy5vcHRpb25zJ10sIHRoaXMubGF5b3V0LCB0aGlzLl9vcHRpb25zLCAodGhpcy5fb3B0aW9ucy5ib3VuZHMgfHwge30pLm1pbkRhdGUpO1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ2luaXRDaGFydCcsICdlbXB0eSddLCB0aGlzLl9vcHRpb25zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuZ3JpZGNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC54YXhpcy5ncmlkY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnlheGlzLnplcm9saW5lY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLnplcm9saW5lY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0Lm1hcmdpbi50ID0gdGhpcy5zdGFuZGFsb25lID8gMjAgOiAxMDtcbiAgICB0aGlzLmxheW91dC5zaG93bGVnZW5kID0gdGhpcy5fc2hvd0xlZ2VuZDtcbiAgICBpZiAoIXRoaXMuX3Jlc3BvbnNpdmUpIHtcbiAgICAgIHRoaXMubGF5b3V0LndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgIHRoaXMubGF5b3V0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIH1cblxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMub3B0aW9ucyddLCB0aGlzLmxheW91dCwgdGhpcy5fb3B0aW9ucyk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5sYXlvdXQnXSwgdGhpcy5sYXlvdXQpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMucGxvdGx5Q29uZmlnJ10sIHRoaXMucGxvdGx5Q29uZmlnKTtcbiAgICBpZiAoISF0aGlzLl9vcHRpb25zLnNob3dSYW5nZVNlbGVjdG9yKSB7XG4gICAgICB0aGlzLnJlc2l6ZSh0aGlzLmhlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0Lm1hcmdpbi5iID0gMzA7XG4gICAgfVxuICAgIHRoaXMubGF5b3V0ID0gey4uLnRoaXMubGF5b3V0fTtcbiAgICB0aGlzLmhpZ2hsaXRlQ3VydmUucGlwZSh0aHJvdHRsZVRpbWUoMjAwKSkuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHtvcGFjaXR5OiAwLjR9LCB2YWx1ZS5vZmYpO1xuICAgICAgdGhpcy5ncmFwaC5yZXN0eWxlQ2hhcnQoe29wYWNpdHk6IDF9LCB2YWx1ZS5vbik7XG4gICAgfSk7XG4gICAgdGhpcy51bmhpZ2hsaXRlQ3VydmUucGlwZSh0aHJvdHRsZVRpbWUoMjAwKSkuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHtvcGFjaXR5OiAxfSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0TmV3Qm91bmRzKG1pbiwgbWF4LCBtYXJnaW5MZWZ0KSB7XG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMuYm91bmRzRGlkQ2hhbmdlLmVtaXQoe2JvdW5kczoge21pbiwgbWF4LCBtYXJnaW5MZWZ0fSwgc291cmNlOiAnY2hhcnQnfSk7XG4gICAgICB0aGlzLl9vcHRpb25zLmJvdW5kcyA9IHRoaXMuX29wdGlvbnMuYm91bmRzIHx8IHt9O1xuICAgICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IG1pbjtcbiAgICAgIHRoaXMuX29wdGlvbnMuYm91bmRzLm1heERhdGUgPSBtYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1pbkRhdGUgPSBtb21lbnQudHoobWluLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCk7XG4gICAgICBjb25zdCBtYXhEYXRlID0gbW9tZW50LnR6KG1heCwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpO1xuICAgICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMgPSB0aGlzLl9vcHRpb25zLmJvdW5kcyB8fCB7fTtcbiAgICAgIHRoaXMuX29wdGlvbnMuYm91bmRzLm1pbkRhdGUgPSBtaW5EYXRlO1xuICAgICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWF4RGF0ZSA9IG1heERhdGU7XG4gICAgICB0aGlzLmJvdW5kc0RpZENoYW5nZS5lbWl0KHtib3VuZHM6IHttaW46IG1pbkRhdGUsIG1heDogbWF4RGF0ZSwgbWFyZ2luTGVmdH0sIHNvdXJjZTogJ2NoYXJ0J30pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0Q2hhcnQoZWw6IEVsZW1lbnRSZWYpOiBib29sZWFuIHtcbiAgICBjb25zdCByZXMgPSBzdXBlci5pbml0Q2hhcnQoZWwpO1xuICAgIGNvbnN0IHg6IGFueSA9IHtcbiAgICAgIHRpY2swOiB1bmRlZmluZWQsXG4gICAgICByYW5nZTogW10sXG4gICAgfTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2luaXRDaGFydCcsICd1cGRhdGVCb3VuZHMnXSwgdGhpcy5jaGFydEJvdW5kcywgdGhpcy5fb3B0aW9ucy5ib3VuZHMpO1xuICAgIGNvbnN0IG1pbiA9ICh0aGlzLl9vcHRpb25zLmJvdW5kcyB8fCB7fSkubWluRGF0ZSB8fCB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluIHx8IHRoaXMubWluVGljaztcbiAgICBjb25zdCBtYXggPSAodGhpcy5fb3B0aW9ucy5ib3VuZHMgfHwge30pLm1heERhdGUgfHwgdGhpcy5jaGFydEJvdW5kcy50c21heCB8fCB0aGlzLm1heFRpY2s7XG4gICAgdGhpcy5MT0cuZGVidWcoWydpbml0Q2hhcnQnLCAndXBkYXRlQm91bmRzJ10sIFttaW4sIG1heF0pO1xuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHgudGljazAgPSBtaW47XG4gICAgICB4LnJhbmdlID0gW21pbiwgbWF4XTtcbiAgICB9IGVsc2Uge1xuICAgICAgeC50aWNrMCA9IEdUU0xpYi50b0lTT1N0cmluZyhtaW4sIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSk7XG4gICAgICB4LnJhbmdlID0gW1xuICAgICAgICBHVFNMaWIudG9JU09TdHJpbmcobWluLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLFxuICAgICAgICBHVFNMaWIudG9JU09TdHJpbmcobWF4LCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpXG4gICAgICBdO1xuICAgIH1cbiAgICB0aGlzLmxheW91dC54YXhpcyA9IHg7XG4gICAgaWYgKCEhcmVzKSB7XG4gICAgICB0aGlzLnJlc2l6ZSh0aGlzLmhlaWdodCk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgdGhpcy5wYXJzaW5nID0gIXRoaXMuX29wdGlvbnMuaXNSZWZyZXNoO1xuICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBkYXRhc2V0OiBQYXJ0aWFsPGFueT5bXSA9IFtdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAndGhpcy5faGlkZGVuRGF0YSddLCB0aGlzLl9oaWRkZW5EYXRhKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAndGhpcy5fb3B0aW9ucy50aW1lem9uZSddLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKTtcbiAgICBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YS5kYXRhKSkge1xuICAgICAgbGV0IGd0c0xpc3QgPSBHVFNMaWIuZmxhdERlZXAoR1RTTGliLmZsYXR0ZW5HdHNJZEFycmF5KGRhdGEuZGF0YSBhcyBhbnlbXSwgMCkucmVzKTtcbiAgICAgIHRoaXMubWF4VGljayA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbiAgICAgIHRoaXMubWluVGljayA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICAgIHRoaXMudmlzaWJsZUd0c0lkID0gW107XG4gICAgICB0aGlzLmd0c0lkID0gW107XG4gICAgICBjb25zdCBub25QbG90dGFibGUgPSBndHNMaXN0LmZpbHRlcihnID0+IChnLnYgJiYgIUdUU0xpYi5pc0d0c1RvUGxvdChnKSkpO1xuICAgICAgZ3RzTGlzdCA9IGd0c0xpc3QuZmlsdGVyKGcgPT4gZy52ICYmIEdUU0xpYi5pc0d0c1RvUGxvdChnKSk7XG4gICAgICAvLyBpbml0aWFsaXplIHZpc2liaWxpdHkgc3RhdHVzXG4gICAgICBpZiAodGhpcy52aXNpYmlsaXR5U3RhdHVzID09PSAndW5rbm93bicpIHtcbiAgICAgICAgdGhpcy52aXNpYmlsaXR5U3RhdHVzID0gZ3RzTGlzdC5sZW5ndGggPiAwID8gJ3Bsb3R0YWJsZVNob3duJyA6ICdub3RoaW5nUGxvdHRhYmxlJztcbiAgICAgIH1cblxuICAgICAgbGV0IHRpbWVzdGFtcE1vZGUgPSB0cnVlO1xuICAgICAgY29uc3QgdHNMaW1pdCA9IDEwMCAqIEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgICAgZ3RzTGlzdC5mb3JFYWNoKChndHM6IEdUUykgPT4ge1xuICAgICAgICBjb25zdCB0aWNrcyA9IGd0cy52Lm1hcCh0ID0+IHRbMF0pO1xuICAgICAgICBjb25zdCBzaXplID0gZ3RzLnYubGVuZ3RoO1xuICAgICAgICB0aW1lc3RhbXBNb2RlID0gdGltZXN0YW1wTW9kZSAmJiAodGlja3NbMF0gPiAtdHNMaW1pdCAmJiB0aWNrc1swXSA8IHRzTGltaXQpO1xuICAgICAgICB0aW1lc3RhbXBNb2RlID0gdGltZXN0YW1wTW9kZSAmJiAodGlja3Nbc2l6ZSAtIDFdID4gLXRzTGltaXQgJiYgdGlja3Nbc2l6ZSAtIDFdIDwgdHNMaW1pdCk7XG4gICAgICB9KTtcbiAgICAgIGlmICh0aW1lc3RhbXBNb2RlIHx8IHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnZGF0ZSc7XG4gICAgICB9XG4gICAgICBndHNMaXN0LmZvckVhY2goKGd0czogR1RTLCBpKSA9PiB7XG4gICAgICAgIGlmIChndHMudiAmJiBHVFNMaWIuaXNHdHNUb1Bsb3QoZ3RzKSkge1xuICAgICAgICAgIFRpbXNvcnQuc29ydChndHMudiwgKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcbiAgICAgICAgICBjb25zdCBzaXplID0gZ3RzLnYubGVuZ3RoO1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbaV0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSAoKGRhdGEucGFyYW1zIHx8IFtdKVtpXSB8fCB7dHlwZTogdGhpcy5fdHlwZX0pLnR5cGUgfHwgdGhpcy5fdHlwZTtcbiAgICAgICAgICBjb25zdCBzZXJpZXM6IFBhcnRpYWw8YW55PiA9IHtcbiAgICAgICAgICAgIHR5cGU6IHR5cGUgPT09ICdzcGxpbmUnID8gJ3NjYXR0ZXInIDogJ3NjYXR0ZXJnbCcsXG4gICAgICAgICAgICBtb2RlOiB0eXBlID09PSAnc2NhdHRlcicgPyAnbWFya2VycycgOiBzaXplID4gdGhpcy5tYXhQbG90dGFibGUgPyAnbGluZXMnIDogJ2xpbmVzK21hcmtlcnMnLFxuICAgICAgICAgICAgLy8gbmFtZTogbGFiZWwsXG4gICAgICAgICAgICB0ZXh0OiBsYWJlbCxcbiAgICAgICAgICAgIHg6IFtdLFxuICAgICAgICAgICAgeTogW10sXG4gICAgICAgICAgICBsaW5lOiB7Y29sb3J9LFxuICAgICAgICAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgICBjb25uZWN0Z2FwczogZmFsc2UsXG4gICAgICAgICAgICB2aXNpYmxlOiAhKHRoaXMuX2hpZGRlbkRhdGEuZmlsdGVyKGggPT4gaCA9PT0gZ3RzLmlkKS5sZW5ndGggPiAwKSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmICh0eXBlID09PSAnc2NhdHRlcicgfHwgc2l6ZSA8IHRoaXMubWF4UGxvdHRhYmxlKSB7XG4gICAgICAgICAgICBzZXJpZXMubWFya2VyID0ge1xuICAgICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICAgICAgICBjb2xvcjogbmV3IEFycmF5KHNpemUpLmZpbGwoY29sb3IpLFxuICAgICAgICAgICAgICBsaW5lOiB7Y29sb3IsIHdpZHRoOiAzfSxcbiAgICAgICAgICAgICAgb3BhY2l0eTogbmV3IEFycmF5KHNpemUpLmZpbGwodGhpcy5fdHlwZSA9PT0gJ3NjYXR0ZXInIHx8IHRoaXMuX29wdGlvbnMuc2hvd0RvdHMgPyAxIDogMClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc3BsaW5lJzpcbiAgICAgICAgICAgICAgc2VyaWVzLmxpbmUuc2hhcGUgPSAnc3BsaW5lJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmVhJzpcbiAgICAgICAgICAgICAgc2VyaWVzLmZpbGwgPSAndG96ZXJveSc7XG4gICAgICAgICAgICAgIHNlcmllcy5maWxsY29sb3IgPSBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciwgMC4zKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGVwJzpcbiAgICAgICAgICAgICAgc2VyaWVzLmxpbmUuc2hhcGUgPSAnaHZoJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGVwLWJlZm9yZSc6XG4gICAgICAgICAgICAgIHNlcmllcy5saW5lLnNoYXBlID0gJ3ZoJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGVwLWFmdGVyJzpcbiAgICAgICAgICAgICAgc2VyaWVzLmxpbmUuc2hhcGUgPSAnaHYnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy52aXNpYmxlR3RzSWQucHVzaChndHMuaWQpO1xuICAgICAgICAgIHRoaXMuZ3RzSWQucHVzaChndHMuaWQpO1xuICAgICAgICAgIC8vICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgJ2ZvckVhY2ggdmFsdWUnKTtcbiAgICAgICAgICBjb25zdCB0aWNrcyA9IGd0cy52Lm1hcCh0ID0+IHRbMF0pO1xuICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGd0cy52Lm1hcCh0ID0+IHRbdC5sZW5ndGggLSAxXSk7XG5cbiAgICAgICAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMubWluVGljayA9IHRoaXMubWluVGljayB8fCB0aWNrc1swXTtcbiAgICAgICAgICAgIHRoaXMubWF4VGljayA9IHRoaXMubWF4VGljayB8fCB0aWNrc1swXTtcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSAxOyB2IDwgc2l6ZTsgdisrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRpY2tzW3ZdO1xuICAgICAgICAgICAgICB0aGlzLm1pblRpY2sgPSB2YWwgPD0gdGhpcy5taW5UaWNrID8gdmFsIDogdGhpcy5taW5UaWNrO1xuICAgICAgICAgICAgICB0aGlzLm1heFRpY2sgPSB2YWwgPj0gdGhpcy5tYXhUaWNrID8gdmFsIDogdGhpcy5tYXhUaWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGltZXN0YW1wTW9kZSB8fCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICAgICAgc2VyaWVzLnggPSB0aWNrcztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VyaWVzLnggPSB0aWNrcy5tYXAodCA9PiBHVFNMaWIudG9JU09TdHJpbmcodCwgdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlcmllcy55ID0gdmFsdWVzO1xuICAgICAgICAgIGRhdGFzZXQucHVzaChzZXJpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChub25QbG90dGFibGUubGVuZ3RoID4gMCAmJiBndHNMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBub25QbG90dGFibGUuZm9yRWFjaChnID0+IHtcbiAgICAgICAgICBnLnYuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cyA9IHZhbHVlWzBdO1xuICAgICAgICAgICAgaWYgKHRzIDwgdGhpcy5taW5UaWNrKSB7XG4gICAgICAgICAgICAgIHRoaXMubWluVGljayA9IHRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRzID4gdGhpcy5tYXhUaWNrKSB7XG4gICAgICAgICAgICAgIHRoaXMubWF4VGljayA9IHRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm90IGFueSBwbG90dGFibGUgZGF0YSwgd2UgbXVzdCBhZGQgYSBmYWtlIG9uZSB3aXRoIGlkIC0xLiBUaGlzIG9uZSB3aWxsIGFsd2F5cyBiZSBoaWRkZW4uXG4gICAgICAgIGlmICgwID09PSBndHNMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgIGlmICghdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1pblRpY2tdKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFIYXNoc2V0W3RoaXMubWluVGlja10gPSBbMF07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1heFRpY2tdKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFIYXNoc2V0W3RoaXMubWF4VGlja10gPSBbMF07XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudmlzaWJpbGl0eS5wdXNoKGZhbHNlKTtcbiAgICAgICAgICB0aGlzLnZpc2libGVHdHNJZC5wdXNoKC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgJ2VuZCcsIGRhdGFzZXQpO1xuICAgIHRoaXMubm9EYXRhID0gZGF0YXNldC5sZW5ndGggPT09IDA7XG4gICAgdGhpcy5wYXJzaW5nID0gZmFsc2U7XG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBhZnRlclBsb3QocGxvdGx5SW5zdGFuY2UpIHtcbiAgICBzdXBlci5hZnRlclBsb3QocGxvdGx5SW5zdGFuY2UpO1xuICAgIHRoaXMubWFyZ2luTGVmdCA9IHBhcnNlSW50KCh0aGlzLmdyYXBoLnBsb3RFbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5xdWVyeVNlbGVjdG9yKCdnLmJnbGF5ZXIgPiByZWN0JykuZ2V0QXR0cmlidXRlKCd4JyksIDEwKTtcblxuICAgIHRoaXMuTE9HLmRlYnVnKFsnYWZ0ZXJQbG90JywgJ21hcmdpbkxlZnQnXSwgdGhpcy5tYXJnaW5MZWZ0KTtcbiAgICBpZiAodGhpcy5jaGFydEJvdW5kcy50c21pbiAhPT0gdGhpcy5taW5UaWNrIHx8IHRoaXMuY2hhcnRCb3VuZHMudHNtYXggIT09IHRoaXMubWF4VGljaykge1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21pbiA9IHRoaXMubWluVGljaztcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtYXggPSB0aGlzLm1heFRpY2s7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1hcmdpbkxlZnQgPSB0aGlzLm1hcmdpbkxlZnQ7XG4gICAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KHRoaXMuY2hhcnRCb3VuZHMpO1xuICAgICAgaWYgKHRoaXMuYWZ0ZXJCb3VuZHNVcGRhdGUgfHwgdGhpcy5zdGFuZGFsb25lKSB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnYWZ0ZXJQbG90JywgJ3VwZGF0ZUJvdW5kcyddLCB0aGlzLm1pblRpY2ssIHRoaXMubWF4VGljayk7XG4gICAgICAgIHRoaXMuZW1pdE5ld0JvdW5kcyh0aGlzLm1pblRpY2ssIHRoaXMubWF4VGljaywgdGhpcy5tYXJnaW5MZWZ0KTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWZ0ZXJCb3VuZHNVcGRhdGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmVsYXlvdXQoZGF0YTogYW55KSB7XG4gICAgbGV0IGNoYW5nZSA9IGZhbHNlO1xuICAgIGlmIChkYXRhWyd4YXhpcy5yYW5nZSddICYmIGRhdGFbJ3hheGlzLnJhbmdlJ10ubGVuZ3RoID09PSAyKSB7XG4gICAgICBpZiAodGhpcy5jaGFydEJvdW5kcy5tc21pbiAhPT0gZGF0YVsneGF4aXMucmFuZ2UnXVswXSB8fCB0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4ICE9PSBkYXRhWyd4YXhpcy5yYW5nZSddWzFdKSB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsncmVsYXlvdXQnLCAndXBkYXRlQm91bmRzJywgJ3hheGlzLnJhbmdlJ10sIGRhdGFbJ3hheGlzLnJhbmdlJ10pO1xuICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWluID0gZGF0YVsneGF4aXMucmFuZ2UnXVswXTtcbiAgICAgICAgdGhpcy5jaGFydEJvdW5kcy5tc21heCA9IGRhdGFbJ3hheGlzLnJhbmdlJ11bMV07XG4gICAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtaW4pLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCkgKiB0aGlzLmRpdmlkZXI7XG4gICAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtYXggPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtYXgpLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCkgKiB0aGlzLmRpdmlkZXI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRhWyd4YXhpcy5yYW5nZVswXSddICYmIGRhdGFbJ3hheGlzLnJhbmdlWzFdJ10pIHtcbiAgICAgIGlmICh0aGlzLmNoYXJ0Qm91bmRzLm1zbWluICE9PSBkYXRhWyd4YXhpcy5yYW5nZVswXSddIHx8IHRoaXMuY2hhcnRCb3VuZHMubXNtYXggIT09IGRhdGFbJ3hheGlzLnJhbmdlWzFdJ10pIHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydyZWxheW91dCcsICd1cGRhdGVCb3VuZHMnLCAneGF4aXMucmFuZ2VbeF0nXSwgZGF0YVsneGF4aXMucmFuZ2VbMF0nXSk7XG4gICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgIHRoaXMuY2hhcnRCb3VuZHMubXNtaW4gPSBkYXRhWyd4YXhpcy5yYW5nZVswXSddO1xuICAgICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4ID0gZGF0YVsneGF4aXMucmFuZ2VbMV0nXTtcbiAgICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21pbiA9IG1vbWVudC50eihtb21lbnQodGhpcy5jaGFydEJvdW5kcy5tc21pbiksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKSAqIHRoaXMuZGl2aWRlcjtcbiAgICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IG1vbWVudC50eihtb21lbnQodGhpcy5jaGFydEJvdW5kcy5tc21heCksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKSAqIHRoaXMuZGl2aWRlcjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGFbJ3hheGlzLmF1dG9yYW5nZSddKSB7XG4gICAgICBpZiAodGhpcy5jaGFydEJvdW5kcy50c21pbiAhPT0gdGhpcy5taW5UaWNrIHx8IHRoaXMuY2hhcnRCb3VuZHMudHNtYXggIT09IHRoaXMubWF4VGljaykge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3JlbGF5b3V0JywgJ3VwZGF0ZUJvdW5kcycsICdhdXRvcmFuZ2UnXSwgZGF0YSwgdGhpcy5taW5UaWNrLCB0aGlzLm1heFRpY2spO1xuICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gdGhpcy5taW5UaWNrO1xuICAgICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gdGhpcy5tYXhUaWNrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhbmdlKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3JlbGF5b3V0JywgJ3VwZGF0ZUJvdW5kcyddLCB0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICAgIHRoaXMuZW1pdE5ld0JvdW5kcyh0aGlzLmNoYXJ0Qm91bmRzLnRzbWluLCB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4LCB0aGlzLm1hcmdpbkxlZnQpO1xuICAgIH1cbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmFmdGVyQm91bmRzVXBkYXRlID0gZmFsc2U7XG4gIH1cblxuICBzbGlkZXJDaGFuZ2UoJGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3NsaWRlckNoYW5nZSddLCAkZXZlbnQpO1xuICB9XG5cbiAgdXBkYXRlQm91bmRzKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVCb3VuZHMnXSwgbWluLCBtYXgsIHRoaXMuX29wdGlvbnMpO1xuICAgIG1pbiA9IG1pbiB8fCB0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXI7XG4gICAgbWF4ID0gbWF4IHx8IHRoaXMubWF4VGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICB0aGlzLmxheW91dC54YXhpcy5hdXRvcmFuZ2UgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMucmFuZ2UgPSBbbWluLCBtYXhdO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBtaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW1xuICAgICAgICBHVFNMaWIudG9JU09TdHJpbmcobWluLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLFxuICAgICAgICBHVFNMaWIudG9JU09TdHJpbmcobWF4LCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpXG4gICAgICBdO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBHVFNMaWIudG9JU09TdHJpbmcobWluLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpO1xuICAgIH1cbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVCb3VuZHMnXSwgdGhpcy5sYXlvdXQpO1xuICAgIHRoaXMuYWZ0ZXJCb3VuZHNVcGRhdGUgPSB0cnVlO1xuICB9XG5cblxuICBzZXRSZWFsQm91bmRzKGNoYXJ0Qm91bmRzOiBDaGFydEJvdW5kcykge1xuICAgIHRoaXMuYWZ0ZXJCb3VuZHNVcGRhdGUgPSB0cnVlO1xuICAgIHRoaXMubWluVGljayA9IGNoYXJ0Qm91bmRzLnRzbWluO1xuICAgIHRoaXMubWF4VGljayA9IGNoYXJ0Qm91bmRzLnRzbWF4O1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzID0gdGhpcy5fb3B0aW9ucy5ib3VuZHMgfHwge307XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IHRoaXMubWluVGljaztcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gdGhpcy5tYXhUaWNrO1xuICAgIGNvbnN0IHg6IGFueSA9IHtcbiAgICAgIHRpY2swOiB1bmRlZmluZWQsXG4gICAgICByYW5nZTogW10sXG4gICAgfTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5zaG93UmFuZ2VTZWxlY3Rvcikge1xuICAgICAgeC5yYW5nZXNsaWRlciA9IHtcbiAgICAgICAgYmdjb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgdGhpY2tuZXNzOiA0MCAvIHRoaXMuaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgeC50aWNrMCA9IHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHgucmFuZ2UgPSBbdGhpcy5taW5UaWNrLCB0aGlzLm1heFRpY2tdO1xuICAgIH0gZWxzZSB7XG4gICAgICB4LnRpY2swID0gR1RTTGliLnRvSVNPU3RyaW5nKHRoaXMubWluVGljaywgdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKTtcbiAgICAgIHgucmFuZ2UgPSBbXG4gICAgICAgIEdUU0xpYi50b0lTT1N0cmluZyh0aGlzLm1pblRpY2ssIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSksXG4gICAgICAgIEdUU0xpYi50b0lTT1N0cmluZyh0aGlzLm1heFRpY2ssIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSlcbiAgICAgIF07XG4gICAgfVxuICAgIHRoaXMubGF5b3V0LnhheGlzID0geDtcbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gIH1cblxuICBob3ZlcihkYXRhOiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hvdmVyJ10sIGRhdGEpO1xuICAgIGxldCBkZWx0YSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgbGV0IHBvaW50O1xuICAgIGNvbnN0IGN1cnZlcyA9IFtdO1xuICAgIHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGlmIChkYXRhLnBvaW50c1swXSAmJiBkYXRhLnBvaW50c1swXS5kYXRhLm9yaWVudGF0aW9uICE9PSAnaCcpIHtcbiAgICAgIGNvbnN0IHkgPSAoZGF0YS55dmFscyB8fCBbJyddKVswXTtcbiAgICAgIGRhdGEucG9pbnRzLmZvckVhY2gocCA9PiB7XG4gICAgICAgIGN1cnZlcy5wdXNoKHAuY3VydmVOdW1iZXIpO1xuICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMocC55IC0geSk7XG4gICAgICAgIGlmIChkIDwgZGVsdGEpIHtcbiAgICAgICAgICBkZWx0YSA9IGQ7XG4gICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeDogbnVtYmVyID0gKGRhdGEueHZhbHMgfHwgWycnXSlbMF07XG4gICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICBjdXJ2ZXMucHVzaChwLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgY29uc3QgZCA9IE1hdGguYWJzKHAueCAtIHgpO1xuICAgICAgICBpZiAoZCA8IGRlbHRhKSB7XG4gICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgIHBvaW50ID0gcDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHN1cGVyLmhvdmVyKGRhdGEsIHBvaW50KTtcbiAgICBpZiAocG9pbnQgJiYgdGhpcy5oaWdobGlnaHRlZCAhPT0gcG9pbnQuY3VydmVOdW1iZXIpIHtcbiAgICAgIHRoaXMuaGlnaGxpdGVDdXJ2ZS5uZXh0KHtvbjogW3BvaW50LmN1cnZlTnVtYmVyXSwgb2ZmOiBjdXJ2ZXN9KTtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0ZWQgPSBwb2ludC5jdXJ2ZU51bWJlcjtcbiAgICB9XG4gICAgdGhpcy5wb2ludEhvdmVyLmVtaXQoZGF0YS5ldmVudCk7XG4gICAgLypzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBwbiA9IC0xO1xuICAgICAgbGV0IHRuID0gLTE7XG4gICAgICBsZXQgY29sb3IgPSBbXTtcbiAgICAgIGxldCBsaW5lID0ge307XG4gICAgICBsZXQgb3BhY2l0eSA9IFtdO1xuICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgaWYgKCEhcC5kYXRhLm1hcmtlcikge1xuICAgICAgICAgIGNvbG9yID0gcC5kYXRhLm1hcmtlci5jb2xvcjtcbiAgICAgICAgICBvcGFjaXR5ID0gcC5kYXRhLm1hcmtlci5vcGFjaXR5O1xuICAgICAgICAgIGxpbmUgPSBwLmRhdGEubWFya2VyLmxpbmU7XG4gICAgICAgICAgcG4gPSBwLnBvaW50TnVtYmVyO1xuICAgICAgICAgIHRuID0gcC5jdXJ2ZU51bWJlcjtcbiAgICAgICAgICBpZiAocG4gPj0gMCkge1xuICAgICAgICAgICAgY29sb3JbcG5dID0gJ3RyYW5zcGFyZW50JztcbiAgICAgICAgICAgIG9wYWNpdHlbcG5dID0gMTtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHttYXJrZXI6IHtjb2xvciwgb3BhY2l0eSwgbGluZSwgc2l6ZTogMTV9fTtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHVwZGF0ZSwgW3RuXSk7XG4gICAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hvdmVyJ10sICdyZXN0eWxlQ2hhcnQgaW5uZXInLCB1cGRhdGUsIFt0bl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkqL1xuICB9XG5cbiAgdW5ob3ZlcihkYXRhOiBhbnkpIHtcbiAgICBsZXQgZGVsdGEgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgIGxldCBwb2ludDtcbiAgICBpZiAoZGF0YS5wb2ludHNbMF0gJiYgZGF0YS5wb2ludHNbMF0uZGF0YS5vcmllbnRhdGlvbiAhPT0gJ2gnKSB7XG4gICAgICBjb25zdCB5ID0gKGRhdGEueXZhbHMgfHwgWycnXSlbMF07XG4gICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMocC55IC0geSk7XG4gICAgICAgIGlmIChkIDwgZGVsdGEpIHtcbiAgICAgICAgICBkZWx0YSA9IGQ7XG4gICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeDogbnVtYmVyID0gKGRhdGEueHZhbHMgfHwgWycnXSlbMF07XG4gICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMocC54IC0geCk7XG4gICAgICAgIGlmIChkIDwgZGVsdGEpIHtcbiAgICAgICAgICBkZWx0YSA9IGQ7XG4gICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCEhcG9pbnQgJiYgdGhpcy5oaWdobGlnaHRlZCAhPT0gcG9pbnQuY3VydmVOdW1iZXIpIHtcbiAgICAgIHRoaXMudW5oaWdobGl0ZUN1cnZlLm5leHQoW3RoaXMuaGlnaGxpZ2h0ZWRdKTtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0ZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHN1cGVyLnVuaG92ZXIoZGF0YSwgcG9pbnQpO1xuICAgIC8qc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsZXQgcG4gPSAtMTtcbiAgICAgIGxldCB0biA9IC0xO1xuICAgICAgbGV0IGNvbG9yID0gW107XG4gICAgICBsZXQgbGluZSA9IHt9O1xuICAgICAgbGV0IG9wYWNpdHkgPSBbXTtcbiAgICAgIGRhdGEucG9pbnRzLmZvckVhY2gocCA9PiB7XG4gICAgICAgIGlmICghIXAuZGF0YS5tYXJrZXIpIHtcbiAgICAgICAgICBwbiA9IHAucG9pbnROdW1iZXI7XG4gICAgICAgICAgdG4gPSBwLmN1cnZlTnVtYmVyO1xuICAgICAgICAgIGNvbG9yID0gcC5kYXRhLm1hcmtlci5jb2xvcjtcbiAgICAgICAgICBvcGFjaXR5ID0gcC5kYXRhLm1hcmtlci5vcGFjaXR5O1xuICAgICAgICAgIGxpbmUgPSBwLmRhdGEubWFya2VyLmxpbmU7XG4gICAgICAgICAgaWYgKHBuID49IDApIHtcbiAgICAgICAgICAgIGNvbG9yW3BuXSA9IHAuZGF0YS5saW5lLmNvbG9yO1xuICAgICAgICAgICAgb3BhY2l0eVtwbl0gPSB0aGlzLl9vcHRpb25zLnNob3dEb3RzID8gMSA6IDA7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7bWFya2VyOiB7Y29sb3IsIG9wYWNpdHksIGxpbmUsIHNpemU6IDE1fX07XG4gICAgICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh1cGRhdGUsIFt0bl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkqL1xuICB9XG59XG4iXX0=