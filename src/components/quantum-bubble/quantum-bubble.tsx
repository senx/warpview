import Chart from 'chart.js';
import {Component, Prop, Element, Watch} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-bubble',
  styleUrl: 'quantum-bubble.css',
  shadow: true
})
export class QuantumBubble extends GTSLib {
  @Prop() unit: string = '';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: object = {};
  @Element() el: HTMLElement;


  @Watch('data')
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.data = newValue;
      this.drawChart();
    }
  }

  drawChart() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let data = JSON.parse(this.data);
    if (!data) return;
    new Chart(ctx, {
      type: 'bubble',
      legend: {display: this.showLegend},
      data: {
        datasets: this.parseData(data)
      },
      options: {
        borderWidth: 1,
        tooltips: {
          mode: 'index',
          position: 'nearest'
        },
        responsive: this.responsive
      }
    });
  }

  parseData(gts) {
    if (!gts) return;
    let datasets = [];
    for (let i = 0; i < gts.length; i++) {
      let label = Object.keys(gts[i])[0];
      let data = [];
      let g = gts[i][label];
      if (this.isArray(g)) {
        g.forEach(d => {
          data.push({
              x: d[0],
              y: d[1],
              r: d[2],
            }
          )
        });
      }
      datasets.push({
        data: data,
        label: label,
        backgroundColor: GTSLib.transparentize(this.getColor(i), 0.5),
        borderColor: this.getColor(i),
        borderWidth: 1
      });
    }
    return datasets;
  }

  componentDidLoad() {
    this.drawChart()
  }

  render() {
    return (
      <div>
        <h1>{this.chartTitle}</h1>
        <canvas id="myChart" width="400" height="400"/>
      </div>
    );
  }
}
