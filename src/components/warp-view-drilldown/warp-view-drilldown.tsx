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

import {Component, Element, Listen, Prop, Watch} from "@stencil/core";
import {ChartLib} from "../../utils/chart-lib";
import {DataModel} from "../../model/dataModel";
import {Param} from "../../model/param";
import {Logger} from "../../utils/logger";
import {GTSLib} from "../../utils/gts.lib";
import moment from "moment";
import {ColorLib} from "../../utils/color-lib";
import deepEqual from "deep-equal";

/**
 *
 */
@Component({
  tag: 'warp-view-drilldown',
  styleUrl: 'warp-view-drilldown.scss',
  shadow: true
})
export class WarpViewDrillDown {
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | any[] | string;
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';
  @Prop() debug = false;

  @Element() el: HTMLElement;

  private LOG: Logger;
  private _options: Param = {
    gridLineColor: '#8e8e8e',
    timeZone: 'UTC',
    timeUnit: 'us'
  };
  private resizeTimer;
  private parentWidth = -1;
  private heatMapData: any;

  @Listen('window:resize')
  onResize() {
    if (this.el.parentElement.getBoundingClientRect().width !== this.parentWidth || this.parentWidth <= 0) {
      this.parentWidth = this.el.parentElement.getBoundingClientRect().width;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
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
  private onData(newValue: DataModel | any[]) {
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
    this.height = (this.responsive ? this.el.parentElement.getBoundingClientRect().height : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.getBoundingClientRect().width : this.width || 800) + '';
    if (!this.data) return;
    let data: any = this.data;
    if (typeof data === 'string') {
      data = JSON.parse(data as string);
    }
    if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
      data = data[0];
    }
    let dataList: any[];
    if (data instanceof DataModel || data.hasOwnProperty('data')) {
      dataList = data.data as any[];
    } else {
      dataList = data;
    }
    this.heatMapData = this.parseData(GTSLib.flatDeep(dataList));
  }


  private parseData(dataList: any[]) {
    const details = [];
    let values = [];
    const dates = [];
    const data = {};
    const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue);
    this.LOG.debug(['parseData'], dataList);
    dataList.forEach((gts, i) => {
      const name = GTSLib.serializeGtsMetadata(gts);
      gts.v.forEach(v => {
        const refDate = moment.utc(v[0] / 1000).startOf('day').toISOString();
        if (!data[refDate]) {
          data[refDate] = [];
        }
        if (!values[refDate]) {
          values[refDate] = [];
        }
        dates.push(v[0] / 1000);
        values[refDate].push(v[v.length - 1]);
        data[refDate].push({
          name: name,
          date: v[0] / 1000,
          value: v[v.length - 1],
          color: ColorLib.getColor(i),
          id: i
        });
      });
    });
    Object.keys(data).forEach((d: string) => {
      details.push({
        date: moment.utc(d),
        total: values[d].reduce(reducer),
        details: data[d],
        summary: []
      })
    });
    return details;
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewDrillDown, this.debug);
  }

  componentDidLoad() {
    this.drawChart()
  }

  render() {
    // noinspection CheckTagEmptyBody
    return <div class="wrapper">
      <calendar-heatmap data={this.heatMapData} overview={'global'}
                        debug={this.debug}
                        minColor={this._options.minColor}
                        maxColor={this._options.maxColor}></calendar-heatmap>
    </div>;
  }

}
