/*! Built with http://stenciljs.com */
const { h } = window.warpview;

import { a as Chart } from './chunk-7fd53585.js';
import { a as GTSLib, d as ChartLib, b as Logger, c as Param, e as DataModel } from './chunk-f154ccfa.js';
import { a as ColorLib } from './chunk-1b4e64a6.js';
import './chunk-07b61ac6.js';

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
class WarpViewBar {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewBar);
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this._mapIndex = {};
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                this.drawChart();
            }, 250);
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    buildGraph() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        let gts = this.gtsToData(this.data);
        if (!gts) {
            return;
        }
        const color = this._options.gridLineColor;
        const graphOpts = {
            legend: {
                display: this.showLegend
            },
            animation: {
                duration: 0,
            },
            tooltips: {
                mode: 'index',
                position: 'nearest'
            },
            scales: {
                xAxes: [{
                        type: "time",
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }],
                yAxes: [
                    {
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        },
                        scaleLabel: {
                            display: this.unit !== '',
                            labelString: this.unit
                        }
                    }
                ]
            },
            responsive: this.responsive
        };
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: gts.ticks,
                datasets: gts.datasets
            },
            options: graphOpts
        });
        this.onResize();
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        if (!this.data)
            return;
        this.buildGraph();
    }
    gtsToData(gts) {
        this.LOG.debug(['gtsToData'], gts);
        let datasets = [];
        let ticks = [];
        let pos = 0;
        let dataList;
        if (typeof gts === 'string') {
            gts = JSON.parse(this.data);
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
            dataList = gts.data;
            this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
        }
        else {
            dataList = gts;
        }
        if (!dataList || dataList.length === 0) {
            return;
        }
        else {
            dataList = GTSLib.flatDeep(dataList);
            dataList.forEach(g => {
                let data = [];
                if (g.v) {
                    GTSLib.gtsSort(g);
                    g.v.forEach(d => {
                        ticks.push(Math.floor(parseInt(d[0]) / 1000));
                        data.push(d[d.length - 1]);
                    });
                    let color = ColorLib.getColor(pos);
                    let label = GTSLib.serializeGtsMetadata(g);
                    this._mapIndex[label] = pos;
                    let ds = {
                        label: label,
                        data: data,
                        borderColor: color,
                        borderWidth: 1,
                        backgroundColor: ColorLib.transparentize(color, 0.5)
                    };
                    datasets.push(ds);
                    pos++;
                }
            });
        }
        this.LOG.debug(['gtsToData', 'datasets'], datasets);
        return { datasets: datasets, ticks: GTSLib.unique(ticks).sort((a, b) => a > b ? 1 : a === b ? 0 : -1) };
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-bar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host div {\n  height: var(--warp-view-chart-height, 100%); }\n\n:host .chart-container {\n  width: var(--warp-view-chart-width, 100%);\n  height: var(--warp-view-chart-height, 100%);\n  position: relative; }"; }
}

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
class WarpViewBubble {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.LOG = new Logger(WarpViewBubble);
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                this.drawChart();
            }, 250);
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        if (!this.data)
            return;
        let dataList;
        let gts = this.data;
        if (typeof gts === 'string') {
            gts = JSON.parse(gts);
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
            dataList = gts.data;
            this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
        }
        else {
            dataList = gts;
        }
        const color = this._options.gridLineColor;
        const options = {
            legend: {
                display: this.showLegend
            },
            layout: {
                padding: {
                    left: 0,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            borderWidth: 1,
            animation: {
                duration: 0,
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }],
                yAxes: [
                    {
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        },
                        scaleLabel: {
                            display: this.unit !== '',
                            labelString: this.unit
                        }
                    }
                ]
            },
            responsive: this.responsive
        };
        const dataSets = this.parseData(dataList);
        this.LOG.debug(['drawChart'], [options, dataSets]);
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, {
            type: 'bubble',
            tooltips: {
                mode: 'x',
                position: 'nearest',
                callbacks: ChartLib.getTooltipCallbacks()
            },
            data: {
                datasets: dataSets
            },
            options: options
        });
        this.onResize();
    }
    parseData(gts) {
        if (!gts)
            return;
        let datasets = [];
        for (let i = 0; i < gts.length; i++) {
            let label = Object.keys(gts[i])[0];
            let data = [];
            let g = gts[i][label];
            if (GTSLib.isArray(g)) {
                g.forEach(d => {
                    data.push({
                        x: d[0],
                        y: d[1],
                        r: d[2],
                    });
                });
            }
            datasets.push({
                data: data,
                label: label,
                backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5),
                borderColor: ColorLib.getColor(i),
                borderWidth: 1
            });
        }
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-bubble"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host div {\n  height: var(--warp-view-chart-height, 100%); }\n\n:host .chart-container {\n  width: var(--warp-view-chart-width, 100%);\n  height: var(--warp-view-chart-height, 100%);\n  position: relative; }"; }
}

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
/**
 * Display component
 */
