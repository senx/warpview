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
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";
import {Logger} from "../../utils/logger";
import {GTSLib} from "../../utils/gts.lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";
import moment from "moment";
import deepEqual from "deep-equal";

@Component({
  tag: 'warp-view-scatter',
  styleUrl: 'warp-view-scatter.scss',
  shadow: true
})
export class WarpViewScatter {
  @Prop() unit: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | GTS[] | string;
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';
  @Prop() debug = false;

  @Element() el: HTMLElement;

  private LOG: Logger;
  private _options: Param = {
    gridLineColor: '#8e8e8e'
  };
  private _chart: Chart;
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');
  private resizeTimer;
  private parentWidth = -1;
  private canvas: HTMLCanvasElement;
  private parentHeight = -1;


  @Listen('window:resize')
  onResize() {
    if (this.el.parentElement.getBoundingClientRect().width !== this.parentWidth || this.parentWidth <= 0 || this.el.parentElement.getBoundingClientRect().height !== this.parentHeight) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.parentWidth = this.el.parentElement.getBoundingClientRect().width;
        this.parentHeight = this.el.parentElement.getBoundingClientRect().height;
        if (this.el.parentElement.getBoundingClientRect().width > 0) {
          this.LOG.debug(['onResize'], this.el.parentElement.getBoundingClientRect().width);
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

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    let dataList: any[];
    let data: any = this.data;
    if (!data) return;
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
    let gts = this.gtsToScatter(dataList);
    this.height = (this.responsive ? this.el.parentElement.getBoundingClientRect().height : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.getBoundingClientRect().width : this.width || 800) + '';
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
      maintainAspectRatio: false
    };
    if (this._options.timeMode === 'timestamp') {
      options.scales.xAxes[0].time = undefined;
      options.scales.xAxes[0].type = 'linear';
      options.scales.xAxes[0].ticks = {
        fontColor: color,
      };
    } else {
      options.scales.xAxes[0].time = {
        displayFormats: {
          millisecond: 'HH:mm:ss.SSS',
          second: 'HH:mm:ss',
          minute: 'HH:mm',
          hour: 'HH'
        }
      };
      options.scales.xAxes[0].ticks = {
        fontColor: color
      };
      options.scales.xAxes[0].type = 'time';
    }
    if (this._chart) {
      this._chart.destroy();
    }
    this._chart = new Chart.Scatter(this.canvas, {data: {datasets: gts}, options: options});
    this.onResize();    
    setTimeout(() => {
      this._chart.update();
    }, 250);
    this.LOG.debug(['gtsToScatter', 'chart'], [gts, options]);
  }

  private gtsToScatter(gts) {
    if (!gts) {
      return;
    }
    this.LOG.debug(['gtsToScatter'], gts);
    let datasets = [];
    let timestampdivider: number = 1000; //default for µs timeunit
    if (this._options.timeUnit && this._options.timeUnit === 'ms') {
      timestampdivider = 1;
    }
    if (this._options.timeUnit && this._options.timeUnit === 'ns') {
      timestampdivider = 1000000;
    }
    for (let i = 0; i < gts.length; i++) {
      let g = gts[i];
      let data = [];
      g.v.forEach(d => {
        if (this._options.timeMode === 'timestamp') {
          data.push({x: d[0], y: d[d.length - 1]});
        } else {
          data.push({x: moment.utc(d[0] / timestampdivider), y: d[d.length - 1]});
        }
      });
      datasets.push({
        label: GTSLib.serializeGtsMetadata(g),
        data: data,
        pointRadius: 2,
        borderColor: ColorLib.getColor(i),
        backgroundColor: ColorLib.transparentize(ColorLib.getColor(i))
      });
    }
    this.LOG.debug(['gtsToScatter', 'datasets'], datasets);
    return datasets;
  }


  componentWillLoad() {
    this.LOG = new Logger(WarpViewScatter, this.debug);
  }

  componentDidLoad() {
    this.drawChart()
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
