import Chart from 'chart.js';
import {Component, Element, Event, EventEmitter, Prop, Watch} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-chart',
  styleUrl: 'quantum-chart.scss',
  shadow: true
})
export class QuantumChart {
  @Prop() unit: string = '';
  @Prop() type: string = 'line';
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

  interpolations = ['spline', 'step-before', 'step-after', 'area'];

  @Watch('data')
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.data = newValue;
      this.drawChart();
    }
  }

  drawChart() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    console.debug('[QuantumChart] drawChart', this.data);
    let data = JSON.parse(this.data);
    if (!data) return;
    let gts = this.gtsToData(data);
    const me = this;
    new Chart(ctx, {
      type: (this.interpolations.indexOf(this.type) > -1) ? 'line' : this.type,
      data: {
        labels: gts.ticks,
        datasets: gts.datasets
      },
      options: {
        legend: {display: this.showLegend},
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
            scaleLabel: {
              display: true,
              labelString: this.unit
            }
          }]
        },
        responsive: this.responsive
      }
    });
  }

  gtsToData(gts) {
    let datasets = [];
    let ticks = [];
    if (!gts) {
      return;
    } else gts.forEach(d => {
      if (d.gts) {
        for (let i = 0; i < d.gts.length; i++) {
          let g = d.gts[i];
          let data = [];
          if (g.v) {
            g.v.forEach(d => {
              ticks.push(d[0] / 1000);
              data.push(d[d.length - 1])
            });
            let color = GTSLib.getColor(i);
            if (d.params && d.params[i] && d.params[i].color) {
              color = d.params[i].color
            }
            let label = GTSLib.serializeGtsMetadata(g);
            if (d.params && d.params[i] && d.params[i].key) {
              label = d.params[i].key
            }
            let ds = {
              label: label,
              data: data,
              pointRadius: 1,
              fill: false,
              steppedLine: this.isStepped(),
              borderColor: color,
              borderWidth: 1,
              backgroundColor: GTSLib.transparentize(color, 0.5)
            };
            if (d.params && d.params[i] && d.params[i].interpolate) {
              switch (d.params[i].interpolate) {
                case 'line':
                  ds['lineTension'] = 0;
                  break;
                case 'spline':
                  break;
                case 'area':
                  ds.fill = true
              }
            }
            datasets.push(ds)
          }
        }
      }
    });
    return {datasets: datasets, ticks: GTSLib.unique(ticks)}
  }


  isStepped() {
    if (this.type.startsWith('step')) {
      return this.type.replace('step-', '');
    } else {
      return false;
    }
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
