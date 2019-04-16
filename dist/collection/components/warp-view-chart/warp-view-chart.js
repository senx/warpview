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
 *
 */
import { GTSLib } from '../../utils/gts.lib';
import Dygraph from 'dygraphs';
import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { Param } from "../../model/param";
import moment from "moment-timezone";
import deepEqual from "deep-equal";
import { ChartBounds } from "../../model/chartBounds";
/**
 * options :
 *  gridLineColor: 'red | #fff'
 *  timeMode.timeMode: 'timestamp | date'
 *  showRangeSelector: boolean
 *  type : 'line | area | step'
 *
 */
export class WarpViewChart {
    constructor() {
        this.options = new Param();
        this.hiddenData = [];
        this.unit = '';
        this.type = 'line';
        this.responsive = false;
        this.standalone = true;
        this.debug = false;
        this._options = {
            timeMode: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e',
            showDots: false,
            timeZone: 'UTC',
            timeUnit: 'us'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.visibility = [];
        /**
         * usefull for default zoom
         */
        this.maxTick = 0;
        /**
         * usefull for default zoom
         */
        this.minTick = 0;
        /**
         * table of gts id displayed in dygraph. array order is the one of dygraph series
         */
        this.visibleGtsId = [];
        /**
         * key = timestamp. values = table of available points, filled by null.
         */
        this.dataHashset = {};
        /**
         * the big matrix that dygraph expects
         */
        this.dygraphdataSets = [];
        /**
         * the labels of each series. array order is the one of dygraph series
         */
        this.dygraphLabels = [];
        /**
         * the colors of each series. array order is the one of dygraph series
         */
        this.dygraphColors = [];
        /**
         * put this to true before creating a new dygraph to force a resize in the drawCallback
         */
        this.initialResizeNeeded = false;
        /**
         * contains the bounds of current graph, in timestamp (platform time unit), and in millisecond.
         */
        this.chartBounds = new ChartBounds();
        this.previousParentHeight = -1;
        this.previousParentWidth = -1;
        this.visibilityStatus = 'unknown';
        this.heightWithPlottableData = -1;
    }
    // if nothing to display, must reduce to 30px. 
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            let parentWidth = this.el.parentElement.getBoundingClientRect().width;
            let parentHeight = this.el.parentElement.getBoundingClientRect().height;
            if (this.initialResizeNeeded || parentWidth !== this.previousParentWidth || parentHeight !== this.previousParentHeight) {
                this.initialResizeNeeded = false;
                if (this.standalone || this.displayGraph()) {
                    //there is something to show, adapt me to the parent bounding box
                    let width = parentWidth - 5;
                    if (this.visibilityStatus === 'plottablesAllHidden') {
                        //restore the previous height
                        parentHeight = this.heightWithPlottableData;
                        this.visibilityStatus = 'plottableShown';
                        this.resizeMyParent.emit({ h: parentHeight, w: parentWidth });
                    }
                    let height = parentHeight - 20; //kind of padding.
                    if (this._chart) {
                        this.LOG.debug(['onResize', 'destroy'], width, height);
                        this._chart.resize(width, height);
                    }
                }
                else {
                    //nothing to show, and integrated into plot component (not standalone)
                    //shrink to the minimum and send event to resize parent to me
                    if (this.visibilityStatus === 'plottableShown') // hide of all plottable data (but there is some)
                     {
                        this.visibilityStatus = 'plottablesAllHidden';
                        this.heightWithPlottableData = parentHeight; //store the height to restore it later
                    }
                    let height = 30;
                    let width = parentWidth;
                    if (this._chart) {
                        this.LOG.debug(['onResize', 'destroy'], width, height);
                        this._chart.resize(width, height);
                    }
                    parentHeight = height + 20; //margin to keep clear of the handle bar
                    this.resizeMyParent.emit({ h: parentHeight, w: width });
                }
            }
            this.previousParentHeight = parentHeight;
            this.previousParentWidth = parentWidth;
        }, 150);
    }
    onHideData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.LOG.debug(['hiddenData'], newValue);
            let previousVisibility = JSON.stringify(this.visibility);
            if (!!this._chart) {
                this.visibility = [];
                this.visibleGtsId.forEach(id => {
                    //sadly, this does not work.
                    //this._chart.setVisibility(i,newValue.indexOf(id) < 0);
                    // well, not so sad. for a 2 millions points, destroying and redrawing is faster than setvisibility (8s instead 17s)
                    //best workaround : rebuild the dygraph with same dataset and different visibility options. 
                    //TODO: try each next version of dygraph.
                    //id -1 is a special empty serie only used when there only annotations
                    this.visibility.push(newValue.indexOf(id) < 0 && (id != -1));
                });
                this.LOG.debug(['hiddendygraphfullv'], this.visibility);
            }
            let newVisibility = JSON.stringify(this.visibility);
            if (previousVisibility !== newVisibility) {
                this.drawChart(false, true);
                this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
            }
        }
    }
    onData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) { //needed. VSCode fire a data change each time you hide or show something.
            this.LOG.debug(['data'], newValue);
            this.visibilityStatus = 'unknown';
            this.drawChart(true); //force reparse
            this.LOG.debug(['dataupdate', 'destroy'], 'redraw by data change');
        }
    }
    onOptions(newValue) {
        //here we have a problem. 
        // - this function is sometimes called twice, and very often called with oldValue==newValue
        // - changing the visibility of an annotation trigger this function too.
        // so, we must compare the newValue keys with the current _options before launching a redraw.
        let optionChanged = false;
        Object.keys(newValue).forEach(opt => {
            if (this._options.hasOwnProperty(opt)) {
                optionChanged = optionChanged || (newValue[opt] !== (this._options[opt]));
            }
            else {
                optionChanged = true; //new unknown option
            }
        });
        this.LOG.debug(['optionsupdateOPTIONCHANGED'], optionChanged);
        if (optionChanged) {
            this.LOG.debug(['options'], newValue);
            this.drawChart(false, true); //need to resize after.
        }
    }
    onTypeChange(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.LOG.debug(['typeupdate', 'destroy'], 'redraw by type change');
            this.drawChart();
        }
    }
    onUnitChange(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.LOG.debug(['unitupdate', 'destroy'], 'redraw by unit change (full redraw)');
            this.drawChart(true); //reparse all
        }
    }
    async getTimeClip() {
        return new Promise(resolve => {
            this.LOG.debug(['getTimeClip'], this.chartBounds);
            resolve(this.chartBounds);
        });
    }
    handleMouseOut(evt) {
        this.LOG.debug(['handleMouseOut'], evt);
        const legend = this.el.querySelector('.dygraph-legend');
        window.setTimeout(() => {
            legend.style.display = 'none';
        }, 1000);
    }
    /**
     * this function build this.dataHashset (high computing cost), then it build this.dygraphdataSets  (high computing cost too)
     *
     * this function also refresh this.dygraphColors  this.dygraphLabels
     *
     * @param gtsList a flat array of gts
     */
    gtsToData(gtsList) {
        this.LOG.debug(['gtsToData'], gtsList);
        this.visibility = [];
        this.dataHashset = {}; //hashset, no order guaranteed
        let labels = [];
        let colors = [];
        if (!gtsList) {
            return;
        }
        else {
            gtsList = GTSLib.flattenGtsIdArray(gtsList, 0).res;
            gtsList = GTSLib.flatDeep(gtsList);
            this.LOG.debug(['gtsToData', 'gtsList'], gtsList);
            labels.push('Date');
            this.maxTick = Number.NEGATIVE_INFINITY;
            this.minTick = Number.POSITIVE_INFINITY;
            this.visibleGtsId = [];
            //build a non plotable list, then keep plotable ones
            const nonPlottable = gtsList.filter(g => {
                return (g.v && !GTSLib.isGtsToPlot(g));
            });
            gtsList = gtsList.filter(g => {
                return (g.v && GTSLib.isGtsToPlot(g));
            });
            //initialize visibility status
            if (this.visibilityStatus === 'unknown') {
                this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
            }
            //first, add plotable data to the data hashset
            gtsList.forEach((g, i) => {
                labels.push(GTSLib.serializeGtsMetadata(g) + g.id);
                //GTSLib.gtsSort(g); // no need because data{} is not sorted, will sort later the full dataset
                g.v.forEach(value => {
                    const ts = value[0];
                    if (!this.dataHashset[ts]) {
                        this.dataHashset[ts] = new Array(gtsList.length);
                        this.dataHashset[ts].fill(null);
                    }
                    this.dataHashset[ts][i] = value[value.length - 1];
                    if (ts < this.minTick) {
                        this.minTick = ts;
                    }
                    if (ts > this.maxTick) {
                        this.maxTick = ts;
                    }
                });
                this.LOG.debug(['gtsToData', 'gts'], g);
                colors.push(ColorLib.getColor(g.id));
                this.visibility.push(true);
                this.visibleGtsId.push(g.id);
            });
            //non plotable data are important to fix the bounds of the graphics (with null values)
            //just add min and max tick to the hashset
            this.LOG.debug(['gtsToData', 'nonPlottable'], nonPlottable);
            if (nonPlottable.length > 0) { //&& gtsList.length === 0) {
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
                //if there is not any plottable data, we must add a fake one with id -1. This one will always be hidden.
                if (0 == gtsList.length) {
                    if (!this.dataHashset[this.minTick]) {
                        this.dataHashset[this.minTick] = [0];
                    }
                    if (!this.dataHashset[this.maxTick]) {
                        this.dataHashset[this.maxTick] = [0];
                    }
                    labels.push('emptySeries');
                    colors.push(ColorLib.getColor(0));
                    this.visibility.push(false);
                    this.visibleGtsId.push(-1);
                }
                else {
                    //if there is some plottable data, just add some missing points to define min and max
                    if (!this.dataHashset[this.minTick]) {
                        this.dataHashset[this.minTick] = new Array(gtsList.length);
                        this.dataHashset[this.minTick].fill(null);
                    }
                    if (!this.dataHashset[this.maxTick]) {
                        this.dataHashset[this.maxTick] = new Array(gtsList.length);
                        this.dataHashset[this.maxTick].fill(null);
                    }
                }
            }
        }
        this.rebuildDygraphDataSets();
        this.LOG.debug(['dygraphgtsidtable'], this.visibleGtsId);
        this.LOG.debug(['gtsToData', 'datasets'], this.dygraphdataSets, labels, colors);
        this.dygraphColors = colors;
        this.dygraphLabels = labels;
    }
    /**
     * This function build this.dygraphdataSets from this.dataHashset
     *
     * It could be called independently from gtsToData, when only unit or timeMode change.
     */
    rebuildDygraphDataSets() {
        this.dygraphdataSets = [];
        //build the big matrix for dygraph from the data hashSet.
        const divider = GTSLib.getDivider(this._options.timeUnit);
        this.LOG.debug(['chart', 'divider', 'timeunit'], divider, this._options.timeUnit);
        Object.keys(this.dataHashset).forEach(timestamp => {
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.dygraphdataSets.push([parseInt(timestamp)].concat(this.dataHashset[timestamp]));
            }
            else {
                const ts = Math.floor(parseInt(timestamp) / divider);
                //this.dygraphdataSets.push([moment.utc(ts).toDate()].concat(this.dataHashset[timestamp]));
                this.dygraphdataSets.push([moment(ts).utc(true).toDate()].concat(this.dataHashset[timestamp]));
            }
        });
        //sort the big table. (needed, data is not a treeSet or sortedSet)
        this.dygraphdataSets.sort((a, b) => a[0] - b[0]);
    }
    isStepped() {
        return this.type === 'step';
    }
    isStacked() {
        return this.type === 'area';
    }
    static toFixed(x) {
        let e;
        let res = '';
        if (Number.isSafeInteger(x)) {
            return x.toString();
        }
        else {
            res = x.toString();
            e = parseInt(x.toString().split('+')[1]);
            if (e > 20) {
                e -= 20;
                x /= Math.pow(10, e);
                res = x.toString();
                res += (new Array(e + 1)).join('0');
            }
            return res;
        }
    }
    /**
     *
     * @param {string} data
     * @returns {string}
     */
    static formatLabel(data) {
        const serializedGTS = data.split('{');
        let display = `<span class='gts-classname'>${serializedGTS[0]}</span>`;
        if (serializedGTS.length > 1) {
            display += `<span class='gts-separator'>{</span>`;
            const labels = serializedGTS[1].substr(0, serializedGTS[1].length - 1).split(',');
            if (labels.length > 0) {
                labels.forEach((l, i) => {
                    const label = l.split('=');
                    if (l.length > 1) {
                        display += `<span><span class='gts-labelname'>${label[0]}</span><span class='gts-separator'>=</span><span class='gts-labelvalue'>${label[1]}</span>`;
                        if (i !== labels.length - 1) {
                            display += `<span>, </span>`;
                        }
                    }
                });
            }
            display += `<span class='gts-separator'>}</span>`;
        }
        if (serializedGTS.length > 2) {
            display += `<span class='gts-separator'>{</span>`;
            const labels = serializedGTS[2].substr(0, serializedGTS[2].length - 1).split(',');
            if (labels.length > 0) {
                labels.forEach((l, i) => {
                    const label = l.split('=');
                    if (l.length > 1) {
                        display += `<span><span class='gts-attrname'>${label[0]}</span><span class='gts-separator'>=</span><span class='gts-attrvalue'>${label[1]}</span>`;
                        if (i !== labels.length - 1) {
                            display += `<span>, </span>`;
                        }
                    }
                });
            }
            display += `<span class='gts-separator'>}</span>`;
        }
        return display;
    }
    legendFormatter(data) {
        if (data.x === null) {
            // This happens when there's no selection and {legend: 'always'} is set.
            return '<br>' + data.series.map(function (series) {
                if (!series.isVisible)
                    return;
                let labeledData = WarpViewChart.formatLabel(series.labelHTML) + ': ' + WarpViewChart.toFixed(parseFloat(series.yHTML));
                if (series.isHighlighted) {
                    labeledData = `<b>${labeledData}</b>`;
                }
                return WarpViewChart.formatLabel(series.labelHTML) + ' ' + labeledData;
            }).join('<br>');
        }
        let html = '';
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            html = `<b>${data.x}</b>`;
        }
        else {
            html = `<b>${(moment.utc(parseInt(data.x)).toISOString() || '').replace('Z', this._options.timeZone == 'UTC' ? 'Z' : '')}</b>`; //data.x is already a date in millisecond, whatever the unit option
        }
        data.series.forEach(function (series) {
            if (series.isVisible && series.yHTML) {
                let labeledData = WarpViewChart.formatLabel(series.labelHTML) + ': ' + WarpViewChart.toFixed(parseFloat(series.yHTML));
                if (series.isHighlighted) {
                    labeledData = `<b>${labeledData}</b>`;
                }
                html += `<br>${series.dashHTML} ${labeledData}`;
            }
        });
        return html;
    }
    highlightCallback(event) {
        const legend = this.el.querySelector('.dygraph-legend');
        legend.style.display = 'block';
        this.pointHover.emit({
            x: event.offsetX,
            y: event.offsetY
        });
    }
    scroll(event, g) {
        if (!event.altKey)
            return;
        this.LOG.debug(['scroll'], g);
        const normal = event.detail ? event.detail * -1 : event.wheelDelta / 40;
        // For me the normalized value shows 0.075 for one click. If I took
        // that verbatim, it would be a 7.5%.
        const percentage = normal / 50;
        if (!(event.offsetX && event.offsetY)) {
            event.offsetX = event.layerX - event.target.offsetLeft;
            event.offsetY = event.layerY - event.target.offsetTop;
        }
        const percentages = WarpViewChart.offsetToPercentage(g, event.offsetX, event.offsetY);
        const xPct = percentages[0];
        const yPct = percentages[1];
        WarpViewChart.zoom(g, percentage, xPct, yPct);
        event.preventDefault();
    }
    static offsetToPercentage(g, offsetX, offsetY) {
        // This is calculating the pixel offset of the leftmost date.
        const xOffset = g.toDomCoords(g.xAxisRange()[0], null)[0];
        const yar0 = g.yAxisRange(0);
        // This is calculating the pixel of the higest value. (Top pixel)
        const yOffset = g.toDomCoords(null, yar0[1])[1];
        // x y w and h are relative to the corner of the drawing area,
        // so that the upper corner of the drawing area is (0, 0).
        const x = offsetX - xOffset;
        const y = offsetY - yOffset;
        // This is computing the rightmost pixel, effectively defining the
        // width.
        const w = g.toDomCoords(g.xAxisRange()[1], null)[0] - xOffset;
        // This is computing the lowest pixel, effectively defining the height.
        const h = g.toDomCoords(null, yar0[0])[1] - yOffset;
        // Percentage from the left.
        const xPct = w === 0 ? 0 : (x / w);
        // Percentage from the top.
        const yPct = h === 0 ? 0 : (y / h);
        // The (1-) part below changes it from "% distance down from the top"
        // to "% distance up from the bottom".
        return [xPct, (1 - yPct)];
    }
    static adjustAxis(axis, zoomInPercentage, bias) {
        const delta = axis[1] - axis[0];
        const increment = delta * zoomInPercentage;
        const foo = [increment * bias, increment * (1 - bias)];
        return [axis[0] + foo[0], axis[1] - foo[1]];
    }
    static zoom(g, zoomInPercentage, xBias, yBias) {
        xBias = xBias || 0.5;
        yBias = yBias || 0.5;
        const yAxes = g.yAxisRanges();
        const newYAxes = [];
        for (let i = 0; i < yAxes.length; i++) {
            newYAxes[i] = WarpViewChart.adjustAxis(yAxes[i], zoomInPercentage, yBias);
        }
        g.updateOptions({
            dateWindow: WarpViewChart.adjustAxis(g.xAxisRange(), zoomInPercentage, xBias),
            valueRange: newYAxes[0]
        });
    }
    drawCallback(dygraph, is_initial) {
        this.LOG.debug(['drawCallback', 'destroy'], [dygraph.dateWindow_, is_initial]);
        this._chart = dygraph; //usefull for the on resize, because into the callback, this._chart is still undefined.
        let cmin = 0;
        let cmax = 0;
        let divider = GTSLib.getDivider(this._options.timeUnit);
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            // everything works in timestamp, no divider, no timezone.
            if (dygraph.dateWindow_) { //if zoomed view
                this.chartBounds.tsmin = Math.round(dygraph.dateWindow_[0]);
                this.chartBounds.tsmax = Math.round(dygraph.dateWindow_[1]);
            }
            else {
                this.chartBounds.tsmin = this.minTick;
                this.chartBounds.tsmax = this.maxTick;
            }
            cmin = this.chartBounds.tsmin;
            cmax = this.chartBounds.tsmax;
        }
        else {
            //everything works in milliseconds with a timezone
            if (dygraph.dateWindow_) { //if zoomed view
                cmin = dygraph.dateWindow_[0];
                cmax = dygraph.dateWindow_[1];
                //find the original timestamp, have to reverse the timezone. 
                //utc offset depends on current timestamp, let's take cmin. it may cause problems in case of years long series.
                let zoneOffset = moment.tz.zone(this._options.timeZone).utcOffset(cmin) * 60000;
                //find the utc timestamp in platform unit from the timezoned one in millisecond.
                this.chartBounds.tsmin = Math.floor((cmin + zoneOffset) * divider);
                this.chartBounds.tsmax = Math.ceil((cmax + zoneOffset) * divider);
            }
            else {
                cmin = moment(this.minTick / divider).utc(true).valueOf(); //manage the tz
                cmax = moment(this.maxTick / divider).utc(true).valueOf();
                this.chartBounds.tsmin = this.minTick;
                this.chartBounds.tsmax = this.maxTick;
            }
        }
        this.chartBounds.msmin = this.chartBounds.tsmin / divider;
        this.chartBounds.msmax = this.chartBounds.tsmax / divider;
        this.LOG.debug(['drawCallback', 'newBounds', 'platform unit'], this.chartBounds.tsmin, this.chartBounds.tsmax);
        this.LOG.debug(['drawCallback', 'newBounds', 'for annotations'], cmin, cmax);
        this.boundsDidChange.emit({
            bounds: {
                min: cmin,
                max: cmax
            }
        });
        if (this.initialResizeNeeded) {
            this.onResize();
        }
    }
    drawChart(reparseNewData = false, forceresize = false) {
        this.LOG.debug(['drawChart', 'this.data'], [this.data]);
        let previousTimeMode = this._options.timeMode || ''; //detect a timemode change
        let previousTimeUnit = this._options.timeUnit || ''; //detect a timeUnit change
        let previousTimeZone = this._options.timeZone || 'UTC'; //detect a timeZone change
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.LOG.debug(['tz'], this._options.timeZone);
        moment.tz.setDefault(this._options.timeZone);
        let data = GTSLib.getData(this.data);
        let dataList = data.data;
        this._options = ChartLib.mergeDeep(this._options, data.globalParams);
        if (reparseNewData) {
            this.gtsToData(dataList);
        }
        else {
            if (previousTimeMode !== this._options.timeMode
                || previousTimeUnit !== this._options.timeUnit
                || previousTimeZone !== this._options.timeZone) {
                this.rebuildDygraphDataSets();
            }
        }
        const chart = this.el.querySelector('#' + this.uuid);
        if (this.dygraphdataSets) {
            const color = this._options.gridLineColor;
            let interactionModel = Dygraph.defaultInteractionModel;
            interactionModel.mousewheel = this.scroll.bind(this);
            interactionModel.mouseout = this.handleMouseOut.bind(this);
            let options = {
                height: this.displayGraph() ? (this.responsive ? this.el.parentElement.getBoundingClientRect().height : WarpViewChart.DEFAULT_HEIGHT) - 30 : 30,
                width: (this.responsive ? this.el.parentElement.getBoundingClientRect().width : WarpViewChart.DEFAULT_WIDTH) - 5,
                labels: this.dygraphLabels,
                showRoller: false,
                showRangeSelector: this.dygraphdataSets && this.dygraphdataSets.length > 0 && this._options.showRangeSelector,
                showInRangeSelector: true,
                connectSeparatedPoints: true,
                colors: this.dygraphColors,
                legend: 'follow',
                stackedGraph: this.isStacked(),
                strokeBorderWidth: this.isStacked() ? null : 0,
                strokeWidth: 2,
                stepPlot: this.isStepped(),
                ylabel: this.unit,
                labelsSeparateLines: true,
                highlightSeriesBackgroundAlpha: 1,
                highlightSeriesOpts: {
                    strokeWidth: 3,
                    strokeBorderWidth: 0,
                    highlightCircleSize: 3,
                    showInRangeSelector: true
                },
                visibility: this.visibility,
                labelsUTC: true,
                gridLineColor: color,
                axisLineColor: color,
                fillAlpha: 0.5,
                drawGapEdgePoints: this._options.showDots,
                drawPoints: this._options.showDots,
                pointSize: 3,
                digitsAfterDecimal: 5,
                axes: {
                    x: {
                        drawAxis: this.displayGraph(),
                    }
                },
                legendFormatter: this.legendFormatter.bind(this),
                highlightCallback: this.highlightCallback.bind(this),
                drawCallback: this.drawCallback.bind(this),
                axisLabelWidth: this.standalone ? 50 : 94,
                rightGap: this.standalone ? 0 : 20,
                interactionModel: interactionModel
            };
            if (!this.displayGraph()) {
                options.xAxisHeight = 30;
                options.rangeSelectorHeight = 30;
                chart.style.height = '30px';
            }
            if (this._options.timeMode === 'timestamp') {
                options.axes.x.axisLabelFormatter = (x) => {
                    return WarpViewChart.toFixed(x);
                };
            }
            //even on visibility change. setting this to reparseNewData is not a solution.
            this.initialResizeNeeded = reparseNewData || forceresize;
            if (!!this._chart) {
                this._chart.destroy();
                this.LOG.debug(['drawChart', 'dygraphdestroyed'], 'dygraph destroyed to reborn with reparseNewData=', reparseNewData, 'and forceresize=', forceresize);
            }
            this.LOG.debug(['drawChart', 'dygraphdataSets'], this.dygraphdataSets);
            if (this.dygraphdataSets && this.dygraphdataSets.length > 0) {
                this._chart = new Dygraph(chart, this.dygraphdataSets, options);
            }
        }
    }
    displayGraph() {
        let status = false;
        this.visibility.forEach(s => {
            status = s || status;
        });
        return status;
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewChart, this.debug);
    }
    componentDidLoad() {
        this.drawChart(true);
        ChartLib.resizeWatchTimer(this.el, this.onResize.bind(this));
    }
    render() {
        return h("div", { id: "chartContainer" },
            h("div", { id: this.uuid, class: "chart" }));
    }
    static get is() { return "warp-view-chart"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "el": {
            "elementRef": true
        },
        "getTimeClip": {
            "method": true
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "standalone": {
            "type": Boolean,
            "attr": "standalone"
        },
        "type": {
            "type": String,
            "attr": "type",
            "watchCallbacks": ["onTypeChange"]
        },
        "unit": {
            "type": String,
            "attr": "unit",
            "watchCallbacks": ["onUnitChange"]
        }
    }; }
    static get events() { return [{
            "name": "boundsDidChange",
            "method": "boundsDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "warpViewChartResize",
            "method": "warpViewChartResize",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "resizeMyParent",
            "method": "resizeMyParent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:warp-view-chart:**/"; }
}
WarpViewChart.DEFAULT_WIDTH = 800;
WarpViewChart.DEFAULT_HEIGHT = 500;
