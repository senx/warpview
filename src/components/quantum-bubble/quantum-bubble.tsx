import Chart from 'chart.js';
import {Component, Prop, Element, Watch, EventEmitter, Event} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-bubble',
  styleUrl: 'quantum-bubble.css',
  shadow: true
})
export class QuantumBubble {
  @Prop() unit: string = '';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: object = {};
  @Prop() width = '';
  @Prop() height = '';
  @Prop() timeMin: number;
  @Prop() timeMax: number;

  @Event() pointHover: EventEmitter;

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
    const me = this;
    new Chart(ctx, {
      type: 'bubble',
      tooltips: {
        mode: 'x',
        position: 'nearest',
        custom: function (tooltip) {
          if (tooltip.opacity > 0) {
            console.log("Tooltip is showing", tooltip, this._eventPosition);
            me.pointHover.emit({x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y});
          } else {
            console.log("Tooltip is hidden", tooltip);
            me.pointHover.emit({x: -100, y: this._eventPosition.y});
          }
          return;
        }
      },
      legend: {display: this.showLegend},
      data: {
        datasets: this.parseData(data)
      },
      options: {
        borderWidth: 1,
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
      if (GTSLib.isArray(g)) {
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
        backgroundColor: GTSLib.transparentize(GTSLib.getColor(i), 0.5),
        borderColor: GTSLib.getColor(i),
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
        <div class="chart-container">
          <canvas id="myChart" width={this.width} height={this.height}/>
        </div>
      </div>
    );
  }
}
