/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as Chart } from './chunk-35f9f27a.js';
import { a as GTSLib } from './chunk-388780c8.js';
import './chunk-ee323282.js';

class QuantumBubble {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.standalone = true;
        this.data = '[]';
        this.options = {};
        this.theme = 'light';
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    drawChart() {
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let data = JSON.parse(this.data);
        if (!data)
            return;
        const me = this;
        const color = this.options.gridLineColor || this.theme === 'light' ? '#FFFFFF' : '#000000';
        const options = {
            legend: {
                display: this.showLegend
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
        if (!this.standalone) {
            options.scales.yAxes[0].afterFit = (scaleInstance) => {
                scaleInstance.width = 100; // sets the width to 100px
            };
        }
        new Chart(ctx, {
            type: 'bubble',
            tooltips: {
                mode: 'x',
                position: 'nearest',
                custom: function (tooltip) {
                    if (tooltip.opacity > 0) {
                        me.pointHover.emit({ x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y });
                    }
                    else {
                        me.pointHover.emit({ x: -100, y: this._eventPosition.y });
                    }
                    return;
                }
            },
            data: {
                datasets: this.parseData(data)
            },
            options: options
        });
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
                backgroundColor: GTSLib.transparentize(GTSLib.getColor(i), 0.5),
                borderColor: GTSLib.getColor(i),
                borderWidth: 1
            });
        }
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return (h("div", { class: this.theme },
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" },
                h("canvas", { id: "myChart", width: this.width, height: this.height }))));
    }
    static get is() { return "quantum-bubble"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "standalone": {
            "type": Boolean,
            "attr": "standalone"
        },
        "theme": {
            "type": String,
            "attr": "theme"
        },
        "timeMax": {
            "type": Number,
            "attr": "time-max"
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get events() { return [{
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "[data-quantum-bubble-host]   div[data-quantum-bubble] {\n  height: var(--quantum-chart-height, 100%); }\n\n[data-quantum-bubble-host]   .chart-container[data-quantum-bubble] {\n  width: var(--quantum-chart-width, 100%);\n  height: calc(var(--quantum-chart-height, 100%) - 30px);\n  position: relative; }\n\n[data-quantum-bubble-host]   h1[data-quantum-bubble] {\n  font-size: 20px;\n  padding: 5px;\n  margin: 0; }\n\n[data-quantum-bubble-host]   .dark[data-quantum-bubble]   h1[data-quantum-bubble] {\n  color: #ffffff; }\n\n[data-quantum-bubble-host]   .light[data-quantum-bubble]   h1[data-quantum-bubble] {\n  color: #000000; }"; }
}

class QuantumPie {
    constructor() {
        this.unit = '';
        this.type = 'pie';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    /**
     *
     * @param num
     * @returns {any[]}
     */
    generateColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(GTSLib.getColor(i));
        }
        return color;
    }
    /**
     *
     * @param data
     * @returns {{labels: any[]; data: any[]}}
     */
    parseData(data) {
        let labels = [];
        let _data = [];
        data.forEach(d => {
            _data.push(d[1]);
            labels.push(d[0]);
        });
        return { labels: labels, data: _data };
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let data = this.parseData(JSON.parse(this.data));
        new Chart(ctx, {
            type: (this.type === 'gauge') ? 'doughnut' : this.type,
            data: {
                datasets: [{ data: data.data, backgroundColor: this.generateColors(data.data.length), label: this.chartTitle }],
                labels: data.labels
            },
            options: {
                legend: {
                    display: this.showLegend
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
    }
    getRotation() {
        if ('gauge' === this.type) {
            return Math.PI;
        }
        else {
            return -0.5 * Math.PI;
        }
    }
    getCirc() {
        if ('gauge' === this.type) {
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
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height })));
    }
    static get is() { return "quantum-pie"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
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
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get style() { return "host[data-quantum-pie]   .chart-container[data-quantum-pie] {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }"; }
}

class QuantumPolar {
    constructor() {
        this.unit = '';
        this.type = 'polar';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    generateColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(GTSLib.transparentize(GTSLib.getColor(i), 0.5));
        }
        return color;
    }
    parseData(gts) {
        let labels = [];
        let datas = [];
        gts.forEach(d => {
            datas.push(d[1]);
            labels.push(d[0]);
        });
        return { labels: labels, datas: datas };
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.parseData(JSON.parse(this.data));
        new Chart.PolarArea(ctx, {
            type: this.type,
            legend: { display: this.showLegend },
            data: {
                datasets: [{ data: gts.datas, backgroundColor: this.generateColors(gts.datas.length), label: this.chartTitle }],
                labels: gts.labels
            },
            options: {
                responsive: this.responsive,
                tooltips: {
                    mode: 'index',
                    intersect: true,
                }
            }
        });
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return (h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height }))));
    }
    static get is() { return "quantum-polar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
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
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get style() { return ".chart-container[data-quantum-polar] {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative;\n}"; }
}

