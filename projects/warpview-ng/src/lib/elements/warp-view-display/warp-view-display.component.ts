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

import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {ChartLib} from '../../utils/chart-lib';
import {GTSLib} from '../../utils/gts.lib';
import {DataModel} from '../../model/dataModel';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import fitty, {FittyInstance} from 'fitty';

/**
 *
 */
@Component({
  selector: 'warpview-display',
  templateUrl: './warp-view-display.component.html',
  styleUrls: ['./warp-view-display.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewDisplayComponent extends WarpViewComponent implements OnInit {
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef;
  toDisplay = '';
  private fitties: FittyInstance;

  constructor(
    public el: ElementRef,
    public sizeService: SizeService,
  ) {
    super(el, sizeService);
    this.LOG = new Logger(WarpViewDisplayComponent, this._debug);
  }

  ngOnInit() {
    this.fitties = fitty(this.wrapper.nativeElement as HTMLElement, {
      multiLine: true,
      maxSize: (this.el.nativeElement as HTMLElement).parentElement.clientHeight / 1.5,
      minSize: 12
    });
    this.drawChart();
  }

  update(options: Param, refresh: boolean): void {
    this.drawChart();
  }

  private drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
    this.LOG.debug(['drawChart'], [this._data, this.toDisplay]);
  }

  protected convert(data: DataModel): any[] {
    if (this._data.data) {
      this.toDisplay = GTSLib.isArray(this._data.data) ? this._data.data[0] : this._data.data;
      this._options = ChartLib.mergeDeep(this._options, this._data.globalParams || {}) as Param;
    } else {
      this.toDisplay = GTSLib.isArray(this._data) ? this._data[0] : this._data;
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
    this.fitties.fit();
  }
}
