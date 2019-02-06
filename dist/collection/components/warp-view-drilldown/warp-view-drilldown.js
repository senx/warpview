import { ChartLib } from "../../utils/chart-lib";
import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
import { Logger } from "../../utils/logger";
import { GTSLib } from "../../utils/gts.lib";
import moment from "moment";
import { ColorLib } from "../../utils/color-lib";
import deepEqual from "deep-equal";
export class WarpViewDrillDown {
    constructor() {
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.debug = false;
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.getBoundingClientRect().width !== this.parentWidth || this.parentWidth <= 0) {
            this.parentWidth = this.el.parentElement.getBoundingClientRect().width;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                if (this.el.parentElement.getBoundingClientRect().width > 0) {
                    this.LOG.debug(['onResize'], this.el.parentElement.getBoundingClientRect().width);
                    this.drawChart();
                }
                else {
                    this.onResize();
                }
            }, 150);
        }
    }
    onData(newValue) {
        this.LOG.debug(['data'], newValue);
        this.drawChart();
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.getBoundingClientRect().height : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.getBoundingClientRect().width : this.width || 800) + '';
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
        this.heatMapData = this.parseData(GTSLib.flatDeep(dataList));
    }
    parseData(dataList) {
        const details = [];
        let values = [];
        const dates = [];
        const data = {};
        const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue);
        this.LOG.debug(['parseData'], dataList);
        dataList.forEach((gts, i) => {
            const name = GTSLib.serializeGtsMetadata(gts);
            gts.v.forEach(v => {
                const refDate = moment.utc(v[0] / 1000).startOf('day').toISOString();
                if (!data[refDate]) {
                    data[refDate] = [];
                }
                if (!values[refDate]) {
                    values[refDate] = [];
                }
                dates.push(v[0] / 1000);
                values[refDate].push(v[v.length - 1]);
                data[refDate].push({
                    name: name,
                    date: v[0] / 1000,
                    value: v[v.length - 1],
                    color: ColorLib.getColor(i),
                    id: i
                });
            });
        });
        Object.keys(data).forEach((d) => {
            details.push({
                date: moment.utc(d),
                total: values[d].reduce(reducer),
                details: data[d],
                summary: []
            });
        });
        return details;
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewDrillDown, this.debug);
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", { class: "wrapper" },
            h("calendar-heatmap", { data: this.heatMapData, overview: 'global', debug: this.debug, minColor: this._options.minColor, maxColor: this._options.maxColor }));
    }
    static get is() { return "warp-view-drilldown"; }
    static get encapsulation() { return "shadow"; }
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
    static get style() { return "/**style-placeholder:warp-view-drilldown:**/"; }
}
