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

import {Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {DataModel} from '../../model/dataModel';
import gauge from 'canvas-gauges';
import {ColorLib} from '../../utils/color-lib';
import deepEqual from 'deep-equal';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {ChartLib} from '../../utils/chart-lib';
import {Param} from '../../model/param';

@Component({
  selector: 'warpview-gauge',
  templateUrl: './warp-view-gauge.component.html',
  styleUrls: ['./warp-view-gauge.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewGaugeComponent extends WarpViewComponent implements OnInit {
  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  private CHART_MARGIN = 0.05;
  // tslint:disable-next-line:variable-name
  private _type = 'gauge'; // gauge or bullet

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewGaugeComponent, this._debug);
  }

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  update(options, refresh): void {
    this.LOG.debug(['onOptions', 'before'], this._options, options);
    if (!deepEqual(options, this._options)) {
      this.LOG.debug(['options', 'changed'], options);
      this._options = ChartLib.mergeDeep(this._options, options as Param) as Param;
    }
    this.drawChart();
  }

  drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
    this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
    this.layout.autosize = true;
    this.layout.grid = {
      rows: Math.ceil(this.plotlyData.length / 2),
      columns: 2,
      pattern: 'independent',
      xgap: 0.2,
      ygap: 0.2
    };
    this.layout.margin = {t: 25, r: 25, l: 25, b: 25};
    if (this._type === 'bullet') {
      this.layout.height = this.plotlyData.length * 100;
      (this.el.nativeElement as HTMLDivElement).style.height = this.layout.height + 'px';
      this.layout.margin.l = 300;
      this.layout.yaxis = {
        automargin: true
      };
      this.layout.grid = {rows: this.plotlyData.length, columns: 1, pattern: 'independent'};
    }
    this.loading = false;
  }

  protected convert(data: DataModel): any[] {
    this.LOG.debug(['convert'], data);
    const gtsList = data.data as any[];
    const dataList = [];
    let max = Number.MIN_VALUE;
    this.LOG.debug(['convert', 'gtsList'], gtsList);
    if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
      return;
    }
    gtsList.forEach(d => max = Math.max(max, d[1]));
    let x = 0;
    let y = -1 / (gtsList.length / 2);
    gtsList.forEach((gts, i) => {
      if (i % 2 !== 0) {
        x = 0.5;
      } else {
        x = 0;
        y += 1 / (gtsList.length / 2);
      }
      const c = ColorLib.getColor(gts.id || i, this._options.scheme);
      const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
      const domain = gtsList.length > 1 ? {
        x: [x + this.CHART_MARGIN, x + 0.5 - this.CHART_MARGIN],
        y: [y + this.CHART_MARGIN, y + 1 / (gtsList.length / 2) - this.CHART_MARGIN * 2]
      } : {
        x: [0, 1],
        y: [0, 1]
      };
      if (this._type === 'bullet' || (!!data.params && !!data.params[i].type && data.params[i].type === 'bullet')) {
        domain.x = [this.CHART_MARGIN, 1 - this.CHART_MARGIN];
        domain.y = [(i > 0 ? i / gtsList.length : 0) + this.CHART_MARGIN, (i + 1) / gtsList.length - this.CHART_MARGIN];
      }
      dataList.push(
        {
          domain,
          align: 'left',
          value: gts[1],
          delta: {
            reference: !!data.params && !!data.params[i].delta ? data.params[i].delta + gts[1] : 0,
            font: {color: this.getLabelColor(this.el.nativeElement)}
          },
          title: {
            text: gts[0],
            align: 'center',
            font: {color: this.getLabelColor(this.el.nativeElement)}
          },
          number: {
            font: {color: this.getLabelColor(this.el.nativeElement)}
          },
          type: 'indicator',
          mode: !!data.params && !!data.params[i].delta ? 'number+delta+gauge' : 'gauge+number',
          gauge: {
            bgcolor: 'transparent',
            shape: !!data.params && !!data.params[i].type ? data.params[i].type : this._type || 'gauge',
            bordercolor: this.getGridColor(this.el.nativeElement),
            axis: {
              range: [null, max],
              tickcolor: this.getGridColor(this.el.nativeElement),
              tickfont: {color: this.getGridColor(this.el.nativeElement)}
            },
            bar: {
              color: ColorLib.transparentize(color),
              line: {
                width: 1,
                color
              }
            }
          }
        });
      this.LOG.debug(['convert', 'dataList'], i);
    });
    this.LOG.debug(['convert', 'dataList'], dataList);
    return dataList;
  }
}
