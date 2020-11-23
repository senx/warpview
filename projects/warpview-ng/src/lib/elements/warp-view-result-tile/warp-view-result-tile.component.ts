import {Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Size, SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {ChartLib} from '../../utils/chart-lib';
import {ResizedEvent} from 'angular-resize-event';
import {GTSLib} from '../../utils/gts.lib';

@Component({
  selector: 'warpview-result-tile',
  templateUrl: './warp-view-result-tile.component.html',
  styleUrls: ['./warp-view-result-tile.component.scss']
})
export class WarpViewResultTileComponent extends WarpViewComponent {

  @Input('type') set type(type: string) {
    this._type = type;
  }

  get type(): string {
    if (this.dataModel && this.dataModel.globalParams) {
      return this.dataModel.globalParams.type || this._options.type || this._type || 'plot';
    } else {
      return this._type || 'plot';
    }
  }

  @Input('standalone') standalone = true;

  @Output('pointHover') pointHover = new EventEmitter<any>();
  @Output('warpViewChartResize') warpViewChartResize = new EventEmitter<any>();
  @Output('chartDraw') chartDraw = new EventEmitter<any>();
  @Output('boundsDidChange') boundsDidChange = new EventEmitter<any>();
  @Output('warpViewNewOptions') warpViewNewOptions = new EventEmitter<any>();

  loading = true;
  dataModel: DataModel;
  graphs = {
    spectrum: ['histogram2dcontour', 'histogram2d'],
    chart: ['line', 'spline', 'step', 'step-after', 'step-before', 'area', 'scatter'],
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

  protected _type;
  private isRefresh = false;

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewResultTileComponent, this._debug);
  }

  protected update(options: Param, refresh: boolean): void {
    setTimeout(() => this.loading = !refresh);
    this.LOG.debug(['parseGTS', 'data'], this._data);
    this.dataModel = this._data;
    if (!!this.dataModel) {
      this._options = ChartLib.mergeDeep(this._options, options) as Param;
      this._options = ChartLib.mergeDeep(ChartLib.mergeDeep(this.defOptions, options),
        this._data ? this._data.globalParams || {} : {}) as Param;
      this.LOG.debug(['parseGTS', 'data'], this._data);
      this.dataModel = this._data;
      if (this._options) {
        this._unit = this._options.unit || this._unit;
        this._type = this._options.type || this._type || 'plot';
      }
      this.LOG.debug(['parseGTS', '_type'], this._type);
      setTimeout(() => this.loading = false);
    }
  }

  protected convert(data: DataModel): Partial<any>[] {
    setTimeout(() => this.loading = !this.isRefresh);
    this.LOG.debug(['convert', 'data'], this._data, data);
    this.dataModel = data;
    if (this.dataModel.globalParams) {
      this._unit = this.dataModel.globalParams.unit || this._unit;
      this._type = this.dataModel.globalParams.type || this._type || 'plot';
    }
    this.LOG.debug(['convert', '_type'], this._type);
    return [];
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
    this.LOG.debug(['onResized'], event.newWidth, event.newHeight);
    this.sizeService.change(new Size(this.width, this.height));
  }

  chartDrawn() {
    this.LOG.debug(['chartDrawn']);
    setTimeout(() => this.loading = false);
    this.chartDraw.emit();
  }

  setResult(data: string, isRefresh: boolean) {
    this.isRefresh = isRefresh;
    if (!!data) {
      this._data = GTSLib.getData(data);
      this._options.isRefresh = isRefresh;
      this.update(this._options, isRefresh);
      this.LOG.debug(['onData'], this._data);
    }
  }

  onWarpViewNewOptions(opts) {
    this.warpViewNewOptions.emit(opts);
  }
}
