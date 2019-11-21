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

import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Logger} from '../../utils/logger';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import {ColorLib} from '../../utils/color-lib';
import moment from 'moment-timezone';
import {SizeService} from '../../services/resize.service';
import deepEqual from 'deep-equal';

@Component({
  selector: 'warpview-radar',
  templateUrl: './warp-view-radar.component.html',
  styleUrls: ['./warp-view-radar.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
/**
 *
 */
export class WarpViewRadarComponent extends WarpViewComponent implements OnInit, OnDestroy {

  @ViewChild('toolTip', {static: true}) toolTip: ElementRef;
  @ViewChild('graph', {static: true}) graph: ElementRef;

  @Output() chartDraw = new EventEmitter<any>();

  protected layout: Partial<any> = {
    paper_bgcolor: 'transparent',
    showlegend: true,
    legend: {orientation: 'h'},
    font: {size: 12},
    polar: {
      bgcolor: 'transparent',
      angularaxis: {type: 'category'},
      radialaxis: {visible: true}
    }
  };

  update(options, refresh): void {
    if (options) {
      let optionChanged = false;
      Object.keys(options).forEach(opt => {
        if (this._options.hasOwnProperty(opt)) {
          optionChanged = optionChanged || !deepEqual(options[opt], this._options[opt]);
        } else {
          optionChanged = true; // new unknown option
        }
      });
      if (this.LOG) {
        this.LOG.debug(['onOptions', 'optionChanged'], optionChanged);
      }
      if (optionChanged) {
        if (this.LOG) {
          this.LOG.debug(['onOptions', 'options'], options);
        }
        this._options = options;
        this.drawChart();
      }
    } else {
      this.drawChart();
    }
  }

  constructor(private el: ElementRef, private sizeService: SizeService) {
    super();
    this.LOG = new Logger(WarpViewRadarComponent, this._debug);
    this.sizeService.sizeChanged$.subscribe(() => {
      if (this._chart) {
        this.layout.width = (el.nativeElement as HTMLElement).parentElement.getBoundingClientRect().width;
        this.layout.height = (el.nativeElement as HTMLElement).parentElement.getBoundingClientRect().height;
        Plotly.relayout(this.graph.nativeElement, {
          height: this.layout.height,
          width: this.layout.width
        });
      }
    });
  }

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  ngOnDestroy() {
    if (this._chart) {
      Plotly.purge(this._chart);
    }
  }

  private drawChart() {
    if (!this.initiChart(this.el)) {
      return;
    }
    this.layout.polar.radialaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.polar.angularaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.showlegend = this.showLegend;
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
    Plotly.newPlot(this.graph.nativeElement, this.plotlyData, this.layout, this.plotlyConfig).then(plot => {
      this._chart = plot;
      this.manageTooltip(this.toolTip.nativeElement, this.graph.nativeElement);
      this.chartDraw.emit();
      this.loading = false;
    });
  }

  protected convert(data: DataModel): any[] {
    const dataset: any[] = [];
    const divider = GTSLib.getDivider(this._options.timeUnit);
    const gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    this.LOG.debug(['convert', 'gtsList'], gtsList);
    let minVal = Number.MAX_VALUE;
    let maxVal = Number.MIN_VALUE;
    gtsList.forEach((gts: GTS) => {
      const color = ColorLib.getColor(gts.id, this._options.scheme);
      const series: any = {
        r: [],
        theta: [],
        line: {color},
        marker: {
          line: {color, width: 1},
          color: ColorLib.transparentize(color)
        },
        fillcolor: ColorLib.transparentize(color),
        hoverinfo: 'none',
        name: GTSLib.serializeGtsMetadata(gts),
        text: GTSLib.serializeGtsMetadata(gts),
        type: 'scatterpolar',
        fill: 'toself'
      };
      gts.v.forEach(value => {
        const ts = value[0];
        series.r.push(value[value.length - 1]);
        minVal = Math.min(minVal, value[value.length - 1]);
        maxVal = Math.max(maxVal, value[value.length - 1]);
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
          series.theta.push(ts.toString());
        } else {
          const timestamp = Math.floor(ts / divider);
          series.theta.push(moment(timestamp).utc(true).toISOString());
        }
      });
      dataset.push(series);
    });
    this.layout.polar.radialaxis.range = [minVal, maxVal];
    return dataset;
  }
}
