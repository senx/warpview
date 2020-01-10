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

import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Logger} from '../../utils/logger';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import {SizeService} from '../../services/resize.service';
import deepEqual from 'deep-equal';
import Plotly from 'plotly.js';

@Component({
  selector: 'warpview-pie',
  templateUrl: './warp-view-pie.component.html',
  styleUrls: ['./warp-view-pie.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewPieComponent extends WarpViewComponent implements OnInit, OnDestroy {
  @ViewChild('graph', {static: true}) graph: ElementRef;
  @ViewChild('toolTip', {static: false}) toolTip: ElementRef;

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  @Output('chartDraw') chartDraw = new EventEmitter<any>();

  private _type = 'pie';
  protected layout: Partial<any> = {
    showlegend: true,
    legend: {
      orientation: 'h',
      bgcolor: 'transparent',
    },
    orientation: 270
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
    this.LOG = new Logger(WarpViewPieComponent, this._debug);
    this.sizeService.sizeChanged$.subscribe(evt => {
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

  drawChart() {
    if (!this.initiChart(this.el)) {
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
    Plotly.newPlot(this.graph.nativeElement, this.plotlyData, this.layout, this.plotlyConfig).then(plot => {
      this.loading = false;
      this._chart = plot;
      this.chartDraw.emit();
    });
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
