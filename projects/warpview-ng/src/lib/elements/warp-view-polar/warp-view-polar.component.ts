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

import {Component, ElementRef, NgZone, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import {GTS} from '../../model/GTS';
import {GTSLib} from '../../utils/gts.lib';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import deepEqual from 'deep-equal';
import {ChartLib} from '../../utils/chart-lib';
import {Param} from '../../model/param';

@Component({
  selector: 'warpview-polar',
  templateUrl: './warp-view-polar.component.html',
  styleUrls: ['./warp-view-polar.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
/**
 *
 */
export class WarpViewPolarComponent extends WarpViewComponent implements OnInit {
  layout: Partial<any> = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    showlegend: true,
    legend: {orientation: 'h'},
    font: {size: 12, familly: '\'Quicksand\', sans-serif'},
    polar: {
      bgcolor: 'rgba(0,0,0,0)',
      angularaxis: {
        type: 'category'
      },
      radialaxis: {
        visible: true,
      }
    },
    orientation: 270,
    margin: {
      t: 10,
      b: 25,
      r: 10,
      l: 10
    }
  };

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewPolarComponent, this._debug);
  }

  update(options, refresh): void {
    this.LOG.debug(['onOptions', 'before'], this._options, options);
    if (!deepEqual(options, this._options)) {
      this.LOG.debug(['options', 'changed'], options);
      this._options = ChartLib.mergeDeep(this._options, options as Param) as Param;
    }
    this.drawChart();
  }

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  private drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
    this.layout.polar.radialaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.polar.angularaxis.color = this.getGridColor(this.el.nativeElement);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
    this.loading = false;
  }

  protected convert(data: DataModel): Partial<any>[] {
    const dataset: Partial<any>[] = [];
    const divider = GTSLib.getDivider(this._options.timeUnit);
    const gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    this.LOG.debug(['convert', 'gtsList'], gtsList);
    let minVal = Number.MAX_VALUE;
    let maxVal = Number.MIN_VALUE;
    gtsList.forEach((gts: GTS, i) => {
      const c = ColorLib.getColor(i, this._options.scheme);
      const color = ((data.params || [])[gts.id] || {datasetColor: c}).datasetColor || c;
      const series: any = {
        r: [],
        theta: [],
        marker: {
          line: {color, width: 1},
          color: ColorLib.transparentize(color),
        },
        fillcolor: ColorLib.transparentize(color),
        hoverinfo: 'none',
        name: GTSLib.serializeGtsMetadata(gts),
        text: GTSLib.serializeGtsMetadata(gts),
        fill: 'toself',
        type: 'barpolar',
      };
      gts.v.forEach(value => {
        const ts = value[0];
        minVal = Math.min(minVal, value[value.length - 1]);
        maxVal = Math.max(maxVal, value[value.length - 1]);
        series.r.push(value[value.length - 1]);
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
          series.theta.push(ts.toString());
        } else {
          series.theta.push(GTSLib.toISOString(ts, this.divider, this._options.timeZone));
        }
      });
      if (this.unit) {
        series.title = {
          text: this.unit
        };
      }
      dataset.push(series);
    });
    this.layout.polar.radialaxis.range = [minVal, maxVal];
    return dataset;
  }

  public resize(layout: { width: number; height: any }) {
    //
  }
}
