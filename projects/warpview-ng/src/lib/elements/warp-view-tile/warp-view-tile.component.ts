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
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Param} from '../../model/param';
import {ChartLib} from '../../utils/chart-lib';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {HttpErrorHandler} from '../../services/http-error-handler.service';
import {WarpViewComponent} from '../warp-view-component';
import {ResizedEvent} from 'angular-resize-event';
import {Size, SizeService} from '../../services/resize.service';
import {Warp10Service} from '../../services/warp10.service';
import {Logger} from '../../utils/logger';
import {JsonLib} from '../../utils/jsonLib';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'warpview-tile',
  templateUrl: './warp-view-tile.component.html',
  styleUrls: ['./warp-view-tile.component.scss'],
  providers: [HttpErrorHandler],
  encapsulation: ViewEncapsulation.None
})
export class WarpViewTileComponent extends WarpViewComponent implements OnInit, AfterViewInit {
  @ViewChild('warpRef', {static: true}) warpRef: ElementRef;
  @Output('warpscriptResult') warpscriptResult = new EventEmitter<any>();
  @Output('execStatus') execStatus = new EventEmitter<any>();
  @Output('execError') execError = new EventEmitter<any>();

  @Input('type') type = 'line';
  @Input('chartTitle') chartTitle;
  @Input('url') url = '';
  @Input('isAlone') isAlone = false; // used by plot to manage its keyboard events
  @Input('gtsFilter') set gtsFilter(gtsFilter: string) {
    this._gtsFilter = gtsFilter;
    this.parseGTS();
  }

  @Input()
  set warpscript(warpScript: string) {
    if (!!warpScript && this._warpScript !== warpScript) {
      this._warpScript = warpScript;
      this.execute();
    }
  }

  get warpscript(): string {
    return this._warpScript;
  }

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
  gtsList: any = [];
  loaderMessage = '';
  error: any;
  status: string;

  private timer: any;
  private _autoRefresh;
  private _gtsFilter = '';
  private _warpScript = '';
  private execUrl = '';
  private timeUnit = 'us';

  constructor(
    public el: ElementRef,
    public sizeService: SizeService,
    private warp10Service: Warp10Service,
    private cdRef: ChangeDetectorRef
  ) {
    super(el, sizeService);
    this.LOG = new Logger(WarpViewTileComponent, this._debug);
  }

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  ngAfterViewInit() {
    this._warpScript = this._warpScript || this.warpRef.nativeElement.textContent.trim();
    this.LOG.debug(['ngAfterViewInit', 'warpScript'], this._warpScript);
    this.el.nativeElement.style.opacity = '1';
    if (this.warpRef.nativeElement.textContent.trim() !== '') {
      this.execute();
    }
  }

  update(options: Param): void {
    this.LOG.debug(['update', 'options'], options);
    this.parseGTS();
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
    this.LOG.debug(['onResized'], event.newWidth, event.newHeight);
    this.sizeService.change(new Size(this.width, this.height));
  }

