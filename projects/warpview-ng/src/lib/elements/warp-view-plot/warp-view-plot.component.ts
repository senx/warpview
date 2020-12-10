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
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {WarpViewModalComponent} from '../warp-view-modal/warp-view-modal.component';
import {Param} from '../../model/param';
import {WarpViewChartComponent} from '../warp-view-chart/warp-view-chart.component';
import {WarpViewAnnotationComponent} from '../warp-view-annotation/warp-view-annotation.component';
import {WarpViewMapComponent} from '../warp-view-map/warp-view-map.component';
import {WarpViewGtsPopupComponent} from '../warp-view-gts-popup/warp-view-gts-popup.component';
import {ChartBounds} from '../../model/chartBounds';
import moment from 'moment-timezone';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import {DataModel} from '../../model/dataModel';
import {Size, SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';

@Component({
  selector: 'warpview-plot',
  templateUrl: './warp-view-plot.component.html',
  styleUrls: ['./warp-view-plot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WarpViewPlotComponent extends WarpViewComponent implements OnInit, AfterViewInit {
  @ViewChild('mainPlotDiv', {static: true}) mainPlotDiv: ElementRef;
  @ViewChild('timeClip', {static: true}) timeClip: WarpViewModalComponent;
  @ViewChild('modal', {static: true}) modal: WarpViewModalComponent;
  @ViewChild('chart') chart: WarpViewChartComponent;
  @ViewChild('gtsPopupModal') gtsPopupModal: WarpViewGtsPopupComponent;
  @ViewChild('annotation') annotation: WarpViewAnnotationComponent;
  @ViewChild('map') map: WarpViewMapComponent;
  @ViewChild('timeClipElement', {static: true}) timeClipElement: ElementRef;
  @ViewChild('GTSTree', {static: true}) GTSTree: ElementRef;
  @ViewChild('controls', {static: true}) controls: ElementRef;
  @ViewChild('filterInput', {static: true}) filterInput: ElementRef;
  @ViewChild('tzSelector') tzSelector: ElementRef;
  @ViewChild('line') line: ElementRef;
  @ViewChild('main') main: ElementRef;

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  get type() {
    return this._type;
  }

  @Input('gtsFilter') set gtsFilter(gtsFilter) {
    this._gtsFilter = gtsFilter;
    this.drawChart();
  }

  get gtsFilter() {
    return this._gtsFilter;
  }

  @Input('isAlone') isAlone = false;
  @Input('initialChartHeight') initialChartHeight = 400;
  @Input('initialMapHeight') initialMapHeight = 400;

  @Output('warpViewChartResize') warpViewChartResize = new EventEmitter<any>();
  @Output('warpViewNewOptions') warpViewNewOptions = new EventEmitter<any>();

  _options: Param = {
    ...new Param(), ...{
      showControls: true,
      showGTSTree: true,
      showDots: true,
      timeZone: 'UTC',
      timeUnit: 'us',
      timeMode: 'date',
      bounds: {}
    }
  };
  _toHide: number[] = [];
  showChart = true;
  showMap = false;
  timeClipValue = '';
  kbdLastKeyPressed: string[] = [];
  warningMessage = '';
  loading = false;
  gtsIdList: number[] = [];
  gtsList: DataModel | GTS[] | string;
  loadingChart = true;
  private kbdCounter = 0;
  private gtsFilterCount = 0;
  private gtsBrowserIndex = -1;
  private _gtsFilter = 'x';
  protected _type = 'line';
  private chartBounds: ChartBounds = {
    tsmin: Number.MAX_VALUE,
    tsmax: Number.MIN_VALUE,
    msmax: '',
    msmin: '',
    marginLeft: 0
  };
  // key event are trapped in plot component.
  // if one of this key is pressed, default action is prevented.
  private preventDefaultKeyList: string[] = ['Escape', '/'];
  private preventDefaultKeyListInModals: string[] = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
  private showLine = false;
  private left: number;

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewPlotComponent, this._debug);
  }

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  ngAfterViewInit(): void {
    this.drawChart(true);
    this.resizeArea();
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(ev: KeyboardEvent) {
    this.LOG.debug(['handleKeydown'], ev);
    if (!this.isAlone) {
      this.handleKeyPress(ev).then(() => {
        // empty
      });
    }
  }

  stateChange(event: any) {
    this.LOG.debug(['stateChange'], event);
    switch (event.id) {
      case 'timeSwitch' :
        this.loading = true;
        if (event.state) {
          this._options.timeMode = 'timestamp';
        } else {
          this._options.timeMode = 'date';
        }
        this.warpViewNewOptions.emit(this._options);
        setTimeout(() => this.drawChart(true));
        break;
      case 'typeSwitch' :
        this.loadingChart = true;
        setTimeout(() => {
          this._type = event.state ? 'step' : 'line';
          this.drawChart(false);
        }, 500);
        break;
      case 'chartSwitch' :
        this.loadingChart = true;
        this.showChart = event.state;
        setTimeout(() => this.drawChart(false));
        break;
      case 'mapSwitch' :
        this.showMap = event.state;
        if (this.showMap) {
          setTimeout(() => this.map.resize());
        }
        break;
    }
  }

  boundsDidChange(event) {
    this.LOG.debug(['updateBounds'], event);
    this._options.bounds = this._options.bounds || {};
    if (this._options.bounds.minDate !== event.bounds.min && this._options.bounds.maxDate !== event.bounds.max) {
      this._options.bounds = this._options.bounds || {};
      this._options.bounds.minDate = event.bounds.min;
      this._options.bounds.maxDate = event.bounds.max;
      this.warpViewNewOptions.emit(this._options);
      if (event.source === 'chart') {
        this.annotation.updateBounds(event.bounds.min, event.bounds.max, event.bounds.marginLeft);
      } else if (event.source === 'annotation') {
        this.chart.updateBounds(event.bounds.min, event.bounds.max);
      }
      this.LOG.debug(['updateBounds'], this.divider,
        GTSLib.toISOString(event.bounds.min, this.divider, this._options.timeZone),
        GTSLib.toISOString(event.bounds.max, this.divider, this._options.timeZone));
      this.line.nativeElement.style.left = '-100px';
    }
  }

  onWarpViewModalClose() {
    this.mainPlotDiv.nativeElement.focus();
  }

  warpViewSelectedGTS(event) {
    this.LOG.debug(['warpViewSelectedGTS'], event);
    if (!this._toHide.find(i => {
      return i === event.gts.id;
    }) && !event.selected) { // if not in toHide and state false, put id in toHide
      this._toHide.push(event.gts.id);
    } else {
      if (event.selected) { // if in toHide and state true, remove it from toHide
        this._toHide = this._toHide.filter(i => {
          return i !== event.gts.id;
        });
      }
    }
    this.LOG.debug(['warpViewSelectedGTS', 'this._toHide'], this._toHide);
    this.ngZone.run(() => {
      this._toHide = [...this._toHide];
    });
  }

  handleMouseMove(evt: MouseEvent) {
    evt.preventDefault();
    if (this.showLine && this.line) {
      this.line.nativeElement.style.left = Math.max(evt.pageX - this.left, 50) + 'px';
    }
  }

  handleMouseEnter(evt: MouseEvent) {
    evt.preventDefault();
    this.left = this.left || this.main.nativeElement.getBoundingClientRect().left;
    this.showLine = true;
    if (this.line) {
      this.renderer.setStyle(this.line.nativeElement, 'display', 'block');
    }
  }

  handleMouseOut(evt: MouseEvent) {
    // evt.preventDefault();
    if (this.line) {
      this.showLine = false;
      this.renderer.setStyle(this.line.nativeElement, 'left', '-100px');
      this.renderer.setStyle(this.line.nativeElement, 'display', 'none');
    }
  }

  update(options, refresh): void {
    this.drawChart(refresh);
  }

  inputTextKeyboardEvents(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    if (e.key === 'Enter') {
      this.applyFilter();
    } else if (e.key === 'Escape') {
      this.pushKbdEvent('Escape');
      this.modal.close();
    }
  }

  tzSelected(event) {
    const timeZone = this.tzSelector.nativeElement.value;
    this.LOG.debug(['timezone', 'tzselect'], timeZone, event);
    delete this._options.bounds;
    this._options.timeZone = timeZone;
    this.tzSelector.nativeElement.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
    this.drawChart();
  }

  public getTimeClip(): Promise<ChartBounds> {
    this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
    return this.chart.getTimeClip();
  }

  resizeChart(event) {
    if (this.initialChartHeight !== event) {
      this.LOG.debug(['resizeChart'], event);
      this.initialChartHeight = event;
      this.sizeService.change(new Size(this.width, event));
    }
  }

  drawChart(firstDraw: boolean = false) {
    this.LOG.debug(['drawCharts'], this._data, this._options);
    if (!this._data || !this._data.data || this._data.data.length === 0) {
      return;
    }
    if (this.timeClip) {
      this.timeClip.close();
    }
    if (this.modal) {
      this.modal.close();
    }
    this.LOG.debug(['PPts'], 'firstdraw ', firstDraw);
    if (firstDraw) { // on the first draw, we can set some default options.
      // automatically switch to timestamp mode
      // when the first tick and last tick of all the series are in the interval [-100ms 100ms]
      const tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
      const dataList = this._data.data;
      if (dataList) {
        let gtsList = GTSLib.flattenGtsIdArray(dataList as any, 0).res;
        gtsList = GTSLib.flatDeep(gtsList);
        let timestampMode = true;
        let totalDatapoints = 0;
        gtsList.forEach(g => {
          this.gtsIdList.push(g.id); // usefull for gts browse shortcut
          if (g.v.length > 0) { // if gts not empty
            timestampMode = timestampMode && (g.v[0][0] > -tsLimit && g.v[0][0] < tsLimit);
            timestampMode = timestampMode && (g.v[g.v.length - 1][0] > -tsLimit && g.v[g.v.length - 1][0] < tsLimit);
            totalDatapoints += g.v.length;
          }
        });
        if (timestampMode) {
          this._options.timeMode = 'timestamp';
        }
        this.LOG.debug(['drawCharts', 'parsed', 'timestampMode'], timestampMode);
      }
    }
    this.gtsList = this._data;
    this._options = {...this._options};
    this.divider = GTSLib.getDivider(this._options.timeUnit);

    this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
    this.resizeArea();
  }

  focus(event: any) {
    // read the first 4 letters of id of all elements in the click tree
    const idListClicked = event.path.map(el => (el.id || '').slice(0, 4));
    // if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
    if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
      this.mainPlotDiv.nativeElement.focus();
    } // prevent stealing focus of the timezone selector.
  }

  private async handleKeyPress(ev: KeyboardEvent) {
    this.LOG.debug(['handleKeyPress'], ev);
    if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
      ev.preventDefault();
    }
    if (await this.timeClip.isOpened() || await this.modal.isOpened() || await this.gtsPopupModal.isOpened()) {
      if (this.preventDefaultKeyListInModals.indexOf(ev.key) >= 0) {
        ev.preventDefault();
      }
    }
    if (ev.key === '/') {
      this.modal.open();
      this.filterInput.nativeElement.focus();
      this.filterInput.nativeElement.select();
    } else if (ev.key === 't') {
      this.chart.getTimeClip().then(tc => {
        this.timeClipValue = `<p>keep data between
          ${this._options.timeMode === 'timestamp' ? tc.tsmin : moment.tz(tc.tsmin, this._options.timeZone).toLocaleString()} and
          ${this._options.timeMode === 'timestamp' ? tc.tsmax : moment.tz(tc.tsmax, this._options.timeZone).toLocaleString()}
          ${this._options.timeUnit !== 'us' ? ' (for a ' + this._options.timeUnit + ' platform)' : ''}</p>
          <pre><code>${Math.round(tc.tsmax)} ${Math.round(tc.tsmax - tc.tsmin)} TIMECLIP</code></pre>`;
        this.timeClip.open();
      });
    } else if (ev.key === 'b' || ev.key === 'B') { // browse among all gts
      if (this.gtsBrowserIndex < 0) {
        this.gtsBrowserIndex = 0;
      }
      if (ev.key === 'b') { // increment index
        this.gtsBrowserIndex++;
        if (this.gtsBrowserIndex === this.gtsIdList.length) {
          this.gtsBrowserIndex = 0;
        }
      } else { // decrement index
        this.gtsBrowserIndex--;
        if (this.gtsBrowserIndex < 0) {
          this.gtsBrowserIndex = this.gtsIdList.length - 1;
        }
      }
      this._toHide = this.gtsIdList.filter(v => v !== this.gtsIdList[this.gtsBrowserIndex]); // hide all but one
    } else if (ev.key === 'n') {
      this._toHide = [...this.gtsIdList];
      return false;
    } else if (ev.key === 'a') {
      this._toHide = [];
    } else if (ev.key === 'Escape') {
      this.timeClip.isOpened().then(r => {
        if (r) {
          this.timeClip.close();
        }
      });
      this.modal.isOpened().then(r => {
        if (r) {
          this.modal.close();
        }
      });
      this.gtsPopupModal.isOpened().then(r => {
        if (r) {
          this.gtsPopupModal.close();
        }
      });
    } else {
      this.pushKbdEvent(ev.key);
    }
    this.LOG.debug(['handleKeyPress', 'this.gtsIdList'], this._toHide, this.gtsBrowserIndex);
  }

  applyFilter() {
    this.gtsFilterCount++;
    this._gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.nativeElement.value;
    this.modal.close();
  }

  private pushKbdEvent(key: string) {
    this.kbdCounter++;
    this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
  }

  getTZ() {
    return moment.tz.names();
  }

  protected convert(data: DataModel): any[] {
    return [];
  }

  onChartDraw($event: any, component) {
    if (
      this.chartBounds
      && $event
      && this.chartBounds.tsmin !== Math.min(this.chartBounds.tsmin, $event.tsmin)
      && this.chartBounds.tsmax !== Math.max(this.chartBounds.tsmax, $event.tsmax)
    ) {
      this.chartBounds.tsmin = Math.min(this.chartBounds.tsmin, $event.tsmin);
      this.chartBounds.tsmax = Math.max(this.chartBounds.tsmax, $event.tsmax);
      this.annotation.setRealBounds(this.chartBounds);
      this.chart.setRealBounds(this.chartBounds);
      this.chartDraw.emit();
      this.LOG.debug(['onChartDraw', 'this.chartBounds'], component, this.chartBounds, $event);
    } else {
      this.chartDraw.emit($event);
    }
    this.loadingChart = false;
    this.resizeArea();
  }

  private resizeArea() {
    if (this.showChart && !!this.chart) {
      let h = this.chart.el.nativeElement.getBoundingClientRect().height;
      if (h > 0) {
        if (!!this.GTSTree) {
          h -= this.GTSTree.nativeElement.getBoundingClientRect().height;
        }
        if (!!this.controls) {
          h -= this.controls.nativeElement.getBoundingClientRect().height;
        }
        this.initialChartHeight = h;
      } else {
        setTimeout(() => this.resizeArea(), 100);
      }
    }
  }

  public resize(layout: { width: number; height: any }) {
    //
  }
}
