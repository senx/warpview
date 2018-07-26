import Chart from 'chart.js';
import { GTSLib } from '../../gts.lib';
export class QuantumBubble {
    constructor() {
        this.unit = '';
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
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let data = JSON.parse(this.data);
        if (!data)
            return;
        const me = this;
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
            legend: { display: this.showLegend },
            data: {
                datasets: this.parseData(data)
            },
            options: {
                borderWidth: 1,
                scales: {
                    yAxes: [
                        {
                            afterFit: function (scaleInstance) {
                                scaleInstance.width = 100; // sets the width to 100px
                            }
                        }
                    ]
                },
                responsive: this.responsive
            }
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
        return (h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height }))));
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
    static get style() { return "/**style-placeholder:quantum-bubble:**/"; }
}
