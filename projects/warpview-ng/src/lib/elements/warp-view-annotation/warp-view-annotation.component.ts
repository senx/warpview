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

import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
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

@Component({
  selector: 'warpview-annotation',
  templateUrl: './warp-view-annotation.component.html',
  styleUrls: ['./warp-view-annotation.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewAnnotationComponent extends WarpViewComponent {
  @ViewChild('chartContainer', {static: true}) chartContainer: ElementRef;

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
      this.drawChart(false);
      this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
    }
  }

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  @Input('standalone') standalone = true;
  @Output('pointHover') pointHover = new EventEmitter<any>();
  @Output('warpViewChartResize') warpViewChartResize = new EventEmitter<any>();
  @Output('chartDraw') chartDraw = new EventEmitter<any>();
  @Output('boundsDidChange') boundsDidChange = new EventEmitter<any>();

  displayExpander = true;

  // tslint:disable-next-line:variable-name
  private _type = 'line';
  private visibility: boolean[] = [];
  private expanded = true;
  private trimmed;
  private maxTick = Number.MIN_VALUE;
  private minTick = Number.MAX_VALUE;
  private visibleGtsId = [];
  private dataHashset = {};
  private lineHeight = 30;
  private chartBounds: ChartBounds = new ChartBounds();
  layout: Partial<any> = {
    showlegend: false,
    hovermode: 'closest',
    xaxis: {
      gridwidth: 1,
      fixedrange: false,
      autorange: false,
      automargin: false,
      showticklabels: false,
    },
    autosize: false,
    autoexpand: false,
    yaxis: {
      showticklabels: false,
      fixedrange: true,
      dtick: 1,
      gridwidth: 1,
      tick0: 0,
      nticks: 2,
      rangemode: 'tozero',
      tickson: 'boundaries',
      automargin: true,
      showline: true,
      zeroline: true
    },
    margin: {
      t: 30,
      b: 2,
      r: 10,
      l: 10
    },
  };
  marginLeft = 10;

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

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
  ) {
    super(el, renderer, sizeService);
    this._autoResize = false;
    this.LOG = new Logger(WarpViewAnnotationComponent, this._debug);
  }

  update(options: Param, refresh: boolean): void {
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
    this.LOG.debug(['updateBounds'],
      moment.tz(min / this.divider, this._options.timeZone).toISOString(),
      moment.tz(max / this.divider, this._options.timeZone).toISOString());
    this.minTick = min;
    this.maxTick = max;
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.tick0 = min / this.divider;
      this.layout.xaxis.range = [min / this.divider, max / this.divider];
    } else {
      this.layout.xaxis.tick0 = moment.tz(min / this.divider, this._options.timeZone).toISOString();
      this.layout.xaxis.range = [
        moment.tz(min / this.divider, this._options.timeZone).toISOString(),
        moment.tz(max / this.divider, this._options.timeZone).toISOString()
      ];
    }
    this.layout.margin.l = marginLeft;
    this.marginLeft = marginLeft;
    this.layout = {... this.layout};
    this.LOG.debug(['updateBounds'], {... this.layout.xaxis.range });
  }

  drawChart(reparseNewData: boolean = false) {
    if (!this.initChart(this.el)) {
      this.el.nativeElement.style.display = 'none';
      return;
    }
    this.el.nativeElement.style.display = 'block';
    this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
    this.LOG.debug(['drawChart', 'hiddenData'], this._hiddenData);
    this.LOG.debug(['drawChart', 'this._options.bounds'], this._options.bounds);
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.yaxis.showline = this.standalone;
    this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.autorange = this.standalone;
    this.layout.xaxis.showticklabels = this.standalone;
    this.displayExpander = (this.plotlyData.length > 1);
    const count = this.plotlyData.filter(d => d.y.length > 0).length;
    const calculatedHeight = (this.expanded ? this.lineHeight * count : this.lineHeight) + this.layout.margin.t + this.layout.margin.b;
    this.el.nativeElement.style.height = calculatedHeight + 'px';
    this.height = calculatedHeight;
    this.layout.height = this.height;
    this.LOG.debug(['drawChart', 'height'], this.height, count, calculatedHeight);
    this.layout.yaxis.range = [0, this.expanded ? count : 1];
    this.layout.margin.l = this.standalone ? 10 : 50;
    this.layout.margin.b = this.standalone ? 30 : 10;
    this.LOG.debug(['drawChart', 'this.layout'], this.responsive, reparseNewData);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.tick0 = this.minTick / this.divider;
      this.layout.xaxis.range = [this.minTick / this.divider, this.maxTick / this.divider];
      this.layout.xaxis.type = 'linear';
    } else {
      this.layout.xaxis.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
      this.layout.xaxis.range = [
        moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
        moment.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
      ];
      this.layout.xaxis.type = 'date';
    }
    this.plotlyConfig.scrollZoom = !!this.standalone;
    this.plotlyConfig = {...this.plotlyConfig};
    this.layout = {...this.layout};
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig, this.plotlyData);
    this.loading = false;
  }

  relayout(data: any) {
    if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
      this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
      this.chartBounds.msmin = data['xaxis.range'][0];
      this.chartBounds.msmax = data['xaxis.range'][1];
      this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf();
      this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf();
    } else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
      this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
      this.chartBounds.msmin = data['xaxis.range[0]'];
      this.chartBounds.msmax = data['xaxis.range[1]'];
      this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf();
      this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf();
    } else if (data['xaxis.autorange']) {
      this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data);
      this.chartBounds.tsmin = this.minTick / this.divider;
      this.chartBounds.tsmax = this.maxTick / this.divider;
    }
    this.emitNewBounds(moment.utc(this.chartBounds.tsmin).valueOf(), moment.utc(this.chartBounds.msmax).valueOf());
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
    tooltip.style.paddingLeft = (this.standalone ? 0 : 40) + 'px';
    tooltip.style.top = (
      (this.expanded ? count - 1 - (data.points[0].y + 0.5) : -1) * (this.lineHeight) + this.layout.margin.t
    ) + 6 + 'px';
    tooltip.classList.remove('right', 'left');
    tooltip.innerHTML = `<div class="tooltip-body trimmed" id="tooltip-body">
<span class="tooltip-date">${this._options.timeMode === 'timestamp'
      ? x
      : (moment(x).utc().toISOString().replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '') || '')}</span>
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

  afterPlot(div) {
    this.loading = false;
    this.chartBounds.tsmin = this.minTick;
    this.chartBounds.tsmax = this.maxTick;
    this.chartDraw.emit(this.chartBounds);
    this.LOG.debug(['afterPlot'], this.chartBounds, div);
  }

  private emitNewBounds(min, max) {
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
    const dataset: Partial<any>[] = [];
    let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    this.maxTick = Number.NEGATIVE_INFINITY;
    this.minTick = Number.POSITIVE_INFINITY;
    this.visibleGtsId = [];
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
          type: 'scatter',
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
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
          this.layout.xaxis.type = 'linear';
        } else {
          this.layout.xaxis.type = 'date';
        }
        const ticks = gts.v.map(t => t[0]);
        series.text = gts.v.map(t => t[t.length - 1]);
        series.y = gts.v.map(() => (this.expanded ? i : 0) + 0.5);
        if (size > 0) {
          this.minTick = ticks[0];
          this.maxTick = ticks[0];
          for (let v = 1; v < size; v++) {
            const val = ticks[v];
            this.minTick = (val < this.minTick) ? val : this.minTick;
            this.maxTick = (val > this.maxTick) ? val : this.maxTick;
          }
        }
        if (timestampMode || this._options.timeMode === 'timestamp') {
          series.x = ticks;
        } else {
          if (this._options.timeZone !== 'UTC') {
            series.x = ticks.map(t => moment.utc(t / this.divider).tz(this._options.timeZone).toISOString());
          } else {
            series.x = ticks.map(t => moment.utc(t / this.divider).toISOString());
          }
        }
        if (series.x.length > 0) {
          dataset.push(series);
        }
      }
    });
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
    if (timestampMode) {
      this._options.timeMode = 'timestamp';
    }
    return dataset;
  }

  toggle() {
    this.expanded = !this.expanded;
    this.drawChart();
  }

  setRealBounds(chartBounds: ChartBounds) {
    this.minTick = chartBounds.tsmin;
    this.maxTick = chartBounds.tsmax;
    this._options.bounds.minDate = this.minTick;
    this._options.bounds.maxDate = this.maxTick;
    const x = {
      tick0: undefined,
      range: []
    };
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      x.tick0 = this.minTick / this.divider;
      x.range = [this.minTick / this.divider, this.maxTick / this.divider];
    } else {
      x.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
      x.range = [
        moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
        moment.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
      ];
    }
    this.layout.xaxis = x;
    this.layout = {...this.layout};
  }
}
