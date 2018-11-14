/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import Chart from 'chart.js';
import {Component, Element, Listen, Prop, Watch} from '@stencil/core';
import {GTSLib} from '../../utils/gts.lib';
import {Param} from "../../model/param";
import {Logger} from "../../utils/logger";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";

@Component({
  tag: 'warp-view-bubble',
  styleUrl: 'warp-view-bubble.scss',
  shadow: true
})
export class WarpViewBubble {
  @Prop() unit: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | GTS[] | string;
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  private _options: Param = {
    gridLineColor: '#8e8e8e'
  };
  private LOG: Logger = new Logger(WarpViewBubble);
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');
  private _chart: Chart;
  private resizeTimer;
  private parentWidth = -1;

  @Listen('window:resize')
  onResize() {
    if(this.el.parentElement.clientWidth !== this.parentWidth) {
      this.parentWidth = this.el.parentElement.clientWidth;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
        this.drawChart();
      }, 250);
    }
  }

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
    let gts: any = this.data;
    if (typeof gts === 'string') {
      gts = JSON.parse(gts as string);
    }
    if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
      dataList = gts.data as any[];
      this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
    } else {
      dataList = gts;
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
    if(this._chart) {
      this._chart.destroy();
    }
    this._chart = new Chart(ctx, {
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
    this.onResize();
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
      <div class="chart-container">
        <canvas id={this.uuid} width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
