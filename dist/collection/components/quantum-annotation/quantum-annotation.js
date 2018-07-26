import Chart from 'chart.js';
import { GTSLib } from '../../gts.lib';
export class QuantumAnnotation {
    constructor() {
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = "";
        this.width = '';
        this.height = '';
        this.legendOffset = 70;
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    changeScale(newValue, oldValue) {
        if (oldValue !== newValue) {
            const data = JSON.parse(newValue);
            if (data.time.timeMode === "timestamp") {
                this._chart.options.scales.xAxes[0].time.stepSize = data.time.stepSize;
                this._chart.options.scales.xAxes[0].time.unit = data.time.unit;
                this._chart.options.scales.xAxes[0].time.displayFormats.millisecond = data.time.displayFormats;
                this._chart.update();
            }
            else {
                this._chart.options.scales.xAxes[0].time.stepSize = data.time.stepSize;
                this._chart.options.scales.xAxes[0].time.unit = data.time.unit;
                this._chart.update();
            }
        }
    }
    hideData(newValue) {
        if (newValue % 2 !== 0 && newValue !== -1) {
            const index = Math.trunc(newValue / 2);
            const meta = this._chart.getDatasetMeta(index);
            meta.hidden === null ? meta.hidden = true : meta.hidden = null;
            this._chart.update();
        }
        this.didHideOrShowAnomaly.emit();
    }
    /**
     *
     */
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.gtsToScatter(JSON.parse(this.data));
        let calculatedHeight = 30 * gts.length + this.legendOffset;
        let height = (this.height || this.height !== '')
            ? (Math.max(calculatedHeight, parseInt(this.height)))
            : (calculatedHeight);
        this.height = height + '';
        console.log('height', this.height, calculatedHeight);
        ctx.parentElement.style.height = height + 'px';
        ctx.parentElement.style.width = '100%';
        const me = this;
        this._chart = new Chart.Scatter(ctx, {
            data: {
                datasets: gts
            },
            options: {
                layout: {
                    padding: {
                        bottom: 30 * gts.length
                    }
                },
                legend: { display: this.showLegend },
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
                    callbacks: {
                        title: (tooltipItems, _data) => {
                            return tooltipItems[0].xLabel || '';
                        },
                        label: (tooltipItem, data) => {
                            return `${data.datasets[tooltipItem.datasetIndex].label}: ${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].val}`;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                            drawTicks: false,
                            type: 'time',
                            time: {
                                min: this.timeMin,
                                max: this.timeMax,
                                unit: 'day'
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                    yAxes: [{
                            display: false,
                            drawTicks: false,
                            scaleLabel: {
                                display: false
                            },
                            afterFit: function (scaleInstance) {
                                scaleInstance.width = 100; // sets the width to 100px
                            },
                            ticks: {
                                min: 0,
                                max: 1,
                                beginAtZero: true,
                                stepSize: 1
                            }
                        }]
                },
            }
        });
    }
    /**
     *
     * @param {number} w
     * @param {number} h
     * @param {string} color
     * @returns {HTMLImageElement}
     */
    buildImage(w, h, color) {
        const img = new Image(w, h);
        const svg = `<svg width="${w}px" height="${h}px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid">
<rect width="${w}" height="${h}" style="fill:${color};" />
</svg>`;
        // 	myImage.src = "ripple.svg"
        img.src = 'data:image/svg+xml;base64,' + btoa(svg);
        return img;
    }
    /**
     *
     * @param gts
     * @returns {any[]}
     */
    gtsToScatter(gts) {
        console.log(gts);
        let datasets = [];
        if (!gts) {
            return;
        }
        else
            gts.forEach(d => {
                console.log(d.gts);
                d.gts = GTSLib.flatDeep(d.gts);
                d.gts.forEach((g, i) => {
                    if (GTSLib.isGtsToAnnotate(g)) {
                        let data = [];
                        let color = GTSLib.getColor(i);
                        const myImage = this.buildImage(1, 30, color);
                        g.v.forEach(d => {
                            data.push({ x: d[0] / 1000, y: 0.5, val: d[d.length - 1] });
                        });
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
                            pointRadius: 5,
                            pointHoverRadius: 5,
                            pointHitRadius: 5,
                            pointStyle: myImage,
                            borderColor: color,
                            backgroundColor: GTSLib.transparentize(color, 0.5)
                        });
                    }
                });
            });
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container", style: { position: 'relative', width: this.width, height: this.height } },
                h("canvas", { id: "myChart", width: this.width, height: this.height })));
    }
    static get is() { return "quantum-annotation"; }
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
            "attr": "height",
            "mutable": true
        },
        "hiddenData": {
            "type": Number,
            "attr": "hidden-data",
            "watchCallbacks": ["hideData"]
        },
        "options": {
            "type": String,
            "attr": "options",
            "watchCallbacks": ["changeScale"]
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "timeMax": {
            "type": Number,
            "attr": "time-max"
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min"
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
        }, {
            "name": "didHideOrShowAnomaly",
            "method": "didHideOrShowAnomaly",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-annotation:**/"; }
}
