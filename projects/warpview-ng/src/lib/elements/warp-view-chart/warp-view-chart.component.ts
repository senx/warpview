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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {DataModel} from '../../model/dataModel';
import {GTS} from '../../model/GTS';
import {GTSLib} from '../../utils/gts.lib';
import moment from 'moment-timezone';
import {ChartBounds} from '../../model/chartBounds';
import {ColorLib} from '../../utils/color-lib';
import {VisibilityState, WarpViewComponent} from '../warp-view-component';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';

@Component({
  selector: 'warpview-chart',
  templateUrl: './warp-view-chart.component.html',
  styleUrls: ['./warp-view-chart.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewChartComponent extends WarpViewComponent implements OnInit {


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
  @Output('boundsDidChange') boundsDidChange = new EventEmitter<any>();
  @Output('pointHover') pointHover = new EventEmitter<any>();
  @Output('warpViewChartResize') warpViewChartResize = new EventEmitter<any>();

  // tslint:disable-next-line:variable-name
  private _type = 'line';
  private visibility: boolean[] = [];

  layout: Partial<any> = {
    showlegend: false,
    autosize: true,
    hovermode: 'x',
    xaxis: {},
    yaxis: {
      exponentformat: 'none',
      fixedrange: true,
      showline: true
    },
    margin: {
      t: 0,
      b: 25,
      r: 10,
      l: 50
    },
  };

  private maxTick = 0;
  private minTick = 0;
  private visibleGtsId = [];
  private dataHashset = {};
  private chartBounds: ChartBounds = new ChartBounds();
  private visibilityStatus: VisibilityState = 'unknown';
  private afterBoundsUpdate = false;

  update(options, refresh): void {
    this.drawChart(refresh);
  }

  constructor(
    public el: ElementRef,
    public sizeService: SizeService,
  ) {
    super(el, sizeService);
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
    this.LOG.debug(['drawChart', 'this.layout', 'this.options'], this.layout, this._options);
    if (!this.initChart(this.el)) {
      this.LOG.debug(['drawChart', 'initChart'], this._options);
      return;
    }
    this.plotlyConfig.scrollZoom = true;
    if (!!this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.type = 'linear';
      this.layout.xaxis.tick0 = this.minTick / this.divider;
    } else {
      this.layout.xaxis.type = 'date';
      this.layout.xaxis.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
    }

    this.layout.yaxis.color = this.getLabelColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getLabelColor(this.el.nativeElement);
    this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    this.layout.margin.t = this.standalone ? 20 : 10;
    this.layout.automargin = this.standalone;
    this.layout.showlegend = this._showLegend;
    if (!this._responsive) {
      this.layout.width = this.width;
      this.layout.height = this.height;
    }
    this.LOG.debug(['drawChart', 'this.options'], this.layout, this._options);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    if (this._options.showRangeSelector) {
      this.layout.xaxis.rangeslider = {
        bgcolor: 'transparent',
        thickness: 40 / this.height
      };
    } else {
      this.layout.margin.b = 30;
    }
    this.loading = false;
  }

  private emitNewBounds(min, max) {
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.boundsDidChange.emit({bounds: {min, max}, source: 'chart'});
    } else {
      this.boundsDidChange.emit({
        bounds: {
          min: moment.tz(min, this._options.timeZone).valueOf(),
          max: moment.tz(max, this._options.timeZone).valueOf()
        }, source: 'chart'
      });
    }
  }

  protected convert(data: DataModel): Partial<any>[] {
    const dataset: Partial<any>[] = [];
    this.LOG.debug(['convert'], this._options.timeMode);
    this.LOG.debug(['convert', 'this._hiddenData'], this._hiddenData);
    if (GTSLib.isArray(data.data)) {
      let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
      this.maxTick = Number.NEGATIVE_INFINITY;
      this.minTick = Number.POSITIVE_INFINITY;
      this.visibleGtsId = [];
      const nonPlottable = gtsList.filter(g => {
        this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
        return (g.v && !GTSLib.isGtsToPlot(g));
      });
      gtsList = gtsList.filter(g => {
        return (g.v && GTSLib.isGtsToPlot(g));
      });
      // initialize visibility status
      if (this.visibilityStatus === 'unknown') {
        this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
      }

      this.LOG.debug(['convert'], this._options.timeMode);
      gtsList.forEach((gts: GTS, i) => {
        if (gts.v && GTSLib.isGtsToPlot(gts)) {
          const label = GTSLib.serializeGtsMetadata(gts);
          const c = ColorLib.getColor(gts.id, this._options.scheme);
          const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
          const series: Partial<any> = {
            type: 'scatter',
            mode: this._type === 'scatter' ? 'markers' : this._options.showDots ? 'lines+markers' : 'lines',
            name: label,
            text: label,
            x: [],
            y: [],
            line: {color},
            hoverinfo: 'none',
            connectgaps: false,
            visible: !(this._hiddenData.filter(h => h === gts.id).length > 0),
          };
          switch (this._type) {
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

          gts.v.forEach(value => {
            const ts = value[0];
            if (ts < this.minTick) {
              this.minTick = ts;
            }
            if (ts > this.maxTick) {
              this.maxTick = ts;
            }
            series.y.push(value[value.length - 1]);
            if (!!this._options.timeMode && this._options.timeMode === 'timestamp') {
              series.x.push(ts);
            } else {
              series.x.push(moment.tz(moment.utc(ts / this.divider), this._options.timeZone).toISOString());
            }
          });
          dataset.push(series);
        }
      });
      if (nonPlottable.length > 0) { // && gtsList.length === 0) {
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
    }
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.type = 'linear';
    } else {
      this.layout.xaxis.type = 'date';
    }
    return dataset;
  }

  afterPlot() {
    this.LOG.debug(['plotly_afterPlot']);
    this.chartBounds.tsmin = this.minTick;
    this.chartBounds.tsmax = this.maxTick;
    this.chartDraw.emit(this.chartBounds);
    if (!this.afterBoundsUpdate) {

      this.LOG.debug(['afterPlot', 'updateBounds'], this.minTick, this.maxTick);
      this.emitNewBounds(this.minTick, this.maxTick);
      this.loading = false;
      this.afterBoundsUpdate = false;
    }
  }

  relayout(data: any) {
    if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
      this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
      this.chartBounds.msmin = data['xaxis.range'][0];
      this.chartBounds.msmax = data['xaxis.range'][1];
      this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
      this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
    } else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
      this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
      this.chartBounds.msmin = data['xaxis.range[0]'];
      this.chartBounds.msmax = data['xaxis.range[1]'];
      this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
      this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
    } else if (data['xaxis.autorange']) {
      this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data, this.minTick, this.maxTick);
      this.chartBounds.tsmin = this.minTick;
      this.chartBounds.tsmax = this.maxTick;
    }
    this.emitNewBounds(this.chartBounds.tsmin, this.chartBounds.tsmax);
    this.afterBoundsUpdate = false;
  }

  sliderChange($event: any) {
    this.LOG.debug(['sliderChange'], $event);
    console.log($event);
  }

  updateBounds(min, max) {
    this.LOG.debug(['updateBounds'], min, max, this._options);
    min = min || this.minTick / this.divider;
    max = max || this.maxTick / this.divider;
    this.layout.xaxis.autorange = false;
    this.LOG.debug(['updateBounds'],
      moment.tz(min, this._options.timeZone).toISOString(),
      moment.tz(max, this._options.timeZone).toISOString());
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.range = [min, max];
      this.layout.xaxis.tick0 = min;
    } else {
      this.layout.xaxis.range = [
        moment.tz(min, this._options.timeZone).toISOString(),
        moment.tz(max, this._options.timeZone).toISOString()
      ];
      this.layout.xaxis.tick0 = moment.tz(min, this._options.timeZone).toISOString();
    }
    this.layout = {...this.layout};
    this.LOG.debug(['updateBounds'], this.layout);
    this.afterBoundsUpdate = true;
  }


  setRealBounds(chartBounds: ChartBounds) {
    this.minTick = chartBounds.tsmin;
    this.maxTick = chartBounds.tsmax;
  }
}
