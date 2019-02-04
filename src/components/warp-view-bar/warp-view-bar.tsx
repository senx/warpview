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

import Chart from "chart.js";
import {Component, Element, Listen, Prop, Watch} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";
import {ChartLib} from "../../utils/chart-lib";
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {ColorLib} from "../../utils/color-lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";
import moment from "moment";
import deepEqual from "deep-equal";

@Component({
  tag: "warp-view-bar",
  styleUrl: "warp-view-bar.scss",
  shadow: true
})
export class WarpViewBar {
  @Prop() unit: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | DataModel[] | GTS[] | string;
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
  private _chart: any;
  private _mapIndex = {};
  private resizeTimer;
  private parentWidth = -1;
  private canvas: HTMLCanvasElement;
  private parentHeight = -1;


  @Listen('window:resize')
  onResize() {
    if (this.el.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0 || this.el.parentElement.clientHeight !== this.parentHeight) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.parentWidth = this.el.parentElement.clientWidth;
        this.parentHeight = this.el.parentElement.clientHeight;
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
  private onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    this.LOG.debug(['data'], newValue);
    this.drawChart();
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  private buildGraph() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    let gts = this.gtsToData(this.data);
    if (!gts) {
      return;
    }
    const color = this._options.gridLineColor;
    const graphOpts: any = {
      legend: {
        display: this.showLegend
      },
      animation: {
        duration: 0,
      },
      tooltips: {
        mode: 'index',
        position: 'nearest'
      },
      scales: {
        xAxes: [{
          type: "time",
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
      responsive: this.responsive,
      maintainAspectRatio: false
    };
    if (this._options.timeMode === 'timestamp') {
      graphOpts.scales.xAxes[0].time = undefined;
      graphOpts.scales.xAxes[0].type = 'linear';
      graphOpts.scales.xAxes[0].ticks = {
        fontColor: color,
      };
    } else {
      graphOpts.scales.xAxes[0].time = {
        displayFormats: {
          millisecond: 'HH:mm:ss.SSS',
          second: 'HH:mm:ss',
          minute: 'HH:mm',
          hour: 'HH'
        }
      };
      graphOpts.scales.xAxes[0].ticks = {
        fontColor: color
      };
      graphOpts.scales.xAxes[0].type = 'time';
    }
    if (this._chart) {
      this._chart.destroy();
    }
    this._chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: gts.ticks,
        datasets: gts.datasets
      },
      options: graphOpts
    });
    this.onResize();
    setTimeout(() => {
      this._chart.update();
    }, 250);
  }

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    if (!this.data) return;
    this.buildGraph();
  }

  private gtsToData(gts) {
    this.LOG.debug(['gtsToData'], gts);
    let datasets = [];
    let ticks = [];
    let pos = 0;
    let dataList: any[];
    if (typeof gts === 'string') {
      gts = JSON.parse(this.data as string);
    }
    if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
      gts = gts[0];
    }
    if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
      dataList = gts.data as any[];
      this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
    } else {
      dataList = gts;
    }
    if (!dataList || dataList.length === 0) {
      return;
    } else {
      dataList = GTSLib.flatDeep(dataList);
      let i = 0;
      let timestampdivider: number = 1000; //default for µs timeunit
      if (this._options.timeUnit && this._options.timeUnit === 'ms') {
        timestampdivider = 1;
      }
      if (this._options.timeUnit && this._options.timeUnit === 'ns') {
        timestampdivider = 1000000;
      }
      dataList.forEach(g => {
        let data = [];
        if (g.v) {
          GTSLib.gtsSort(g);
          g.v.forEach(d => {
            if (this._options.timeMode === 'timestamp') {
              ticks.push(d[0]);
            } else {
              ticks.push(moment.utc(d[0] / timestampdivider));
            }
            data.push(d[d.length - 1]);
          });
          let color = ColorLib.getColor(pos);
          let label = GTSLib.serializeGtsMetadata(g);
          this._mapIndex[label] = pos;
          let ds = {
            label: label,
            data: data,
            borderColor: color,
            borderWidth: 1,
            backgroundColor: ColorLib.transparentize(color)
          };
          datasets.push(ds);
          pos++;
          i++;
        }
      });
    }
    this.LOG.debug(['gtsToData', 'datasets'], datasets);
    return {datasets: datasets, ticks: GTSLib.unique(ticks).sort((a, b) => a > b ? 1 : a === b ? 0 : -1)};
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewBar, this.debug);
  }

  componentDidLoad() {
    this.drawChart();
    ChartLib.resizeWatchTimer(this.el,this.onResize.bind(this));
  }

  render() {
    return <div>
      <div class="chart-container">  
        <canvas ref={el => this.canvas = el} width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
