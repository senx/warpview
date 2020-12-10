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

import {ChartLib} from '../utils/chart-lib';
import {Param} from '../model/param';
import {Logger} from '../utils/logger';
import {DataModel} from '../model/dataModel';
import {GTS} from '../model/GTS';
import {GTSLib} from '../utils/gts.lib';
import {Directive, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild} from '@angular/core';
import {Size, SizeService} from '../services/resize.service';
import {PlotlyComponent} from '../plotly/plotly.component';
import {Config} from 'plotly.js';

export type VisibilityState = 'unknown' | 'nothingPlottable' | 'plottablesAllHidden' | 'plottableShown';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class WarpViewComponent {
  @ViewChild('toolTip', {static: true}) toolTip: ElementRef;
  @ViewChild('graph') graph: PlotlyComponent;
  @ViewChild('chartContainer', {static: true}) chartContainer: ElementRef;

  @Input('width') width = ChartLib.DEFAULT_WIDTH;
  @Input('height') height = ChartLib.DEFAULT_HEIGHT;
  protected drawn = false;
  protected _type: string;

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    this._hiddenData = hiddenData;
  }

  get hiddenData(): number[] {
    return this._hiddenData;
  }

  @Input('unit') set unit(unit: string) {
    this._unit = unit;
    this.update(undefined, false);
  }

  get unit() {
    return this._unit;
  }

  @Input('debug') set debug(debug: boolean | string) {
    if (typeof debug === 'string') {
      debug = 'true' === debug;
    }
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input('responsive') set responsive(responsive: boolean | string) {
    if (typeof responsive === 'string') {
      responsive = 'true' === responsive;
    }
    this._responsive = responsive;
  }

  get responsive() {
    return this._responsive;
  }

  @Input('options') set options(options: Param | string) {
    this.LOG.debug(['onOptions'], options);
    if (typeof options === 'string') {
      options = JSON.parse(options);
    }
    if (JSON.stringify(options) !== JSON.stringify(this._options)) {
      this.drawn = false;
      this.LOG.debug(['onOptions', 'changed'], options);
      this._options = ChartLib.mergeDeep<Param>(options as Param, {});
      this.update(this._options, false);
    }
  }

  @Input('data') set data(data: string | DataModel | GTS[]) {
    this.LOG.debug(['onData'], data);
    if (data) {
      this.drawn = false;
      this._data = GTSLib.getData(data);
      this.update(this._options, this._options.isRefresh);
      this.LOG.debug(['onData'], this._data);
    }
  }

  @Output('chartDraw') chartDraw = new EventEmitter<any>();

  protected LOG: Logger;
  protected defOptions = ChartLib.mergeDeep(new Param(), {
    dotsLimit: 1000,
    heatControls: false,
    showRangeSelector: true,
    gridLineColor: '#8e8e8e',
    showDots: false,
    timeZone: 'UTC',
    timeUnit: 'us',
    showControls: true,
    // bounds: {}
  }) as Param;

  protected _debug = false;
  protected _responsive = true;
  protected _unit = '';
  protected _data: DataModel;
  protected _autoResize = true;
  protected _hiddenData: number[] = [];
  protected divider: number;

  tooltipPosition: any = {top: '-10000px', left: '-1000px'};
  loading = true;
  noData = true;
  _options: Param = new Param();
  layout: Partial<any> = {
    showlegend: false,
    margin: {
      t: 10,
      b: 25,
      r: 10,
      l: 10
    }
  };
  plotlyConfig: Partial<Config> = {
    responsive: true,
    showAxisDragHandles: true,
    scrollZoom: true,
    doubleClick: 'reset+autosize',
    showTips: true,
    plotGlPixelRatio: 1,
    staticPlot: false,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'lasso2d', 'select2d', 'toggleSpikelines', 'toggleHover', 'hoverClosest3d', 'autoScale2d',
      'hoverClosestGeo', 'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover',
      'hoverClosestCartesian', 'hoverCompareCartesian'
    ]
  };
  plotlyData: Partial<any>[];
  private hideTooltipTimer: any;
  private rect: any;

  protected constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    this.sizeService.sizeChanged$.subscribe((size: Size) => {
      if ((el.nativeElement as HTMLElement).parentElement) {
        const parentSize = (el.nativeElement as HTMLElement).parentElement.getBoundingClientRect();
        if (this._responsive) {
          this.height = parentSize.height;
          this.width = parentSize.width;
        }
        if (!!this.graph && this._responsive && parentSize.height > 0 && this._autoResize) {
          const layout = {
            width: parentSize.width,
            height: this._autoResize ? parentSize.height : this.layout.height
          };
          if (this.layout.width !== layout.width || this.layout.height !== layout.height) {
            setTimeout(() => this.layout = {...this.layout, ...layout});
            this.LOG.debug(['sizeChanged$'], this.layout.width, this.layout.height);
            this.resize(layout);
          }
        }
      }
    });
  }

  protected abstract update(options: Param, refresh: boolean): void;

  protected abstract convert(data: DataModel): Partial<any>[];

  protected abstract resize(layout: { width: number; height: any });

  protected legendFormatter(x, series, highlighted = -1): string {
    const displayedCurves = [];
    if (x === null) {
      // This happens when there's no selection and {legend: 'always'} is set.
      return `<br>
      ${series.map(s => {
        // FIXME :  if (!s.isVisible) return;
        let labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + ((this._options.horizontal ? s.x : s.y) || s.r || '');
        let color = s.data.line.color;
        if (!!s.data.marker) {
          if (GTSLib.isArray(s.data.marker.color)) {
            color = s.data.marker.color[0];
          } else {
            color = s.data.marker.color;
          }
        }
        if (s.curveNumber === highlighted) {
          labeledData = `<i class="chip"
    style="background-color: ${color};border: 2px solid ${color};"></i> ${labeledData}`;
        }
        return labeledData;
      }).join('<br>')}`;
    }

    let html = '';
    if (!!series[0]) {
      x = series[0].x || series[0].theta;
    }
    html += `<b>${x}</b><br />`;
    // put the highlighted one(s?) first, keep only visible, keep only 50 first ones.
    series = series.sort((sa, sb) => (sa.curveNumber === highlighted) ? -1 : 1);
    series
      // .filter(s => s.isVisible && s.yHTML)
      .slice(0, 50)
      .forEach((s, i) => {
        if (displayedCurves.indexOf(s.curveNumber) <= -1) {
          displayedCurves.push(s.curveNumber);
          let value = series[0].data.orientation === 'h' ? s.x : s.y;
          if (!value && value !== 0) {
            value = s.r;
          }
          let labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + value;
          if (s.curveNumber === highlighted) {
            labeledData = `<b>${labeledData}</b>`;
          }
          let color = s.data.line ? s.data.line.color : '';
          if (!!s.data.marker) {
            if (GTSLib.isArray(s.data.marker.color)) {
              color = s.data.marker.color[0];
            } else {
              color = s.data.marker.color;
            }
          }
          html += `<i class="chip" style="background-color: ${color};border: 2px solid ${color};"></i>&nbsp;${labeledData}`;
          if (i < series.length) {
            html += '<br>';
          }
        }
      });
    return html;
  }

  protected initChart(el: ElementRef, resize = true, customData = false): boolean {
    if (!!this.drawn) {
      return true;
    }
    const parentSize = (el.nativeElement as HTMLElement).parentElement.parentElement.getBoundingClientRect();
    if (this._responsive) {
      if (resize) {
        if (
          this._autoResize && (parentSize.height === 0 || this.height !== parentSize.height)
          || parentSize.width === 0 || this.width !== parentSize.width) {
          if (this._autoResize) {
            this.height = parentSize.height;
          }
          this.width = parentSize.width;
          setTimeout(() => this.initChart(el), 100);
          return;
        } else {
          if (this._autoResize) {
            this.height = parentSize.height;
          }
          this.width = parentSize.width;
        }
      }
    }
    this.LOG.debug(['initChart', 'this._data'], this._data, this._options);
    if (!this._data || !this._data.data || this._data.data.length === 0 || !this._options) {
      this.loading = false;
      this.LOG.debug(['initChart', 'nodata']);
      this.noData = true;
      this.chartDraw.emit();
      return false;
    }
    this._options = ChartLib.mergeDeep<Param>(this.defOptions, this._options || {}) as Param;
    const dataModel = this._data;
    this._options = ChartLib.mergeDeep<Param>(this._options || {} as Param, this._data.globalParams) as Param;
    this.LOG.debug(['initChart', 'this._options.timeMode'], this._options.timeMode);
    if (!this._options.timeMode) {
      this._options.timeMode = this._type === 'display' ? 'custom' : 'date';
    }
    this.LOG.debug(['initChart', 'this._options.timeMode'], this._options.timeMode, this._options);
    this.loading = !this._options.isRefresh;
    this.divider = GTSLib.getDivider(this._options.timeUnit);
    this.plotlyData = this.convert(dataModel);
    this.plotlyConfig.responsive = this._responsive;
    this.layout.paper_bgcolor = 'rgba(0,0,0,0)';
    this.layout.plot_bgcolor = 'rgba(0,0,0,0)';
    if (!this._responsive) {
      this.layout.width = this.width || ChartLib.DEFAULT_WIDTH;
      if (!this.height && this._autoResize) {
        this.layout.height = this.height || ChartLib.DEFAULT_HEIGHT;
      }
    } else {
      this.layout.width = this.width || parentSize.width;
      if (!this.height && this._autoResize) {
        this.layout.height = this.height || parentSize.height;
      }
    }
    this.LOG.debug(['initiChart', 'plotlyData'], this.plotlyData);
    this.loading = false;
    this.chartDraw.emit();
    if (!customData) {
      this.noData = (this.plotlyData || []).length === 0;
      return !(!this.plotlyData || this.plotlyData.length === 0);
    } else {
      return true;
    }
  }

  afterPlot(plotlyInstance?: any) {
    this.LOG.debug(['afterPlot', 'plotlyInstance'], plotlyInstance);
    this.loading = false;
    this.drawn = true;
    this.rect = this.graph.getBoundingClientRect();
    this.chartDraw.emit();
  }

  hideTooltip() {
    if (!!this.hideTooltipTimer) {
      clearTimeout(this.hideTooltipTimer);
    }
    this.hideTooltipTimer = setTimeout(() => {
      this.toolTip.nativeElement.style.display = 'none';
    }, 1000);
  }

  unhover(data?: any, point?: any) {
    //   this.LOG.debug(['unhover'], data);
    if (!!this.hideTooltipTimer) {
      clearTimeout(this.hideTooltipTimer);
    }
  }

  hover(data: any, highlighted = 0) {
    this.renderer.setStyle(this.toolTip.nativeElement, 'display', 'block');
    if (!!this.hideTooltipTimer) {
      clearTimeout(this.hideTooltipTimer);
    }
    const p = data.points[highlighted];
    const content = this.legendFormatter(
      this._options.horizontal ?
        (data.yvals || [''])[0] :
        (data.xvals || [''])[0]
      , data.points, highlighted);
    if (!!p) {
      let left = (p.xaxis.d2p(p.x) + p.xaxis._offset + 20) + 'px';
      if (data.event.offsetX > this.chartContainer.nativeElement.clientWidth / 2) {
        left = Math.max(0,
          p.xaxis.d2p(p.x) + p.xaxis._offset - this.toolTip.nativeElement.clientWidth - 20) + 'px';
      }
      let top = (p.yaxis.l2p(p.y) + p.yaxis._offset);
      top = Math.min(
        this.el.nativeElement.getBoundingClientRect().height - this.toolTip.nativeElement.getBoundingClientRect().height - 20,
        top);
      this.moveTooltip(top + 'px', left, content);
    }
  }

  getTooltipPosition() {
    return {
      top: this.tooltipPosition.top,
      left: this.tooltipPosition.left,
    };
  }

  protected moveTooltip(top, left, content) {
    const div = this.toolTip.nativeElement as HTMLDivElement;
    this.LOG.debug(['hover - moveTooltip'], top, left);
    div.innerHTML = content;
    div.style.top = top;
    div.style.left = left;
  }

  relayout($event: any) {

  }

  protected getLabelColor(el: HTMLElement) {
    return this.getCSSColor(el, '--warp-view-chart-label-color', '#8e8e8e').trim();
  }

  protected getGridColor(el: HTMLElement) {
    return this.getCSSColor(el, '--warp-view-chart-grid-color', '#8e8e8e').trim();
  }

  protected getCSSColor(el: HTMLElement, property: string, defColor: string) {
    const color = getComputedStyle(el).getPropertyValue(property).trim();
    return color === '' ? defColor : color;
  }
}
