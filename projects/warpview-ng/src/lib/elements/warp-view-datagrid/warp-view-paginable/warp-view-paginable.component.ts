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

import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Logger} from '../../../utils/logger';
import {Param} from '../../../model/param';
import {ChartLib} from '../../../utils/chart-lib';
import {GTSLib} from '../../../utils/gts.lib';

@Component({
  selector: 'warpview-paginable',
  templateUrl: './warp-view-paginable.component.html',
  styleUrls: ['./warp-view-paginable.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewPaginableComponent implements OnInit {
  constructor() {
    this.LOG = new Logger(WarpViewPaginableComponent, this.debug);
  }

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input('options') set options(options: Param) {
    if (JSON.stringify(options || new Param()) !== JSON.stringify(this._options || new Param())) {
      this._options = options;
      this.drawGridData();
    }
  }

  @Input('data') set data(data: { name: string, values: any[], headers: string[] }) {
    if (data) {
      this._data = data;
      this.drawGridData();
    }
  }

  @Input('elemsCount') elemsCount = 15;
  @Input('windowed') windowed = 5;

  page = 0;
  pages: number[] = [];
  // tslint:disable-next-line:variable-name
  _data: { name: string, values: any[], headers: string[] };
  displayedValues: any[] = [];
  private LOG: Logger;
  // tslint:disable-next-line:variable-name
  private _debug = false;
  private _options = new Param();
  // tslint:disable-next-line:variable-name
  private defOptions: Param = {
    ...new Param(), ...{
      timeMode: 'date',
      timeZone: 'UTC',
      timeUnit: 'us',
      bounds: {}
    }
  };

  goto(page: number) {
    this.page = page;
    this.drawGridData();
  }

  next() {
    this.page = Math.min(this.page + 1, this._data.values.length - 1);
    this.drawGridData();
  }

  prev() {
    this.page = Math.max(this.page - 1, 0);
    this.drawGridData();
  }

  private drawGridData() {
    this.LOG.debug(['drawGridData', '_options'], this._options);
    if (!this._data) {
      return;
    }
    this._options = ChartLib.mergeDeep<Param>(this.defOptions, this._options || {}) as Param;
    this.pages = [];
    for (let i = 0; i < (this._data.values || []).length / this.elemsCount; i++) {
      this.pages.push(i);
    }
    this.elemsCount = this._options.elemsCount || this.elemsCount;
    this.windowed = this._options.windowed || this.windowed;
    this.displayedValues = (this._data.values || []).slice(
      Math.max(0, this.elemsCount * this.page),
      Math.min(this.elemsCount * (this.page + 1), (this._data.values || []).length)
    );
    this.LOG.debug(['drawGridData', '_data'], this._data);
  }

  decodeURIComponent(str: string): string {
    return decodeURIComponent(str);
  }

  ngOnInit() {
    this.drawGridData();
  }

  formatLabel(name: string) {
    return GTSLib.formatLabel(name);
  }
}
