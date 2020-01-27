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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import deepEqual from 'deep-equal';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {ChartLib} from '../../utils/chart-lib';
import {Param} from '../../model/param';

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

  private _type = 'pie';
  layout: Partial<any> = {
    showlegend: true,
    legend: {
      orientation: 'h',
      bgcolor: 'transparent',
    },
    orientation: 270
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
    public sizeService: SizeService,
  ) {
    super(el, sizeService);
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
    const gtsList = data.data as any[];
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
    gtsList.forEach((d: any, i) => {
      const color = ColorLib.getColor(i, this._options.scheme);
      pieData.values.push(d[1]);
      pieData.labels.push(d[0]);
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
    plotData.push(pieData);
    return plotData;
  }
}
