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

import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';

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
    yaxis: {},
  };

  constructor(
    protected el: ElementRef,
    protected sizeService: SizeService,
  ) {
    super(el, sizeService);
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
    this.loading = false;
  }
}