class QuantumScatter {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
        this.theme = 'light';
        this.standalone = true;
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.gtsToScatter(JSON.parse(this.data));
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const me = this;
        const color = this.options.gridLineColor || this.theme === 'light' ? '#FFFFFF' : '#000000';
        const options = {
            legend: {
                display: this.showLegend
            },
            responsive: this.responsive,
            tooltips: {
                mode: 'x',
                position: 'nearest',
                custom: function (tooltip) {
                    if (tooltip.opacity > 0) {
                        me.pointHover.emit({ x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y });
                    }
                    else {
                        me.pointHover.emit({ x: -100, y: this._eventPosition.y });
                    }
                    return;
                },
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        },
                        type: 'time',
                        time: {
                            min: this.timeMin,
                            max: this.timeMax,
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
        if (!this.standalone) {
            options.scales.yAxes[0].afterFit = (scaleInstance) => {
                scaleInstance.width = 100; // sets the width to 100px
            };
        }
        new Chart.Scatter(ctx, {
            data: {
                datasets: gts
            },
            options: options
        });
    }
    gtsToScatter(gts) {
        let datasets = [];
        gts.forEach(d => {
            for (let i = 0; i < d.gts.length; i++) {
                let g = d.gts[i];
                let data = [];
                g.v.forEach(d => {
                    data.push({ x: d[0] / 1000, y: d[d.length - 1] });
                });
                let color = GTSLib.getColor(i);
                if (d.params && d.params[i] && d.params[i].color) {
                    color = d.params[i].color;
                }
                let label = `${g.c} - ${JSON.stringify(g.l)}`;
                if (d.params && d.params[i] && d.params[i].key) {
                    label = d.params[i].key;
                }
                datasets.push({
                    label: label,
                    data: data,
                    pointRadius: 2,
                    borderColor: color,
                    backgroundColor: GTSLib.transparentize(color, 0.5)
                });
            }
        });
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", { class: this.theme },
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" },
                h("canvas", { id: "myChart", width: this.width, height: this.height })));
    }
    static get is() { return "quantum-scatter"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "standalone": {
            "type": Boolean,
            "attr": "standalone"
        },
        "theme": {
            "type": String,
            "attr": "theme"
        },
        "timeMax": {
            "type": Number,
            "attr": "time-max"
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get events() { return [{
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "[data-quantum-scatter-host]   div[data-quantum-scatter] {\n  height: var(--quantum-chart-height, 100%); }\n\n[data-quantum-scatter-host]   .chart-container[data-quantum-scatter] {\n  width: var(--quantum-chart-width, 100%);\n  height: calc(var(--quantum-chart-height, 100%) - 30px);\n  position: relative; }\n\n[data-quantum-scatter-host]   h1[data-quantum-scatter] {\n  font-size: 20px;\n  padding: 5px;\n  margin: 0; }\n\n[data-quantum-scatter-host]   .dark[data-quantum-scatter]   h1[data-quantum-scatter] {\n  color: #ffffff; }\n\n[data-quantum-scatter-host]   .light[data-quantum-scatter]   h1[data-quantum-scatter] {\n  color: #000000; }"; }
}

class QuantumTile {
    constructor() {
        this.warpscript = '';
        this.data = '[]';
        this.unit = '';
        this.theme = 'light';
        this.type = 'line';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.url = '';
        this.graphs = {
            'scatter': ['scatter'],
            'chart': ['line', 'spline', 'step', 'area', 'bar'],
            'pie': ['pie', 'doughnut', 'gauge'],
            'polar': ['polar'],
            'bar': ['bar']
        };
    }
    componentDidLoad() {
        this.warpscript = this.wsElement.textContent;
        let me = this;
        fetch(this.url, { method: 'POST', body: this.warpscript }).then(response => {
            response.text().then(gtsStr => {
                let gtsList = JSON.parse(gtsStr);
                let data = [];
                if (me.type === 'doughnut' || me.type === 'pie' || me.type === 'polar' || me.type === 'gauge' || me.type === 'bubble') {
                    if (gtsList.length > 0) {
                        if (Array.isArray(gtsList[0])) {
                            gtsList = gtsList[0];
                        }
                    }
                    me.data = JSON.stringify(gtsList);
                }
                else {
                    if (gtsList.length > 0) {
                        if (Array.isArray(gtsList[0])) {
                            gtsList = gtsList[0];
                        }
                    }
                    data.push({
                        gts: gtsList,
                        params: me.getParams(gtsList)
                    });
                    me.data = JSON.stringify(data);
                }
            }, err => {
                console.error(err);
            });
        }, err => {
            console.error(err);
        });
    }
    getParams(gtsList) {
        let params = [];
        let me = this;
        for (let i = 0; i < gtsList.length; i++) {
            let gts = gtsList[i];
            params.push({ color: GTSLib.getColor(i), key: GTSLib.serializeGtsMetadata(gts), interpolate: me.type });
        }
        return params;
    }
    render() {
        return h("div", { class: "wrapper", id: "wrapper" },
            h("div", { class: "warpscript" },
                h("slot", null)),
            this.graphs['scatter'].indexOf(this.type) > -1 ?
                h("quantum-scatter", { responsive: this.responsive, unit: this.unit, data: this.data, theme: this.theme, "show-legend": this.showLegend, "chart-title": this.chartTitle })
                : '',
            this.graphs['chart'].indexOf(this.type) > -1 ?
                h("quantum-dygraphs", { responsive: this.responsive, unit: this.unit, data: this.data, options: JSON.stringify({ type: this.type }), "show-legend": this.showLegend, chartTitle: this.chartTitle, theme: this.theme })
                : '',
            this.type == 'bubble' ?
                h("quantum-bubble", { showLegend: this.showLegend, responsive: true, unit: this.unit, data: this.data, theme: this.theme, chartTitle: this.chartTitle }) : '',
            this.graphs['pie'].indexOf(this.type) > -1 ?
                h("quantum-pie", { responsive: this.responsive, unit: this.unit, data: this.data, type: this.type, showLegend: this.showLegend, chartTitle: this.chartTitle }) : '',
            this.graphs['polar'].indexOf(this.type) > -1 ?
                h("quantum-polar", { responsive: this.responsive, unit: this.unit, data: this.data, type: this.type, showLegend: this.showLegend, chartTitle: this.chartTitle }) : '');
    }
    static get is() { return "quantum-tile"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "state": true
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "theme": {
            "type": String,
            "attr": "theme"
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
    static get style() { return "[data-quantum-tile-host] {\n  --quantum-chart-height: 100%; }\n  [data-quantum-tile-host]   .warpscript[data-quantum-tile] {\n    display: none; }\n  [data-quantum-tile-host]   .wrapper[data-quantum-tile] {\n    min-height: var(--quantum-tile-height, 400px);\n    width: var(--quantum-tile-width, 100%);\n    height: var(--quantum-tile-height, 100%); }"; }
}

export { QuantumBubble, QuantumPie, QuantumPolar, QuantumScatter, QuantumTile };
