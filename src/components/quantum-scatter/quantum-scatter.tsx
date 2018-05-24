import Chart from 'chart.js';
import {Component, Prop, Element, Watch} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-scatter',
  styleUrl: 'quantum-scatter.css',
  shadow: true
})
export class QuantumScatter extends GTSLib {
  @Prop() unit: string = '';
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

  drawChart() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let gts = this.gtsToScatter(JSON.parse(this.data));

    new Chart.Scatter(ctx, {
      data: {
        datasets: gts
      },
      options: {
        legend: {display: this.showLegend},
        responsive: this.responsive,
        tooltips: {
          mode: 'index',
          position: 'nearest'
        },
        scales: {
          xAxes: [{
            type: 'time'
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.unit
            }
          }]
        },
      }
    });
  }

  gtsToScatter(gts) {
    let datasets = [];
    gts.forEach(d => {
      for (let i = 0; i < d.gts.length; i++) {
        let g = d.gts[i];
        let data = [];
        g.v.forEach(d => {
          data.push({x: d[0] / 10000, y: d[d.length - 1]})
        });
        let color = this.getColor(i);
        if (d.params && d.params[i] && d.params[i].color) {
          color = d.params[i].color
        }
        let label = `${g.c} - ${JSON.stringify(g.l)}`;
        if (d.params && d.params[i] && d.params[i].key) {
          label = d.params[i].key
        }
        datasets.push({
          label: label,
          data: data,
          pointRadius: 2,
          borderColor: color,
          backgroundColor: GTSLib.transparentize(color, 0.5)
        })
      }
    });
    return datasets;
  }


  componentDidLoad() {
    this.drawChart()
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
