import Chart from 'chart.js';
import { GTSLib } from '../../utils/gts.lib';
export class QuantumPolar {
    constructor() {
        this.unit = '';
        this.type = 'polar';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
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
    static generateColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(GTSLib.getColor(i));
        }
        return color;
    }
    static generateTransparentColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(GTSLib.transparentize(GTSLib.getColor(i), 0.5));
        }
        return color;
    }
    parseData(gts) {
        let labels = [];
        let data = [];
        gts.forEach(d => {
            data.push(d[1]);
            labels.push(d[0]);
        });
        return { labels: labels, data: data };
    }
    drawChart() {
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this.options.gridLineColor || GTSLib.getGridColor(this.theme);
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.parseData(JSON.parse(this.data));
        new Chart.PolarArea(ctx, {
            type: this.type,
            data: {
                datasets: [{
                        data: gts.data,
                        backgroundColor: QuantumPolar.generateTransparentColors(gts.data.length),
                        borderColor: QuantumPolar.generateColors(gts.data.length),
                        label: this.chartTitle
                    }],
                labels: gts.labels
            },
            options: {
                legend: { display: this.showLegend },
                responsive: this.responsive,
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
                        }
                    }
                ],
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
        return (h("div", { class: this.theme },
            h("h1", null,
                this.chartTitle,
                " ",
                h("small", null, this.unit)),
            h("div", { class: "chart-container" },
                h("canvas", { id: "myChart", width: this.width, height: this.height }))));
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
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get style() { return "/**style-placeholder:quantum-polar:**/"; }
}
