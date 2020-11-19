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

import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {DataModel} from '../../model/dataModel';
import {GTS} from '../../model/GTS';
import {GTSLib} from '../../utils/gts.lib';
import {ChartBounds} from '../../model/chartBounds';
import {ColorLib} from '../../utils/color-lib';
import {VisibilityState, WarpViewComponent} from '../warp-view-component';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {Subject} from 'rxjs';
import {throttleTime} from 'rxjs/operators';
import {Timsort} from '../../utils/timsort';

@Component({
  selector: 'warpview-chart',
  templateUrl: './warp-view-chart.component.html',
  styleUrls: ['./warp-view-chart.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewChartComponent extends WarpViewComponent implements OnInit {

  @ViewChild('line') line: ElementRef;

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    const previousVisibility = JSON.stringify(this.visibility);
    this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
    this._hiddenData = hiddenData;
    this.visibility = [];
    this.visibleGtsId.forEach(id => this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)));
    this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
    const newVisibility = JSON.stringify(this.visibility);
    this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility, this._hiddenData);
    if (previousVisibility !== newVisibility) {
      const visible = [];
      const hidden = [];
      (this.gtsId || []).forEach((id, i) => {
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
      this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change', visible, hidden);
    }
  }

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  @Input('standalone') standalone = true;
  @Output('boundsDidChange') boundsDidChange = new EventEmitter<any>();
  @Output('pointHover') pointHover = new EventEmitter<any>();
  @Output('warpViewChartResize') warpViewChartResize = new EventEmitter<any>();

  // tslint:disable-next-line:variable-name
  private _type = 'line';
  private visibility: boolean[] = [];
  private maxTick = 0;
  private minTick = 0;
  private visibleGtsId = [];
  private gtsId = [];
  private dataHashset = {};
  private chartBounds: ChartBounds = new ChartBounds();
  private visibilityStatus: VisibilityState = 'unknown';
  private afterBoundsUpdate = false;
  private marginLeft: number;
  private maxPlottable = 10000;
  private hoverTimeout: any;
  parsing = false;
  unhighliteCurve = new Subject<number[]>();
  highliteCurve = new Subject<{ on: number[], off: number[] }>();
  layout: Partial<any> = {
    showlegend: false,
    autosize: true,
    hovermode: 'x',
    hoverdistance: 20,
    xaxis: {
      font: {}
    },
    yaxis: {
      exponentformat: 'none',
      fixedrange: true,
      automargin: true,
      showline: true,
      font: {}
    },
    margin: {
      t: 0,
      b: 30,
      r: 10,
      l: 50
    },
  };
  private highlighted: any;

  update(options, refresh): void {
    this.drawChart(refresh);
  }

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewChartComponent, this._debug);
  }

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  public async getTimeClip(): Promise<ChartBounds> {
    return new Promise<ChartBounds>(resolve => {
      this.LOG.debug(['getTimeClip'], this.chartBounds);
      resolve(this.chartBounds);
    });
  }

  public resize(newHeight: number) {
    this.LOG.debug(['resize'], newHeight);
    this.height = newHeight;
    this.layout.height = this.height;
    if (this._options.showRangeSelector) {
      this.layout.xaxis.rangeslider = {
        bgcolor: 'transparent',
        thickness: 40 / this.height
      };
    }
  }

  drawChart(reparseNewData: boolean = false) {
    this.LOG.debug(['drawChart', 'this.layout', 'this.options'], this.layout, this._options, (this._options.bounds || {}).minDate);
    if (!this.initChart(this.el)) {
      this.LOG.debug(['drawChart', 'initChart', 'empty'], this._options);
      return;
    }
    this.plotlyConfig.scrollZoom = true;
    this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    this.layout.margin.t = this.standalone ? 20 : 10;
    this.layout.showlegend = this._showLegend;
    if (!this._responsive) {
      this.layout.width = this.width;
      this.layout.height = this.height;
    }

    this.LOG.debug(['drawChart', 'this.options'], this.layout, this._options);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    if (!!this._options.showRangeSelector) {
      this.resize(this.height);
    } else {
      this.layout.margin.b = 30;
    }
    this.layout = {...this.layout};
    this.highliteCurve.pipe(throttleTime(200)).subscribe(value => {
      this.graph.restyleChart({opacity: 0.4}, value.off);
      this.graph.restyleChart({opacity: 1}, value.on);
    });
    this.unhighliteCurve.pipe(throttleTime(200)).subscribe(value => {
      this.graph.restyleChart({opacity: 1}, value);
    });
    this.loading = false;
  }

  private emitNewBounds(min, max, marginLeft) {
    this.LOG.debug(['emitNewBounds'], min, max);
    this.boundsDidChange.emit({bounds: {min, max, marginLeft}, source: 'chart'});
  }

  protected initChart(el: ElementRef): boolean {
    const res = super.initChart(el);
    const x: any = {tick0: undefined, range: []};
    this.LOG.debug(['initChart', 'updateBounds'], this.chartBounds, this._options.bounds);
    const min = (this._options.bounds || {}).minDate || this.chartBounds.tsmin || this.minTick;
    const max = (this._options.bounds || {}).maxDate || this.chartBounds.tsmax || this.maxTick;
    this.LOG.debug(['initChart', 'updateBounds'], [min, max]);

    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      x.tick0 = min;
      x.range = [min, max];
    } else {
      x.tick0 = GTSLib.toISOString(min, this.divider, this._options.timeZone);
      x.range = [
        GTSLib.toISOString(min, this.divider, this._options.timeZone),
        GTSLib.toISOString(max, this.divider, this._options.timeZone)
      ];
    }
    this.layout.xaxis = x;
    if (!!res) {
      this.resize(this.height);
    }
    return res;
  }

  protected convert(data: DataModel): Partial<any>[] {
    this.parsing = !this._options.isRefresh;
    this.chartBounds.tsmin = undefined;
    this.chartBounds.tsmax = undefined;
    const dataset: Partial<any>[] = [];
    this.LOG.debug(['convert'], this._options.timeMode);
    this.LOG.debug(['convert', 'this._hiddenData'], this._hiddenData);
    this.LOG.debug(['convert', 'this._options.timezone'], this._options.timeZone);
    if (GTSLib.isArray(data.data)) {
      let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
      this.maxTick = Number.MIN_VALUE;
      this.minTick = Number.MAX_VALUE;
      this.visibleGtsId = [];
      this.gtsId = [];
      const nonPlottable = gtsList.filter(g => (g.v && !GTSLib.isGtsToPlot(g)));
      gtsList = gtsList.filter(g => g.v && GTSLib.isGtsToPlot(g));
      // initialize visibility status
      if (this.visibilityStatus === 'unknown') {
        this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
      }

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
        if (gts.v && GTSLib.isGtsToPlot(gts)) {
          Timsort.sort(gts.v, (a, b) => a[0] - b[0]);
          const size = gts.v.length;
          const label = GTSLib.serializeGtsMetadata(gts);
          const c = ColorLib.getColor(gts.id, this._options.scheme);
          const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
          const type = ((data.params || [])[i] || {type: this._type}).type || this._type;
          const series: Partial<any> = {
            type: type === 'scattergl',
            mode: type === 'scatter' ? 'markers' : size > this.maxPlottable ? 'lines' : 'lines+markers',
            // name: label,
            text: label,
            x: [],
            y: [],
            line: {color},
            hoverinfo: 'none',
            connectgaps: false,
            visible: !(this._hiddenData.filter(h => h === gts.id).length > 0),
          };
          if (type === 'scatter' || size < this.maxPlottable) {
            series.marker = {
              size: 3,
              color: new Array(size).fill(color),
              line: {color, width: 3},
              opacity: new Array(size).fill(this._type === 'scatter' || this._options.showDots ? 1 : 0)
            };
          }
          switch (type) {
            case 'spline':
              series.line.shape = 'spline';
              break;
            case 'area':
              series.fill = 'tozeroy';
              series.fillcolor = ColorLib.transparentize(color, 0.3);
              break;
            case 'step':
              series.line.shape = 'hvh';
              break;
            case 'step-before':
              series.line.shape = 'vh';
              break;
            case 'step-after':
              series.line.shape = 'hv';
              break;
          }
          this.visibleGtsId.push(gts.id);
          this.gtsId.push(gts.id);
          //  this.LOG.debug(['convert'], 'forEach value');
          const ticks = gts.v.map(t => t[0]);
          const values = gts.v.map(t => t[t.length - 1]);

          if (size > 0) {
            for (let v = 1; v < size; v++) {
              const ts = ticks[v];
              this.minTick = ts <= this.minTick ? ts : this.minTick;
              this.maxTick = ts >= this.maxTick ? ts : this.maxTick;
            }
          }
          if (timestampMode || this._options.timeMode === 'timestamp') {
            series.x = ticks;
          } else {
            series.x = ticks.map(t => GTSLib.toISOString(t, this.divider, this._options.timeZone));
          }
          series.y = values;
          dataset.push(series);
        }
      });
      if (nonPlottable.length > 0 && gtsList.length === 0) {
        nonPlottable.forEach(g => {
          g.v.forEach(value => {
            const ts = value[0];
            this.minTick = ts <= this.minTick ? ts : this.minTick;
            this.maxTick = ts >= this.maxTick ? ts : this.maxTick;
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
    }
    this.LOG.debug(['convert'], 'end', dataset, this.minTick, this.maxTick,
      GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
      GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone));
    this.noData = dataset.length === 0;
    this.parsing = false;
    return dataset;
  }

  afterPlot(plotlyInstance) {
    super.afterPlot(plotlyInstance);
    this.marginLeft = parseInt((this.graph.plotEl.nativeElement as HTMLElement).querySelector('g.bglayer > rect').getAttribute('x'), 10);

    this.LOG.debug(['afterPlot', 'marginLeft'], this.marginLeft);
    if (this.chartBounds.tsmin !== this.minTick || this.chartBounds.tsmax !== this.maxTick) {
      this.chartBounds.tsmin = this.minTick;
      this.chartBounds.tsmax = this.maxTick;
      this.chartBounds.marginLeft = this.marginLeft;
      this.chartDraw.emit(this.chartBounds);
      if (this.afterBoundsUpdate || this.standalone) {
        this.LOG.debug(['afterPlot', 'updateBounds'], this.minTick, this.maxTick, this.afterBoundsUpdate);
        this.emitNewBounds(this.minTick, this.maxTick, this.marginLeft);
        this.loading = false;
        this.afterBoundsUpdate = false;
      }
    } else {
      this.loading = false;
    }
  }

  relayout(data: any) {
    let change = false;
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
        this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
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
      this.LOG.debug(['relayout', 'updateBounds'], this.chartBounds);
      this.LOG.debug(['relayout', 'updateBounds'], GTSLib.toISOString(this.chartBounds.tsmin, this.divider, this._options.timeZone));
      this.emitNewBounds(this.chartBounds.tsmin, this.chartBounds.tsmax, this.marginLeft);
    }
    this.loading = false;
    this.afterBoundsUpdate = true;
  }

  sliderChange($event: any) {
    this.LOG.debug(['sliderChange'], $event);
  }

  updateBounds(min, max) {
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
    this.layout = {...this.layout};
    this.LOG.debug(['updateBounds'], {...this.layout.xaxis.range});
    this.afterBoundsUpdate = true;
  }


  setRealBounds(chartBounds: ChartBounds) {
    this.minTick = chartBounds.tsmin;
    this.maxTick = chartBounds.tsmax;
    this._options.bounds = this._options.bounds || {};
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
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
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

  hover(data: any) {
    //  this.LOG.debug(['hover'], data);
    const xaxis = data.points[0].xaxis;
    const yaxis = data.points[0].yaxis;
    let toHighlight;
    const curves = [];
    let delta = Number.MAX_VALUE;
    let point;
    const annotations = [];
    data.points.forEach(p => {
      curves.push(p.curveNumber);

      const dist = Math.abs(data.yvals[0] - p.y);
      if (delta > dist) {
        delta = dist;
        toHighlight = p.curveNumber;
        point = p;
      }
      data.meta = {
        x: p.x,
        y: p.y.toPrecision(3),
        w: xaxis.l2p(p.x),
        h: yaxis.l2p(p.y),
        name: p.data.text
      };
    });
    if (!!this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    annotations.push({
      x: point.x,
      y: point.y,
      arrowhead: 6,
      arrowsize: 1,
      ax: 3,
      ay: 3,
      arrowcolor: point.data.line.color
    });
    // this.graph.relayoutPlot('annotations', 'remove');
   // this.graph.relayoutPlot('annotations', annotations);
    super.hover(data, toHighlight);
  }

  unhover(data: any) {
    super.unhover(data);
    if (!!this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }


  handleMouseMove(evt: MouseEvent) {
    evt.preventDefault();
    if (this.standalone && this.line) {
      this.line.nativeElement.style.left = Math.max(evt.offsetX, 50) + 'px';
    }
  }

  handleMouseEnter(evt: MouseEvent) {
    evt.preventDefault();
    this.marginLeft = this.marginLeft || this.el.nativeElement.getBoundingClientRect().left;
    if (this.standalone && this.line) {
      this.renderer.setStyle(this.line.nativeElement, 'display', 'block');
      this.renderer.setStyle(this.line.nativeElement, 'bottom', (40 / this.height) + 'px');
    }
  }

  handleMouseOut(evt: MouseEvent) {
    // evt.preventDefault();
    if (this.standalone && this.line) {
      this.renderer.setStyle(this.line.nativeElement, 'left', '-100px');
      this.renderer.setStyle(this.line.nativeElement, 'display', 'none');
    }
    if (!!this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  //  setTimeout(() => this.graph.relayoutPlot('annotations', 'remove'), 1000);
  }
}
