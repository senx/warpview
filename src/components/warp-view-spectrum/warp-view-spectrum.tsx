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

import { Component, Element, Listen, Prop, Watch } from "@stencil/core";
import { ChartLib } from "../../utils/chart-lib";
import { HeatMap } from '@syncfusion/ej2-heatmap';
import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
import { Logger } from "../../utils/logger";
import { GTSLib } from "../../utils/gts.lib";
import moment from "moment";

/**
 *
 */
export class WarpViewSpectrumParam {
  range: string = 'd';
  granularity: string = '10 m';
  scale: number = 24;
  interval: 6
}


@Component({
  tag: 'warp-view-spectrum',
  styleUrl: 'warp-view-spectrum.scss',
  shadow: true
})
export class WarpViewSpectrum {
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | any[] | string;
  @Prop() options: Param = new Param();
  @Prop({ mutable: true }) width = '';
  @Prop({ mutable: true }) height = '';

  @Element() el: HTMLElement;

  private uuid = 'spectrum-' + ChartLib.guid().split('-').join('');
  private LOG: Logger = new Logger(WarpViewSpectrum);
  private _options: Param = {
    gridLineColor: '#8e8e8e',
    spectrum: new WarpViewSpectrumParam()
  };
  private _chart: HeatMap;
  private resizeTimer;
  private parentWidth = -1;

  @Listen('window:resize')
  onResize() {
    if(this.el.parentElement.clientWidth !== this.parentWidth) {
      this.parentWidth = this.el.parentElement.clientWidth;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.LOG.debug([ 'onResize' ], this.el.parentElement.clientWidth);
        this.drawChart();
      }, 250);
    }
  }

  @Watch('data')
  private onData(newValue: DataModel | any[], oldValue: DataModel | any[]) {
    if(oldValue !== newValue) {
      this.LOG.debug([ 'data' ], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if(oldValue !== newValue) {
      this.LOG.debug([ 'options' ], newValue);
      this.drawChart();
    }
  }

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    let ctx = this.el.shadowRoot.querySelector('#' + this.uuid) as HTMLElement;
    document.getElementById = (id:string) => {
      return this.el.shadowRoot.querySelector('#' + id) as HTMLElement;
    };
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
    const color = this._options.gridLineColor;
    if(!this.data) return;

    let data: any = this.data;
    if(typeof data === 'string') {
      data = JSON.parse(data as string);
    }

    if(GTSLib.isArray(data) && data[ 0 ] && (data[ 0 ] instanceof DataModel || data[ 0 ].hasOwnProperty('data'))) {
      data = data[ 0 ];
    }
    let dataList: any[];
    if(data instanceof DataModel || data.hasOwnProperty('data')) {
      dataList = data.data as any[];
    } else {
      dataList = data;
    }
    if(!this._chart) {
      this._chart = new HeatMap({
        yAxis: { labels: this.formatAxis(dataList), isInversed: true },
        xAxis: {
          increment: 1,
          interval: this._options.spectrum.interval,
          minimum: 0,
          maximum: (this._options.spectrum.scale - 1) * this._options.spectrum.interval,
          labels: WarpViewSpectrum.buildLabels()
        },
        renderingMode: 'Canvas',
        dataSource: dataList,
        paletteSettings: {
          emptyPointColor: 'transparent',
          palette: [
            { color: 'rgb(255,0,255)' },
            { color: 'rgb(0,0,255)' },
            { color: 'rgb(0,255,0)' },
            { color: 'rgb(255,255,0)' },
            { color: 'rgb(255,0,0)' },
          ],
          type: 'Gradient'
        },
        legendSettings: {
          visible: true,
          position: 'Bottom',
          width: '75%',
          enableSmartLegend: true
        },
        showTooltip: false,
        cellSettings: {
          border: {
            width: 0
          },
          showLabel: false,
        },
      });

      this._chart.appendTo(ctx);
    } else {
      this._chart.dataSource =dataList;
    }
  }

  static buildLabels() {
    const r = [];
    for(let i = 0; i < 24 * 6; i++) {
      const j = i / 6;
      if(j - Math.floor(j) === 0) {
        if(j < 10) {
          r.push('0' + j + ':00');
        } else {
          r.push(j + ':00');
        }
      } else {
        r.push('');
      }
    }
    return r;
  }

  formatAxis(labels: string[]) {
    const formatedLabels = [];
    labels.forEach(timestamp => {
      const ts = Math.floor(parseInt(timestamp) / 1000);
      formatedLabels.push(moment.utc(ts).format("D MMM YYYY"));
    });
    return formatedLabels
  }

  componentDidLoad() {
    this.drawChart()
  }

  render() {
    return <div class="wrapper">
      <div id={this.uuid}></div>
    </div>;
  }

  private parseData(dataList: any[]) {


  }
}
