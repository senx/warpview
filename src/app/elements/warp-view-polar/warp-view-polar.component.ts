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

import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import {GTS} from '../../model/GTS';
import moment from 'moment-timezone';
import {GTSLib} from '../../utils/gts.lib';
import deepEqual from 'deep-equal';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';

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
    orientation: 270
  };

  constructor(
    protected el: ElementRef,
    protected sizeService: SizeService,
  ) {
    super(el, sizeService);
    this.LOG = new Logger(WarpViewPolarComponent, this._debug);
  }

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

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  private drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
    this.layout.polar.radialaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.polar.angularaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.showlegend = !!this.showLegend;
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
    gtsList.forEach((gts: GTS) => {
      const color = ColorLib.getColor(gts.id, this._options.scheme);
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
          const timestamp = Math.floor(ts / divider);
          series.theta.push(moment(timestamp).utc(true).toISOString());
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
}
