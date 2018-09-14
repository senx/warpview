import Chart from 'chart.js';
import {Component, Element, Prop, Watch} from '@stencil/core';
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";
import {DataModel} from "../../model/dataModel";

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
  @Prop() data: DataModel | any[];
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(QuantumRadar);
  private _options: Param = {
    gridLineColor: '#8e8e8e'
  };
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');
  private _chart: Chart;

  @Watch('data')
  private onData(newValue: DataModel | any[], oldValue: DataModel | any[]) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  private parseData(gts) {
    this.LOG.debug(['gtsToData'], gts);
    let datasets = [];
    let labels = {};

    if (!gts || gts.length === 0) {
      return;
    } else {
      let i = 0;
      gts.forEach(g => {
        Object.keys(g).forEach(label => {
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
    this._options = ChartLib.mergeDeep(this._options, this.options);
    let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    const color = this._options.gridLineColor;
    const data = this.data;
    if (!data) return;
    let dataList: any[];
    if (this.data instanceof DataModel) {
      dataList = this.data.data;
    } else {
      dataList = this.data;
    }
    let gts = this.parseData(dataList);
    if (!gts) {
      return;
    }
    if(this._chart) {
      this._chart.destroy();
    }
    this._chart = new Chart(ctx, {
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
        animation: {
          duration: 0,
        },
        legend: {display: this.showLegend},
        responsive: this.responsive,
        scale: {
          gridLines: {
            color: color,
            zeroLineColor: color
          },
          pointLabels: {
            fontColor: color,
          },
          ticks: {
            fontColor: color,
            backdropColor: 'transparent'
          }
        },
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
    return <div>
      <h1>{this.chartTitle}
        <small>{this.unit}</small>
      </h1>
      <div class="chart-container">
        <canvas id={this.uuid} width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
