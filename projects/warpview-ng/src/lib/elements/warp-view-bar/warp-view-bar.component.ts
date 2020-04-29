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

import {Component, ElementRef, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {ColorLib} from '../../utils/color-lib';
import moment from 'moment-timezone';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';

@Component({
  selector: 'warpview-bar',
  templateUrl: './warp-view-bar.component.html',
  styleUrls: ['./warp-view-bar.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewBarComponent extends WarpViewComponent implements OnInit {

  layout: Partial<any> = {
    showlegend: false,
    xaxis: {},
    yaxis: {
      exponentformat: 'none',
      fixedrange: true,
      showline: true
    },
    margin: {
      t: 10,
      b: 40,
      r: 10,
      l: 50
    }
  };

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
  ) {
    super(el, renderer, sizeService);
    this.LOG = new Logger(WarpViewBarComponent, this._debug);
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
    let gtsList = [];
    if (GTSLib.isArray(data.data)) {
      if (data.data.length > 0 && GTSLib.isGts(data.data[0])) {
        gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
      } else {
        gtsList = data.data as any[];
      }
    } else {
      gtsList = [data.data];
    }
    this.LOG.debug(['convert', 'gtsList'], gtsList);
    const dataset = [];
    gtsList.forEach((gts, i) => {
      if (gts.v) {
        const label = GTSLib.serializeGtsMetadata(gts);
        const c = ColorLib.getColor(gts.id || i, this._options.scheme);
        const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
        const series: Partial<any> = {
          type: 'bar',
          mode: 'lines+markers',
          name: label,
          text: label,
          orientation: this._options.horizontal ? 'h' : 'v',
          x: [],
          y: [],
          hoverinfo: 'none',
          marker: {
            color: ColorLib.transparentize(color),
            line: {
              color,
              width: 1
            }
          }
        };
        gts.v.forEach(value => {
          const ts = value[0];
          if (!this._options.horizontal) {
            series.y.push(value[value.length - 1]);
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
              series.x.push(ts);
            } else {
              series.x.push(moment.tz(moment.utc(ts / this.divider), this._options.timeZone).toISOString());
            }
          } else {
            series.x.push(value[value.length - 1]);
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
              series.y.push(ts);
            } else {
              series.y.push(moment.tz(moment.utc(ts / this.divider), this._options.timeZone).toISOString());
            }
          }
        });
        dataset.push(series);
      } else {
        this._options.timeMode = 'custom';
        this.LOG.debug(['convert', 'gts'], gts);
        (gts.columns || []).forEach((label, index) => {
          const c = ColorLib.getColor(gts.id || index, this._options.scheme);
          const color = ((data.params || [])[index] || {datasetColor: c}).datasetColor || c;
          const series: Partial<any> = {
            type: 'bar',
            mode: 'lines+markers',
            name: label,
            text: label,
            orientation: this._options.horizontal ? 'h' : 'v',
            x: [],
            y: [],
            hoverinfo: 'none',
            marker: {
              color: ColorLib.transparentize(color),
              line: {
                color,
                width: 1
              }
            }
          };
          if (this._options.horizontal) {
            (gts.rows || []).forEach(r => {
              series.y.unshift(r[0]);
              series.x.push(r[index + 1]);
            });
          } else {
            (gts.rows || []).forEach(r => {
              series.x.push(r[0]);
              series.y.push(r[index + 1]);
            });
          }
          dataset.push(series);
        });
      }
    });
    this.LOG.debug(['convert', 'dataset'], dataset, this._options.horizontal);
    return dataset;
  }

  private buildGraph() {
    this.LOG.debug(['buildGraph', 'this.layout'], this.responsive);
    this.LOG.debug(['buildGraph', 'this.layout'], this.layout);
    this.LOG.debug(['buildGraph', 'this.plotlyConfig'], this.plotlyConfig);
    this.layout.showlegend = this._showLegend;
    this.layout.barmode = this._options.stacked ? 'stack' : 'group';
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    this.loading = false;
  }
}
