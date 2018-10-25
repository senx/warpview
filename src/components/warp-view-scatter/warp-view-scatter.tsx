/*
 *
 *    Copyright 2016  Cityzen Data
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

import Chart from 'chart.js';
import {Component, Element, Listen, Prop, Watch} from '@stencil/core';
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";
import {Logger} from "../../utils/logger";
import {GTSLib} from "../../utils/gts.lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";

@Component({
  tag: 'warp-view-scatter',
  styleUrl: 'warp-view-scatter.scss',
  shadow: true
})
export class WarpViewScatter {
  @Prop() unit: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | GTS[];
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(WarpViewScatter);
  private _options: Param = {
    gridLineColor: '#8e8e8e'
  };
  private _chart: Chart;
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');
  private resizeTimer;

  @Listen('window:resize')
  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
      this.drawChart();
    }, 250);
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
    let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
    let dataList: any[];
    if (this.data instanceof DataModel) {
      dataList = this.data.data as any[];
    } else {
      dataList = this.data;
    }
    let gts = this.gtsToScatter(dataList);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    const color = this._options.gridLineColor;
    const options: any = {
      legend: {
        display: this.showLegend
      },
      responsive: this.responsive,
      animation: {
        duration: 0,
      },
      tooltips: {
        mode: 'x',
        position: 'nearest',
        callbacks: ChartLib.getTooltipCallbacks()
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
        yAxes: [{
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
        }]
      },
    };
    if(this._chart) {
      this._chart.destroy();
    }
    this._chart = new Chart.Scatter(ctx, {data: {datasets: gts}, options: options});
    this.onResize();
    this.LOG.debug(['gtsToScatter', 'chart'], [gts, options]);
  }

  private gtsToScatter(gts) {
    if(!gts) {
      return;
    }
    this.LOG.debug(['gtsToScatter'], gts);
    let datasets = [];
    for (let i = 0; i < gts.length; i++) {
      let g = gts[i];
      let data = [];
      g.v.forEach(d => {
        data.push({x: d[0] / 1000, y: d[d.length - 1]})
      });
      datasets.push({
        label: GTSLib.serializeGtsMetadata(g),
        data: data,
        pointRadius: 2,
        borderColor: ColorLib.getColor(i),
        backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5)
      });
    }
    this.LOG.debug(['gtsToScatter', 'datasets'], datasets);
    return datasets;
  }

  componentDidLoad() {
    this.drawChart()
  }

  render() {
    return <div>
      <div class="chart-container">
        <canvas id={this.uuid} width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
