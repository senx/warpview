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

import {Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {ChartLib} from '../../utils/chart-lib';
import moment from 'moment-timezone';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import {ColorLib} from '../../utils/color-lib';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {ChartBounds} from '../../model/chartBounds';
import {PlotlyHTMLElement} from 'plotly.js';

@Component({
  selector: 'warpview-annotation',
  templateUrl: './warp-view-annotation.component.html',
  styleUrls: ['./warp-view-annotation.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewAnnotationComponent extends WarpViewComponent {

  @Input('type') set type(type: string) {
    this.LOG.debug(['type'], type);
    this._type = type;
    this.drawChart();
  }

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    const previousVisibility = JSON.stringify(this.visibility);
    this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
    this._hiddenData = hiddenData;
    this.visibility = [];
    this.visibleGtsId.forEach(id => this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)));
    this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
    const newVisibility = JSON.stringify(this.visibility);
    this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
    if (previousVisibility !== newVisibility) {
      const visible = [];
      const hidden = [];
      this.gtsId.forEach((id, i) => {
        if (this._hiddenData.indexOf(id) > -1) {
          hidden.push(i);
        } else {
          visible.push(i);
        }
      });
      if (visible.length > 0) {
        this.graph.restyleChart({visible: true}, visible);
      }
      if (hidden.length > 0) {
        this.graph.restyleChart({visible: false}, hidden);
      }
      this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
    }
  }

  @Input('standalone') set standalone(isStandalone: boolean) {
    this.LOG.debug(['standalone'], isStandalone);
    if (this._standalone !== isStandalone) {
      this._standalone = isStandalone;
      this.drawChart();
    }
  }

  get standalone(): boolean {
    return this._standalone;
  }


  @Input('height') height = 0;

  @Output('pointHover') pointHover = new EventEmitter<any>();
  @Output('chartDraw') chartDraw = new EventEmitter<any>();
  @Output('boundsDidChange') boundsDidChange = new EventEmitter<any>();

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this._autoResize = false;
    this.LOG = new Logger(WarpViewAnnotationComponent, this._debug);
  }

  displayExpander = true;
  layout: Partial<any> = {
    showlegend: false,
    hovermode: 'closest',
    xaxis: {
      gridwidth: 1,
      fixedrange: false,
      autorange: false,
      automargin: false,
      showticklabels: true,
      showgrid: false
    },
    autosize: false,
    autoexpand: false,
    yaxis: {
      showticklabels: false,
      fixedrange: true,
      dtick: 1,
      gridwidth: 1,
      tick0: 0,
      nticks: 1,
      rangemode: 'tozero',
      tickson: 'boundaries',
      automargin: true,
      showline: false,
      zeroline: true
    },
    margin: {
      t: 2,
      b: 50,
      r: 10,
      l: 10
    },
  };
  marginLeft = 50;
  expanded = false;
  // tslint:disable-next-line:variable-name
  protected _type = 'annotation';
  private visibility: boolean[] = [];
  private _standalone = true;
  private trimmed;
  private maxTick = Number.MIN_VALUE;
  private minTick = Number.MAX_VALUE;
  private visibleGtsId = [];
  private gtsId = [];
  private dataHashset = {};
  private lineHeight = 30;
  private chartBounds: ChartBounds = new ChartBounds();
  private afterBoundsUpdate = false;
  private firstDraw = true;

  @HostListener('keydown', ['$event'])
  @HostListener('document:keydown', ['$event'])
  handleKeyDown($event: KeyboardEvent) {
    if ($event.key === 'Control') {
      this.trimmed = setInterval(() => {
        if (!!this.toolTip.nativeElement.querySelector('#tooltip-body')) {
          this.toolTip.nativeElement.querySelector('#tooltip-body').classList.add('full');
        }
      }, 100);
    }
  }

  @HostListener('keyup', ['$event'])
  @HostListener('document:keyup', ['$event'])
  handleKeyup($event: KeyboardEvent) {
    this.LOG.debug(['document:keyup'], $event);
    if ($event.key === 'Control') {
      if (!!this.toolTip.nativeElement.querySelector('#tooltip-body')) {
        if (this.trimmed) {
          clearInterval(this.trimmed);
        }
        this.toolTip.nativeElement.querySelector('#tooltip-body').classList.remove('full');
      }
    }
  }

  update(options: Param, refresh: boolean): void {
    this.LOG.debug(['update'], options);
    this.loading = true;
    if (!!options) {
      this._options = ChartLib.mergeDeep(this._options, options) as Param;
    }
    this.drawChart(refresh);
  }

  updateBounds(min, max, marginLeft) {
    this.LOG.debug(['updateBounds'], min, max, this._options);
    this._options.bounds.minDate = min;
    this._options.bounds.maxDate = max;
    this.layout.xaxis.autorange = false;
    this.LOG.debug(['updateBounds'], GTSLib.toISOString(min, this.divider, this._options.timeZone),
      GTSLib.toISOString(max, this.divider, this._options.timeZone));
    this.minTick = min;
    this.maxTick = max;
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.tick0 = min;
      this.layout.xaxis.range = [min, max];
    } else {
      this.layout.xaxis.tick0 = GTSLib.toISOString(min, this.divider, this._options.timeZone);
      this.layout.xaxis.range = [
        GTSLib.toISOString(min, this.divider, this._options.timeZone),
        GTSLib.toISOString(max, this.divider, this._options.timeZone)
      ];
    }
    this.layout.margin.l = marginLeft;
    this.marginLeft = marginLeft;
    this.layout = {...this.layout};
    this.LOG.debug(['updateBounds'], {...this.layout.xaxis.range});
    this.afterBoundsUpdate = true;
  }

  drawChart(reparseNewData: boolean = false) {
    this.loading = true;
    this.layout.margin.l = !!this._standalone ? 10 : 50;
    this.layout.margin.b = !!this._standalone ? 50 : 2;
    this.height = this.lineHeight * (this.expanded ? this.gtsId.length : 1) + this.layout.margin.t + this.layout.margin.b;
    this.LOG.debug(['drawChart', 'this.height'], this.height);
    if (this.firstDraw) {
      this.expanded = !!this._options.expandAnnotation;
    }
    this.layout.height = this.height;
    if (!this.initChart(this.el)) {
      return;
    }
    this.el.nativeElement.style.display = 'block';
    this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
    this.LOG.debug(['drawChart', 'hiddenData'], this._hiddenData);
    this.LOG.debug(['drawChart', 'this._options.bounds'], this._options.bounds);
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.yaxis.showline = !!this._standalone;
    this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.autorange = !!this._standalone;
    this.layout.xaxis.showticklabels = !!this._standalone;
    this.displayExpander = (this.plotlyData.length > 1);
    const count = this.plotlyData.filter(d => d.y.length > 0).length;
    const calculatedHeight = this.lineHeight * (this.expanded ? count : 1) + this.layout.margin.t + this.layout.margin.b;
    this.el.nativeElement.style.height = (calculatedHeight + 30) + 'px';
    this.height = calculatedHeight;
    this.layout.height = this.height;
    this.LOG.debug(['drawChart', 'height'], this.lineHeight, this.height, count, calculatedHeight, this.expanded, this.layout.margin);
    this.layout.yaxis.range = [0, this.expanded ? count : 1];
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.tick0 = this.minTick;
      this.layout.xaxis.range = [this.minTick, this.maxTick];
      this.layout.xaxis.type = 'linear';
    } else {
      this.layout.xaxis.tick0 = GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
      this.layout.xaxis.range = [
        GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
        GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
      ];
      this.layout.xaxis.type = 'date';
    }
    this.plotlyConfig.scrollZoom = true;
    this.layout.xaxis.showgrid = false;
    setTimeout(() => {
      this.plotlyConfig = {...this.plotlyConfig};
      this.layout = {...this.layout};
      this.firstDraw = false;
    });
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig, this.plotlyData, this.layout);
  }

  relayout(data: any) {
    let change = false;
    this.LOG.debug(['relayout', 'updateBounds'], data);
    if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
      if (this.chartBounds.msmin !== data['xaxis.range'][0] || this.chartBounds.msmax !== data['xaxis.range'][1]) {
        this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
        change = true;
        this.chartBounds.msmin = data['xaxis.range'][0];
        this.chartBounds.msmax = data['xaxis.range'][1];
        this.chartBounds.tsmin = GTSLib.toTimestamp(this.chartBounds.msmin, this.divider, this._options.timeZone);
        this.chartBounds.tsmax = GTSLib.toTimestamp(this.chartBounds.msmax, this.divider, this._options.timeZone);
      }
    } else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
      if (this.chartBounds.msmin !== data['xaxis.range[0]'] || this.chartBounds.msmax !== data['xaxis.range[1]']) {
        this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]'], data['xaxis.range[1]']);
        change = true;
        this.chartBounds.msmin = data['xaxis.range[0]'];
        this.chartBounds.msmax = data['xaxis.range[1]'];
        this.chartBounds.tsmin = GTSLib.toTimestamp(this.chartBounds.msmin, this.divider, this._options.timeZone);
        this.chartBounds.tsmax = GTSLib.toTimestamp(this.chartBounds.msmax, this.divider, this._options.timeZone);
      }
    } else if (data['xaxis.autorange']) {
      if (this.chartBounds.tsmin !== this.minTick || this.chartBounds.tsmax !== this.maxTick) {
        this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data, this.minTick, this.maxTick);
        change = true;
        this.chartBounds.tsmin = this.minTick;
        this.chartBounds.tsmax = this.maxTick;
      }
    }
    if (change) {
      this.LOG.debug(['relayout', 'updateBounds'], this.minTick, this.maxTick);
      this.LOG.debug(['relayout', 'updateBounds'], this.chartBounds);
      if (this._options.timeMode && this._options.timeMode === 'timestamp') {
        this.emitNewBounds(this.chartBounds.msmin, this.chartBounds.msmax);
      } else {
        this.emitNewBounds(this.chartBounds.tsmin, this.chartBounds.tsmax);
      }
    }
    this.loading = false;
    this.afterBoundsUpdate = false;
    this.chartDraw.emit();
  }

  hover(data: any) {
    this.LOG.debug(['hover'], data);
    const tooltip = this.toolTip.nativeElement;
    this.pointHover.emit({
      x: data.event.offsetX,
      y: data.event.offsetY
    });
    let x = data.xvals[0];
    if (!!data.points[0]) {
      x = data.points[0].x;
    }
    const layout = this.el.nativeElement.getBoundingClientRect();
    const count = this.plotlyData.filter(d => d.y.length > 0).length;
    tooltip.style.opacity = '1';
    tooltip.style.display = 'block';
    tooltip.style.paddingLeft = (this._standalone ? 0 : 40) + 'px';
    tooltip.style.top = (
      (this.expanded ? count - 1 - (data.points[0].y + 0.5) : -1) * (this.lineHeight) + this.layout.margin.t
    ) + 6 + 'px';
    tooltip.classList.remove('right', 'left');
    tooltip.innerHTML = `<div class="tooltip-body trimmed" id="tooltip-body">
<span class="tooltip-date">${this._options.timeMode === 'timestamp'
      ? x
      : (moment.utc(x).toISOString().replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '') || '')}</span>
<ul>
<li>${GTSLib.formatLabel(data.points[0].data.name)}: <span class="value">${data.points[0].text}</span></li>
</ul>
      </div>`;
    if (data.event.offsetX > layout.width / 2) {
      tooltip.classList.add('left');
    } else {
      tooltip.classList.add('right');
    }
    tooltip.style.pointerEvents = 'none';
  }

  unhover() {
    this.toolTip.nativeElement.style.display = 'none';
  }

  afterPlot(div: PlotlyHTMLElement) {
    this.loading = false;
    this.chartBounds.tsmin = this.minTick;
    this.chartBounds.tsmax = this.maxTick;
    this.LOG.debug(['afterPlot'], 'div', div);
    if (this.afterBoundsUpdate || this._standalone) {
      this.chartDraw.emit(this.chartBounds);
      this.LOG.debug(['afterPlot'], 'chartBounds', this.chartBounds, div);
      this.afterBoundsUpdate = false;
    }
  }

  private emitNewBounds(min, max) {
    this.LOG.debug(['emitNewBounds'], min, max);
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.boundsDidChange.emit({bounds: {min, max}, source: 'annotation'});
    } else {
      this.boundsDidChange.emit({
        bounds: {
          min: moment.tz(min, this._options.timeZone).valueOf(),
          max: moment.tz(max, this._options.timeZone).valueOf()
        },
        source: 'annotation'
      });
    }
  }

  protected convert(data: DataModel): Partial<any>[] {
    this.loading = true;
    this.noData = true;
    const dataset: Partial<any>[] = [];
    let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    this.maxTick = Number.NEGATIVE_INFINITY;
    this.minTick = Number.POSITIVE_INFINITY;
    this.visibleGtsId = [];
    this.gtsId = [];
    const nonPlottable = gtsList.filter(g => g.v && GTSLib.isGtsToPlot(g));
    gtsList = gtsList.filter(g => g.v && !GTSLib.isGtsToPlot(g));
    let timestampMode = true;
    const tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
    gtsList.forEach((gts: GTS) => {
      const ticks = gts.v.map(t => t[0]);
      const size = gts.v.length;
      timestampMode = timestampMode && (ticks[0] > -tsLimit && ticks[0] < tsLimit);
      timestampMode = timestampMode && (ticks[size - 1] > -tsLimit && ticks[size - 1] < tsLimit);
    });
    if (timestampMode || this._options.timeMode === 'timestamp') {
      this.layout.xaxis.type = 'linear';
    } else {
      this.layout.xaxis.type = 'date';
    }
    gtsList.forEach((gts: GTS, i) => {
      if (gts.v) {
        const size = gts.v.length;
        const label = GTSLib.serializeGtsMetadata(gts);
        const c = ColorLib.getColor(gts.id, this._options.scheme);
        const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
        const series: Partial<any> = {
          type: 'scattergl',
          mode: 'markers',
          name: label,
          x: [],
          y: [],
          text: [],
          hoverinfo: 'none',
          connectgaps: false,
          visible: !(this._hiddenData.filter(h => h === gts.id).length > 0),
          line: {color},
          marker: {
            symbol: 'line-ns-open',
            color,
            size: 20,
            width: 5,
          }
        };
        this.visibleGtsId.push(gts.id);
        this.gtsId.push(gts.id);
        if (timestampMode || !!this._options.timeMode && this._options.timeMode === 'timestamp') {
          this.layout.xaxis.type = 'linear';
        } else {
          this.layout.xaxis.type = 'date';
        }
        const ticks = [];
        series.text = [];
        series.y = [];
        if (size > 0) {
          for (let v = 0; v < size; v++) {
            const val = gts.v[v];
            const t = val[0];
            ticks.push(t);
            series.text.push(val[val.length - 1]);
            series.y.push((this.expanded ? i : 0) + 0.5);
            this.minTick = (t < this.minTick) ? t : this.minTick;
            this.maxTick = (t > this.maxTick) ? t : this.maxTick;
          }
        }
        if (timestampMode || this._options.timeMode === 'timestamp') {
          series.x = ticks;
        } else {
          series.x = ticks.map(t => GTSLib.toISOString(t, this.divider, this._options.timeZone));
        }
        if (series.x.length > 0) {
          dataset.push(series);
        }
      }
    });
    this.LOG.debug(['convert'], 'forEach value end', this.minTick, this.maxTick);
    if (nonPlottable.length > 0) {
      nonPlottable.forEach(g => {
        g.v.forEach(value => {
          const ts = value[0];
          if (ts < this.minTick) {
            this.minTick = ts;
          }
          if (ts > this.maxTick) {
            this.maxTick = ts;
          }
        });
      });
      // if there is not any plottable data, we must add a fake one with id -1. This one will always be hidden.
      if (0 === gtsList.length) {
        if (!this.dataHashset[this.minTick]) {
          this.dataHashset[this.minTick] = [0];
        }
        if (!this.dataHashset[this.maxTick]) {
          this.dataHashset[this.maxTick] = [0];
        }
        this.visibility.push(false);
        this.visibleGtsId.push(-1);
      }
    }
    const x = {...this.layout.xaxis, tick0: undefined, range: []};
    const pad = ChartLib.fraction2r(this.minTick, this.maxTick, 0.067);
    if (timestampMode || !!this._options.timeMode && this._options.timeMode === 'timestamp') {
      x.tick0 = this.minTick - pad;
      x.range = [x.tick0, this.maxTick + pad];
    } else {
      x.tick0 = GTSLib.toISOString(this.minTick - pad, this.divider, this._options.timeZone);
      x.range = [x.tick0, GTSLib.toISOString(this.maxTick + pad, this.divider, this._options.timeZone)];
    }
    this.layout.xaxis = x;
    this.noData = dataset.length === 0;
    return dataset;
  }

  toggle() {
    setTimeout(() => {
      this.expanded = !this.expanded;
      this.drawChart(false);
    });
  }

  setRealBounds(chartBounds: ChartBounds) {
    this.LOG.debug(['setRealBounds'], chartBounds, this._options.timeMode);
    this.afterBoundsUpdate = true;
    this.minTick = chartBounds.tsmin;
    this.maxTick = chartBounds.tsmax;
    this._options.bounds = this._options.bounds || {};
    this._options.bounds.minDate = this.minTick;
    this._options.bounds.maxDate = this.maxTick;
    const x: any = {
      tick0: undefined,
      range: [],
    };
    if (this._options.showRangeSelector) {
      x.rangeslider = {
        bgcolor: 'transparent',
        thickness: 40 / this.height
      };
    }
    if (!!this._options.timeMode && this._options.timeMode === 'timestamp') {
      x.tick0 = this.minTick / this.divider;
      x.range = [this.minTick, this.maxTick];
    } else {
      x.tick0 = GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
      x.range = [
        GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
        GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
      ];
    }
    this.layout.xaxis = x;
    this.layout = {...this.layout};
  }

  public resize(layout: { width: number; height: any }) {
    //
  }
}
