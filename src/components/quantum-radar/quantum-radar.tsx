import Chart from 'chart.js';
import {Component, Element, Prop, Watch} from '@stencil/core';
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";

@Component({
  tag: 'quantum-radar',
  styleUrl: 'quantum-radar.scss',
  shadow: true
})
export class QuantumRadar {
  @Prop() unit: string = '';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = true;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: string = '{}';
  @Prop() theme = 'light';
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(QuantumRadar);
  private _options: Param = {};
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');

  @Watch('data')
  private onData(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  @Watch('theme')
  private onTheme(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['theme'], newValue);
      this.drawChart();
    }
  }

  private parseData(gts) {
    this.LOG.debug(['gtsToData'], gts);
    let datasets = [];
    let labels = {};
    let dataList: any[];
    if (gts.hasOwnProperty('data')) {
      dataList = gts.data
    } else {
      dataList = gts;
    }
    if (!dataList || dataList.length === 0) {
      return;
    } else {
      let i = 0;
      dataList.forEach(g => {
        let data = [];
        Object.keys(g).forEach(label => {
          const values = g[label];
          const dataSet = {
            label: label,
            data: [],
            backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5),
            borderColor: ColorLib.getColor(i)
          };
          g[label].forEach(val => {
            const l = Object.keys(val)[0];
            labels[l] = 0;
            dataSet.data.push(val[l]);
          });
          datasets.push(dataSet);
          i++;
        });
      });
    }
    this.LOG.debug(['gtsToData', 'datasets'], [datasets, Object.keys(labels)]);
    return {datasets: datasets, labels: Object.keys(labels)};
  }

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, JSON.parse(this.options));
    let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    const color = this._options.gridLineColor || ChartLib.getGridColor(this.theme);
    const data = JSON.parse(this.data);
    if (!data) return;
    let dataList: any[];
    if (data.hasOwnProperty('data')) {
      dataList = data.data
    } else {
      dataList = data;
    }
    let gts = this.parseData(dataList);
    if (!gts) {
      return;
    }
    new Chart(ctx, {
      type: 'radar',
      legend: {display: this.showLegend},
      data: {
        labels: gts.labels,
        datasets: gts.datasets
      },
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 50,
            bottom: 0
          }
        },
        legend: {display: this.showLegend},
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
    this.drawChart()
  }

  render() {
    return (
      <div class={this.theme}>
        <h1>{this.chartTitle} <small>{this.unit}</small></h1>
        <div class="chart-container">
          <canvas id={this.uuid} width={this.width} height={this.height}/>
        </div>
      </div>
    );
  }
}
