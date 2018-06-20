import Chart from "chart.js";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch
} from "@stencil/core";
import { GTSLib } from "../../gts.lib";

@Component({
  tag: "quantum-chart",
  styleUrl: "quantum-chart.scss",
  shadow: true
})
export class QuantumChart {
  @Prop() unit: string = "";
  @Prop() type: string = "line";
  @Prop() chartTitle: string = "";
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = "[]";
  @Prop() options: object = {};
  @Prop() width = "";
  @Prop() height = "";
  @Prop() timeMin: number;
  @Prop() timeMax: number;

  @Event() pointHover: EventEmitter;

  @Element() el: HTMLElement;

  @Watch("data")
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
    }
  }

  drawChart() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    console.debug("[QuantumChart] drawChart", this.data);
    let data = JSON.parse(this.data);
    if (!data) return;
    let gts = this.gtsToData(JSON.parse(this.data));
    const me = this;
    const graphOpts = {
      legend: { display: this.showLegend },
      tooltips: {
        mode: "x",
        position: "nearest",
        custom: function(tooltip) {
          if (tooltip.opacity > 0) {
            me.pointHover.emit({
              x: tooltip.dataPoints[0].x + 15,
              y: this._eventPosition.y
            });
          } else {
            me.pointHover.emit({ x: -100, y: this._eventPosition.y });
          }
          return;
        }
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              min: this.timeMin,
              max: this.timeMax
            }
          }
        ],
        yAxes: [
          {
            afterFit: function(scaleInstance) {
              scaleInstance.width = 100; // sets the width to 100px
            },
            scaleLabel: {
              display: true,
              labelString: this.unit
            }
          }
        ]
      },
      responsive: this.responsive
    };

    if(this.type === "spline") {
      graphOpts['elements'] = { line: { lineTension: 0}};
    }
    if(this.type === "area") {
      graphOpts['elements'] = { line: { fill: 'start'}};
    }
    new Chart(ctx, {
      type: this.type === "bar" ? this.type: "line",
      data: {
        labels: gts.ticks,
        datasets: gts.datasets
      },
      options: graphOpts
    });
  }

  gtsToData(gts) {
    let datasets = [];
    let ticks = [];
    if (!gts) {
      return;
    } else
      gts.forEach(d => {
        if (d.gts) {
          d.gts = GTSLib.flatDeep(d.gts);
          d.gts.forEach((g, i) => {
            let data = [];
            if (g.v) {
              g.v.forEach(d => {
                ticks.push(d[0] / 1000);
                data.push(d[d.length - 1]);
              });
              let color = GTSLib.getColor(i);
              if (d.params && d.params[i] && d.params[i].color) {
                color = d.params[i].color;
              }
              let label = GTSLib.serializeGtsMetadata(g);
              if (d.params && d.params[i] && d.params[i].key) {
                label = d.params[i].key;
              }
              let ds = {
                label: label,
                data: data,
                pointRadius: 1,
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
              }
              datasets.push(ds);
            }
          });
        }
      });
    return { datasets: datasets, ticks: GTSLib.unique(ticks) };
  }

  isStepped() {
    if (this.type.startsWith("step")) {
      return this.type.replace("step-", "");
    } else {
      return false;
    }
  }

  componentDidLoad() {
    this.drawChart();
  }

  render() {
    return (
      <div>
        <h1>{this.chartTitle}</h1>
        <div class="chart-container">
          {this.responsive
            ? <canvas id="myChart" />
            : <canvas id="myChart" width={this.width} height={this.height}/>
          }
        </div>
      </div>
    );
  }
}
