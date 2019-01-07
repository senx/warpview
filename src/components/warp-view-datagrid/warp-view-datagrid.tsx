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

import {Component, Element, Prop, State, Watch} from "@stencil/core";
import {DataModel} from "../../model/dataModel";
import {Param} from "../../model/param";
import {Logger} from "../../utils/logger";
import {ChartLib} from "../../utils/chart-lib";
import {GTSLib} from "../../utils/gts.lib";

@Component({
  tag: 'warp-view-datagrid',
  styleUrl: 'warp-view-datagrid.scss',
  shadow: true
})

export class WarpViewDatagrid {
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: DataModel | any[] | string;
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';
  @Prop() elemsCount = 15;
  @Prop() debug = false;

  @Element() el: HTMLElement;

  @State() page = 0;

  private LOG: Logger;
  private _options: Param = {
    timeMode: 'date'
  };

  @State() _data: { name: string, values: any[], headers: string[] }[] = [];

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

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.LOG.debug(['drawChart', '_options'], this._options);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
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
    this._data = this.parseData(GTSLib.flatDeep(dataList));
    this.LOG.debug(['drawChart', '_data'], this._data);
  }

  private getHeaderParam(i: number, j: number, key: string, def: string): string {
    return this.data['params'] && this.data['params'][i] && this.data['params'][i][key] && this.data['params'][i][key][j]
      ? this.data['params'][i][key][j]
      : this.data['globalParams'] && this.data['globalParams'][key] && this.data['globalParams'][key][j]
        ? this.data['globalParams'][key][j]
        : def;
  }

  private parseData(data: any[]): { name: string, values: any[], headers: string[] }[] {
    const flatData: { name: string, values: any[], headers: string[] }[] = [];
    this.LOG.debug(['parseData'], data);

    data.forEach((d, i) => {
      let dataSet: { name: string, values: any[], headers: string[] } =   {
        name: '',
        values: [],
        headers: []
      };
      if (GTSLib.isGts(d)) {
        this.LOG.debug(['parseData', 'isGts'], d);
        dataSet.name=  GTSLib.serializeGtsMetadata(d);
        dataSet.values =d.v;
      } else {
        this.LOG.debug(['parseData', 'is not a Gts'], d);
        dataSet.values = GTSLib.isArray(d) ? d : [d];
      }
      dataSet.headers = [this.getHeaderParam(i, 0, 'headers', 'Date')];
      if (d.v.length > 0 && d.v[0].length > 2) {
        dataSet.headers.push(this.getHeaderParam(i, 1, 'headers', 'Latitude'));
      }
      if (d.v.length > 0 && d.v[0].length > 3) {
        dataSet.headers.push(this.getHeaderParam(i, 2, 'headers', 'Longitude'));
      }
      if (d.v.length > 0 && d.v[0].length > 4) {
        dataSet.headers.push(this.getHeaderParam(i, 3, 'headers', 'Elevation'));
      }
      dataSet.headers.push(this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
      flatData.push(dataSet);
    });
    this.LOG.debug(['parseData', 'flatData'], flatData);
    return flatData;
  }


  componentWillLoad() {
    this.LOG = new Logger(WarpViewDatagrid, this.debug);
    this.drawChart();
  }

  render() {
    // noinspection CheckTagEmptyBody
    return <div class="wrapper">
      {this._data.map((data) =>
        <warp-view-paginable data={data} options={this._options} debug={this.debug}></warp-view-paginable>
      )}
    </div>;
  }
}
