import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewEncapsulation} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Size, SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {ChartLib} from '../../utils/chart-lib';
import {ResizedEvent} from 'angular-resize-event';

@Component({
  selector: 'warpview-result-tile',
  templateUrl: './warp-view-result-tile.component.html',
  styleUrls: ['./warp-view-result-tile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WarpViewResultTileComponent extends WarpViewComponent {

  @Input('type') set type(type: string) {
    this._type = type;
  }

  get type(): string {
    return this._type;
  }

  @Input('standalone') standalone = true;
  @Output('pointHover') pointHover = new EventEmitter<any>();
  @Output('warpViewChartResize') warpViewChartResize = new EventEmitter<any>();
  @Output('chartDraw') chartDraw = new EventEmitter<any>();
  @Output('boundsDidChange') boundsDidChange = new EventEmitter<any>();
  loading = true;
  dataModel: DataModel;
  private _type;
  graphs = {
    spectrum: ['histogram2dcontour', 'histogram2d'],
    chart: ['line', 'spline', 'step', 'area', 'scatter'],
    pie: ['pie', 'donut'],
    polar: ['polar'],
    radar: ['radar'],
    bar: ['bar'],
    bubble: ['bubble'],
    annotation: ['annotation'],
    'gts-tree': ['gts-tree'],
    datagrid: ['datagrid'],
    display: ['display'],
    drilldown: ['drilldown'],
    image: ['image'],
    map: ['map'],
    gauge: ['gauge', 'bullet'],
    plot: ['plot'],
    box: ['box', 'box-date'],
    line3d: ['line3d'],
    globe: ['globe'],
    drops: ['drops']
  };

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
  ) {
    super(el, renderer, sizeService);
    this.LOG = new Logger(WarpViewResultTileComponent, this._debug);
  }

  protected update(options: Param, refresh: boolean): void {
    setTimeout(() => this.loading = true);
    if (!!this._data) {
      this._options = ChartLib.mergeDeep(this._options, options) as Param;
      this._options = ChartLib.mergeDeep(ChartLib.mergeDeep(this.defOptions, options), this._data.globalParams || {}) as Param;
      if (this._data.globalParams) {
        this._unit = this._data.globalParams.unit || this._unit;
      }
      this.LOG.debug(['parseGTS', 'data'], this._data);
      this.dataModel = this._data;
    }
  }

  protected convert(data: DataModel): Partial<any>[] {
    setTimeout(() => this.loading = true);
    this.dataModel = data;
    return [];
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
    this.LOG.debug(['onResized'], event.newWidth, event.newHeight);
    this.sizeService.change(new Size(this.width, this.height));
  }

  chartDrawn() {
    setTimeout(() => this.loading = false);
  }
}
