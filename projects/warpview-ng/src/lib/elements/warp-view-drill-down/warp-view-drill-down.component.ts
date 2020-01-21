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

import {AfterViewInit, Component, ElementRef, HostListener, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import moment from 'moment';
import {GTSLib} from '../../utils/gts.lib';
import {ColorLib} from '../../utils/color-lib';
import {DataModel} from '../../model/dataModel';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';

/**
 *
 */
@Component({
  selector: 'warpview-drill-down',
  templateUrl: './warp-view-drill-down.component.html',
  styleUrls: ['./warp-view-drill-down.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewDrillDownComponent extends WarpViewComponent implements AfterViewInit {

  heatMapData: any;
  private parentWidth = -1;
  private resizeTimer;

  constructor(
    public el: ElementRef,
    public sizeService: SizeService,
  ) {
    super(el, sizeService);
    this.LOG = new Logger(WarpViewDrillDownComponent, this._debug);
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  update(options: Param, refresh: boolean): void {
    this.drawChart();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
      this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.el.nativeElement.parentElement.clientWidth > 0) {
          this.LOG.debug(['onResize'], this.el.nativeElement.parentElement.clientWidth);
          this.drawChart();
        } else {
          this.onResize();
        }
      }, 150);
    }
  }

  private drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
  }

  protected convert(data: DataModel): any[] {
    const dataList = this._data.data as any[];
    this.heatMapData = this.parseData(GTSLib.flatDeep(dataList));
    return [];
  }

  private parseData(dataList: any[]) {
    const details = [];
    const values = [];
    const dates = [];
    const data = {};
    const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue, 10);
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
          name,
          date: v[0] / 1000,
          value: v[v.length - 1],
          color: ColorLib.getColor(i, this._options.scheme),
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
      });
    });
    return details;
  }
}
