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

import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {Logger} from '../../utils/logger';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {ColorLib} from '../../utils/color-lib';
import * as moment from 'moment-timezone';
import {SizeService} from '../../services/resize.service';

@Component({
  selector: 'warpview-bar',
  templateUrl: './warp-view-bar.component.html',
  styleUrls: ['./warp-view-bar.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewBarComponent extends WarpViewComponent implements OnInit, OnDestroy {

  @ViewChild('graph') graph: ElementRef;
  @ViewChild('toolTip') toolTip: ElementRef;
  @Output() chartDraw = new EventEmitter<any>();

  protected layout: Partial<any> = {
    showlegend: false,
    xaxis: {},
    yaxis: {
      exponentformat: 'none',
      fixedrange: true,
      showline: true
    },
  };

  constructor(private el: ElementRef, private sizeService: SizeService) {
    super();
    this.LOG = new Logger(WarpViewBarComponent, this._debug);
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

  ngOnInit() {
    this.drawChart();
  }

  ngOnDestroy() {
    if (this._chart) {
      Plotly.purge(this._chart);
    }
  }

  update(options: Param): void {
    this.drawChart();
  }

  private drawChart() {
    if (!this.initiChart(this.el)) {
      return;
    }
    this.plotlyConfig.scrollZoom = true;
    this.buildGraph();
  }

  protected convert(data: DataModel): Partial<any>[] {
    const gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    let divider = 1000; // default for µs timeunit
    if (this._options.timeUnit && this._options.timeUnit === 'ms') {
      divider = 1;
    }
    if (this._options.timeUnit && this._options.timeUnit === 'ns') {
      divider = 1000000;
    }
    const dataset = [];
    gtsList.forEach(gts => {
      if (gts.v) {
        const label = GTSLib.serializeGtsMetadata(gts);
        const color = ColorLib.getColor(gts.id, this._options.scheme);
        const series: Partial<any> = {
          type: 'bar',
          mode: 'lines+markers',
          name: label,
          text: label,
          x: [],
          y: [],
          hoverinfo: 'none',
          marker: {
            color: ColorLib.transparentize(color),
            line: {
              color
            }
          }
        };
        gts.v.forEach(value => {
          const ts = value[0];
          (series.y as any[]).push(value[value.length - 1]);
          if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            (series.x as any[]).push(ts);
          } else {
            const timestamp = Math.floor(ts / divider);
            (series.x as any[]).push(moment(timestamp).utc(true).toDate());
          }
        });
        dataset.push(series);
      }
    });
    return dataset;
  }

  private buildGraph() {
    this.LOG.debug(['buildGraph', 'this.layout'], this.responsive);
    this.LOG.debug(['buildGraph', 'this.layout'], this.layout);
    this.LOG.debug(['buildGraph', 'this.plotlyConfig'], this.plotlyConfig);
    this.layout.showlegend = this.showLegend;
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    Plotly.newPlot(this.graph.nativeElement, this.plotlyData, this.layout, this.plotlyConfig).then(plot => {
      this._chart = plot;
      this.manageTooltip(this.toolTip.nativeElement, this.graph.nativeElement);
      this.chartDraw.emit();
      this.loading = false;
    });
  }
}
