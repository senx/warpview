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

import {Component, Prop, State} from "@stencil/core";
import {ChartLib} from "../../utils/chart-lib";
import {GTSLib} from "../../utils/gts.lib";
import moment from "moment";
import {Param} from "../../model/param";
import {Logger} from "../../utils/logger";

@Component({
  tag: 'warp-view-paginable',
  styleUrl: 'warp-view-paginable.scss',
  shadow: true
})

export class WarpViewPaginable {
  @Prop() data: { name: string, values: any[], headers: string[] };
  @Prop() options: Param = new Param();
  @Prop() elemsCount = 15;

  @State() page = 0;

  private pages: number[] = [];
  private _data: { name: string, values: any[], headers: string[] };
  private displayedValues: any[] = [];
  private LOG: Logger = new Logger(WarpViewPaginable);
  private _options: Param = {
    timeMode: 'date'
  };
  private windowed: number = 5;

  private formatDate(date: number): string {
    return this._options.timeMode === 'date' ? moment.utc(date / 1000).toISOString() : date.toString();
  }

  private goto(page: number) {
    this.page = page;
    this.drawGridData();
  }

  private next() {
    this.page = Math.min(this.page + 1, this._data.values.length - 1);
    this.drawGridData();
  }

  private prev() {
    this.page = Math.max(this.page - 1, 0);
    this.drawGridData();
  }

  private drawGridData() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.LOG.debug(['drawGridData', '_options'], this._options);
    if (!this.data) return;
    this.pages = [];
    for (let i = 0; i < this.data.values.length / this.elemsCount; i++) {
      this.pages.push(i);
    }
    this._data = {...this.data};
    this.displayedValues = this._data.values.slice(Math.max(0, this.elemsCount * this.page), Math.min(this.elemsCount * (this.page + 1), this._data.values.length));
    this.LOG.debug(['drawGridData', '_data'], this.data);
  }

  componentWillLoad() {
    this.drawGridData();
  }

  render() {
    // noinspection CheckTagEmptyBody
    return <div class="wrapper">
      {this._data ?
        <div>
          <div class="heading" innerHTML={GTSLib.formatLabel(this._data.name)}></div>
          <table>
            <thead>
            {this._data.headers.map((headerName) =>
              <th>{headerName}</th>
            )}
            </thead>
            <tbody>
            {this.displayedValues.map((value, index) =>
              <tr class={index % 2 === 0 ? 'odd' : 'even'}>
                {value.map((v, index) => <td>{index === 0 ? this.formatDate(v) : v}</td>)}
              </tr>)}
            </tbody>
          </table>
          <div class="center">
            <div class="pagination">
              {this.page !== 0 ? <div class="prev hoverable" onClick={() => this.prev()}>&lt;</div> : ''}
              {this.page - this.windowed > 0
                ? <div class="index disabled">...</div>
                : ''}
              {this.pages.map(c =>
                c >= this.page - this.windowed && c <= this.page + this.windowed
                  ? <div class={'index ' + (this.page === c ? 'active' : 'hoverable')}
                         onClick={() => this.goto(c)}>{c}</div>
                  : ''
              )}
              {this.page + this.windowed < this.pages.length
                ? <div class="index disabled">...</div>
                : ''}
              {this.page !== this._data.values.length - 1 ?
                <div class="next hoverable" onClick={() => this.next()}>&gt;</div> : ''}
            </div>
          </div>
        </div>
        : ''
      }
    </div>;
  }
}
