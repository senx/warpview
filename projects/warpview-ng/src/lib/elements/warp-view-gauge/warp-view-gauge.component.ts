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

import {Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import deepEqual from 'deep-equal';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {ChartLib} from '../../utils/chart-lib';
import {Param} from '../../model/param';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';

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
  private lineHeight = 80;
  private gaugeHeight = 200;
  // tslint:disable-next-line:variable-name
  protected _type = 'gauge'; // gauge or bullet
  layout: Partial<any> = {
    showlegend: false,
    autosize: false,
    autoexpand: false,
    margin: {
      t: 10,
      b: 2,
      r: 10,
      l: 10
    },
  };

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
    this._autoResize = this._type !== 'bullet';
    this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
    // this.layout.autosize = true;
    this.layout.grid = {
      rows: Math.ceil(this.plotlyData.length / 2),
      columns: 2,
      pattern: 'independent',
      xgap: 0,
      ygap: 0
    };
    this.layout.margin = {t: 25, r: 25, l: 25, b: 25};

    this.loading = false;
  }

  protected convert(data: DataModel): any[] {
    this.LOG.debug(['convert'], data);
    let gtsList = data.data as any[];
    const dataList = [];
    let overallMax = this._options.maxValue || Number.MIN_VALUE;
    this.LOG.debug(['convert', 'gtsList'], gtsList);
    if (!gtsList || gtsList.length === 0) {
      return;
    }
    gtsList = GTSLib.flatDeep(gtsList);
    const dataStruct = [];
    if (GTSLib.isGts(gtsList[0])) {
      gtsList.forEach((gts: GTS, i) => {
        let max: number = Number.MIN_VALUE;
        const values = (gts.v || []);
        const val = values[values.length - 1] || [];
        let value = 0;
        if (val.length > 0) {
          value = val[val.length - 1];
        }
        if (!!data.params && !!data.params[i] && !!data.params[i].maxValue) {
          max = data.params[i].maxValue;
        } else {
          if (overallMax < value) {
            overallMax = value;
          }
        }
        dataStruct.push({
          key: GTSLib.serializeGtsMetadata(gts),
          value,
          max
        });
      });
    } else {
      // custom data format
      gtsList.forEach((gts, i) => {
        let max: number = Number.MIN_VALUE;
        if (!!data.params && !!data.params[i] && !!data.params[i].maxValue) {
          max = data.params[i].maxValue;
        } else {
          if (overallMax < gts.value || Number.MIN_VALUE) {
            overallMax = gts.value || Number.MIN_VALUE;
          }
        }
        dataStruct.push({
          key: gts.key || '',
          value: gts.value || Number.MIN_VALUE,
          max
        });
      });
    }
    //  dataStruct.reverse();
    this.LOG.debug(['convert', 'dataStruct'], dataStruct);
    this.layout.annotations = [];
    let count = Math.ceil(dataStruct.length / 2);
    this.layout.autosize = true;

    this.layout.grid = {
      rows: count, columns: 1, pattern: 'independent',
      ygap: 0
    };
    let labelSize = 0.05;
    if (this._type === 'bullet') {
      this.layout.height = 100;
      this.layout.yaxis = {automargin: false};
      count = dataStruct.length;
      this.layout.autosize = false;
      let calculatedHeight = this.lineHeight * count + this.layout.margin.t + this.layout.margin.b;
      calculatedHeight += this.layout.grid.ygap * count;
      this.el.nativeElement.style.height = calculatedHeight + 'px';
      (this.el.nativeElement as HTMLDivElement).style.height = calculatedHeight + 'px';
      this.height = calculatedHeight;
      this.layout.height = this.height;
      labelSize = 20.0 / (this.layout.height - (this.layout.margin.t + this.layout.margin.b));
    }
    const itemHeight = 1 / count;
    let x = 0;
    let y = 1 + itemHeight;
    dataStruct.forEach((gts, i) => {
      if (this._type === 'bullet') {
        y -= itemHeight;
      } else {
        if (i % 2 === 0) {
          y -= itemHeight;
          x = 0;
        } else {
          x = 0.5;
        }
      }
      const c = ColorLib.getColor(i, this._options.scheme);
      const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
      const domain = dataStruct.length > 1 ? {
        x: [x + labelSize, x + 0.5 - labelSize],
        y: [y - itemHeight + labelSize * 2, y - labelSize * 2]
      } : {
        x: [0, 1],
        y: [0, 1]
      };
      if (this._type === 'bullet') {
        domain.x = [0, 1];
        domain.y = [y - itemHeight + labelSize, y - labelSize * 2];
        this.layout.annotations.push({
          xref: 'x domain',
          yref: 'y domain',
          x: 0,
          xanchor: 'left',
          y: y - labelSize / 2,
          yanchor: 'top',
          text: gts.key,
          showarrow: false,
          align: 'left',
          font: {
            size: 14,
            color: this.getLabelColor(this.el.nativeElement)
          }
        });
      }
      dataList.push(
        {
          domain,
          align: 'left',
          value: gts.value,
          delta: {
            reference: !!data.params && !!data.params[i] && !!data.params[i].delta ? data.params[i].delta + gts.value : 0,
            font: {color: this.getLabelColor(this.el.nativeElement)}
          },
          title: {
            text: this._type === 'bullet'
            || (!!data.params && !!data.params[i] && !!data.params[i].type && data.params[i].type === 'bullet') ? '' : gts.key,
            align: 'center',
            font: {color: this.getLabelColor(this.el.nativeElement)}
          },
          number: {
            font: {color: this.getLabelColor(this.el.nativeElement)}
          },
          type: 'indicator',
          mode: !!data.params && !!data.params[i] && !!data.params[i].delta ? 'number+delta+gauge' : 'gauge+number',
          gauge: {
            bgcolor: 'transparent',
            shape: !!data.params && !!data.params[i] && !!data.params[i].type ? data.params[i].type : this._type || 'gauge',
            bordercolor: this.getGridColor(this.el.nativeElement),
            axis: {
              range: [null, overallMax === Number.MIN_VALUE ? gts.max : overallMax],
              tickcolor: this.getGridColor(this.el.nativeElement),
              tickfont: {color: this.getGridColor(this.el.nativeElement)}
            },
            bar: {
              color: ColorLib.transparentize(color),
              thickness: 1,
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

  public resize(layout: { width: number; height: any }) {
    //
  }
}
