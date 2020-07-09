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

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {GTS} from '../../../model/GTS';
import {Logger} from '../../../utils/logger';
import {GTSLib} from '../../../utils/gts.lib';
import {ColorLib} from '../../../utils/color-lib';
import {Param} from '../../../model/param';

/**
 *
 */
@Component({
  selector: 'warpview-chip',
  templateUrl: './warp-view-chip.component.html',
  styleUrls: ['./warp-view-chip.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewChipComponent implements OnInit, AfterViewInit {

  @ViewChild('chip', {static: false}) chip: ElementRef;

  @Input('name') name: string;
  @Input('node') node: any;
  @Input('param') param: Param = new Param();
  @Input('options') options: Param = new Param();

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    this._hiddenData = hiddenData;
 //   this.LOG.debug(['hiddenData'], hiddenData, this._node, this._node.gts, this._node.gts.c);
    if (this._node && this._node.gts && this._node.gts.c) {
      this._node = {
        ...this._node,
        selected: this.hiddenData.indexOf(this._node.gts.id) === -1,
        label: GTSLib.serializeGtsMetadata(this._node.gts)
      };
      this.LOG.debug(['hiddenData'], this._node);
      this.colorizeChip();
    }
  }

  get hiddenData(): number[] {
    return this._hiddenData;
  }

  @Input('gtsFilter') set gtsFilter(gtsFilter: string) {
    this._gtsFilter = gtsFilter;
    if (this._gtsFilter.slice(1) !== '') {
      this.setState(new RegExp(this._gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
    } else {
      this.setState(true);
    }
  }

  get gtsFilter() {
    return this._gtsFilter;
  }

  @Input('kbdLastKeyPressed') set kbdLastKeyPressed(kbdLastKeyPressed: string[]) {
    this._kbdLastKeyPressed = kbdLastKeyPressed;
    if (kbdLastKeyPressed[0] === 'a') {
      this.setState(true);
    }
    if (kbdLastKeyPressed[0] === 'n') {
      this.setState(false);
    }
  }

  @Output('warpViewSelectedGTS') warpViewSelectedGTS = new EventEmitter<any>();

  private LOG: Logger;
  private refreshCounter = 0;
  // the first character triggers change each filter apply to trigger events. it must be discarded.
  private _gtsFilter = 'x';
  private _debug = false;
  private _kbdLastKeyPressed: string[] = [];
  private _hiddenData: number[] = [];
  _node: any = {
    selected: true,
    gts: GTS,
  };

  constructor() {
    this.LOG = new Logger(WarpViewChipComponent, this.debug);
  }

  ngOnInit(): void {
    this._node = {...this.node, selected: this.hiddenData.indexOf(this.node.gts.id) === -1};
  }

  ngAfterViewInit() {
    if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
      || this.hiddenData.indexOf(this._node.gts.id) > -1) {
      this.setState(false);
    }
    this.colorizeChip();
  }

  private colorizeChip() {
    if (this.chip) {
      if (this._node.selected && this.chip.nativeElement) {
        const c = ColorLib.getColor(this._node.gts.id, this.options.scheme);
        const color = (this.param || {datasetColor: c}).datasetColor || c;
        this.chip.nativeElement.style.setProperty('background-color', ColorLib.transparentize(color));
        this.chip.nativeElement.style.setProperty('border-color', color);
      } else {
        this.chip.nativeElement.style.setProperty('background-color', '#eeeeee');
      }
      this.refreshCounter++;
    }
  }

  toArray(obj) {
    if (obj === undefined) {
      return [];
    }
    return Object.keys(obj).map(key => ({name: key, value: obj[key]}));
  }

  switchPlotState(event: UIEvent) {
    event.preventDefault();
    this.setState(!this._node.selected);
    return false;
  }

  private setState(state: boolean) {
    if (this._node && this._node.gts) {
      this._node = {
        ...this._node,
        selected: state,
        label: GTSLib.serializeGtsMetadata(this._node.gts)
      };
      //   this.LOG.debug(['switchPlotState'], this._node);
      this.colorizeChip();
      this.warpViewSelectedGTS.emit(this._node);
    }
  }
}
