import Chart from "chart.js";
import {Component, Element, Event, EventEmitter, Method, Prop, Watch} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";

@Component({
  tag: "quantum-bar",
  styleUrl: "quantum-bar.scss",
  shadow: true
})
export class QuantumBar {
  @Prop() unit: string = '';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() standalone: boolean = true;
  @Prop() data: string = '[]';
  @Prop() hiddenData: string = '[]';
  @Prop() options: string = '{}';
  @Prop() theme = 'light';
  @Prop() width = '';
  @Prop() height = '';

  @Element() el: HTMLElement;

  private _chart;
  private _mapIndex = {};
  private _data: any;
  private _type = 'date';
  private _options: any = {};


  @Watch("data")
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
    }
  }

  @Watch('theme')
  onTheme(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
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

  buildGraph() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let gts = this.gtsToData(this._data);
    console.log(gts);
    const color = this._options.gridLineColor || GTSLib.getGridColor(this.theme);
    const graphOpts: any = {
      legend: {
        display: this.showLegend
      },
      //   borderWidth: 1,
      animation: {
        duration: 0,
      },
      tooltips: {
        mode: 'index',
        position: 'nearest'
      },
      scales: {
        xAxes: [{
          type: "time",
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
            },
            scaleLabel: {
              display: this.unit !== '',
              labelString: this.unit
            }
          }
        ]
      },
      responsive: this.responsive
    };


    if (!this.standalone) {
      graphOpts.scales.yAxes[0].afterFit = (scaleInstance) => {
        scaleInstance.width = 100; // sets the width to 100px
      };
    }
    /*
        if (this._type === "timestamp") {
          delete  graphOpts.scales.xAxes[0].time;
          graphOpts.scales.xAxes[0].ticks = {
          };
        } else {
          graphOpts.scales.xAxes[0].time = {
          }
        }*/
    this._chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: gts.ticks,
        datasets: gts.datasets
      },
      options: graphOpts
    });

    this._chart.update();
  }


  drawChart() {
    this._data = JSON.parse(this.data);
    if (!this._data) return;
    this.buildGraph();
    console.log(Chart.helpers.color)
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
                ticks.push(Math.floor(parseInt(d[0]) / 1000));
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
                borderColor: color,
                borderWidth: 1,
                backgroundColor: GTSLib.transparentize(color, 0.5)
              };
              datasets.push(ds);
              pos++;
              i++;
            }
          });
        }
      });
    return {datasets: datasets, ticks: GTSLib.unique(ticks).sort((a, b) => a > b ? 1 : a === b ? 0 : -1)};
  }

  componentWillLoad() {
    this._options = GTSLib.mergeDeep(this._options, JSON.parse(this.options));
  }

  componentDidLoad() {
    this.drawChart();
  }

  render() {
    return (
      <div class={this.theme}>
        <h1>{this.chartTitle}</h1>
        <div class="chart-container">
          <canvas id="myChart" width={this.width} height={this.height}/>
        </div>
      </div>
    );
  }
}
