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
import {Logger} from '../../utils/logger';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import {SizeService} from '../../services/resize.service';
import Plotly from 'plotly.js';

@Component({
  selector: 'warpview-bubble',
  templateUrl: './warp-view-bubble.component.html',
  styleUrls: ['./warp-view-bubble.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewBubbleComponent extends WarpViewComponent implements OnInit, OnDestroy {

  @ViewChild('graph', { static: true }) graph: ElementRef;
  @ViewChild('toolTip', { static: true }) toolTip: ElementRef;
  @Output('chartDraw') chartDraw = new EventEmitter<any>();

  protected layout: Partial<any> = {
    showlegend: false,
    xaxis: {},
    yaxis: {},
  };

  constructor(private el: ElementRef, private sizeService: SizeService) {
    super();
    this.LOG = new Logger(WarpViewBubbleComponent, this._debug);
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
    const dataset = [];
    (data.data as any []).forEach((gts, i) => {
      const label = Object.keys(gts)[0];
      const color = ColorLib.getColor(i, this._options.scheme);
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
      gts[label].forEach(value => {
        (series.y as any[]).push(value[0]);
        (series.x as any[]).push(value[1]);
        (series.marker.size as any[]).push(value[2]);
      });
      dataset.push(series);
    });
    return dataset;
  }

  private buildGraph() {
    this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
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
