import Chart from 'chart.js';
import {Component, Element, Prop, Watch} from '@stencil/core';
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";

@Component({
  tag: 'quantum-polar',
  styleUrl: 'quantum-polar.scss',
  shadow: true
})
export class QuantumPolar {
  @Prop() unit: string = '';
  @Prop() type: string = 'polar';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: any = {};
  @Prop() theme = 'light';
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  @Watch('data')
  onData(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
    }
  }

  parseData(gts) {
    let labels = [];
    let data = [];
    gts.forEach(d => {
      data.push(d[1]);
      labels.push(d[0]);
    });
    return {labels: labels, data: data}
  }

  drawChart() {
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    const color = this.options.gridLineColor || ChartLib.getGridColor(this.theme);
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let gts = this.parseData(JSON.parse(this.data));
    new Chart.PolarArea(ctx, {
      type: this.type,
      data: {
        datasets: [{
          data: gts.data,
          backgroundColor: ColorLib.generateTransparentColors(gts.data.length),
          borderColor: ColorLib.generateColors(gts.data.length),
          label: this.chartTitle
        }],
        labels: gts.labels
      },
      options: {
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
          <canvas id="myChart" width={this.width} height={this.height}/>
        </div>
      </div>
    );
  }
}
