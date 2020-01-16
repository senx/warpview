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

import {AfterViewInit, Component, ElementRef, HostListener, Input, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {ChartLib} from '../../utils/chart-lib';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';

/**
 *
 */
@Component({
  selector: 'warpview-image',
  templateUrl: './warp-view-image.component.html',
  styleUrls: ['./warp-view-image.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewImageComponent extends WarpViewComponent implements AfterViewInit {
  @Input('imageTitle') imageTitle = '';

  toDisplay: string[];

  private resizeTimer;
  private parentWidth = -1;

  constructor(
    protected el: ElementRef,
    protected sizeService: SizeService,
  ) {
    super(el, sizeService);
    this.LOG = new Logger(WarpViewImageComponent, this._debug);
  }

  ngAfterViewInit(): void {
    this.LOG.debug(['ngAfterViewInit'], this._options);
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
    if (!this._data || !this._data.data || this._data.data.length === 0) {
      return;
    }
    this.initChart(this.el);
    this.toDisplay = [];
    let gts: DataModel = this._data;
    this.LOG.debug(['drawChart', 'gts'], gts);
    if (typeof gts === 'string') {
      try {
        gts = JSON.parse(gts as string);
      } catch (error) {
        // empty : it's a base64 string
      }
    }
    if (gts.data && gts.data.length > 0 && GTSLib.isEmbeddedImage(gts.data[0])) {
      this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {}) as Param;
      this.toDisplay.push(gts.data[0]);
    } else if (gts.data && GTSLib.isEmbeddedImage(gts.data)) {
      this.toDisplay.push(gts.data as string);
    }
    this.LOG.debug(['drawChart', 'this.data', 'this.toDisplay'], this.data, this.toDisplay);
  }

  getStyle() {
    this.LOG.debug(['getStyle'], this._options);
    if (!this._options) {
      return {};
    } else {
      const style: any = {'background-color': this._options.bgColor || 'transparent', width: this.width, height: 'auto'};
      if (this._options.fontColor) {
        style.color = this._options.fontColor;
      }
      this.LOG.debug(['getStyle', 'style'], style);
      return style;
    }
  }

  protected convert(data: DataModel): any[] {
    return [];
  }
}
