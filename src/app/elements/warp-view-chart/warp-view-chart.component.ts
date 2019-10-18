/*
 * Copyright 2019 SenX S.A.S.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DataModel} from '../../model/dataModel';
import {GTS} from '../../model/GTS';
import {GTSLib} from '../../utils/gts.lib';
import * as moment from 'moment-timezone';
import {ChartBounds} from '../../model/chartBounds';
import {ColorLib} from '../../utils/color-lib';
import {Logger} from '../../utils/logger';
import {WarpViewComponent} from '../warp-view-component';
import {SizeService} from '../../services/resize.service';

type visibilityState = 'unknown' | 'nothingPlottable' | 'plottablesAllHidden' | 'plottableShown';

@Component({
  selector: 'warpview-chart',
  templateUrl: './warp-view-chart.component.html',
  styleUrls: ['./warp-view-chart.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewChartComponent extends WarpViewComponent implements OnInit, OnDestroy {
  @ViewChild('toolTip') toolTip: ElementRef;
  @ViewChild('graph') graph: ElementRef;

  @Input() set hiddenData(hiddenData: number[]) {
    const previousVisibility = JSON.stringify(this.visibility);
    this._hiddenData = hiddenData;
    if (!!this._chart) {
      this.visibility = [];
      this.visibleGtsId.forEach(id => {
        this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1));
      });
      this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
    }
    const newVisibility = JSON.stringify(this.visibility);
    if (previousVisibility !== newVisibility) {
      this.drawChart(false);
      this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
    }
  }

  @Input() set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  @Input() standalone = true;
  @Output() boundsDidChange = new EventEmitter<any>();
  @Output() pointHover = new EventEmitter<any>();
  @Output() warpViewChartResize = new EventEmitter<any>();
  @Output() chartDraw = new EventEmitter<any>();

  // tslint:disable-next-line:variable-name
  private _type = 'line';
  private visibility: boolean[] = [];

  protected layout: Partial<any> = {
    showlegend: false,
    autosize: true,
    xaxis: {
      rangeslider: {
        bgcolor: 'transparent'
      }
    },
    yaxis: {
      exponentformat: 'none',
      fixedrange: true,
      showline: true
    },
    margin: {
      t: 0,
      b: 25,
      r: 0,
      l: 50
    },
  };

  /**
   * usefull for default zoom
   */
  private maxTick = 0;
  /**
   * usefull for default zoom
   */
  private minTick = 0;
  /**
   * table of gts id displayed in dygraph. array order is the one of dygraph series
   */
  private visibleGtsId = [];
  /**
   * key = timestamp. values = table of available points, filled by null.
   */
  private dataHashset = {};
  /**
   * contains the bounds of current graph, in timestamp (platform time unit), and in millisecond.
   */
  private chartBounds: ChartBounds = new ChartBounds();
  private visibilityStatus: visibilityState = 'unknown';

  update(options, refresh): void {
    this.drawChart(refresh);
    /*  if (options) {
        this.visibilityStatus = 'unknown';
        let optionChanged = false;
     /!*   Object.keys(options).forEach(opt => {
          if (this._options.hasOwnProperty(opt)) {
            optionChanged = optionChanged || !deepEqual(options[opt] !== this._options[opt]);
          } else {
            optionChanged = true; // new unknown option
          }
        });*!/
        if (this.LOG) {
          this.LOG.debug(['onOptions', 'optionChanged'], optionChanged);
        }
      /!*  if (optionChanged) {
          if (this.LOG) {
            this.LOG.debug(['onOptions', 'options'], options);
          }*!/
          this._options = options;
          this.drawChart(false);
        //}
      } else {
        this.drawChart(refresh);
      }*/
  }

  constructor(private el: ElementRef, private sizeService: SizeService) {
    super();
    this.LOG = new Logger(WarpViewChartComponent, this._debug);
    this.sizeService.sizeChanged$.subscribe(() => {
      if (this._chart) {
        this.layout.width = (el.nativeElement as HTMLElement).parentElement.getBoundingClientRect().width;
        this.layout.height = (el.nativeElement as HTMLElement).parentElement.getBoundingClientRect().height;
        this.layout.xaxis.rangeslider.thickness = 40 / this.layout.height;
        Plotly.relayout(this.graph.nativeElement, {
          height: this.layout.height,
          width: this.layout.width,
          xaxis: {
            rangeslider: {
              thickness: 40 / this.layout.height
            }
          }
        });
      }
    });
  }

  /**
   *
   */
  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  /**
   *
   */
  ngOnDestroy() {
    if (this._chart) {
      this._chart.removeAllListeners('plotly_hover');
      this._chart.removeAllListeners('plotly_unhover');
      this._chart.removeAllListeners('plotly_relayout');
      Plotly.purge(this._chart);
    }
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
    this.layout.xaxis.rangeslider.thickness = 40 / this.layout.height;
    Plotly.relayout(this.graph.nativeElement, {
      height: this.layout.height,
      xaxis: {
        rangeslider: {
          thickness: 40 / this.layout.height
        }
      }
    });
  }

  drawChart(reparseNewData: boolean = false) {
    if (!this.initiChart(this.el)) {
      return;
    }
    this.plotlyConfig.scrollZoom = true;
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.tick0 = this.minTick / this.divider;
    } else {
      this.layout.xaxis.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
    }

    this.layout.yaxis.color = this.getLabelColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getLabelColor(this.el.nativeElement);
    this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    if (!this.responsive) {
      this.layout.width = this.width;
      this.layout.height = this.height;
    }
    this.LOG.debug(['drawChart', 'this.layout'], this.responsive, reparseNewData);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    if (this._chart) {
      this.ngOnDestroy();
    }
    this.layout.xaxis.rangeslider.thickness = 40 / this.height;
    Plotly.newPlot(this.graph.nativeElement, this.plotlyData, this.layout, this.plotlyConfig).then(plot => {
      this._chart = plot;
      this.manageTooltip(this.toolTip.nativeElement, this.graph.nativeElement);
      this._chart.on('plotly_relayout', data => {
        this.LOG.debug(['plotly_relayout'], data);
        if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
          this.emitNewBounds(data['xaxis.range'][0], data['xaxis.range'][1]);
        } else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
          this.emitNewBounds(data['xaxis.range[0]'], data['xaxis.range[1]']);
        } else if (data['xaxis.autorange']) {
          this.emitNewBounds(this.minTick / this.divider, this.maxTick / this.divider);
        }
      });
      this.chartDraw.emit();
      this.emitNewBounds(this.minTick / this.divider, this.maxTick / this.divider);
      this.loading = false;
    });
  }

  private emitNewBounds(min, max) {
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.boundsDidChange.emit({bounds: {min, max}});
    } else {
      this.boundsDidChange.emit({
        bounds: {
          min: moment.tz(min, this._options.timeZone).valueOf(),
          max: moment.tz(max, this._options.timeZone).valueOf()
        }
      });
    }
  }

  protected convert(data: DataModel): Partial<any>[] {
    const dataset: Partial<any>[] = [];
    this.LOG.debug(['convert'], this._options.timeMode);
    this.visibility = [];
    let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    this.maxTick = Number.NEGATIVE_INFINITY;
    this.minTick = Number.POSITIVE_INFINITY;
    this.visibleGtsId = [];
    const nonPlottable = gtsList.filter(g => {
      return (g.v && !GTSLib.isGtsToPlot(g));
    });
    gtsList = gtsList.filter(g => {
      return (g.v && GTSLib.isGtsToPlot(g));
    });
    // initialize visibility status
    if (this.visibilityStatus === 'unknown') {
      this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
    }

    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.type = 'linear';
    } else {
      this.layout.xaxis.type = 'date';
    }
    gtsList.forEach((gts: GTS) => {
      if (gts.v && GTSLib.isGtsToPlot(gts)) {
        const label = GTSLib.serializeGtsMetadata(gts);
        const color = ColorLib.getColor(gts.id, this._options.scheme);
        const series: Partial<any> = {
          type: 'scatter',
          mode: this._options.showDots ? 'lines+markers' : 'lines',
          name: label,
          text: label,
          x: [],
          y: [],
          line: {color},
          hoverinfo: 'none',
          connectgaps: false,
          visible: this._hiddenData.filter(h => h === gts.id).length >= 0,
        };
        switch (this._type) {
          case 'spline':
            series.line.shape = 'spline';
            break;
          case 'area':
            series.fill = 'tozeroy';
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
        this.visibility.push(true);
        this.visibleGtsId.push(gts.id);

        gts.v.forEach(value => {
          const ts = value[0];
          if (ts < this.minTick) {
            this.minTick = ts;
          }
          if (ts > this.maxTick) {
            this.maxTick = ts;
          }
          (series.y as any[]).push(value[value.length - 1]);
          if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            (series.x as any).push(ts);
          } else {
            (series.x as any).push(moment(Math.floor(ts / this.divider)).utc(true).toDate());
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

    return dataset;
  }
}
