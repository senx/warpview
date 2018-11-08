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
import {Component, Element, Event, EventEmitter, Listen, Prop, Watch} from '@stencil/core';
import {GTSLib} from '../../utils/gts.lib';
import {ColorLib} from "../../utils/color-lib";
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";
import moment from "moment";

@Component({
  tag: "warp-view-annotation",
  styleUrl: "warp-view-annotation.scss",
  shadow: true
})
export class WarpViewAnnotation {
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | GTS[];
  @Prop() options: Param = new Param();
  @Prop() hiddenData: string[] = [];
  @Prop() timeMin: number;
  @Prop() timeMax: number;
  @Prop({mutable: true}) width = "";
  @Prop({mutable: true}) height = "";

  @Event() pointHover: EventEmitter;

  @Element() el: HTMLElement;

  private legendOffset = 70;
  private _chart: Chart;
  private _mapIndex = {};
  private LOG: Logger = new Logger(WarpViewAnnotation);
  private _options: Param = {
    gridLineColor: '#000000',
    timeMode: 'date'
  };
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');
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

  @Watch("options")
  changeScale(newValue: Param, oldValue: Param) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  @Watch("hiddenData")
  hideData(newValue, oldValue) {
    if (oldValue !== newValue && this._chart) {
      this.LOG.debug(['hiddenData'], newValue);
      const hiddenData = GTSLib.cleanArray(newValue);
      Object.keys(this._mapIndex).forEach(key => {
        this._chart.getDatasetMeta(this._mapIndex[key]).hidden = !!hiddenData.find(item => item === key);
      });
      this._chart.update();
    }
  }

  @Watch("timeMin")
  minBoundChange(newValue: number, oldValue: number) {
    if (this._chart) {
      this._chart.options.animation.duration = 0;
      if (oldValue !== newValue && this._chart.options.scales.xAxes[0].time) {
        this._chart.options.scales.xAxes[0].time.min = newValue;
        this.LOG.debug(['minBoundChange'], this._chart.options.scales.xAxes[0].time.min);
        this._chart.update();
      }
    }
  }

  @Watch("timeMax")
  maxBoundChange(newValue: number, oldValue: number) {
    if (this._chart) {
      this._chart.options.animation.duration = 0;
      if (oldValue !== newValue && this._chart.options.scales.xAxes[0].time) {
        this._chart.options.scales.xAxes[0].time.max = newValue;
        this.LOG.debug(['maxBoundChange'], this._chart.options.scales.xAxes[0].time.max);
        this._chart.update();
      }
    }
  }

  /**
   *
   */
  private drawChart() {
    if (!this.data) {
      return;
    }
    this._options.timeMode = 'date';
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.LOG.debug(['drawChart', 'hiddenData'], this.hiddenData);
    let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
    let gts = this.parseData(this.data);
    let calculatedHeight = 30 * gts.length + this.legendOffset;
    let height =
      this.height || this.height !== ''
        ? Math.max(calculatedHeight, parseInt(this.height))
        : calculatedHeight;
    this.height = height.toString();
    (ctx as HTMLElement).parentElement.style.height = height + 'px';
    (ctx as HTMLElement).parentElement.style.width = '100%';
    const color = this._options.gridLineColor;
    const me = this;
    const chartOption = {
      layout: {
        padding: {
          bottom: Math.max(30, 30 * gts.length)
        }
      },
      legend: {display: this.showLegend},
      responsive: this.responsive,
      animation: {
        duration: 0,
      },
      tooltips: {
        mode: "x",
        position: "nearest",
        custom: function (tooltip) {
          if (tooltip.opacity > 0) {
            me.pointHover.emit({
              x: tooltip.dataPoints[0].x,
              y: this._eventPosition.y
            });
          } else {
            me.pointHover.emit({x: -100, y: this._eventPosition.y});
          }
          return;
        },
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].xLabel || "";
          },
          label: (tooltipItem, data) => {
            return `${data.datasets[tooltipItem.datasetIndex].label}: ${
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                .val
              }`;
          }
        }
      },
      scales: {
        xAxes: [
          {
            drawTicks: false,
            type: "linear",
            time: {},
            gridLines: {
              zeroLineColor: color,
              color: color,
              display: false
            },
            ticks: {}
          }
        ],
        yAxes: [
          {
            display: false,
            drawTicks: false,
            scaleLabel: {
              display: false
            },
            afterFit: function (scaleInstance) {
              scaleInstance.width = 100; // sets the width to 100px
            },
            gridLines: {
              color: color,
              zeroLineColor: color,
            },
            ticks: {
              fontColor: color,
              min: 0,
              max: 1,
              beginAtZero: true,
              stepSize: 1
            }
          }
        ]
      }
    };
    this.LOG.debug(['options'], this._options);

    if (this._options.timeMode === 'timestamp') {
      chartOption.scales.xAxes[0].time = undefined;
      chartOption.scales.xAxes[0].type = 'linear';
      chartOption.scales.xAxes[0].ticks = {
        fontColor: color,
        min: this.timeMin,
        max: this.timeMax,
      };
    } else {
      chartOption.scales.xAxes[0].time = {
        min: this.timeMin,
        max: this.timeMax,
        displayFormats: {
          millisecond: 'HH:mm:ss.SSS',
          second: 'HH:mm:ss',
          minute: 'HH:mm',
          hour: 'HH'
        }
      };
      chartOption.scales.xAxes[0].ticks = {
        fontColor: color
      };
      chartOption.scales.xAxes[0].type = 'time';
    }
    this.LOG.debug(['drawChart'], [height, gts]);
    if (this._chart) {
      this._chart.destroy();
    }
    if (!gts || gts.length === 0) {
      return;
    }
    this._chart = new Chart.Scatter(ctx, {
        data: {
          datasets: gts
        },
        options: chartOption
      }
    );
    Object.keys(this._mapIndex).forEach(key => {
      this._chart.getDatasetMeta(this._mapIndex[key]).hidden = !!this.hiddenData.find(item => item === key);
    });
    this._chart.update();
    this.onResize();
  }

  /**
   *
   * @param gts
   * @returns {any[]}
   */
  private parseData(gts) {
    this.LOG.debug(['parseData'], gts);
    let dataList = GTSLib.getData(gts).data;
    this.LOG.debug(['parseData', 'dataList'], dataList);
    if (!dataList || dataList.length === 0) {
      return [];
    } else {
      let datasets = [];
      let pos = 0;
      dataList = GTSLib.flatDeep(dataList as any[]) as any[];
      dataList.forEach((g, i) => {
        if (GTSLib.isGtsToAnnotate(g)) {
          let data = [];
          let color = ColorLib.getColor(i);
          const myImage = ChartLib.buildImage(1, 30, color);
          g.v.forEach(d => {
            let time = d[0];
            if (this._options.timeMode !== 'timestamp') {
              time = moment(time / 1000).utc(true).valueOf();
            }
            data.push({x: time, y: 0.5, val: d[d.length - 1]});
          });
          let label = GTSLib.serializeGtsMetadata(g);
          this._mapIndex[label] = pos;
          datasets.push({
            label: label,
            data: data,
            pointRadius: 5,
            pointHoverRadius: 5,
            pointHitRadius: 5,
            pointStyle: myImage,
            borderColor: color,
            backgroundColor: ColorLib.transparentize(color, 0.5)
          });
          pos++;
        }
      });
      return datasets;
    }
  }

  componentDidLoad() {
    this.drawChart();
  }

  render() {
    return <div>
      <div
        class="chart-container"
        style={{
          position: "relative",
          width: this.width,
          height: this.height
        }}
      >
        <canvas id={this.uuid} width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
