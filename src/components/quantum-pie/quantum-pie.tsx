import {Component, Element, Prop, Watch} from '@stencil/core';
import {Logger} from "../../utils/logger";
import Chart from 'chart.js';
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";

@Component({
  tag: 'quantum-pie',
  styleUrl: 'quantum-pie.scss',
  shadow: true
})
export class QuantumPie {
  @Prop() chartTitle: string = '';
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: string = '{}';
  @Prop() theme = 'light';
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';
  @Prop() unit: string = '';
  @Prop() responsive: boolean = false;

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(QuantumPie);
  private _options: Param = {
    type: 'pie'
  };

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

  /**
   *
   * @param data
   * @returns {{labels: any[]; data: any[]}}
   */
  private parseData(data) {
    this.LOG.debug(['parseData'], data);
    let labels = [];
    let _data = [];
    let dataList: any[];
    if (data.hasOwnProperty('data')) {
      dataList = data.data
    } else {
      dataList = data;
    }
    dataList.forEach(d => {
      _data.push(d[1]);
      labels.push(d[0]);
    });
    this.LOG.debug(['parseData'], [labels, _data]);
    return {labels: labels, data: _data}
  }

  private drawChart() {
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
    })
  }

  private getRotation() {
    if ('gauge' === this._options.type) {
      return Math.PI;
    } else {
      return -0.5 * Math.PI;
    }
  }

  private getCirc() {
    if ('gauge' === this._options.type) {
      return Math.PI;
    } else {
      return 2 * Math.PI;
    }
  }

  componentDidLoad() {
    this.drawChart();
  }

  render() {
    return <div class={this.theme}>
      <h1>{this.chartTitle}
        <small>{this.unit}</small>
      </h1>
      <div class="chart-container">
        <canvas id="myChart" width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
