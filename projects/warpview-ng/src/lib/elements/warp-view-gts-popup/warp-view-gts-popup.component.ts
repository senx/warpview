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

import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {DataModel} from '../../model/dataModel';
import {Logger} from '../../utils/logger';
import {GTSLib} from '../../utils/gts.lib';
import {WarpViewModalComponent} from '../warp-view-modal/warp-view-modal.component';
import {Param} from '../../model/param';
import deepEqual from 'deep-equal';
import {ChartLib} from '../../utils/chart-lib';

/**
 *
 */
@Component({
  selector: 'warpview-gts-popup',
  templateUrl: './warp-view-gts-popup.component.html',
  styleUrls: ['./warp-view-gts-popup.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewGtsPopupComponent implements AfterViewInit {
  @ViewChild('modal', {static: true}) modal: WarpViewModalComponent;

  @Input('options') set options(options: Param | string) {
    this.LOG.debug(['onOptions'], options);
    if (typeof options === 'string') {
      options = JSON.parse(options);
    }
    if (!deepEqual(options, this._options)) {
      this.LOG.debug(['options', 'changed'], options);
      this._options = ChartLib.mergeDeep(this._options, options as Param) as Param;
      this.prepareData();
    }
  }

  @Input('gtsList') set gtsList(gtsList: DataModel) {
    this._gtsList = gtsList;
    this.LOG.debug(['_gtsList'], this._gtsList);
    this.prepareData();
  }

  get gtslist(): DataModel {
    return this._gtsList;
  }

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input('data') set data(data: DataModel) {
    this.LOG.debug(['data'], data);
    if (data) {
      this._data = data;
    }
  }

  get data(): DataModel {
    return this._data;
  }


  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    this._hiddenData = hiddenData;
    this.prepareData();
  }

  get hiddenData(): number[] {
    return this._hiddenData;
  }

  @Input('maxToShow') maxToShow = 5;

  @Input('kbdLastKeyPressed') set kbdLastKeyPressed(kbdLastKeyPressed: string[]) {
    this._kbdLastKeyPressed = kbdLastKeyPressed;
    if (kbdLastKeyPressed[0] === 's' && !this.modalOpenned) {
      this.showPopup();
    } else if (this.modalOpenned) {
      switch (kbdLastKeyPressed[0]) {
        case'ArrowUp':
        case'j':
          this.current = Math.max(0, this.current - 1);
          this.prepareData();
          break;
        case 'ArrowDown':
        case 'k':
          this.current = Math.min(this._gts.length - 1, this.current + 1);
          this.prepareData();
          break;
        case ' ':
          this.warpViewSelectedGTS.emit({
            gts: this._gts[this.current],
            selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
          });
          break;
        default:
          return;
      }
    }
  }

  get kbdLastKeyPressed(): string[] {
    return this._kbdLastKeyPressed;
  }

  @Output('warpViewSelectedGTS') warpViewSelectedGTS = new EventEmitter<any>();
  @Output('warpViewModalOpen') warpViewModalOpen = new EventEmitter<any>();
  @Output('warpViewModalClose') warpViewModalClose = new EventEmitter<any>();

  current = 0;
  // tslint:disable-next-line:variable-name
  _gts: any[] = [];
  _options: Param = new Param();

  // tslint:disable-next-line:variable-name
  private _kbdLastKeyPressed: string[] = [];
  // tslint:disable-next-line:variable-name
  private _hiddenData: number[] = [];
  // tslint:disable-next-line:variable-name
  private _debug = false;
  // tslint:disable-next-line:variable-name
  private _gtsList: DataModel;
  // tslint:disable-next-line:variable-name
  private _data: DataModel;
  private displayed: any[] = [];
  private modalOpenned = false;
  private LOG: Logger;

  constructor() {
    this.LOG = new Logger(WarpViewGtsPopupComponent, this.debug);
  }

  ngAfterViewInit(): void {
    this.prepareData();
  }

  onWarpViewModalOpen() {
    this.modalOpenned = true;
    this.warpViewModalOpen.emit({});
  }

  onWarpViewModalClose() {
    this.modalOpenned = false;
    this.warpViewModalClose.emit({});
  }

  public isOpened(): Promise<boolean> {
    return this.modal.isOpened();
  }

  private showPopup() {
    this.current = 0;
    this.modal.open();
    this.prepareData();
  }

  public close() {
    this.modal.close();
  }

  private prepareData() {
    if (this._gtsList && this._gtsList.data) {
      this._gts = GTSLib.flatDeep([this._gtsList.data]);
      const size = this._gts.length;
      const min = Math.max(0, Math.min(this.current - this.maxToShow, size - 2 * this.maxToShow));
      const max = Math.min(size, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0)));
      this.displayed = this._gts.slice(min, max);
      this.LOG.debug(['prepareData'], this.displayed);
    }
  }

  isHidden(gts) {
    return !this.displayed.find(g => !!gts ? gts.id === g.id : false);
  }

  identify(index, item) {
    return index;
  }
}
