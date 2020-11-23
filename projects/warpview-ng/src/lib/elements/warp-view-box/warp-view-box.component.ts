import {Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {DataModel} from '../../model/dataModel';
import {Param} from '../../model/param';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {ColorLib} from '../../utils/color-lib';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import moment from 'moment-timezone';

@Component({
  selector: 'warpview-box',
  templateUrl: './warp-view-box.component.html',
  styleUrls: ['./warp-view-box.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewBoxComponent extends WarpViewComponent implements OnInit {

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  layout: Partial<any> = {
    showlegend: false,
    xaxis: {
      type: '-'
    },
    yaxis: {zeroline: false},
    boxmode: 'group',
    margin: {
      t: 10,
      b: 25,
      r: 10,
      l: 10
    }
  };
  protected _type = 'box';

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewBoxComponent, this._debug);
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
    this.LOG.debug(['convert'], this._options, this._type);
    let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    gtsList = gtsList.filter(g => {
      return (g.v && GTSLib.isGtsToPlot(g));
    });
    const pattern = 'YYYY/MM/DD hh:mm:ss';
    const format = pattern.slice(0, pattern.lastIndexOf(this._options.split || 'D') + 1);
    gtsList.forEach((gts: GTS, i) => {
      if (gts.v) {
        const label = GTSLib.serializeGtsMetadata(gts);
        const c = ColorLib.getColor(gts.id, this._options.scheme);
        const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
        const series: Partial<any> = {
          type: 'box',
          boxmean: 'sd',
          marker: {color},
          name: label,
          x: this._type === 'box' ? undefined : [],
          y: [],
          //  hoverinfo: 'none',
          boxpoints: false
        };
        if (!!this._options.showDots) {
          series.boxpoints = 'all';
        }
        gts.v.forEach(value => {
          series.y.push(value[value.length - 1]);
          if (this._type === 'box-date') {
            series.x.push(GTSLib.toISOString(value[0], this.divider, this._options.timeZone));
          }
        });
        dataset.push(series);
      }
    });
    this.LOG.debug(['convert', 'dataset'], dataset, format);
    return dataset;
  }

  private buildGraph() {
    this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    this.layout.xaxis.showticklabels = this._type === 'box-date';
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    this.loading = false;
  }

  hover(data: any) {

  }
}
