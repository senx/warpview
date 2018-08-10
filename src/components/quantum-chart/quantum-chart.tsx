import Chart from "chart.js";
import {Component, Element, Event, EventEmitter, Method, Prop, Watch} from "@stencil/core";
import {GTSLib} from "../../gts.lib";
import moment from "moment";

@Component({
  tag: "quantum-chart",
  styleUrl: "quantum-chart.scss",
  shadow: true
})
export class QuantumChart {
  @Prop() alone: boolean = true;
  @Prop() unit: string = "";
  @Prop() type: string = "line";
  @Prop() chartTitle: string = "";
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = false;
  @Prop() data: string = "[]";
  @Prop() hiddenData: string = "[]";
  @Prop() options: string = "{}";
  @Prop() width = "";
  @Prop() height = "";
  @Prop() timeMin: number;
  @Prop() timeMax: number;
  @Prop() config: string = "{}";
  @Prop() xView: string = "{}";
  @Prop() yView: string = "{}";

  @Event() pointHover: EventEmitter;
  @Event() boundsDidChange: EventEmitter;
  @Event() chartInfos: EventEmitter;

  @Element() el: HTMLElement;

  private _chart;
  private _mapIndex = {};
  private _xSlider = {
    element: null,

    min: 0,
    max: 0
  };
  private _ySlider = {
    element: null,

    min: 0,
    max: 0
  };
  private _config = {
    rail: {
      class: ""
    },
    cursor: {
      class: ""
    }
  };
  private _data: any;
  private _type = 'timestamp';

  @Method()
  toBase64Image() {
    return this._chart.toBase64Image();
  }

