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
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Param} from '../../model/param';
import {Warp10Service} from '../../services/warp10.service';
import {Logger} from '../../utils/logger';
import {ChartLib} from '../../utils/chart-lib';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {HttpErrorHandler} from '../../services/http-error-handler.service';
import {WarpViewComponent} from '../warp-view-component';
import {ResizedEvent} from 'angular-resize-event';
import {Size, SizeService} from '../../services/resize.service';

@Component({
  selector: 'warpview-tile',
  templateUrl: './warp-view-tile.component.html',
  styleUrls: ['./warp-view-tile.component.scss'],
  providers: [HttpErrorHandler],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewTileComponent extends WarpViewComponent implements OnInit, AfterViewInit {
  @ViewChild('warpRef') warpRef: ElementRef;
  @Input() type = 'line';
  @Input() chartTitle;
  @Input() url = '';
  @Input() isAlone = false; // used by plot to manage its keyboard events
  @Input() set gtsFilter(gtsFilter: string) {
    this._gtsFilter = gtsFilter;
    this.parseGTS();
  };

  private _gtsFilter = '';
  private warpScript = '';
  private execUrl = '';
  private timeUnit = 'us';
  graphs = {
    scatter: ['scatter'],
    chart: ['line', 'spline', 'step', 'area'],
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
  };
  gtsList: any = [];
  private timer: any;
  private _autoRefresh;

  /**
   *
   * @param {Warp10Service} warp10Service
   * @param {ChangeDetectorRef} cdRef
   * @param {SizeService} sizeService
   */
  constructor(private warp10Service: Warp10Service, private cdRef: ChangeDetectorRef, private sizeService: SizeService) {
    super();
    this.LOG = new Logger(WarpViewTileComponent, this._debug);
  }

  /**
   *
   */
  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  /**
   *
   */
  ngAfterViewInit() {
    this.warpScript = this.warpRef.nativeElement.textContent.trim();
    this.LOG.debug(['ngAfterViewInit', 'warpScript'], this.warpScript);
    this.execute();
  }

  /**
   *
   * @param {Param} options
   */
  update(options: Param): void {
    this._options = options;
    this.parseGTS();
  }

  /**
   *
   * @param {ResizedEvent} event
   */
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

  /**
   *
   */
  private parseGTS() {
    let data: DataModel = new DataModel();
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
    let opts = new Param();
    if (typeof this._options === 'string') {
      opts = JSON.parse(this._options as string) as Param;
    } else {
      opts = this._options as Param;
    }
    this._options = ChartLib.mergeDeep(ChartLib.mergeDeep(this.defOptions, opts), data.globalParams) as Param;

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
    //
    //analyse the first warpScript lines starting with //
    //
    let extraParamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
    let warpscriptLines = this.warpScript.split('\n');
    for (let l = 1; l < warpscriptLines.length; l++) {
      let currentLine = warpscriptLines[l];
      if (currentLine == '' || currentLine.search('//') >= 0) {
        //find and extract // @paramname parameters
        let lineOnMatch: RegExpMatchArray | null;
        let re = RegExp(extraParamsPattern);
        // noinspection JSAssignmentUsedAsCondition
        while (lineOnMatch = re.exec(currentLine)) {
          let parameterName = lineOnMatch[1];
          let parameterValue = lineOnMatch[2];
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
        break; //no more comments at the beginning of the file
      }
    }
  }

  /**
   *
   */
  private execute() {
    if (this.warpScript && this.warpScript.trim() !== '') {
      this.loading = true;
      this.cdRef.detectChanges();
      this.execUrl = this.url;
      this.detectWarpScriptSpecialComments();
      this.LOG.debug(['execute', 'warpScript'], this.warpScript);
      this.warp10Service.exec(this.warpScript, this.execUrl).subscribe(gtsStr => {
        try {
          this.gtsList = gtsStr;
          this.parseGTS();
        } catch (e) {
          this.LOG.error(['execute'], e);
        }
        this.loading = false;
      });
    }
  }

  /**
   *
   * @param {DataModel} data
   * @returns {[]}
   */
  protected convert(data: DataModel): any[] {
    return [];
  }
}
