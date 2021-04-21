/*
 *  Copyright 2021  SenX S.A.S.
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
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {GTSLib} from '../../utils/gts.lib';
import {HttpErrorHandler} from '../../services/http-error-handler.service';
import {WarpViewComponent} from '../warp-view-component';
import {SizeService} from '../../services/resize.service';
import {Warp10Service} from '../../services/warp10.service';
import {Logger} from '../../utils/logger';
import {HttpResponse} from '@angular/common/http';
import {WarpViewResultTileComponent} from '../warp-view-result-tile/warp-view-result-tile.component';

@Component({
  selector: 'warpview-tile',
  templateUrl: './warp-view-tile.component.html',
  styleUrls: ['./warp-view-tile.component.scss'],
  providers: [HttpErrorHandler]
})
export class WarpViewTileComponent extends WarpViewComponent implements OnInit, AfterViewInit {
  @ViewChild('warpRef', {static: true}) warpRef: ElementRef;
  @ViewChild('resultTile') resultTile: WarpViewResultTileComponent;

  @Output('warpscriptResult') warpscriptResult = new EventEmitter<any>();
  @Output('execStatus') execStatus = new EventEmitter<any>();
  @Output('execError') execError = new EventEmitter<any>();

  @Input('type') type = 'line';
  @Input('chartTitle') chartTitle;
  @Input('url') url = '';
  @Input('isAlone') isAlone = false; // used by plot to manage its keyboard events
  @Input('gtsFilter') set gtsFilter(gtsFilter: string) {
    this._gtsFilter = gtsFilter;
  }

  @Input()
  set warpscript(warpScript: string) {
    if (!!warpScript && this._warpScript !== warpScript) {
      this._warpScript = warpScript;
      this.execute(true);
    }
  }

  get warpscript(): string {
    return this._warpScript;
  }

  error: any;
  status: string;
  loading = false;
  execResult: string;
  loadingExec = false;
  private timer: any;
  private _autoRefresh;
  private _gtsFilter = '';
  private _warpScript = '';
  private execUrl = '';
  private timeUnit = 'us';

  constructor(
    public el: ElementRef,
    public sizeService: SizeService,
    public renderer: Renderer2,
    public ngZone: NgZone,
    private warp10Service: Warp10Service,
  ) {
    super(el, renderer, sizeService, ngZone);
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
      this.execute(false);
    }
  }

  update(options: Param): void {
    this.LOG.debug(['update', 'options'], options);
  }

  /* Listeners */
  @HostListener('document:keyup', ['$event'])
  // @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'r') {
      this.execute(true);
    }
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
        // find and extract
        let lineOnMatch: RegExpMatchArray | null;
        const re = RegExp(extraParamsPattern);
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

  private execute(isRefresh: boolean) {
    if (!!this._warpScript && this._warpScript.trim() !== '') {
      this.LOG.debug(['execute'], isRefresh);
      this.error = undefined;
      setTimeout(() => this.loadingExec = !isRefresh);
      this.execResult = undefined;
      this.execUrl = this.url;
      this.detectWarpScriptSpecialComments();
      this.LOG.debug(['execute', 'warpScript'], this._warpScript);
      this.warp10Service.exec(this._warpScript, this.execUrl)
        .subscribe((response: HttpResponse<string> | string) => {
          setTimeout(() => this.loadingExec = false);
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
              if (this._autoRefresh !== this._options.autoRefresh) {
                this._autoRefresh = this._options.autoRefresh;
                if (this.timer) {
                  window.clearInterval(this.timer);
                }
                if (this._autoRefresh && this._autoRefresh > 0) {
                  this.timer = window.setInterval(() => {
                    this.execute(true);
                  }, this._autoRefresh * 1000);
                }
              }
              setTimeout(() => {
                this.execResult = body;
                this.resultTile.setResult(this.execResult, isRefresh);
                this._options.bounds = {};
                this._options = {...this._options};
                this.loading = false;
              });
            } catch (e) {
              this.LOG.error(['execute'], e);
              this.loading = false;
            }
          } else {
            this.LOG.error(['execute'], response);
            this.error = response;
            this.loading = false;
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

  chartDrawn(event) {
    this.chartDraw.emit(event);
  }

  onWarpViewNewOptions(opts: any) {
    this._options = opts;
  }

  public resize(layout: { width: number; height: any }) {
    //
  }
}
