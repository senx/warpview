import Chart from 'chart.js';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from "../../utils/color-lib";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
import moment from "moment";
export class QuantumAnnotation {
    constructor() {
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.hiddenData = [];
        this.width = "";
        this.height = "";
        this.legendOffset = 70;
        this._mapIndex = {};
        this.LOG = new Logger(QuantumAnnotation);
        this._options = {
            gridLineColor: '#000000',
            timeMode: 'date'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    changeScale(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    hideData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['hiddenData'], newValue);
            const hiddenData = GTSLib.cleanArray(newValue);
            Object.keys(this._mapIndex).forEach(key => {
                this._chart.getDatasetMeta(this._mapIndex[key]).hidden = !!hiddenData.find(item => item === key);
            });
            this._chart.update();
        }
    }
    minBoundChange(newValue, oldValue) {
        this._chart.options.animation.duration = 0;
        if (oldValue !== newValue && this._chart.options.scales.xAxes[0].time) {
            this._chart.options.scales.xAxes[0].time.min = newValue;
            this.LOG.debug(['minBoundChange'], this._chart.options.scales.xAxes[0].time.min);
            this._chart.update();
        }
    }
    maxBoundChange(newValue, oldValue) {
        this._chart.options.animation.duration = 0;
        if (oldValue !== newValue && this._chart.options.scales.xAxes[0].time) {
            this._chart.options.scales.xAxes[0].time.max = newValue;
            this.LOG.debug(['maxBoundChange'], this._chart.options.scales.xAxes[0].time.max);
            this._chart.update();
        }
    }
    /**
     *
     */
    drawChart() {
        this._options.timeMode = 'date';
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.LOG.debug(['drawChart', 'hiddenData'], this.hiddenData);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        let gts = this.parseData(this.data);
        let calculatedHeight = 30 * gts.length + this.legendOffset;
        let height = this.height || this.height !== ''
            ? Math.max(calculatedHeight, parseInt(this.height))
            : calculatedHeight;
        this.height = height.toString();
        ctx.parentElement.style.height = height + 'px';
        ctx.parentElement.style.width = '100%';
        const color = this._options.gridLineColor;
        const me = this;
        const chartOption = {
            layout: {
                padding: {
                    bottom: 30 * gts.length
                }
            },
            legend: { display: this.showLegend },
            responsive: this.responsive,
            animation: {
                duration: 0,
            },
            tooltips: {
                mode: "x",
                position: "nearest",
                custom: function (tooltip) {
                    if (tooltip.opacity > 0) {
                        me.pointHover.emit({
                            x: tooltip.dataPoints[0].x + 15,
                            y: this._eventPosition.y
                        });
                    }
                    else {
                        me.pointHover.emit({ x: -100, y: this._eventPosition.y });
                    }
                    return;
                },
                callbacks: {
                    title: (tooltipItems) => {
                        return tooltipItems[0].xLabel || "";
                    },
                    label: (tooltipItem, data) => {
                        return `${data.datasets[tooltipItem.datasetIndex].label}: ${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                            .val}`;
                    }
                }
            },
            scales: {
                xAxes: [
                    {
                        drawTicks: false,
                        type: "linear",
                        time: {},
                        gridLines: {
                            zeroLineColor: color,
                            color: color,
                            display: false
                        },
                        ticks: {}
                    }
                ],
                yAxes: [
                    {
                        display: false,
                        drawTicks: false,
                        scaleLabel: {
                            display: false
                        },
                        afterFit: function (scaleInstance) {
                            scaleInstance.width = 100; // sets the width to 100px
                        },
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color,
                            min: 0,
                            max: 1,
                            beginAtZero: true,
                            stepSize: 1
                        }
                    }
                ]
            }
        };
        this.LOG.debug(['options'], this._options);
        if (this._options.timeMode === 'timestamp') {
            chartOption.scales.xAxes[0].time = undefined;
            chartOption.scales.xAxes[0].type = 'linear';
            chartOption.scales.xAxes[0].ticks = {
                fontColor: color,
                min: this.timeMin,
                max: this.timeMax,
            };
        }
        else {
            chartOption.scales.xAxes[0].time = {
                min: this.timeMin,
                max: this.timeMax,
                displayFormats: {
                    millisecond: 'HH:mm:ss.SSS',
                    second: 'HH:mm:ss',
                    minute: 'HH:mm',
                    hour: 'HH'
                }
            };
            chartOption.scales.xAxes[0].ticks = {
                fontColor: color
            };
            chartOption.scales.xAxes[0].type = 'time';
        }
        this.LOG.debug(['drawChart'], [height, gts]);
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart.Scatter(ctx, {
            data: {
                datasets: gts
            },
            options: chartOption
        });
        Object.keys(this._mapIndex).forEach(key => {
            this._chart.getDatasetMeta(this._mapIndex[key]).hidden = !!this.hiddenData.find(item => item === key);
        });
        this._chart.update();
    }
    /**
     *
     * @param gts
     * @returns {any[]}
     */
    parseData(gts) {
        this.LOG.debug(['parseData'], gts);
        let dataList = GTSLib.getData(gts).data;
        this.LOG.debug(['parseData', 'dataList'], dataList);
        if (!dataList || dataList.length === 0) {
            return [];
        }
        else {
            let datasets = [];
            let pos = 0;
            dataList = GTSLib.flatDeep(dataList);
            dataList.forEach((g, i) => {
                if (GTSLib.isGtsToAnnotate(g)) {
                    let data = [];
                    let color = ColorLib.getColor(i);
                    const myImage = ChartLib.buildImage(1, 30, color);
                    g.v.forEach(d => {
                        let time = d[0];
                        if (this._options.timeMode !== 'timestamp') {
                            time = moment(time / 1000).utc(true).valueOf();
                            this.LOG.debug(['moment'], time);
                        }
                        data.push({ x: time, y: 0.5, val: d[d.length - 1] });
                    });
                    let label = GTSLib.serializeGtsMetadata(g);
                    this._mapIndex[label] = pos;
                    datasets.push({
                        label: label,
                        data: data,
                        pointRadius: 5,
                        pointHoverRadius: 5,
                        pointHitRadius: 5,
                        pointStyle: myImage,
                        borderColor: color,
                        backgroundColor: ColorLib.transparentize(color, 0.5)
                    });
                    pos++;
                }
            });
            return datasets;
        }
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container", style: {
                    position: "relative",
                    width: this.width,
                    height: this.height
                } },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "quantum-annotation"; }
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
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["hideData"]
        },
        "options": {
            "type": "Any",
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
            "attr": "time-max",
            "watchCallbacks": ["maxBoundChange"]
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min",
            "watchCallbacks": ["minBoundChange"]
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get events() { return [{
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-annotation:**/"; }
}
