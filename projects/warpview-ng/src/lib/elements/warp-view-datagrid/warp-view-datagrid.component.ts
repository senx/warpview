/*
 *  Copyright 2020  SenX S.A.S.
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

import {Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {GTSLib} from '../../utils/gts.lib';
import {DataModel} from '../../model/dataModel';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import moment from 'moment-timezone';

@Component({
  selector: 'warpview-datagrid',
  templateUrl: './warp-view-datagrid.component.html',
  styleUrls: ['./warp-view-datagrid.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewDatagridComponent extends WarpViewComponent implements OnInit {


  @Input('elemsCount') elemsCount = 15;

  // tslint:disable-next-line:variable-name
  _tabularData: { name: string, values: any[], headers: string[] }[] = [];

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
  ) {
    super(el, renderer, sizeService);
    this.LOG = new Logger(WarpViewDatagridComponent, this._debug);
  }

  ngOnInit() {
    this.drawChart();
  }

  update(options: Param): void {
    this.drawChart();
  }

  private drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
  }

  private getHeaderParam(i: number, j: number, key: string, def: string): string {
    return this._data.params && this._data.params[i] && this._data.params[i][key] && this._data.params[i][key][j]
      ? this._data.params[i][key][j]
      : this._data.globalParams && this._data.globalParams[key] && this._data.globalParams[key][j]
        ? this._data.globalParams[key][j]
        : def;
  }

  protected convert(data: DataModel): any[] {
    if (GTSLib.isArray(data.data)) {
      if (data.data.length > 0 && GTSLib.isGts(data.data[0])) {
        this._tabularData = this.parseData(GTSLib.flatDeep(this._data.data as any[]));
      } else {
        this._tabularData = this.parseCustomData(data.data as any[]);
      }
    } else {
      this._tabularData = this.parseCustomData([data.data as any]);
    }
    return [];
  }

  private parseCustomData(data: any[]): { name: string, values: any[], headers: string[] }[] {
    const flatData: { name: string, values: any[], headers: string[] }[] = [];
    data.forEach((d, i) => {
      const dataSet: { name: string, values: any[], headers: string[] } = {
        name: d.title || '',
        values: d.rows,
        headers: ['Name'].concat(d.columns),
      };
      flatData.push(dataSet);
    });
    this.LOG.debug(['parseCustomData', 'flatData'], flatData);
    return flatData;
  }

  protected parseData(data: any[]): { name: string, values: any[], headers: string[] }[] {
    const flatData: { name: string, values: any[], headers: string[] }[] = [];
    this.LOG.debug(['parseData'], data);
    data.forEach((d, i) => {
      const dataSet: { name: string, values: any[], headers: string[] } = {
        name: '',
        values: [],
        headers: []
      };
      if (GTSLib.isGts(d)) {
        this.LOG.debug(['parseData', 'isGts'], d);
        dataSet.name = GTSLib.serializeGtsMetadata(d);
        dataSet.values = d.v.map(v => [this.formatDate(v[0])].concat(v.slice(1, v.length)));
      } else {
        this.LOG.debug(['parseData', 'is not a Gts'], d);
        dataSet.values = GTSLib.isArray(d) ? d : [d];
      }
      dataSet.headers = [this.getHeaderParam(i, 0, 'headers', 'Date')];
      if (d.v && d.v.length > 0 && d.v[0].length > 2) {
        dataSet.headers.push(this.getHeaderParam(i, 1, 'headers', 'Latitude'));
      }
      if (d.v && d.v.length > 0 && d.v[0].length > 3) {
        dataSet.headers.push(this.getHeaderParam(i, 2, 'headers', 'Longitude'));
      }
      if (d.v && d.v.length > 0 && d.v[0].length > 4) {
        dataSet.headers.push(this.getHeaderParam(i, 3, 'headers', 'Elevation'));
      }
      if (d.v && d.v.length > 0) {
        dataSet.headers.push(this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
      }
      flatData.push(dataSet);
    });
    this.LOG.debug(['parseData', 'flatData'], flatData, this._options.timeMode);
    return flatData;
  }

  formatDate(date: number): string {
    return this._options.timeMode === 'date' ? moment.tz(date / this.divider, this._options.timeZone).toISOString() : date.toString();
  }
}
