import {Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import {ColorLib} from '../../utils/color-lib';
import {MapLib} from '../../utils/map-lib';

@Component({
  selector: 'warpview-globe',
  templateUrl: './warp-view-globe.component.html',
  styleUrls: ['./warp-view-globe.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewGlobeComponent extends WarpViewComponent implements OnInit {


  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  layout: Partial<any> = {
    showlegend: false,
    margin: {
      t: 10,
      b: 25,
      r: 10,
      l: 10
    },
    geo: {
      projection: {
        type: 'orthographic',
      },
      showframe: true,
      fitbounds: 'locations',
      showocean: true,
      oceancolor: ColorLib.transparentize('#004eff', 0.2),
      showland: true,
      landcolor: ColorLib.transparentize('#6F694E', 0.2),
      showlakes: true,
      lakecolor: ColorLib.transparentize('#004eff', 0.2),
      showcountries: true,
      lonaxis: {
        showgrid: true,
        gridcolor: 'rgb(102, 102, 102)'
      },
      lataxis: {
        showgrid: true,
        gridcolor: 'rgb(102, 102, 102)'
      }
    }
  };
  private _type = 'scattergeo';
  private geoData: { path: { lat: number, lon: number }[] }[] = [];

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
  ) {
    super(el, renderer, sizeService);
    this.LOG = new Logger(WarpViewGlobeComponent, this._debug);
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
    this.geoData = [];
    this.LOG.debug(['convert'], data, this._options, this._type);
    GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res)
      .filter(g => (g.v && GTSLib.isGts(g)))
      .forEach((gts: GTS, i) => {
        if (gts.v) {
          const geoData = {path: []};
          const label = GTSLib.serializeGtsMetadata(gts);
          const c = ColorLib.getColor(gts.id, this._options.scheme);
          const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
          const series: Partial<any> = {
            mode: 'lines',
            type: 'scattergeo',
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
            lon: [],
            lat: [],
            hoverinfo: 'none',
          };
          gts.v.forEach(value => {
            if (value.length > 2) {
              series.lat.push(value[1]);
              series.lon.push(value[2]);
              geoData.path.push({lat: value[1], lon: value[2]});
            }
          });
          this.geoData.push(geoData);
          dataset.push(series);
        }
      });
    return dataset;
  }

  private buildGraph() {
    this.LOG.debug(['drawChart', 'this.layout'], this._responsive);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    this.layout.showlegend = this._showLegend;
    const bounds = MapLib.getBoundsArray(this.geoData, [], [], []);
    this.LOG.debug(['drawChart', 'bounds'], bounds);
    this.layout.geo.lonaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.geo.lataxis.range = [bounds[0][0], bounds[1][0]];
    this.layout.geo.lonaxis.range = [bounds[0][1], bounds[1][1]];
    this.layout.geo.lataxis.color = this.getGridColor(this.el.nativeElement);
    this.layout = {...this.layout};
    this.loading = false;
  }

}