  /* Listeners */
  @HostListener('document:keyup', ['$event'])
  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'r') {
      this.execute();
    }
  }

  private parseGTS() {
    const data: DataModel = new DataModel();
    this.loaderMessage = 'Parsing data';
    this.LOG.debug(['parseGTS', 'data'], data);
    if (GTSLib.isArray(this.gtsList) && this.gtsList.length === 1) {
      const dataLine = this.gtsList[0];
      if (dataLine.hasOwnProperty('data')) {
        data.data = dataLine.data;
        data.globalParams = dataLine.globalParams || {} as Param;
        data.globalParams.type = data.globalParams.type || this.type;
        data.params = dataLine.params;
      } else {
        data.data = dataLine;
        data.globalParams = {type: this.type} as Param;
      }
    } else {
      data.data = this.gtsList;
      data.globalParams = {type: this.type} as Param;
    }
    this.LOG.debug(['parseGTS', 'data'], data);
    this._data = data;
    let opts: Param;
    if (typeof this._options === 'string') {
      opts = JSON.parse(this._options as string) as Param;
    } else {
      opts = this._options as Param;
    }
    this.LOG.debug(['parseGTS', 'data.globalParams'], [this.defOptions, data.globalParams]);
    this._options = ChartLib.mergeDeep(ChartLib.mergeDeep(this.defOptions, opts), data.globalParams || {}) as Param;
    this._unit = data.globalParams.unit || this._unit;
    this.LOG.debug(['parseGTS', 'options'], [this.options, this._options]);
    if (this._autoRefresh !== this._options.autoRefresh) {
      this._autoRefresh = this._options.autoRefresh;
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      if (this._autoRefresh && this._autoRefresh > 0) {
        this.timer = window.setInterval(() => this.execute(), this._autoRefresh * 1000);
      }
    }
    this.loading = false;
  }

  /** detect some VSCode special modifiers in the beginnig of the code:
   * @endpoint xxxURLxxx
   * @timeUnit ns
   * warning : the first line is empty (to confirm with other browsers)
   */
  private detectWarpScriptSpecialComments() {
    // analyse the first warpScript lines starting with //
    const extraParamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
    const warpscriptLines = this._warpScript.split('\n');
    for (let l = 1; l < warpscriptLines.length; l++) {
      const currentLine = warpscriptLines[l];
      if (currentLine === '' || currentLine.search('//') >= 0) {
        // find and extract // @paramname parameters
        let lineOnMatch: RegExpMatchArray | null;
        const re = RegExp(extraParamsPattern);
        // noinspection JSAssignmentUsedAsCondition
        // tslint:disable-next-line:no-conditional-assignment JSAssignmentUsedAsCondition
        // noinspection JSAssignmentUsedAsCondition
        while (lineOnMatch = re.exec(currentLine)) {
          const parameterName = lineOnMatch[1];
          const parameterValue = lineOnMatch[2];
          switch (parameterName) {
            case 'endpoint':        //        // @endpoint http://mywarp10server/api/v0/exec
              this.execUrl = parameterValue;
              break;
            case 'timeUnit':
              this.timeUnit = parameterValue.toLowerCase();   // set the time unit for graphs
              break;
            default:
              break;
          }
        }
      } else {
        break; // no more comments at the beginning of the file
      }
    }
  }

  private execute() {
    if (!!this._warpScript && this._warpScript.trim() !== '') {
      this.error = undefined;
      this.loading = true;
      this.loaderMessage = 'Requesting data';
      this.cdRef.detectChanges();
      this.execUrl = this.url;
      this.gtsList = [];
      this.detectWarpScriptSpecialComments();
      this.LOG.debug(['execute', 'warpScript'], this._warpScript);
      this.warp10Service.exec(this._warpScript, this.execUrl).subscribe((response: HttpResponse<string> | string) => {

        // this.loading = false;
        this.LOG.debug(['execute'], response);
        if ((response as HttpResponse<string>).body) {
          try {
            const body = (response as HttpResponse<string>).body;
            this.warpscriptResult.emit(body);
            const headers = (response as HttpResponse<string>).headers;
            this.status = `Your script execution took
 ${GTSLib.formatElapsedTime(parseInt(headers.get('x-warp10-elapsed'), 10))}
 serverside, fetched
 ${headers.get('x-warp10-fetched')} datapoints and performed
 ${headers.get('x-warp10-ops')}  WarpScript operations.`;
            this.execStatus.emit({
              message: this.status,
              ops: parseInt(headers.get('x-warp10-ops'), 10),
              elapsed: parseInt(headers.get('x-warp10-elapsed'), 10),
              fetched: parseInt(headers.get('x-warp10-fetched'), 10),
            });
            this.gtsList = new JsonLib().parse(body, undefined);
            this.parseGTS();
          } catch (e) {
            this.LOG.error(['execute'], e);
          }
        } else {
          this.LOG.error(['execute'], response);
          this.loading = false;
          this.error = response;
          this.execError.emit(response);
        }
      }, e => {
        this.loading = false;
        this.execError.emit(e);
        this.LOG.error(['execute'], e);
      });
    }
  }

  protected convert(data: DataModel): any[] {
    return [];
  }
}
