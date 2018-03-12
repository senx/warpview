import Chart from 'chart.js';
import {Component, Prop, Element, Watch} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-chart',
  styleUrl: 'quantum-chart.css',
  shadow: true
})
export class QuantumChart extends GTSLib {
  @Prop() unit: string = '';
  @Prop() type: string = 'line';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;

  @Prop() data: string = '[]';
  @Prop() options: object = {};
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
    let data = JSON.parse(this.data);
    if (!data) return;
    let gts = this.gtsToData(data);
    new Chart(ctx, {
      type: (this.interpolations.indexOf(this.type) > -1)?'line':this.type,
      legend: {display: this.showLegend},
      data: {
        labels: gts.ticks,
        datasets: gts.datasets
      },
      options: {
        tooltips: {
          mode: 'index',
          position: 'nearest'
        },
        scales: {
          xAxes: [{
            type: 'time',
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
    gts.forEach(d => {
      if (d.gts)
        for (let i = 0; i < d.gts.length; i++) {
          let g = d.gts[i];
          let data = [];
          g.v.forEach(d => {
            ticks.push(d[0] / 10000);
            data.push(d[d.length - 1])
          });
          let color = this.getColor(i);
          if (d.params && d.params[i] && d.params[i].color) {
            color = d.params[i].color
          }
          let label = `${g.c} - ${JSON.stringify(g.l)}`;
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
    });
    return {datasets: datasets, ticks: GTSLib.unique(ticks)}
  }


  isStepped() {
    if(this.type.startsWith('step')) {
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
        <canvas id="myChart" width="400" height="400"/>
      </div>
    );
  }
}
