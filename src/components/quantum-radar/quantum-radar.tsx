import Chart from 'chart.js';
import {Component, Prop, Element, Watch} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-radar',
  styleUrl: 'quantum-radar.css',
  shadow: true
})
export class QuantumRadar {
  @Prop() unit: string = '';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = true;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: object = {};
  @Prop() width = '';
  @Prop() height = '';

  @Element() el: HTMLElement;

  @Watch('data')
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
    }
  }

  generateColors(num) {
    let color = [];
    for (let i = 0; i < num; i++) {
      color.push(GTSLib.transparentize(GTSLib.getColor(i), 0.5));
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
    //let gts = this.parseData(JSON.parse(this.data));
    new Chart(ctx, {
      type: 'radar',
      legend: {display: this.showLegend},
      data: {
      /*
      datasets: [{data: gts.datas, backgroundColor: this.generateColors(gts.datas.length), label: this.chartTitle}],
      labels: gts.labels
      */
        labels: ['Beer', 'Rum', 'Peanut', 'Crisps'],
        datasets: [{
            data: [50, 25, 10, 10],
            backgroundColor: '#64aa3939'
          },{
            data: [35, 75, 90, 5],
            backgroundColor: '#642d882d'
          }
        ]
      },
      options: {
        responsive: this.responsive,
        tooltips: {
          mode: 'index',
          intersect: true
        }
      }
    });
  }

  componentDidLoad() {
    this.drawChart()
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
