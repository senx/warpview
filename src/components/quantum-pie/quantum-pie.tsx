import Chart from 'chart.js';
import {Component, Prop, Element, Watch, EventEmitter, Event} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-pie',
  styleUrl: 'quantum-pie.scss',
  shadow: true
})
export class QuantumPie {
  @Prop() unit: string = '';
  @Prop() type: string = 'pie';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: any = {};
  @Prop() theme = 'light';
  @Prop() width = '';
  @Prop() height = '';

  @Element() el: HTMLElement;

  @Watch('data')
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

  /**
   *
   * @param num
   * @returns {any[]}
   */
  static generateColors(num) {
    let color = [];
    for (let i = 0; i < num; i++) {
      color.push(GTSLib.getColor(i));
    }
    return color;
  }

  /**
   *
   * @param num
   */
  static generateTransparentColors(num) {
    let color = [];
    for (let i = 0; i < num; i++) {
      color.push(GTSLib.transparentize(GTSLib.getColor(i), 0.5));
    }
    return color;
  }

  /**
   *
   * @param data
   * @returns {{labels: any[]; data: any[]}}
   */
  parseData(data) {
    let labels = [];
    let _data = [];
    data.forEach(d => {
      _data.push(d[1]);
      labels.push(d[0]);
    });
    return {labels: labels, data: _data}
  }

  drawChart() {
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let data = this.parseData(JSON.parse(this.data));
    new Chart(ctx, {
      type: (this.type === 'gauge') ? 'doughnut' : this.type,
      data: {
        datasets: [{
          data: data.data,
          backgroundColor: QuantumPie.generateTransparentColors(data.data.length),
          borderColor: QuantumPie.generateColors(data.data.length),
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

  getRotation() {
    if ('gauge' === this.type) {
      return Math.PI;
    } else {
      return -0.5 * Math.PI;
    }
  }

  getCirc() {
    if ('gauge' === this.type) {
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
      <h1>{this.chartTitle} <small>{this.unit}</small></h1>
      <div class="chart-container">
       <canvas id="myChart" width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
