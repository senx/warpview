import Chart from 'chart.js';
import {Component, Element, Prop, Watch} from '@stencil/core';
import {GTSLib} from '../../utils/gts.lib';
import {Param} from "../../model/param";
import {Logger} from "../../utils/logger";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";

@Component({
  tag: 'quantum-bubble',
  styleUrl: 'quantum-bubble.scss',
  shadow: true
})
export class QuantumBubble {
  @Prop() unit: string = '';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '{}';
  @Prop() options: string = '{}';
  @Prop() theme = 'light';
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  private _options: Param = new Param();
  private LOG: Logger = new Logger(QuantumBubble);

  @Watch('data')
  private onData(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  @Watch('theme')
  private onTheme(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['theme'], newValue);
      this.drawChart();
    }
  }

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, JSON.parse(this.options));
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let data = JSON.parse(this.data);
    if (!data) return;
    let dataList: any[];
    if (data.hasOwnProperty('data')) {
      dataList = data.data
    } else {
      dataList = data;
    }

    const color = this._options.gridLineColor || ChartLib.getGridColor(this.theme);
    const options: any = {
      legend: {
        display: this.showLegend
      },
      borderWidth: 1,
      animation: {
        duration: 0,
      },
      scales: {
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
            },
            scaleLabel: {
              display: this.unit !== '',
              labelString: this.unit
            }
          }
        ]
      },
      responsive: this.responsive
    };

    const dataSets = this.parseData(dataList);

    this.LOG.debug(['drawChart'], [options, dataSets]);

    new Chart(ctx, {
      type: 'bubble',
      tooltips: {
        mode: 'x',
        position: 'nearest'
      },
      data: {
        datasets: dataSets
      },
      options: options
    });
  }

  private parseData(gts) {
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
        backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5),
        borderColor: ColorLib.getColor(i),
        borderWidth: 1
      });
    }
    return datasets;
  }

  componentDidLoad() {
    this.drawChart();
  }

  render() {
    return (
      <div class={this.theme}>
        <h1>{this.chartTitle}</h1>
        <div class="chart-container">
          <canvas id="myChart" width={this.width} height={this.height}/>
        </div>
      </div>
    );
  }
}
