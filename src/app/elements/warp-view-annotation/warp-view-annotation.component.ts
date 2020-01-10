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

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {Logger} from '../../utils/logger';
import {ChartLib} from '../../utils/chart-lib';
import moment from 'moment-timezone';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import {ColorLib} from '../../utils/color-lib';
import {SizeService} from '../../services/resize.service';
import Plotly from 'plotly.js';

@Component({
  selector: 'warpview-annotation',
  templateUrl: './warp-view-annotation.component.html',
  styleUrls: ['./warp-view-annotation.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewAnnotationComponent extends WarpViewComponent implements OnInit, OnDestroy {
  @ViewChild('toolTip', { static: true }) toolTip: ElementRef;
  @ViewChild('graph', { static: true }) graph: ElementRef;
  @ViewChild('date', { static: true }) date: ElementRef;

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    if (this._chart && hiddenData) {
      this.LOG.debug(['hiddenData'], hiddenData);
      this._hiddenData = hiddenData;
      if (this._chart) {
        this.drawChart();
      }
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

  protected layout: Partial<any> = {
    showlegend: false,
    hovermode: 'closest',
    xaxis: {},
    autosize: false,
    yaxis: {
      showticklabels: true,
      fixedrange: true,
      dtick: 1,
      tick0: 0,
      automargin: false,
      showline: false,
      tickfont: {
        color: 'transparent'
      }
    },
    margin: {
      t: 20,
      b: 0,
      r: 0,
      l: 50
    },
  };

  constructor(private el: ElementRef, private sizeService: SizeService) {
    super();
    this.LOG = new Logger(WarpViewAnnotationComponent, this._debug);
    this.sizeService.sizeChanged$.subscribe(() => {
      if (this._chart) {
        this.layout.width = (this.el.nativeElement as HTMLElement).parentElement.getBoundingClientRect().width;
        this.height = (this.expanded ? 40 * this.plotlyData.length : 40) + this.layout.margin.t;
        this.layout.height = this.height;
        Plotly.relayout(this.graph.nativeElement, {
          height: this.layout.height,
          width: this.layout.width
        });
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this._chart) {
      this._chart.removeAllListeners('plotly_hover');
      this._chart.removeAllListeners('plotly_unhover');
      this._chart.removeAllListeners('plotly_relayout');
      Plotly.purge(this._chart);
    }
  }

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
    this._options = ChartLib.mergeDeep(this._options, options) as Param;
    this.drawChart();
  }

  updateBounds(min, max) {
    this.LOG.debug(['updateBounds'], min, max, this._options);
    this._options.bounds.minDate = min;
    this._options.bounds.maxDate = max;
    if (!!this._chart) {
      if (this._options.timeMode && this._options.timeMode === 'timestamp') {
        this.layout.xaxis.range = [min, max];
      } else {
        this.layout.xaxis.range = [
          moment.tz(min, this._options.timeZone).toISOString(true),
          moment.tz(max, this._options.timeZone).toISOString(true)
        ];
      }
      Plotly.relayout(this.graph.nativeElement, {
        'xaxis.range': this.layout.xaxis.range
      });
    }
  }

  drawChart(reparseNewData: boolean = false) {
    if (!this.initiChart(this.el)) {
      return;
    }
    this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
    this.LOG.debug(['drawChart', 'hiddenData'], this._hiddenData);
    this.LOG.debug(['drawChart', 'this._options.bounds'], this._options.bounds);
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    this.displayExpander = (this.plotlyData.length > 1);
    const calculatedHeight = (this.expanded ? 40 * this.plotlyData.length : 40) + this.layout.margin.t;
    this.height = calculatedHeight;
    this.LOG.debug(['drawChart', 'height'], this.height, this.plotlyData.length, calculatedHeight);
    this.layout.yaxis.range = [0, this.expanded ? this.plotlyData.length : 1];
    this.layout.height = this.height;
    this.LOG.debug(['drawChart', 'this.layout'], this.responsive, reparseNewData);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    if (this.standalone) {
      this.plotlyConfig.scrollZoom = true;
    }
    Plotly.newPlot(this.graph.nativeElement, this.plotlyData, this.layout, this.plotlyConfig).then(plot => {
      this.loading = false;
      this._chart = plot;
      this.chartDraw.emit();
      this._chart.on('plotly_hover', (data: any) => {
        this.LOG.debug(['plotly_hover'], data);
        const tooltip = this.toolTip.nativeElement;
        this.pointHover.emit({
          x: data.event.offsetX,
          y: data.event.offsetY
        });
        const layout = this.graph.nativeElement.getBoundingClientRect();
        tooltip.style.opacity = '1';
        tooltip.style.display = 'block';
        const lineHeight = (this.height - this.layout.margin.t) / (this.expanded ? this.plotlyData.length : 1);
        tooltip.style.top =
          ((this.expanded ? this.plotlyData.length - Math.floor(data.points[0].y + 0.5) + 1 : 1) *
            lineHeight - lineHeight / 2 - 10 + this.layout.margin.t) + 'px';
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
        return;
      });
      this._chart.on('plotly_unhover', () => {
        this.toolTip.nativeElement.style.display = 'none';
      });
    });
  }

  protected convert(data: DataModel): Partial<any>[] {
    const dataset: Partial<any>[] = [];
    const divider = GTSLib.getDivider(this._options.timeUnit);
    this.visibility = [];
    let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    this.maxTick = Number.NEGATIVE_INFINITY;
    this.minTick = Number.POSITIVE_INFINITY;
    this.visibleGtsId = [];
    const nonPlottable = gtsList.filter(g => {
      return (g.v && GTSLib.isGtsToPlot(g));
    });
    gtsList = gtsList.filter(g => {
      return (g.v && !GTSLib.isGtsToPlot(g));
    });
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
          line: {},
          hoverinfo: 'none',
          connectgaps: false,
          visible: this._hiddenData.filter(h => h === gts.id).length >= 0,
          'line.color': color,
          marker: {
            symbol: 'line-ns-open',
            color,
            size: 20,
            width: 5,
          }
        };
        this.visibility.push(true);
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

  private toggle() {
    this.expanded = !this.expanded;
    this.drawChart();
  }
}
