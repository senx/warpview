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

import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Logger} from '../../utils/logger';
import {DataModel} from '../../model/dataModel';
import deepEqual from 'deep-equal';
import * as gauge from 'canvas-gauges';
import {ColorLib} from '../../utils/color-lib';
import {SizeService} from '../../services/resize.service';

@Component({
  selector: 'warpview-gauge',
  templateUrl: './warp-view-gauge.component.html',
  styleUrls: ['./warp-view-gauge.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewGaugeComponent extends WarpViewComponent implements OnInit, OnDestroy {
  @ViewChild('graph') graph: ElementRef;

  @Input() set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  @Output() chartDraw = new EventEmitter<any>();

  private CHART_MARGIN = 0.05;
  private _type = 'gauge'; // gauge or bullet

  constructor(private el: ElementRef, private sizeService: SizeService) {
    super();
    this.LOG = new Logger(WarpViewGaugeComponent, this._debug);
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

  update(options, refresh): void {
    if (options) {
      let optionChanged = false;
      Object.keys(options).forEach(opt => {
        if (this._options.hasOwnProperty(opt)) {
          optionChanged = optionChanged || !deepEqual(options[opt] !== this._options[opt]);
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

  drawChart() {
    if (!this.initiChart(this.el)) {
      return;
    }
    this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
    this.layout.autosize = true;
    this.layout.grid = {rows: Math.ceil(this.plotlyData.length / 2), columns: 2, pattern: 'independent', xgap: 0.2, ygap: 0.2};
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
    Plotly.newPlot(this.graph.nativeElement, this.plotlyData, this.layout, this.plotlyConfig).then(plot => {
      this.loading = false;
      this._chart = plot;
      this.chartDraw.emit();
    });
  }

  protected convert(data: DataModel): any[] {
    const gtsList = data.data as any[];
    const dataList = [];
    let max = Number.MIN_VALUE;
    gtsList.forEach(d => max = Math.max(max, d[1]));
    let x = 0;
    let y = -1 / (gtsList.length / 2);
    gtsList.forEach((d, i) => {
      if (i % 2 !== 0) {
        x = 0.5;
      } else {
        x = 0;
        y += 1 / (gtsList.length / 2);
      }
      const color = !!data.params && !!data.params[i].bgColor
        ? data.params[i].bgColor
        : ColorLib.getColor(i, this._options.scheme);
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
          value: d[1],
          delta: {
            reference: !!data.params && !!data.params[i].delta ? data.params[i].delta + d[1] : 0,
            font: {color: this.getLabelColor(this.el.nativeElement)}
          },
          title: {
            text: d[0],
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
    });

    this.LOG.debug(['convert', 'dataList'], dataList);
    return dataList;
  }
}
