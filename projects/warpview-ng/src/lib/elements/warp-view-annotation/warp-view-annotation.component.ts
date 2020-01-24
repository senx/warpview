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

import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
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

@Component({
  selector: 'warpview-annotation',
  templateUrl: './warp-view-annotation.component.html',
  styleUrls: ['./warp-view-annotation.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewAnnotationComponent extends WarpViewComponent {
  @ViewChild('date', {static: true}) date: ElementRef;
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

  displayExpander = true;

  // tslint:disable-next-line:variable-name
  private _type = 'line';
  private visibility: boolean[] = [];
  private expanded = false;
  private trimmed;
  private maxTick: number;
  private minTick: number;
  private visibleGtsId = [];
  private dataHashset = {};
  private lineHeight = 30;
  layout: Partial<any> = {
    showlegend: false,
    hovermode: 'closest',
    xaxis: {
      gridwidth: 1,
      fixedrange: true,
      autorange: false,
      automargin: false
    },
    autosize: false,
    autoexpand: false,
    yaxis: {
      showticklabels: true,
      fixedrange: true,
      dtick: 1,
      gridwidth: 1,
      tick0: 0,
      nticks: 2,
      rangemode: 'tozero',
      tickson: 'boundaries',
      //     ticks: 'inside',
      automargin: false,
      showline: true,
      zeroline: true,
      tickfont: {
        color: 'transparent'
      }
    },
    margin: {
      t: 30,
      b: 40,
      r: 0,
      l: 0,
      pad: 0
    },
  };

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
    public sizeService: SizeService,
  ) {
    super(el, sizeService);
    this.LOG = new Logger(WarpViewAnnotationComponent, this._debug);
  }

  update(options: Param, refresh: boolean): void {
    this._options = ChartLib.mergeDeep(this._options, options) as Param;
    this.drawChart(refresh);
  }

  updateBounds(min, max) {
    this.LOG.debug(['updateBounds'], min, max, this._options);
    this._options.bounds.minDate = min;
    this._options.bounds.maxDate = max;
    this.LOG.debug(['boundsDidChange'],
      moment.tz(min, this._options.timeZone).toISOString(),
      moment.tz(max, this._options.timeZone).toISOString());
    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.range = [min, max];
    } else {
      this.layout.xaxis.range = [
        moment.tz(min, this._options.timeZone).toISOString(),
        moment.tz(max, this._options.timeZone).toISOString()
      ];
    }
    this.layout = {...this.layout};
    this.LOG.debug(['updateBounds'], this.layout);
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
    this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
    this.displayExpander = (this.plotlyData.length > 1);
    const count = this.plotlyData.filter(d => d.y.length > 0).length;
    const calculatedHeight = (this.expanded ? this.lineHeight * count : this.lineHeight) + this.layout.margin.t + this.layout.margin.b;
    this.el.nativeElement.style.height = calculatedHeight + 'px';
    this.height = calculatedHeight;
    this.layout.height = this.height;
    this.LOG.debug(['drawChart', 'height'], this.height, count, calculatedHeight);
    this.layout.yaxis.range = [0, this.expanded ? count : 1];
    this.layout.margin.l = this.standalone ? 0 : 50;
    this.LOG.debug(['drawChart', 'this.layout'], this.responsive, reparseNewData);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    if (this.standalone) {
      this.plotlyConfig.scrollZoom = true;
    }
    this.loading = false;
  }

  hover(data: any) {
    this.LOG.debug(['plotly_hover'], data);
    const tooltip = this.toolTip.nativeElement;
    this.pointHover.emit({
      x: data.event.offsetX,
      y: data.event.offsetY
    });

    const layout = this.el.nativeElement.getBoundingClientRect();
    const count = this.plotlyData.filter(d => d.y.length > 0).length;
    tooltip.style.opacity = '1';
    tooltip.style.display = 'block';
    tooltip.style.top = (
      (this.expanded ? count - (data.points[0].y + 0.5) : 0) * (this.lineHeight) + this.layout.margin.t
    ) + 'px';
    tooltip.classList.remove('right', 'left');
    this.LOG.debug(['tooltip'], data);
    this.date.nativeElement.innerHTML = this._options.timeMode === 'timestamp'
      ? data.xvals[0]
      : (moment(data.xvals[0]).utc().toISOString() || '')
        .replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '');
    tooltip.innerHTML = `<div class="tooltip-body trimmed" id="tooltip-body">
        <span>${GTSLib.formatLabel(data.points[0].data.name)}: </span>
        <span class="value">${data.yvals[0]}</span>
      </div>`;
    if (data.event.offsetX > layout.width / 2) {
      tooltip.classList.add('left');
    } else {
      tooltip.classList.add('right');
    }
    tooltip.style.pointerEvents = 'none';
    this.LOG.debug(['plotly_hover'], tooltip.style.top);
  }

  unhover() {
    this.toolTip.nativeElement.style.display = 'none';
  }

  afterPlot() {
    this.loading = false;
    this.chartDraw.emit();
  }


  protected convert(data: DataModel): Partial<any>[] {
    const dataset: Partial<any>[] = [];
    const divider = GTSLib.getDivider(this._options.timeUnit);
    let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    this.maxTick = Number.NEGATIVE_INFINITY;
    this.minTick = Number.POSITIVE_INFINITY;
    this.visibleGtsId = [];
    const nonPlottable = gtsList.filter(g => g.v && GTSLib.isGtsToPlot(g));
    gtsList = gtsList.filter(g => g.v && !GTSLib.isGtsToPlot(g));
    gtsList.forEach((gts: GTS, i) => {
      if (gts.v) {
        const label = GTSLib.serializeGtsMetadata(gts);
        const color = ColorLib.getColor(gts.id, this._options.scheme);
        const series: Partial<any> = {
          type: 'scatter',
          mode: 'markers',
          name: label,
          text: label,
          x: [],
          y: [],
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
        gts.v.forEach(value => {
          const ts = value[0];
          if (ts < this.minTick) {
            this.minTick = ts;
          }
          if (ts > this.maxTick) {
            this.maxTick = ts;
          }
          (series.y as any[]).push((this.expanded ? i : 0) + 0.5);
          if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            (series.x as any[]).push(ts);
          } else {
            const timestamp = Math.floor(ts / divider);
            (series.x as any[]).push(moment(timestamp).utc(true).toDate());
          }
        });
        dataset.push(series);
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

    return dataset;
  }

  toggle() {
    this.expanded = !this.expanded;
    this.drawChart();
  }
}
