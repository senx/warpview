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

import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {ChartLib} from '../../utils/chart-lib';
import {GTSLib} from '../../utils/gts.lib';
import {DataModel} from '../../model/dataModel';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import fitty, {FittyInstance} from 'fitty';
import moment from 'moment-timezone';

/**
 *
 */
@Component({
  selector: 'warpview-display',
  templateUrl: './warp-view-display.component.html',
  styleUrls: ['./warp-view-display.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewDisplayComponent extends WarpViewComponent implements OnInit, OnDestroy {
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef;
  toDisplay = '';
  defOptions = ChartLib.mergeDeep(this._options, {
    timeMode: 'custom'
  }) as Param;

  private fitties: FittyInstance;
  private timer;

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
  ) {
    super(el, renderer, sizeService);
    this.LOG = new Logger(WarpViewDisplayComponent, this._debug);
  }

  ngOnInit() {
    this.drawChart();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  update(options: Param, refresh: boolean): void {
    this.drawChart();
    this.flexFont();
  }

  private drawChart() {
    this.LOG.debug(['drawChart'], this._options, this.defOptions);
    this.initChart(this.el);
    this.defOptions = ChartLib.mergeDeep(this.defOptions, this._options);

    this.LOG.debug(['drawChart', 'afterInit'], this._options, this.defOptions, this.height);
    this.LOG.debug(['drawChart'], this._data, this.toDisplay);
    this.flexFont();
    this.chartDraw.emit();
  }

  protected convert(data: DataModel): any[] {
    this.LOG.debug(['convert'], this._options.timeMode);
    let display: string;
    if (this._data.data) {
      display = GTSLib.isArray(this._data.data) ? this._data.data[0] : this._data.data;
    } else {
      display = GTSLib.isArray(this._data) ? this._data[0] : this._data;
    }
    switch (this._options.timeMode) {
      case 'date':
        this.toDisplay = moment.tz(parseInt(display, 10) / this.divider, this._options.timeZone).toISOString(true);
        break;
      case 'duration':
        const start = moment.tz(parseInt(display, 10) / this.divider, this._options.timeZone);
        this.displayDuration(start);
        break;
      case 'custom':
      case 'timestamp':
        this.toDisplay = display;
    }
    return [];
  }

  getStyle() {
    if (!this._options) {
      return {};
    } else {
      const style: any = {'background-color': this._options.bgColor || 'transparent'};
      if (this._options.fontColor) {
        style.color = this._options.fontColor;
      }
      return style;
    }
  }

  flexFont() {
    if (!!this.wrapper) {
      this.LOG.debug(['flexFont'], this.height);
      if (this.fitties) {
        this.fitties.unsubscribe();
      }
      this.fitties = fitty(this.wrapper.nativeElement, {
        maxSize: (this.el.nativeElement as HTMLElement).parentElement.clientHeight * 0.80,
        minSize: 14
      });
      this.LOG.debug(['flexFont'], 'ok', (this.el.nativeElement as HTMLElement).parentElement.clientHeight);
      this.fitties.fit();
      this.loading = false;
    }
  }

  private displayDuration(start: any) {
    this.timer = setInterval(() => {
      const now = moment();
      this.toDisplay = moment.duration(start.diff(now)).humanize(true);
    }, 1000);
  }
}
