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

import {Component, Element, Listen, Prop, Watch} from '@stencil/core';
import {Logger} from "../../utils/logger";
import Chart from 'chart.js';
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";
import {DataModel} from "../../model/dataModel";

@Component({
  tag: 'warp-view-pie',
  styleUrl: 'warp-view-pie.scss',
  shadow: true
})
export class WarpViewPie {
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | any[] | string;
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';
  @Prop() responsive: boolean = false;

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(WarpViewPie);
  private _options: Param = {
    type: 'pie'
  };
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
  private onData(newValue: DataModel | any[], oldValue: DataModel | any[]) {
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

  /**
   *
   * @param data
   * @returns {{labels: any[]; data: any[]}}
   */
  private parseData(data) {
    this.LOG.debug(['parseData'], data);
    if (!data) {
      return;
    }
    let labels = [];
    let _data = [];
    let dataList: any[];
    if (typeof data === 'string') {
      data = JSON.parse(data as string);
    }
    if (data instanceof DataModel || data.hasOwnProperty('data')) {
      dataList = data.data as any[];
      this._options = ChartLib.mergeDeep(this._options, data.globalParams || {});
    } else {
      dataList = data;
    }
    dataList.forEach(d => {
      _data.push(d[1]);
      labels.push(d[0]);
    });
    this.LOG.debug(['parseData'], [labels, _data]);
    return {labels: labels, data: _data}
  }

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    let ctx = this.el.shadowRoot.querySelector("#" + this.uuid);
    let data = this.parseData(this.data);
    if (!data) {
      return;
    }
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    this.LOG.debug(['drawChart'], [this.data, this._options, data]);
    if (this._chart) {
      this._chart.destroy();
      delete this._chart;
    }
    this.LOG.debug(['data.data'], data.data);
    if (data.data && data.data.length > 0) {
      this._options.type = this.options.type || this._options.type;
      this._chart = new Chart(ctx, {
        type: this._options.type === 'gauge' ? 'doughnut' : this._options.type,
        data: {
          datasets: [{
            data: data.data,
            backgroundColor: ColorLib.generateTransparentColors(data.data.length),
            borderColor: ColorLib.generateColors(data.data.length)
          }],
          labels: data.labels
        },
        options: {
          legend: {
            display: this.showLegend
          },
          animation: {
            duration: 0,
          },
          responsive: this.responsive,
          tooltips: {
            mode: 'index',
            intersect: true,
          },
          circumference: this.getCirc(),
          rotation: this.getRotation(),
        }
      });
      this.onResize();
    }
  }

  private getRotation() {
    if ('gauge' === this._options.type) {
      return Math.PI;
    } else {
      return -0.5 * Math.PI;
    }
  }

  private getCirc() {
    if ('gauge' === this._options.type) {
      return Math.PI;
    } else {
      return 2 * Math.PI;
    }
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
