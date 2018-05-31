import Chart from 'chart.js';
import {Component, Prop, Element, Watch, EventEmitter, Event} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-annotation',
  styleUrl: 'quantum-annotation.scss',
  shadow: true
})
export class QuantumAnnotation {
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: object = {};
  @Prop() timeMin: number;
  @Prop() timeMax: number;
  @Prop() width = '';
  @Prop({
    mutable: true
  }) height = '';

  @Event() pointHover: EventEmitter;

  @Element() el: HTMLElement;

  private legendOffset = 50;
  private lineHeight = 15;

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
    let height = (this.height !== '')
      ? (Math.max(gts.length * this.lineHeight + this.legendOffset, parseInt(this.height)))
      : (gts.length * this.lineHeight + this.legendOffset);
    this.height = height + '';
    console.log('height', this.height);
    (ctx as HTMLElement).parentElement.style.height = height + 'px';
    (ctx as HTMLElement).parentElement.style.width = '100%';
    const me = this;
    new Chart.Scatter(ctx, {
      data: {
        datasets: gts
      },
      options: {
        layout: {
          padding: {
            left: 51
          }
        },
        legend: {display: this.showLegend},
        responsive: this.responsive,
        tooltips: {
          mode: 'x',
          position: 'nearest',
          custom: function( tooltip ) {
            if( tooltip.opacity > 0 ) {
              console.log( "Tooltip is showing", tooltip, this._eventPosition );
              me.pointHover.emit({x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y});
            } else {
              console.log( "Tooltip is hidden", tooltip );
              me.pointHover.emit({x: -100, y: this._eventPosition.y});
            }
            return;
          },
          callbacks: {
            label: function (tooltipItem, data) {
              const label = tooltipItem.xLabel || '';
              const val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].val;
              return `(${label}, ${val})`;
            }
          }
        },
        scales: {
          xAxes: [{
            drawTicks: false,
            type: 'time',
            time: {
              min: this.timeMin,
              max: this.timeMax,
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
            drawTicks: false,
            scaleLabel: {
              display: false
            },
            ticks: {
              min: 0,
              max: gts.length - 1,
              beginAtZero: true,
              stepSize: 1
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
          data.push({x: d[0] / 1000, y: i, val: d[d.length - 1]})
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
          pointRadius: 5,
          pointHoverRadius: 5,
          pointHitRadius: 5,
          pointStyle: 'rect',
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
      <div class="chart-container" style={{position: 'relative', width: this.width, height: this.height}}>
        <canvas id="myChart" width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
