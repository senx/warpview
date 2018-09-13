import Chart from 'chart.js';
import {Component, Element, Prop, Watch} from '@stencil/core';
import {GTSLib} from '../../utils/gts.lib';
import {Param} from "../../model/param";
import {Logger} from "../../utils/logger";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";

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
  @Prop() data: DataModel | GTS[];
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  private _options: Param = {
    gridLineColor: '#8e8e8e'
  };
  private LOG: Logger = new Logger(QuantumBubble);
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');

  @Watch('data')
  private onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
    if (!this.data) return;
    let dataList: any[];
    if (this.data instanceof DataModel) {
      dataList = this.data.data;
    } else {
      dataList = this.data;
    }

    const color = this._options.gridLineColor;
    const options: any = {
      legend: {
        display: this.showLegend
      },
      layout: {
        padding: {
          left: 0,
          right: 50,
          top: 50,
          bottom: 50
        }
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
        position: 'nearest',
        callbacks: ChartLib.getTooltipCallbacks()
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
    return <div>
      <h1>{this.chartTitle}</h1>
      <div class="chart-container">
        <canvas id={this.uuid} width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
