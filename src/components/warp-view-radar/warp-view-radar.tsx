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
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";
import {DataModel} from "../../model/dataModel";
import {GTSLib} from "../../utils/gts.lib";
import deepEqual from "deep-equal";

@Component({
  tag: 'warp-view-radar',
  styleUrl: 'warp-view-radar.scss',
  shadow: true
})
export class WarpViewRadar {
  @Prop() responsive: boolean = true;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | any[] | string;
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';
  @Prop() debug = false;

  @Element() el: HTMLElement;

  private LOG: Logger;
  private _options: Param = {
    gridLineColor: '#8e8e8e'
  };
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');
  private _chart: Chart;
  private resizeTimer;
  private parentWidth = -1;


  @Listen('window:resize')
  onResize() {
    if (this.el.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
      this.parentWidth = this.el.parentElement.clientWidth;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.el.parentElement.clientWidth > 0) {
          this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
          this.drawChart();
        } else {
          this.onResize();
        }
      }, 150);
    }
  }

  @Watch('data')
  private onData(newValue: DataModel | any[], oldValue: DataModel | any[]) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  private parseData(gts) {
    this.LOG.debug(['gtsToData'], gts);
    let datasets = [];
    let labels = {};

    if (!gts || gts.length === 0) {
      return;
    } else {
      let i = 0;
      gts.forEach(g => {
        Object.keys(g).forEach(label => {
          const dataSet = {
            label: label,
            data: [],
            backgroundColor: ColorLib.transparentize(ColorLib.getColor(i)),
            borderColor: ColorLib.getColor(i)
          };
          g[label].forEach(val => {
            const l = Object.keys(val)[0];
            labels[l] = 0;
            dataSet.data.push(val[l]);
          });
          datasets.push(dataSet);
          i++;
        });
      });
    }
    this.LOG.debug(['gtsToData', 'datasets'], [datasets, Object.keys(labels)]);
    return {datasets: datasets, labels: Object.keys(labels)};
  }

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    const color = this._options.gridLineColor;
    let data: any = this.data;
    if (!data) return;
    let dataList: any[];
    if (typeof data === 'string') {
      data = JSON.parse(data as string);
    }
    if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
      data = data[0];
    }
    if (data instanceof DataModel || data.hasOwnProperty('data')) {
      dataList = data.data as any[];
    } else {
      dataList = data;
    }
    let gts = this.parseData(dataList);
    if (!gts) {
      return;
    }
    if (this._chart) {
      this._chart.destroy();
      delete this._chart;
    }
    this.LOG.debug(['gts.data'], gts.datasets);
    if (gts.datasets && gts.datasets.length > 0) {
      this._chart = new Chart(ctx, {
        type: 'radar',
        legend: {display: this.showLegend},
        data: {
          labels: gts.labels,
          datasets: gts.datasets
        },
        options: {
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 50,
              bottom: 0
            }
          },
          animation: {
            duration: 0,
          },
          legend: {display: this.showLegend},
          responsive: this.responsive,
          scale: {
            gridLines: {
              color: color,
              zeroLineColor: color
            },
            pointLabels: {
              fontColor: color,
            },
            ticks: {
              fontColor: color,
              backdropColor: 'transparent'
            }
          },
          tooltips: {
            mode: 'index',
            intersect: true,
          }
        }
      });
      this.onResize();
    }
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewRadar, this.debug);
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
