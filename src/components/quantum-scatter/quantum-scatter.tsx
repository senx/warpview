import Chart from 'chart.js';
import {Component, Prop, Element, Watch, EventEmitter, Event} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-scatter',
  styleUrl: 'quantum-scatter.scss',
  shadow: true
})
export class QuantumScatter {
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
    let gts = this.gtsToScatter(JSON.parse(this.data));
    const me = this;
    new Chart.Scatter(ctx, {
      data: {
        datasets: gts
      },
      options: {
        legend: {display: this.showLegend},
        responsive: this.responsive,
        tooltips: {
          mode: 'x',
          position: 'nearest',
          custom: function( tooltip ) {
            if( tooltip.opacity > 0 ) {
              me.pointHover.emit({x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y});
            } else {
              me.pointHover.emit({x: -100, y: this._eventPosition.y});
            }
            return;
          },
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              min: this.timeMin,
              max: this.timeMax,
            }
          }],
          yAxes: [{
            afterFit: function(scaleInstance) {
              scaleInstance.width = 100; // sets the width to 100px
            },
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
          data.push({x: d[0] / 1000, y: d[d.length - 1]})
        });
        let color = GTSLib.getColor(i);
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
        {this.responsive
          ? <canvas id="myChart" />
          : <canvas id="myChart" width={this.width} height={this.height}/>
        }
      </div>
    </div>;
  }
}