  @Watch("data")
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
    }
  }

  @Watch("options")
  changeScale(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      const data = JSON.parse(newValue);
      console.log('changeScale', this._data)
      if (data.time.timeMode === "timestamp") {
        delete this._chart.options.scales.xAxes[0].type;
        //  this._chart.options.scales.xAxes[0].type = 'linear'
        this._type = 'timestamp'
        /*  this._chart.options.scales.xAxes[0].type = 'linear'
          this._chart.options.scales.xAxes[0].linear = {
            displayFormats: {
              millisecond:  data.time.displayFormats
            }
          }
          this._chart.options.scales.xAxes[0].linear.stepSize = data.time.stepSize;
          this._chart.options.scales.xAxes[0].linear.unit = data.time.unit;*/

        /* this._chart.options.scales.xAxes[0].linear.min= moment(!!this.timeMin ? this.timeMin : gts.ticks[0], "x");
           max: moment(
           !!this.timeMax ? this.timeMax : gts.ticks[gts.ticks.length - 1],
           "x"
         )*/
        //   this._chart.options.scales.xAxes[0].time.stepSize = data.time.stepSize;
        //   this._chart.options.scales.xAxes[0].time.unit = data.time.unit;
        //   this._chart.options.scales.xAxes[0].time.displayFormats.millisecond =
        // data.time.displayFormats;
      } else {
        this._type = 'time'
        this._chart.options.scales.xAxes[0].type = 'time';
        this._chart.options.scales.xAxes[0].ticks.stepSize = data.time.stepSize;
        this._chart.options.scales.xAxes[0].ticks.unit = data.time.unit;
      }
      this._chart.update();
    }
  }

  @Watch("hiddenData")
  hideData(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      const hiddenData = GTSLib.cleanArray(JSON.parse(newValue));
      this._data = JSON.parse(this.data);
      if (!this._data) return;
      Object.keys(this._mapIndex).forEach(key => {
        this._chart.getDatasetMeta(this._mapIndex[key]).hidden = !!hiddenData.find(item => item === key);
        console.log(this._chart.getDatasetMeta(this._mapIndex[key]).dataset._children)
      });
      this._chart.update();
    }
  }

  @Watch("xView")
  changeXView() {
    let xView = JSON.parse(this.xView);
    if (this._type === "timestamp") {
      this._chart.options.scales.xAxes[0].ticks.min = xView.min;
      this._chart.options.scales.xAxes[0].ticks.max = xView.max;
    } else {
      this._chart.options.scales.xAxes[0].ticks.min = moment(xView.min, "x");
      this._chart.options.scales.xAxes[0].ticks.max = moment(xView.max, "x");
    }
    this._chart.update();
  }

  @Watch("yView")
  changeYView() {
    let yView = JSON.parse(this.yView);
    this._chart.options.scales.yAxes[0].ticks.min = yView.min;
    this._chart.options.scales.yAxes[0].ticks.max = yView.max;
    this._chart.update();
  }

  buildGraph() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let gts = this.gtsToData(this._data);
    const sortedTicks = gts.ticks.slice().sort(function (a, b) {
      return a - b;
    });
    console.log('buildGraph', gts, !!this.timeMin ? this.timeMin : sortedTicks[0])
    const me = this;
    const graphOpts = {
      animation: false,
      legend: {display: /*this.showLegend*/ false},
      tooltips: {
        mode: "x",
        position: "nearest",
        custom: function (tooltip) {
          if (tooltip.opacity > 0) {
            me.pointHover.emit({
              x: tooltip.dataPoints[0].x + 15,
              y: this._eventPosition.y
            });
          } else {
            me.pointHover.emit({x: -100, y: this._eventPosition.y});
          }
          return;
        }
      },
      scales: {
        xAxes: [
          {
            ticks: {},
            /* time: {
               min: moment(!!this.timeMin ? this.timeMin : sortedTicks[0], "x"),
               max: moment(
                 !!this.timeMax ? this.timeMax :sortedTicks[gts.ticks.length - 1],
                 "x"
               ),
               unit: "day"
             },*/

            type: "time"
          }
        ],
        yAxes: [
          {
            afterFit: function (scaleInstance) {
              scaleInstance.width = 100; // sets the width to 100px
            },
            scaleLabel: {
              display: true,
              labelString: this.unit
            }
          }
        ]
      },
      responsive: this.responsive,
      zoom: {
        enabled: true,
        drag: false,
        sensitivity: 0.5,
        mode: "x"
      }
    };
    if (this._type === "timestamp") {
      delete  graphOpts.scales.xAxes[0].type;
      graphOpts.scales.xAxes[0].ticks = {
        min: !!this.timeMin ? this.timeMin : sortedTicks[0],
        max: !!this.timeMax ? this.timeMax : sortedTicks[gts.ticks.length - 1],
        beginAtZero: false
      };
    } else {
      graphOpts.scales.xAxes[0].ticks = {
        min: moment(!!this.timeMin ? this.timeMin : sortedTicks[0], "x"),
        max: moment(
          !!this.timeMax ? this.timeMax : sortedTicks[gts.ticks.length - 1],
          "x"
        ),
        unit: "day"
      }
    }
    if (this.type === "spline") {
      graphOpts["elements"] = {line: {lineTension: 0}};
    }
    if (this.type === "area") {
      graphOpts["elements"] = {line: {fill: "start"}};
    }
    this._chart = new Chart(ctx, {
      type: this.type === "bar" ? this.type : "line",
      data: {
        labels: gts.ticks,
        datasets: gts.datasets
      },
      options: graphOpts
    });

    let maxArray = [];
    let minArray = [];
    gts.datasets.forEach(g => {
      let max = Math.max(...g.data);
      if (!!max && max != Infinity) {
        maxArray.push(max);
      }
    });
    gts.datasets.forEach(g => {
      let min = Math.min(...g.data);
      if (min == 0 || (!!min && min != Infinity)) {
        minArray.push(min);
      }
    });

    this._ySlider.min = Math.min(...minArray);
    this._ySlider.max = Math.max(...maxArray) * 1.05;
    this._chart.options.scales.yAxes[0].ticks.min = this._ySlider.min;
    this._chart.options.scales.yAxes[0].ticks.max = this._ySlider.max;
    this._chart.update();
    this._xSlider.min = sortedTicks[0];
    this._xSlider.max = sortedTicks[sortedTicks.length - 1];

    if (!this.alone) {
      console.log("Alone", sortedTicks[0], sortedTicks[sortedTicks.length - 1]);
      let chartInfos = {

        xMin: sortedTicks[0],
        xMax: sortedTicks[sortedTicks.length - 1],
        yMin: Math.min(...minArray),
        yMax: Math.max(...maxArray) * 1.05

      };

      this.chartInfos.emit(chartInfos);

    } else {
      console.log("Not alone");
    }
  }


  drawChart() {
    //console.debug("[QuantumChart] drawChart", this.data);
    this._data = JSON.parse(this.data);
    if (!this._data) return;
    this.buildGraph();
  }

  gtsToData(gts) {
    let datasets = [];
    let ticks = [];
    let pos = 0;
    if (!gts) {
      return;
    } else
      gts.forEach(d => {
        if (d.gts) {
          d.gts = GTSLib.flatDeep(d.gts);
          let i = 0;
          d.gts.forEach(g => {
            let data = [];
            if (g.v) {
              g.v.forEach(d => {
                ticks.push(d[0] / 1000.0);
                data.push(d[d.length - 1]);
              });
              let color = GTSLib.getColor(pos);
              if (d.params && d.params[i] && d.params[i].color) {
                color = d.params[i].color;
              }
              let label = GTSLib.serializeGtsMetadata(g);
              this._mapIndex[label] = pos;
              if (d.params && d.params[i] && d.params[i].key) {
                label = d.params[i].key;
              }
              let ds = {
                label: label,
                data: data,
                pointRadius: 0,
                fill: false,
                steppedLine: this.isStepped(),
                borderColor: color,
                borderWidth: 1,
                backgroundColor: GTSLib.transparentize(color, 0.5)
              };
              if (d.params && d.params[i] && d.params[i].interpolate) {
                switch (d.params[i].interpolate) {
                  case "line":
                    ds["lineTension"] = 0;
                    break;
                  case "spline":
                    break;
                  case "area":
                    ds.fill = true;
                }
              } else {
                ds["lineTension"] = 0;
              }
              datasets.push(ds);
              pos++;
              i++;
            }
          });
        }
      });
    return {datasets: datasets, ticks: GTSLib.unique(ticks)};
  }

  isStepped() {
    if (this.type.startsWith("step")) {
      return this.type.replace("step-", "");
    } else {
      return false;
    }
  }

  componentWillLoad() {
    this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    //console.log("chart :", this._config);
  }

  componentDidLoad() {
    this.drawChart();
  }

  render() {
    return (
      <div>
        <h1>{this.chartTitle}</h1>
        <div class="chart-container">

          {this.responsive ? (
            <canvas id="myChart"/>
          ) : (
            <canvas id="myChart" width={this.width} height={this.height}/>
          )}

        </div>
      </div>
    );
  }
}
