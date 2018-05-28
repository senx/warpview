import Chart from 'chart.js';
import {Component, Prop, Element, Watch} from '@stencil/core';
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

  generateColors(num) {
    let color = [];
    for (let i = 0; i < num; i++) {
      color.push(GTSLib.getColor(i));
    }
    return color;
  }

  parseData(gts) {
    let labels = [];
    let datas = [];
    gts.forEach(d => {
      datas.push(d[1]);
      labels.push(d[0]);
    });
    return {labels: labels, datas: datas}
  }

  drawChart() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let gts = this.parseData(JSON.parse(this.data));

    new Chart(ctx, {
      type: (this.type === 'gauge') ? 'doughnut' : this.type,
      legend: {display: this.showLegend},
      data: {
        datasets: [{data: gts.datas, backgroundColor: this.generateColors(gts.datas.length), label: this.chartTitle}],
        labels: gts.labels
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
        <canvas id="myChart" width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
