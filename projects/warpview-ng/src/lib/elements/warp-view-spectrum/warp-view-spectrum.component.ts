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

import {Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation} from '@angular/core';
import {VisibilityState, WarpViewComponent} from '../warp-view-component';
import {DataModel} from '../../model/dataModel';
import {Param} from '../../model/param';
import {ColorLib} from '../../utils/color-lib';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';

@Component({
  selector: 'warpview-spectrum',
  templateUrl: './warp-view-spectrum.component.html',
  styleUrls: ['./warp-view-spectrum.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewSpectrumComponent extends WarpViewComponent {

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  layout: Partial<any> = {
    showlegend: false,
    xaxis: {},
    yaxis: {},
    margin: {
      t: 10,
      b: 25,
      r: 10,
      l: 50
    }
  };
  protected _type = 'histogram2d';
  private visibility: boolean[] = [];
  private visibilityStatus: VisibilityState = 'unknown';
  private maxTick = 0;
  private minTick = 0;
  private visibleGtsId = [];

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewSpectrumComponent, this._debug);
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
    const type = this._options.histo || {histnorm: 'density', histfunc: 'count'};
    const dataset: Partial<any>[] = [];
    this.LOG.debug(['convert'], this._options);
    this.visibility = [];
    let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray([data.data] as any[], 0).res) || [];
    this.maxTick = Number.NEGATIVE_INFINITY;
    this.minTick = Number.POSITIVE_INFINITY;
    this.visibleGtsId = [];
    const nonPlottable = gtsList.filter(g => {
      this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
      return (g.v && !GTSLib.isGtsToPlot(g));
    });
    gtsList = gtsList.filter(g => {
      return (g.v && GTSLib.isGtsToPlot(g));
    });
    // initialize visibility status
    if (this.visibilityStatus === 'unknown') {
      this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
    }

    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.type = 'linear';
    } else {
      this.layout.xaxis.type = 'date';
    }
    gtsList.forEach((gts: GTS, i) => {
      if (gts.v && GTSLib.isGtsToPlot(gts)) {
        const label = GTSLib.serializeGtsMetadata(gts);
        const c = ColorLib.getColor(i, this._options.scheme);
        const color = ((data.params || [])[gts.id] || {datasetColor: c}).datasetColor || c;
        const series: Partial<any> = {
          type: this._type,
          histnorm: type.histnorm || 'density',
          histfunc: type.histfunc || 'count',
          contours: {
            showlabels: true,
            labelfont: {
              color: 'white'
            }
          },
          colorbar: {
            tickcolor: this.getGridColor(this.el.nativeElement),
            thickness: 0,
            tickfont: {
              color: this.getLabelColor(this.el.nativeElement)
            },
            x: 1 + gts.id / 20,
            xpad: 0
          },
          showscale: this._options.showlegend,
          colorscale: ColorLib.getColorGradient(gts.id, this._options.scheme),
          autocolorscale: false,
          name: label,
          text: label,
          x: [],
          y: [],
          line: {color},
          hoverinfo: 'none',
          connectgaps: false,
          visible: this._hiddenData.filter(h => h === gts.id).length >= 0,
        };
        gts.v.forEach(value => {
          const ts = value[0];
          series.y.push(value[value.length - 1]);
          if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            series.x.push(ts);
          } else {
            series.x.push(GTSLib.toISOString(ts, this.divider, this._options.timeZone));
          }
        });
        dataset.push(series);
      }
    });
    this.LOG.debug(['convert', 'dataset'], dataset);

    return dataset;
  }

  private buildGraph() {
    this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    this.loading = false;
  }

  public resize(layout: { width: number; height: any }) {
    //
  }
}
