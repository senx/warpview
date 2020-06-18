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

import {Component, ElementRef, NgZone, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {GTSLib} from '../../utils/gts.lib';
import moment from 'moment-timezone';

@Component({
  selector: 'warpview-bubble',
  templateUrl: './warp-view-bubble.component.html',
  styleUrls: ['./warp-view-bubble.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewBubbleComponent extends WarpViewComponent implements OnInit {

  layout: Partial<any> = {
    showlegend: false,
    xaxis: {},
    hovermode: 'closest',
    hoverdistance: 20,
    yaxis: {},
    margin: {
      t: 10,
      b: 25,
      r: 10,
      l: 50
    }
  };

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewBubbleComponent, this._debug);
  }

  ngOnInit() {
    this.drawChart();
  }

  update(options: Param): void {
    this.drawChart();
  }

  private drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
    this.plotlyConfig.scrollZoom = true;
    this.buildGraph();
  }

  protected convert(data: DataModel): Partial<any>[] {
    const dataset = [];
    GTSLib.flatDeep(data.data as any []).forEach((gts, i) => {
      const label = Object.keys(gts)[0];
      const c = ColorLib.getColor(gts.id || i, this._options.scheme);
      const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
      const series: Partial<any> = {
        type: 'scattergl',
        mode: 'markers',
        name: label,
        text: label,
        x: [],
        y: [],
        hoverinfo: 'none',
        marker: {
          color: ColorLib.transparentize(color),
          line: {
            color
          },
          size: []
        }
      };
      if (GTSLib.isGts(gts)) {
        const ticks = gts.v.map(t => t[0]);
        const values = gts.v.map(t => t[t.length - 1]);
        const sizes = new Array(gts.v.length).fill(10);
        if (this._options.timeMode === 'timestamp') {
          series.x = ticks;
        } else {
          if (this._options.timeZone !== 'UTC') {
            series.x = ticks.map(t => moment.utc(t / this.divider).tz(this._options.timeZone).toISOString());
          } else {
            series.x = ticks.map(t => moment.utc(t / this.divider).toISOString());
          }
        }
        series.y = values;
        series.marker.size = sizes;
      } else {
        gts[label].forEach(value => {
          series.y.push(value[0]);
          series.x.push(value[1]);
          series.marker.size.push(value[2]);
        });
      }
      dataset.push(series);
    });
    this.noData = dataset.length === 0;
    this.LOG.debug(['convert', 'dataset'], dataset);
    return dataset;
  }

  private buildGraph() {
    this.LOG.debug(['drawChart', 'this.responsive'], this._responsive);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    this.layout.showlegend = this.showLegend;
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    this.loading = false;
  }
}
