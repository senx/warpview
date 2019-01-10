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
import {Component, Element, Event, EventEmitter, Listen, Prop, State, Watch} from '@stencil/core';
import {GTSLib} from '../../utils/gts.lib';
import {ColorLib} from "../../utils/color-lib";
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";
import moment from "moment-timezone";

/**
 * @prop --warp-view-chart-width: Fixed width if not responsive
 * @prop --warp-view-chart-height: Fixed height if not responsive
 */
@Component({
  tag: "warp-view-annotation",
  styleUrl: "warp-view-annotation.scss",
  shadow: true
})
export class WarpViewAnnotation {
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | DataModel[] | GTS[] | string;
  @Prop() options: Param = new Param();
  @Prop() hiddenData: number[] = [];
  @Prop() timeMin: number;
  @Prop() timeMax: number;
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';
  @Prop() standalone = true;
  @Prop() debug = false;

  @State() displayExpander = true;

  @Event() pointHover: EventEmitter;

  @Element() el: HTMLElement;

  private _chart: Chart;
  private _mapIndex = {};
  private LOG: Logger;
  private _options: Param = {
    gridLineColor: '#000000',
    timeMode: 'date'
  };
  private canvas: HTMLCanvasElement;
  private tooltip: HTMLDivElement;
  private date: HTMLDivElement;
  private resizeTimer;
  private parentWidth = -1;
  private _height = '0';
  private expanded = false;

