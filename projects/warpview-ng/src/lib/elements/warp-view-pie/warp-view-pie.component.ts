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

import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewEncapsulation} from '@angular/core';
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
  selector: 'warpview-pie',
  templateUrl: './warp-view-pie.component.html',
  styleUrls: ['./warp-view-pie.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewPieComponent extends WarpViewComponent implements OnInit {

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  @Output('chartDraw') chartDraw = new EventEmitter<any>();

  protected _type = 'pie';
  layout: Partial<any> = {
    showlegend: true,
    legend: {
      orientation: 'h',
      bgcolor: 'transparent',
    },
    orientation: 270,
    margin: {
      t: 10,
      b: 25,
      r: 10,
      l: 10
    }
  };

  update(options, refresh): void {
    this.LOG.debug(['onOptions', 'before'], this._options, options);
    if (!deepEqual(options, this._options)) {
      this.LOG.debug(['options', 'changed'], options);
      this._options = ChartLib.mergeDeep(this._options, options as Param) as Param;
    }
    this.drawChart();
  }

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewPieComponent, this._debug);
  }

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
    this.layout.legend.font = {
      color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
    };
    this.layout.textfont = {
      color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
    };
    this.loading = false;
  }

  protected convert(data: DataModel): Partial<any>[] {
    const gtsList = GTSLib.flatDeep(data.data as any[]);
    const plotData = [] as Partial<any>[];
    this.LOG.debug(['convert', 'gtsList'], gtsList);
    const pieData = {
      values: [],
      labels: [],
      marker: {
        colors: [],
        line: {
          width: 3,
          color: [],
        }
      },
      textfont: {
        color: this.getLabelColor(this.el.nativeElement)
      },
      hoverlabel: {
        bgcolor: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-bg', '#000000'),
        bordercolor: 'grey',
        font: {
          color: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-color', '#ffffff')
        }
      },
      type: 'pie'
    } as any;
    const dataList = [];
    this.LOG.debug(['convert', 'gtsList'], gtsList);
    if (!gtsList || gtsList.length === 0) {
      return;
    }
    const dataStruct = [];
    if (GTSLib.isGts(gtsList[0])) {
      gtsList.forEach((gts: GTS, i) => {
        const values = (gts.v || []);
        const val = values[values.length - 1] || [];
        let value = 0;
        if (val.length > 0) {
          value = val[val.length - 1];
        }
        dataStruct.push({
          key: GTSLib.serializeGtsMetadata(gts),
          value
        });
      });
    } else {
      // custom data format
      gtsList.forEach((gts, i) => {
        dataStruct.push({
          key: gts.key || '',
          value: gts.value || Number.MIN_VALUE
        });
      });
    }
    this.LOG.debug(['convert', 'dataStruct'], dataStruct);
    dataStruct.forEach((d: any, i) => {
        const c = ColorLib.getColor(i, this._options.scheme);
        const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
        pieData.values.push(d.value);
        pieData.labels.push(d.key);
        pieData.marker.colors.push(ColorLib.transparentize(color));
        pieData.marker.line.color.push(color);
        if (this._type === 'donut') {
          pieData.hole = 0.5;
        }
        if (this.unit) {
          pieData.title = {
            text: this.unit
          };
        }
    });
    if (pieData.values.length > 0) {
      plotData.push(pieData);
    }
    this.noData = plotData.length === 0;
    return plotData;
  }
}
