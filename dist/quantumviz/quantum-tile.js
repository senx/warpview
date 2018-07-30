/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-357e00db.js';

class QuantumTile {
    constructor() {
        this.warpscript = '';
        this.data = '[]';
        this.unit = '';
        this.type = 'line';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.url = '';
        this.graphs = {
            'scatter': ['scatter'],
            'chart': ['line', 'spline', 'step-after', 'step-before', 'area', 'bar'],
            'pie': ['pie', 'doughnut', 'gauge'],
            'polar': ['polar']
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
            params.push({ color: GTSLib.getColor(i), key: gts.c, interpolate: me.type });
        }
        return params;
    }
    render() {
        if (this.graphs['scatter'].indexOf(this.type) > -1) {
            return h("quantum-scatter", { responsive: this.responsive, unit: this.unit, data: this.data, "show-legend": this.showLegend, chartTitle: this.chartTitle });
        }
        else if (this.graphs['chart'].indexOf(this.type) > -1) {
            return h("quantum-chart", { responsive: this.responsive, unit: this.unit, data: this.data, type: this.type, "show-legend": this.showLegend, chartTitle: this.chartTitle });
        }
        else if (this.type == 'bubble') {
            return h("quantum-bubble", { "show-legend": this.showLegend, responsive: this.responsive, unit: this.unit, data: this.data, chartTitle: this.chartTitle });
        }
        else if (this.graphs['pie'].indexOf(this.type) > -1) {
            return h("quantum-pie", { responsive: this.responsive, unit: this.unit, data: this.data, type: this.type, "show-legend": this.showLegend, chartTitle: this.chartTitle });
        }
        else if (this.graphs['polar'].indexOf(this.type) > -1) {
            return h("quantum-polar", { responsive: this.responsive, unit: this.unit, data: this.data, type: this.type, "show-legend": this.showLegend, chartTitle: this.chartTitle });
        }
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
    static get style() { return ""; }
}

export { QuantumTile };