  @Listen('window:resize')
  onResize() {
    if (this.el.parentElement.clientWidth !== this.parentWidth) {
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
  onOptions(newValue: Param, oldValue: Param) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], [newValue, this.hiddenData]);
      if (this._chart) {
        this._chart.update();
        this.drawChart();
      }
    }
  }

  @Watch("hiddenData")
  hideData(newValue, oldValue) {
    if (oldValue !== newValue && this._chart) {
      this.LOG.debug(['hiddenData'], newValue);
      const hiddenData = newValue;
      if (this._chart) {
        Object.keys(this._mapIndex).forEach(key => {
          const hidden = hiddenData.indexOf(parseInt(key)) >= 0;
          this.LOG.debug(['hiddenDataHidden'], [key, hidden, this._chart.getDatasetMeta(this._mapIndex[key])]);
        });
        this.drawChart();
        this._chart.update();
      }
    }
  }

  @Watch("timeMin")
  minBoundChange(newValue: number, oldValue: number) {
    if (this._chart) {
      this._chart.options.animation.duration = 0;
      if (oldValue !== newValue && this._chart.options.scales.xAxes[0].time) {
        if (this._options.timeMode === 'timestamp') {
          this._chart.options.scales.xAxes[0].ticks.min = newValue;
        } else {
          if (newValue == 0 && !this.standalone) {
            newValue = 1;
          } //clunky hack for issue #22
          this._chart.options.scales.xAxes[0].time.min = newValue;
        }
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
        if (this._options.timeMode === 'timestamp') {
          this._chart.options.scales.xAxes[0].ticks.max = newValue;
        } else {
          if (newValue == 0 && !this.standalone) {
            newValue = 1;
          } //clunky hack for issue #22
          this._chart.options.scales.xAxes[0].time.max = newValue;
        }
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
    moment.tz.setDefault("UTC");    //force X axis display in UTC
    this._options.timeMode = 'date';
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.LOG.debug(['drawChart', 'hiddenData'], this.hiddenData);
    let gts = this.parseData(this.data);

    if (!gts || gts.length === 0) {
      return;
    }

    let calculatedHeight = (this.expanded ? 30 * gts.length : 30);
    let height = this.height
    || this.height !== ''
      ? Math.max(calculatedHeight, parseInt(this.height))
      : calculatedHeight;
    this._height = height.toString();
    this.LOG.debug(['drawChart', 'height'], height, gts.length, calculatedHeight);
    this.canvas.parentElement.style.height = height + 'px';
    this.canvas.parentElement.style.width = '100%';
    const color = this._options.gridLineColor;
    const me = this;
    const chartOption = {
      layout: {
        padding: {
          right: 26 //fine tuning, depends on chart element
        }
      },
      legend: {display: this.showLegend},
      responsive: this.responsive,
      animation: {
        duration: 0,
      },
      tooltips: {
        enabled: false,
        custom: function (tooltipModel) {
          const layout = me.canvas.getBoundingClientRect();
          if (tooltipModel.opacity === 0) {
            me.tooltip.style.opacity = '0';
            me.date.innerHTML = '';
            return;
          }
          if (tooltipModel.dataPoints && tooltipModel.dataPoints[0]) {
            me.pointHover.emit({
              x: tooltipModel.dataPoints[0].x,
              y: this._eventPosition.y
            });
            me.LOG.debug(['bar'], {
              x: tooltipModel.dataPoints[0].x,
              y: this._eventPosition.y
            })
          } else {
            me.pointHover.emit({x: -100, y: this._eventPosition.y});
          }
          me.tooltip.style.opacity = '1';
          me.tooltip.style.top = (tooltipModel.caretY - 14 + 20) + 'px';
          me.tooltip.classList.remove('right', 'left');
          if (tooltipModel.body) {
            me.date.innerHTML = tooltipModel.title || '';
            const label = tooltipModel.body[0].lines[0].split('}:');
            me.tooltip.innerHTML = `<div class="tooltip-body">
  <span>${GTSLib.formatLabel(label[0] + '}')}: </span>
  <span class="value">${label[1]}</span>
</div>`;
          }
          if (tooltipModel.caretX > layout.width / 2) {
            me.tooltip.classList.add('left');
          } else {
            me.tooltip.classList.add('right');
          }
          me.tooltip.style.pointerEvents = 'none';
          return;
        },
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].xLabel || '';
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
            display: this.standalone,
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
            display: true,
            drawTicks: false,
            scaleLabel: {
              display: false
            },
            afterFit: (scaleInstance) => {
              scaleInstance.width = 100; // sets the width to 100px
            },
            gridLines: {
              color: color,
              zeroLineColor: color,
              drawBorder: false
            },
            ticks: {
              display: false,
              min: -0.05,
              max: 1,
              beginAtZero: false,
              stepSize: 1,
              offsetGridLines: true
            }
          }
        ]
      }
    };
    this.LOG.debug(['options'], this._options);
    if (this.expanded) {
      chartOption.scales.yAxes[0].ticks.max = gts.length;
    }

    if (this._options.timeMode === 'timestamp') {
      chartOption.scales.xAxes[0].time = {};
      chartOption.scales.xAxes[0].type = 'linear';
      chartOption.scales.xAxes[0].ticks = {
        fontColor: color,
        min: this.timeMin,
        max: this.timeMax,
        maxRotation: 0,
        minRotation: 0
      };
    } else {
      let tmin: number = (this.timeMin == 0 && !this.standalone) ? 1 : this.timeMin; //clunky hack for issue #22
      let tmax: number = (this.timeMax == 0 && !this.standalone) ? 1 : this.timeMax; //clunky hack for issue #22. introduce a 1millisecond error.
      chartOption.scales.xAxes[0].time = {
        min: tmin,
        max: tmax,
        displayFormats: {
          millisecond: 'HH:mm:ss.SSS',
          second: 'HH:mm:ss',
          minute: 'HH:mm',
          hour: 'HH',
          maxRotation: 0,
          minRotation: 0
        }
      };
      chartOption.scales.xAxes[0].ticks = {
        fontColor: color
      };
      chartOption.scales.xAxes[0].type = 'time';
    }
    this.LOG.debug(['drawChart', 'about to render'], [chartOption, gts]);
    if (this._chart) {
      this._chart.destroy();
    }
    this._chart = new Chart.Scatter(this.canvas, {data: {datasets: gts}, options: chartOption});
    this.onResize(); //TODO : this call drawchart too. infinite loop ?!
    this._chart.update();
    // not needed if managed in dataset. will be needed later when optimizing the parseData calls.
    // Object.keys(this._mapIndex).forEach(key => {
    //   this.LOG.debug(['drawChart', 'hide'], [key]);
    //   this._chart.getDatasetMeta(this._mapIndex[key]).hidden = !!this.hiddenData.find(item => item + '' === key);
    // });
  }

  /**
   *
   * @param gts
   * @returns {any[]}
   */
  private parseData(gts) {
    this.LOG.debug(['parseData'], gts);
    let dataList = GTSLib.getData(gts).data;
    this._mapIndex = {};
    if (!dataList || dataList.length === 0) {
      return [];
    } else {
      let dataSet = [];
      dataList = GTSLib.flattenGtsIdArray(dataList as any[], 0).res;
      dataList = GTSLib.flatDeep(dataList) as any[];
      this.LOG.debug(['parseData', 'dataList'], dataList);
      let i = 0;
      dataList = dataList.filter(g => {
        return (g.v && GTSLib.isGtsToAnnotate(g));
      });
      dataList.forEach(g => {
        this.LOG.debug(['parseData', 'will draw'], g);
        let data = [];
        let color = ColorLib.getColor(g.id);
        const myImage = ChartLib.buildImage(1, 30, color);
        g.v.forEach(d => {
          let time = d[0];
          if (this._options.timeMode !== 'timestamp') {
            time = moment(time / GTSLib.getDivider(this._options.timeUnit)).utc(true).valueOf();
          }
          data.push({x: time, y: (this.expanded ? dataList.length - 1 - i : 0) + 0.5, val: d[d.length - 1]});
        });
        let label = GTSLib.serializeGtsMetadata(g);
        this._mapIndex[g.id + ''] = i;
        dataSet.push({
          label: label,
          data: data,
          pointRadius: 5,
          pointHoverRadius: 5,
          pointHitRadius: 5,
          pointStyle: myImage,
          borderColor: color,
          backgroundColor: ColorLib.transparentize(color),
          hidden: this.hiddenData.indexOf(g.id) >= 0
        });
        i++;
      });
      return dataSet;
    }
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewAnnotation, this.debug);
  }

  componentDidLoad() {
    this.drawChart();
  }

  render() {
    return <div>
      <div class="date" ref={(el) => this.date = el as HTMLDivElement}/>
      {this.displayExpander
        ? <button class={'expander'} onClick={() => this.toggle()} title="collapse/expand">+/-</button>
        : ''
      }
      <div
        class="chart-container"
        style={{
          position: "relative",
          width: this.width,
          height: this._height
        }}
      >
        <canvas ref={(el) => this.canvas = el as HTMLCanvasElement} width={this.width} height={this._height}/>
      </div>
      <div class="tooltip" ref={(el) => this.tooltip = el as HTMLDivElement}/>
    </div>;
  }

  private toggle() {
    this.expanded = !this.expanded;
    this.drawChart();
  }
}