class WarpViewDisplay {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewDisplay);
        this.toDisplay = '';
        this._options = new Param();
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['onData'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this.LOG.debug(['drawChart'], [this.options, this._options]);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + 'px';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + 'px';
        let gts = this.data;
        if (!gts) {
            return;
        }
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse(gts);
            }
            catch (error) {
                // empty : it's a plain string
            }
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
            this.toDisplay = GTSLib.isArray(gts.data) ? gts.data[0] : gts.data;
            this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
        }
        else {
            this.toDisplay = GTSLib.isArray(gts) ? gts[0] : gts;
        }
        this.LOG.debug(['drawChart'], [gts, this.toDisplay]);
    }
    getStyle() {
        this.LOG.debug(['getStyle'], this._options);
        if (!this._options) {
            return {};
        }
        else {
            const style = { 'background-color': this._options.bgColor || 'transparent' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            this.LOG.debug(['getStyle', 'style'], style);
            return style;
        }
    }
    componentDidLoad() {
        this.LOG.debug(['componentDidLoad'], this._options);
        this.drawChart();
    }
    render() {
        return h("div", null, this.toDisplay && this.toDisplay !== '' ?
            h("div", { class: "chart-container", id: "#wrapper" },
                h("div", { style: this.getStyle() },
                    h("div", { class: "value" },
                        this.toDisplay + '',
                        h("small", null, this.unit))))
            :
                h("warp-view-spinner", null));
    }
    static get is() { return "warp-view-display"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host div {\n  height: var(--warp-view-chart-height, 100%); }\n\n:host .chart-container {\n  width: var(--warp-view-chart-width, 100%);\n  height: var(--warp-view-chart-height, 100%);\n  position: relative;\n  color: var(--warp-view-font-color, #000000); }\n  :host .chart-container div {\n    font-size: 10rem;\n    height: 100%;\n    width: 100%; }\n    :host .chart-container div .value {\n      position: relative;\n      top: 50%;\n      -webkit-transform: translateY(-50%);\n      -ms-transform: translateY(-50%);\n      transform: translateY(-50%);\n      text-align: center;\n      height: -webkit-fit-content;\n      height: -moz-fit-content;\n      height: fit-content; }\n      :host .chart-container div .value small {\n        font-size: 3rem; }"; }
}

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
/**
 * Display component
 */
class WarpViewImage {
    constructor() {
        this.imageTitle = '';
        this.responsive = false;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewImage);
        this._options = new Param();
    }
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
            this.drawChart();
        }, 250);
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['onData'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this.LOG.debug(['drawChart'], [this.options, this._options]);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + 'px';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + 'px';
        this.toDisplay = [];
        if (!this.data)
            return;
        let gts = this.data;
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse(gts);
            }
            catch (error) {
                // empty : it's a base64 string
            }
        }
        if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
            if (gts.data && gts.data.length > 0 && GTSLib.isEmbeddedImage(gts.data[0])) {
                this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
                this.toDisplay.push(gts.data[0]);
            }
            else if (gts.data && GTSLib.isEmbeddedImage(gts.data)) {
                this.toDisplay.push(gts.data);
            }
        }
        else {
            if (GTSLib.isArray(gts)) {
                gts.forEach(d => {
                    if (GTSLib.isEmbeddedImage(d)) {
                        this.toDisplay.push(d);
                    }
                });
            }
        }
        this.LOG.debug(['drawChart'], [this.data, this.toDisplay]);
    }
    getStyle() {
        this.LOG.debug(['getStyle'], this._options);
        if (!this._options) {
            return {};
        }
        else {
            const style = { 'background-color': this._options.bgColor || 'transparent' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            this.LOG.debug(['getStyle', 'style'], style);
            return style;
        }
    }
    componentDidLoad() {
        this.LOG.debug(['componentDidLoad'], this._options);
        this.drawChart();
    }
    render() {
        return h("div", null, this.toDisplay ?
            h("div", { class: "chart-container", id: "#wrapper" }, this.toDisplay.map((img) => h("div", { style: this.getStyle() },
                h("img", { src: img, class: "responsive" }))))
            :
                h("warp-view-spinner", null));
    }
    static get is() { return "warp-view-image"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
        },
        "imageTitle": {
            "type": String,
            "attr": "image-title"
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
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host div {\n  height: var(--warp-view-chart-height, 100%); }\n\n:host .chart-container {\n  width: var(--warp-view-chart-width, 100%);\n  height: var(--warp-view-chart-height, 100%);\n  position: relative; }\n  :host .chart-container div {\n    font-size: 10rem;\n    height: 100%;\n    width: 100%; }\n    :host .chart-container div .responsive {\n      width: calc(100% - 10px);\n      height: auto; }"; }
}

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
class WarpViewPie {
    constructor() {
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.responsive = false;
        this.LOG = new Logger(WarpViewPie);
        this._options = {
            type: 'pie'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                this.drawChart();
            }, 250);
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    /**
     *
     * @param data
     * @returns {{labels: any[]; data: any[]}}
     */
    parseData(data) {
        this.LOG.debug(['parseData'], data);
        if (!data) {
            return;
        }
        let labels = [];
        let _data = [];
        let dataList;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
            data = data[0];
        }
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
            this._options = ChartLib.mergeDeep(this._options, data.globalParams || {});
        }
        else {
            dataList = data;
        }
        dataList.forEach(d => {
            _data.push(d[1]);
            labels.push(d[0]);
        });
        this.LOG.debug(['parseData'], [labels, _data]);
        return { labels: labels, data: _data };
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector("#" + this.uuid);
        let data = this.parseData(this.data);
        if (!data) {
            return;
        }
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        this.LOG.debug(['drawChart'], [this.data, this._options, data]);
        if (this._chart) {
            this._chart.destroy();
            delete this._chart;
        }
        this.LOG.debug(['data.data'], data.data);
        if (data.data && data.data.length > 0) {
            this._options.type = this.options.type || this._options.type;
            this._chart = new Chart(ctx, {
                type: this._options.type === 'gauge' ? 'doughnut' : this._options.type,
                data: {
                    datasets: [{
                            data: data.data,
                            backgroundColor: ColorLib.generateTransparentColors(data.data.length),
                            borderColor: ColorLib.generateColors(data.data.length)
                        }],
                    labels: data.labels
                },
                options: {
                    legend: {
                        display: this.showLegend
                    },
                    animation: {
                        duration: 0,
                    },
                    responsive: this.responsive,
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                    },
                    circumference: this.getCirc(),
                    rotation: this.getRotation(),
                }
            });
            this.onResize();
        }
    }
    getRotation() {
        if ('gauge' === this._options.type) {
            return Math.PI;
        }
        else {
            return -0.5 * Math.PI;
        }
    }
    getCirc() {
        if ('gauge' === this._options.type) {
            return Math.PI;
        }
        else {
            return 2 * Math.PI;
        }
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-pie"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host div {\n  width: calc(var(--warp-view-chart-width, 100%));\n  height: calc(var(--warp-view-chart-height, 100%) - 10px); }\n\n:host .chart-container {\n  position: relative;\n  margin: auto; }"; }
}

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
class WarpViewPolar {
    constructor() {
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewPolar);
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                this.drawChart();
            }, 250);
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    parseData(gts) {
        let labels = [];
        let data = [];
        gts.forEach(d => {
            data.push(Math.abs(d[1]));
            labels.push(d[0]);
        });
        return { labels: labels, data: data };
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
        if (!this.data)
            return;
        let data = this.data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
            data = data[0];
        }
        let dataList;
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
        }
        else {
            dataList = data;
        }
        let gts = this.parseData(dataList);
        if (this._chart) {
            this._chart.destroy();
            delete this._chart;
        }
        this.LOG.debug(['gts.data'], gts.data);
        if (gts.data && gts.data.length > 0) {
            this._chart = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    datasets: [{
                            data: gts.data,
                            backgroundColor: ColorLib.generateTransparentColors(gts.data.length),
                            borderColor: ColorLib.generateColors(gts.data.length)
                        }],
                    labels: gts.labels
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 50,
                            bottom: 0
                        }
                    },
                    animation: {
                        duration: 0,
                    },
                    legend: { display: this.showLegend },
                    responsive: this.responsive,
                    scale: {
                        gridLines: {
                            color: color,
                            zeroLineColor: color
                        },
                        pointLabels: {
                            fontColor: color,
                        },
                        ticks: {
                            fontColor: color,
                            backdropColor: 'transparent'
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                    }
                }
            });
            this.onResize();
        }
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-polar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host div {\n  height: var(--warp-view-chart-height, 100%); }\n\n:host .chart-container {\n  width: var(--warp-view-chart-width, 100%);\n  height: var(--warp-view-chart-height, 100%);\n  position: relative; }"; }
}

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
class WarpViewRadar {
    constructor() {
        this.responsive = true;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewRadar);
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                this.drawChart();
            }, 250);
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    parseData(gts) {
        this.LOG.debug(['gtsToData'], gts);
        let datasets = [];
        let labels = {};
        if (!gts || gts.length === 0) {
            return;
        }
        else {
            let i = 0;
            gts.forEach(g => {
                Object.keys(g).forEach(label => {
                    const dataSet = {
                        label: label,
                        data: [],
                        backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5),
                        borderColor: ColorLib.getColor(i)
                    };
                    g[label].forEach(val => {
                        const l = Object.keys(val)[0];
                        labels[l] = 0;
                        dataSet.data.push(val[l]);
                    });
                    datasets.push(dataSet);
                    i++;
                });
            });
        }
        this.LOG.debug(['gtsToData', 'datasets'], [datasets, Object.keys(labels)]);
        return { datasets: datasets, labels: Object.keys(labels) };
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
        let data = this.data;
        if (!data)
            return;
        let dataList;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
            data = data[0];
        }
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
        }
        else {
            dataList = data;
        }
        let gts = this.parseData(dataList);
        if (!gts) {
            return;
        }
        if (this._chart) {
            this._chart.destroy();
            delete this._chart;
        }
        this.LOG.debug(['gts.data'], gts.datasets);
        if (gts.datasets && gts.datasets.length > 0) {
            this._chart = new Chart(ctx, {
                type: 'radar',
                legend: { display: this.showLegend },
                data: {
                    labels: gts.labels,
                    datasets: gts.datasets
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 50,
                            bottom: 0
                        }
                    },
                    animation: {
                        duration: 0,
                    },
                    legend: { display: this.showLegend },
                    responsive: this.responsive,
                    scale: {
                        gridLines: {
                            color: color,
                            zeroLineColor: color
                        },
                        pointLabels: {
                            fontColor: color,
                        },
                        ticks: {
                            fontColor: color,
                            backdropColor: 'transparent'
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                    }
                }
            });
            this.onResize();
        }
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-radar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host div {\n  height: var(--warp-view-chart-height, 100%); }\n\n:host .chart-container {\n  width: var(--warp-view-chart-width, 100%);\n  height: var(--warp-view-chart-height, 100%);\n  position: relative; }"; }
}

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
class WarpViewScatter {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewScatter);
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                this.drawChart();
            }, 250);
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        let dataList;
        let data = this.data;
        if (!data)
            return;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
            data = data[0];
        }
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
        }
        else {
            dataList = data;
        }
        let gts = this.gtsToScatter(dataList);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
        const options = {
            legend: {
                display: this.showLegend
            },
            responsive: this.responsive,
            animation: {
                duration: 0,
            },
            tooltips: {
                mode: 'x',
                position: 'nearest',
                callbacks: ChartLib.getTooltipCallbacks()
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }],
                yAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        },
                        scaleLabel: {
                            display: this.unit !== '',
                            labelString: this.unit
                        }
                    }]
            },
        };
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart.Scatter(ctx, { data: { datasets: gts }, options: options });
        this.onResize();
        this.LOG.debug(['gtsToScatter', 'chart'], [gts, options]);
    }
    gtsToScatter(gts) {
        if (!gts) {
            return;
        }
        this.LOG.debug(['gtsToScatter'], gts);
        let datasets = [];
        for (let i = 0; i < gts.length; i++) {
            let g = gts[i];
            let data = [];
            g.v.forEach(d => {
                data.push({ x: d[0] / 1000, y: d[d.length - 1] });
            });
            datasets.push({
                label: GTSLib.serializeGtsMetadata(g),
                data: data,
                pointRadius: 2,
                borderColor: ColorLib.getColor(i),
                backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5)
            });
        }
        this.LOG.debug(['gtsToScatter', 'datasets'], datasets);
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-scatter"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host div {\n  height: var(--warp-view-chart-height, 100%); }\n\n:host .chart-container {\n  width: var(--warp-view-chart-width, 100%);\n  height: var(--warp-view-chart-height, 100%);\n  position: relative; }"; }
}

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
class WarpViewTile {
    constructor() {
        this.LOG = new Logger(WarpViewTile);
        this.unit = '';
        this.type = 'line';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = false;
        this.url = '';
        this.gtsFilter = '';
        this.warpscript = '';
        this.graphs = {
            'scatter': ['scatter'],
            'chart': ['line', 'spline', 'step', 'area'],
            'pie': ['pie', 'doughnut', 'gauge'],
            'polar': ['polar'],
            'radar': ['radar'],
            'bar': ['bar'],
            'annotation': ['annotation'],
            'gts-tree': ['gts-tree'],
        };
        this.loading = true;
    }
    onOptions(newValue, oldValue) {
        this.LOG.debug(['options'], newValue);
        if (oldValue !== newValue) {
            this.LOG.debug(['options', 'changed'], newValue);
            this.parseGTS();
        }
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.parseGTS();
        }
    }
    resize() {
        this.execute();
    }
    handleKeyDown(ev) {
        if (ev.key === 'r') {
            this.execute();
        }
    }
    componentDidLoad() {
        this.execute();
    }
    parseGTS() {
        let data = new DataModel();
        if (GTSLib.isArray(this.gtsList) && this.gtsList.length === 1) {
            const dataLine = this.gtsList[0];
            if (dataLine.hasOwnProperty('data')) {
                data.data = dataLine.data;
                data.globalParams = dataLine.globalParams || {};
                data.globalParams.type = data.globalParams.type || this.type;
                data.params = dataLine.params;
            }
            else {
                data.data = dataLine;
                data.globalParams = { type: this.type };
            }
        }
        else {
            data.data = this.gtsList;
            data.globalParams = { type: this.type };
        }
        this.LOG.debug(['parseGTS', 'data'], data);
        this.data = data;
        this._options = ChartLib.mergeDeep(this.options || {}, data.globalParams);
        this.LOG.debug(['parseGTS', 'options'], this._options);
        if (this._autoRefresh !== this._options.autoRefresh) {
            this._autoRefresh = this._options.autoRefresh;
            if (this.timer) {
                window.clearInterval(this.timer);
            }
            if (this._autoRefresh && this._autoRefresh > 0) {
                this.timer = window.setInterval(() => this.execute(), this._autoRefresh * 1000);
            }
        }
        this.loading = false;
    }
    execute() {
        this.loading = true;
        this.warpscript = this.wsElement.textContent;
        this.LOG.debug(['execute', 'warpscript'], this.warpscript);
        fetch(this.url, { method: 'POST', body: this.warpscript }).then(response => {
            response.text().then(gtsStr => {
                this.LOG.debug(['execute', 'response'], gtsStr);
                try {
                    this.gtsList = JSON.parse(gtsStr);
                    this.parseGTS();
                }
                catch (e) {
                    this.LOG.error(['execute'], e);
                }
                this.loading = false;
            }, err => {
                this.LOG.error(['execute'], [err, this.url, this.warpscript]);
                this.loading = false;
            });
        }, err => {
            this.LOG.error(['execute'], [err, this.url, this.warpscript]);
            this.loading = false;
        });
    }
    render() {
        return h("div", { class: "wrapper", id: "wrapper" },
            h("div", { class: "warpscript" },
                h("slot", null)),
            this.graphs['scatter'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null, this.chartTitle),
                    h("div", { class: "tile" },
                        h("warp-view-scatter", { responsive: this.responsive, unit: this.unit, data: this.data, options: this._options, "show-legend": this.showLegend })))
                :
                    '',
            this.graphs['chart'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null, this.chartTitle),
                    h("div", { class: "tile" },
                        h("warp-view-chart", { type: this.type, responsive: this.responsive, unit: this.unit, data: this.data, options: this._options, "show-legend": this.showLegend })))
                :
                    '',
            this.type == 'bubble' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-bubble", { showLegend: this.showLegend, responsive: true, unit: this.unit, data: this.data, options: this._options })))
                : '',
            this.type == 'map' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-map", { responsive: true, data: this.data, options: this._options })))
                : '',
            this.graphs['pie'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-pie", { responsive: this.responsive, data: this.data, options: this._options, showLegend: this.showLegend })))
                : '',
            this.graphs['polar'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-polar", { responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                : '',
            this.graphs['radar'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-radar", { responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                : '',
            this.graphs['bar'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null, this.chartTitle),
                    h("div", { class: "tile" },
                        h("warp-view-bar", { responsive: this.responsive, unit: this.unit, data: this.data, showLegend: this.showLegend, options: this._options })))
                : '',
            this.type == 'text' ?
                h("div", null,
                    h("h1", null, this.chartTitle),
                    h("div", { class: "tile" },
                        h("warp-view-display", { responsive: this.responsive, unit: this.unit, data: this.data, options: this._options })))
                : '',
            this.type == 'image' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-image", { responsive: this.responsive, data: this.data, options: this._options })))
                : '',
            this.type == 'plot' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-plot", { responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options, gtsFilter: this.gtsFilter })))
                : '',
            this.type == 'annotation' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-annotation", { responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                : '',
            this.type == 'gts-tree' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-gts-tree", { data: this.data, options: this._options })))
                : '',
            this.loading ? h("warp-view-spinner", null) : '');
    }
    static get is() { return "warp-view-tile"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "state": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "resize": {
            "method": true
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "url": {
            "type": String,
            "attr": "url"
        },
        "wsElement": {
            "elementRef": true
        }
    }; }
    static get listeners() { return [{
            "name": "document:keyup",
            "method": "handleKeyDown"
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host {\n  --warp-view-chart-height: 100%; }\n  :host .warpscript {\n    display: none; }\n  :host .wrapper {\n    min-height: var(--warp-view-tile-height, 400px);\n    width: var(--warp-view-tile-width, 100%);\n    height: var(--warp-view-tile-height, 100%); }\n    :host .wrapper .tile {\n      width: 100%;\n      height: calc(var(--warp-view-tile-height, 100%) - 40px);\n      overflow-y: auto;\n      overflow-x: hidden; }\n    :host .wrapper h1 {\n      font-size: 20px;\n      padding: 5px;\n      margin: 0;\n      color: var(--warp-view-font-color, #000000); }\n      :host .wrapper h1 small {\n        font-size: 10px;\n        margin-left: 10px; }"; }
}

export { WarpViewBar, WarpViewBubble, WarpViewDisplay, WarpViewImage, WarpViewPie, WarpViewPolar, WarpViewRadar, WarpViewScatter, WarpViewTile };
