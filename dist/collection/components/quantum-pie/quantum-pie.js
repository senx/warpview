import Chart from 'chart.js';
import { GTSLib } from '../../gts.lib';
export class QuantumPie {
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
    static get style() { return "/**style-placeholder:quantum-pie:**/"; }
}
