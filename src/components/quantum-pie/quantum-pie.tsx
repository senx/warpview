import Chart from 'chart.js';
import {Component, Prop, Element, Watch, EventEmitter, Event} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-pie',
  styleUrl: 'quantum-pie.css',
  shadow: true
})
export class QuantumPie {
  @Prop() unit: string = '';
  @Prop() type: string = 'pie';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: object = {};
  @Prop() width = '';
  @Prop() height = '';

  @Element() el: HTMLElement;

  @Watch('data')
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.data = newValue;
      this.drawChart();
    }
  }

  /**
   *
   * @param num
   * @returns {any[]}
   */
  generateColors(num) {
    let color = [];
    for (let i = 0; i < num; i++) {
      color.push(GTSLib.getColor(i));
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
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let data = this.parseData(JSON.parse(this.data));
    console.debug('[QuantumPie]', this.data, data);

    new Chart(ctx, {
      type: (this.type === 'gauge') ? 'doughnut' : this.type,
      legend: {display: this.showLegend},
      data: {
        datasets: [{data: data.data, backgroundColor: this.generateColors(data.data.length), label: this.chartTitle}],
        labels: data.labels
      },
      options: {
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
    return <div>
      <h1>{this.chartTitle}</h1>
      <div class="chart-container">
        {this.responsive
          ? <canvas id="myChart" />
          : <canvas id="myChart" width={this.width} height={this.height}/>
        }
      </div>
    </div>;
  }
}
