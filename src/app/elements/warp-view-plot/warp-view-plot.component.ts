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
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Logger} from '../../utils/logger';
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
import deepEqual from 'deep-equal';

/**
 *
 */
@Component({
  selector: 'warpview-plot',
  templateUrl: './warp-view-plot.component.html',
  styleUrls: ['./warp-view-plot.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewPlotComponent extends WarpViewComponent implements OnInit, AfterViewInit {

  @ViewChild('graph', {static: false}) graph: ElementRef;
  @ViewChild('mainPlotDiv', {static: true}) mainPlotDiv: ElementRef;
  @ViewChild('timeClip', {static: true}) timeClip: WarpViewModalComponent;
  @ViewChild('modal', {static: true}) modal: WarpViewModalComponent;
  @ViewChild('chart', {static: false}) chart: WarpViewChartComponent;
  @ViewChild('gtsPopupModal', {static: false}) gtsPopupModal: WarpViewGtsPopupComponent;
  @ViewChild('annotation', {static: false}) annotation: WarpViewAnnotationComponent;
  @ViewChild('map', {static: false}) map: WarpViewMapComponent;
  @ViewChild('timeClipElement', {static: true}) timeClipElement: ElementRef;
  @ViewChild('filterInput', {static: true}) filterInput: ElementRef;
  @ViewChild('tzSelector', {static: false}) tzSelector: ElementRef;
  @ViewChild('line', {static: false}) line: ElementRef;
  @ViewChild('main', {static: false}) main: ElementRef;

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
  @Input('initialChartHeight') initialChartHeight = '400';
  @Input('initialMapHeight') initialMapHeight = '500';

  @Output('chartDraw') chartDraw = new EventEmitter<any>();

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

  private mouseOutTimer: number;
  private kbdCounter = 0;
  private gtsFilterCount = 0;
  private gtsIdList: number[] = [];
  private gtsBrowserIndex = -1;
  private _gtsFilter = 'x';
  private _type = 'line';
  // key event are trapped in plot component.
  // if one of this key is pressed, default action is prevented.
  private preventDefaultKeyList: string[] = ['Escape', '/'];
  private preventDefaultKeyListInModals: string[] = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
  private gtsList: DataModel | GTS[] | string;

  @HostListener('document:keydown', ['$event'])
  @HostListener('keydown', ['$event'])
  handleKeydown(ev: KeyboardEvent) {
    this.LOG.debug(['handleKeydown'], ev);
    if (!this.isAlone) {
      this.handleKeyDown(ev).then(() => {
        // empty
      });
    }
  }

  stateChange(event: any) {
    this.LOG.debug(['stateChange'], event);
    switch (event.id) {
      case 'timeSwitch' :
        if (event.state) {
          this._options.timeMode = 'timestamp';
        } else {
          this._options.timeMode = 'date';
        }
        this.drawChart();
        break;
      case 'typeSwitch' :
        if (event.state) {
          this._type = 'step';
        } else {
          this._type = 'line';
        }
        this.drawChart();
        break;
      case 'chartSwitch' :
        this.showChart = event.state;
        this.drawChart();
        break;
      case 'mapSwitch' :
        this.showMap = event.state;
        if (this.showMap) {
          window.setTimeout(() => this.map.resize(), 500);
        }
        break;
    }
  }

  boundsDidChange(event) {
    this.LOG.debug(['boundsDidChange'], event);
    this._options.bounds.minDate = event.bounds.min;
    this._options.bounds.maxDate = event.bounds.max;
    this.annotation.updateBounds(event.bounds.min, event.bounds.max);
    this.line.nativeElement.style.left = '-100px';
  }

  onWarpViewModalClose() {
    this.mainPlotDiv.nativeElement.focus();
  }

  warpViewSelectedGTS(event) {
    this.LOG.debug(['warpViewSelectedGTS'], event.detail);
    if (!this._toHide.find(i => {
      return i === event.detail.gts.id;
    }) && !event.detail.selected) { // if not in toHide and state false, put id in toHide
      this._toHide.push(event.detail.gts.id);
    } else {
      if (event.detail.selected) { // if in toHide and state true, remove it from toHide
        this._toHide = this._toHide.filter(i => {
          return i !== event.detail.gts.id;
        });
      }
    }
    this.LOG.debug(['warpViewSelectedGTS'], this._toHide);
    this._toHide = this._toHide.slice();
    this.drawChart();
  }

  private handleMouseMove(evt: MouseEvent) {
    if (this.mouseOutTimer) {
      window.clearTimeout(this.mouseOutTimer);
      delete this.mouseOutTimer;
    }
    if (!this.mouseOutTimer) {
      this.mouseOutTimer = window.setTimeout(() => {
        this.line.nativeElement.style.display = 'block';
        this.line.nativeElement.style.left = Math.max(evt.clientX - this.main.nativeElement.getBoundingClientRect().left, 100) + 'px';
      }, 1);
    }
  }

  private handleMouseOut(evt: MouseEvent) {
    this.line.nativeElement.style.left = Math.max(evt.clientX - this.main.nativeElement.getBoundingClientRect().left, 100) + 'px';
    if (this.mouseOutTimer) {
      window.clearTimeout(this.mouseOutTimer);
      delete this.mouseOutTimer;
    }
    if (!this.mouseOutTimer) {
      this.mouseOutTimer = window.setTimeout(() => {
        this.line.nativeElement.style.left = '-100px';
        this.line.nativeElement.style.display = 'none';
      }, 500);
    }
  }

  update(options, refresh): void {
    if (options) {
      let optionChanged = false;
      Object.keys(options).forEach(opt => {
        if (this._options.hasOwnProperty(opt)) {
          optionChanged = optionChanged || !deepEqual(options[opt], this._options[opt]);
        } else {
          optionChanged = true; // new unknown option
        }
      });
      if (this.LOG) {
        this.LOG.debug(['onOptions', 'optionChanged'], optionChanged);
      }
      if (optionChanged) {
        if (this.LOG) {
          this.LOG.debug(['onOptions', 'options'], options);
        }
        this._options = options;
        this.drawChart(false);
      }
    } else {
      this.drawChart(refresh);
    }
  }

  constructor() {
    super();
    this.LOG = new Logger(WarpViewPlotComponent, this._debug);
  }

  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  inputTextKeyboardEvents(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    if (e.key === 'Enter') {
      this.applyFilter();
    } else if (e.key === 'Escape') {
      this.pushKbdEvent('Escape');
    }
  }

  /**
   *
   */
  tzSelected() {
    const timeZone = this.tzSelector.nativeElement.value;
    this.LOG.debug(['timezone', 'tzselect'], timeZone);
    this._options.timeZone = timeZone;
    this.tzSelector.nativeElement.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
    this.drawChart();
  }

  ngAfterViewInit(): void {
    this.drawChart(true);
  }

  public getTimeClip(): Promise<ChartBounds> {
    this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
    return this.chart.getTimeClip();
  }

  resizeChart(event) {
    this.chart.resize(event);
    this.LOG.debug(['resizeChart'], event);
  }

  drawChart(firstDraw: boolean = false) {
    this.LOG.debug(['drawCharts'], [this._data, this._options]);
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
        // do not display the chart if there is obviously lots of data
        if (gtsList.length > 1000 || totalDatapoints > 1000000) {
          this.LOG.warn(['firstdraw'], 'Lots of GTS or datapoint, hiding the graph...');
          this.showChart = false;
          this.warningMessage = `Warning : ${gtsList.length} series, ${totalDatapoints} points. Chart may be slow.`;
        }
      }
    }

    this._options = {...this._options};
    this.gtsList = this._data;
    this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
  }

  focus(event: any) {
    // read the first 4 letters of id of all elements in the click tree
    const idListClicked = event.path.map(el => (el.id || '').slice(0, 4));
    // if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
    if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
      this.mainPlotDiv.nativeElement.focus();
    } // prevent stealing focus of the timezone selector.
  }

  private async handleKeyDown(ev: KeyboardEvent) {
    this.LOG.debug(['document:keydown'], ev);
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
        this.timeClipValue = `// keep data between ${moment.tz(tc.msmin, this._options.timeZone).toLocaleString()} and ` +
          `${moment.tz(tc.msmax, this._options.timeZone).toLocaleString()}<br/>` +
          `${this._options.timeUnit !== 'us' ? '// (for a ' + this._options.timeUnit + ' platform)<br/>' : ''}` +
          `${Math.round(tc.tsmax)} ${Math.round(tc.tsmax - tc.tsmin)} TIMECLIP`;
        this.LOG.debug(['handleKeyUp', 't'], this.timeClipValue);
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
    } else {
      this.pushKbdEvent(ev.key);
    }
  }

  applyFilter() {
    this.gtsFilterCount++;
    this.gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.nativeElement.value;
    this.modal.close();
  }

  private pushKbdEvent(key: string) {
    this.kbdCounter++;
    this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
  }

  getTZ() {
    return moment.tz.names();
  }

  getData() {
    return this.data;
  }

  protected convert(data: DataModel): any[] {
    return [];
  }
}
