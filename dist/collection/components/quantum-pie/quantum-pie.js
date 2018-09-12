import { Logger } from "../../utils/logger";
import Chart from 'chart.js';
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
export class QuantumPie {
    constructor() {
        this.chartTitle = '';
        this.showLegend = true;
        this.data = '[]';
        this.options = '{}';
        this.theme = 'light';
        this.width = '';
        this.height = '';
        this.unit = '';
        this.responsive = false;
        this.LOG = new Logger(QuantumPie);
        this._options = {
            type: 'pie'
        };
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
    onTheme(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['theme'], newValue);
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
        let labels = [];
        let _data = [];
        let dataList;
        if (data.hasOwnProperty('data')) {
            dataList = data.data;
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
        this._options = ChartLib.mergeDeep(this._options, JSON.parse(this.options));
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let data = this.parseData(JSON.parse(this.data));
        this.LOG.debug(['drawChart'], [this.data, this._options, data]);
        new Chart(ctx, {
            type: (this._options.type === 'gauge') ? 'doughnut' : this._options.type,
            data: {
                datasets: [{
                        data: data.data,
                        backgroundColor: ColorLib.generateTransparentColors(data.data.length),
                        borderColor: ColorLib.generateColors(data.data.length),
                        label: this.chartTitle
                    }],
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
        return h("div", { class: this.theme },
            h("h1", null,
                this.chartTitle,
                h("small", null, this.unit)),
            h("div", { class: "chart-container" },
                h("canvas", { id: "myChart", width: this.width, height: this.height })));
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
            "type": String,
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
        "theme": {
            "type": String,
            "attr": "theme",
            "watchCallbacks": ["onTheme"]
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
    static get style() { return "/**style-placeholder:quantum-pie:**/"; }
}
