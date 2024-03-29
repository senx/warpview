/*
 *  Copyright 2021  SenX S.A.S.
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

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Size, SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {ChartLib} from '../../utils/chart-lib';
import {ResizedEvent} from 'angular-resize-event';
import {GTSLib} from '../../utils/gts.lib';

@Component({
  selector: 'warpview-result-tile',
  templateUrl: './warp-view-result-tile.component.html',
  styleUrls: ['./warp-view-result-tile.component.scss']
})
export class WarpViewResultTileComponent extends WarpViewComponent implements AfterViewInit {
  @ViewChild('title', {static: true}) title: ElementRef;
  @Input('chartTitle') chartTitle;

  @Input('type') set type(type: string) {
    this._type = type;
  }

  get type(): string {
    if (this.dataModel && this.dataModel.globalParams) {
      return this.dataModel.globalParams.type || this._options.type || this._type || 'plot';
    } else {
      return this._type || 'plot';
    }
  }

  @Input('standalone') standalone = true;

  @Output('pointHover') pointHover = new EventEmitter<any>();
  @Output('warpViewChartResize') warpViewChartResize = new EventEmitter<any>();
  @Output('chartDraw') chartDraw = new EventEmitter<any>();
  @Output('boundsDidChange') boundsDidChange = new EventEmitter<any>();
  @Output('warpViewNewOptions') warpViewNewOptions = new EventEmitter<any>();

  loading = true;
  dataModel: DataModel;
  innerHeight: number;
  graphs = {
    spectrum: ['histogram2dcontour', 'histogram2d'],
    chart: ['line', 'spline', 'step', 'step-after', 'step-before', 'area', 'scatter'],
    pie: ['pie', 'donut'],
    polar: ['polar'],
    radar: ['radar'],
    bar: ['bar'],
    bubble: ['bubble'],
    annotation: ['annotation'],
    'gts-tree': ['gts-tree'],
    datagrid: ['datagrid'],
    display: ['display'],
    drilldown: ['drilldown'],
    image: ['image'],
    map: ['map'],
    gauge: ['gauge', 'bullet'],
    plot: ['plot'],
    box: ['box', 'box-date'],
    line3d: ['line3d'],
    globe: ['globe'],
    drops: ['drops']
  };

  protected _type;
  private isRefresh = false;

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewResultTileComponent, this._debug);
  }

  ngAfterViewInit(): void {
    const chartDiv = this.getContentBounds((this.el.nativeElement as HTMLElement).parentElement);
    setTimeout(() => {
      if (!!this.title && !!this.chartTitle) {
        const titleDiv = this.getContentBounds(this.title.nativeElement);
        this.innerHeight = chartDiv.h - titleDiv.h - 20;
      } else {
        this.innerHeight = chartDiv.h - 20;
      }
    });
  }

  protected update(options: Param, refresh: boolean): void {
    setTimeout(() => this.loading = !refresh);
    this.LOG.debug(['parseGTS', 'data'], this._data);
    this.dataModel = this._data;
    if (!!this.dataModel) {
      this._options = ChartLib.mergeDeep(this._options, options) as Param;
      this._options = ChartLib.mergeDeep(ChartLib.mergeDeep(this.defOptions, this._options),
        this._data ? this._data.globalParams || {} : {}) as Param;
      this.LOG.debug(['parseGTS', 'data'], this._data);
      if (this._options) {
        this._unit = this._options.unit || this._unit;
        this._type = this._options.type || this._type || 'plot';
      }
      this.LOG.debug(['parseGTS', '_type'], this._type);
      setTimeout(() => this.loading = false);
    }
  }

  protected convert(data: DataModel): Partial<any>[] {
    setTimeout(() => this.loading = !this.isRefresh);
    this.LOG.debug(['convert', 'data'], this._data, data);
    this.dataModel = data;
    if (data.globalParams) {
      this._unit = data.globalParams.unit || this._unit;
      this._type = data.globalParams.type || this._type || 'plot';
    }
    this.LOG.debug(['convert', '_type'], this._type);
    const chartDiv = this.getContentBounds((this.el.nativeElement as HTMLElement).parentElement);
    setTimeout(() => {
      if (!!this.title) {
        const titleDiv = this.getContentBounds(this.title.nativeElement);
        console.log({chartDiv, titleDiv});
        this.innerHeight = chartDiv.h - titleDiv.h;
      } else {
        this.innerHeight = chartDiv.h;
      }
    });
    return [];
  }

  onResized(event: ResizedEvent) {
    this.width = event.newRect.width;
    this.height = event.newRect.height;
    this.LOG.debug(['onResized'], event.newRect.width, event.newRect.height);
    this.sizeService.change(new Size(this.width, this.height));
  }

  chartDrawn() {
    this.LOG.debug(['chartDrawn']);
    setTimeout(() => this.loading = false);
    this.chartDraw.emit();
  }

  setResult(data: string, isRefresh: boolean) {
    this.isRefresh = isRefresh;
    if (!!data) {
      this._data = GTSLib.getData(data);
      this._options.isRefresh = isRefresh;
      this.update(this._options, isRefresh);
      this.LOG.debug(['setResult'], this._data);
    }
  }

  onWarpViewNewOptions(opts) {
    this.warpViewNewOptions.emit(opts);
  }

  public resize(layout: { width: number; height: any }) {
    //
  }
}
