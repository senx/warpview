import {Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import {ColorLib} from '../../utils/color-lib';
import * as moment from 'moment-timezone';

@Component({
  selector: 'warpview-3d-line',
  templateUrl: './warp-view-3d-line.component.html',
  styleUrls: ['./warp-view-3d-line.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpView3dLineComponent extends WarpViewComponent implements OnInit {

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  layout: Partial<any> = {
    showlegend: false,
    xaxis: {},
    yaxis: {},
    zaxis: {},
    margin: {
      t: 10,
      b: 25,
      r: 10,
      l: 10
    }
  };
  private _type = 'line3d';

  constructor(
    public el: ElementRef,
    public sizeService: SizeService,
  ) {
    super(el, sizeService);
    this.LOG = new Logger(WarpView3dLineComponent, this._debug);
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
    const dataset: Partial<any>[] = [];
    this.LOG.debug(['convert'], data, this._options, this._type);
    GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res)
      .filter(g => (g.v && GTSLib.isGts(g)))
      .map(g => {
        console.log(g);
        return g;
      })
      .forEach((gts: GTS) => {
        if (gts.v) {
          const label = GTSLib.serializeGtsMetadata(gts);
          const color = ColorLib.getColor(gts.id, this._options.scheme);
          const series: Partial<any> = {
            mode: 'line',
            type: 'scatter3d',
            marker: {
              color: ColorLib.transparentize(color),
              size: 3,
              symbol: 'circle',
              line: {
                color,
                width: 0
              }
            },
            line: {
              color,
              width: 1
            },
            name: label,
            x: [],
            y: [],
            z: [],
       //     hoverinfo: 'none',
          };
          gts.v.forEach(value => {
            if (value.length > 2) {
              (series.x as any[]).push(value[1]);
              (series.y as any[]).push(value[2]);
              if (value.length > 4) {
                (series.z as any[]).push(value[3]);
              }
            }
          });
          dataset.push(series);
        }
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
    this.layout.zaxis.color = this.getGridColor(this.el.nativeElement);
    this.loading = false;
  }
}
