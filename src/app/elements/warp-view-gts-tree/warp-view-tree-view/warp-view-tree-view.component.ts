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

import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Logger} from '../../../utils/logger';
import {GTSLib} from '../../../utils/gts.lib';
import {Param} from '../../../model/param';

@Component({
  selector: 'warpview-tree-view',
  templateUrl: './warp-view-tree-view.component.html',
  styleUrls: ['./warp-view-tree-view.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewTreeViewComponent implements OnInit {

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    this._hiddenData = [...hiddenData];
  }

  get hiddenData(): number[] {
    return this._hiddenData;
  }

  @Input('options') options: Param;
  @Input('gtsFilter') gtsFilter = 'x';
  @Input('gtsList') gtsList: any[];
  @Input('branch') branch = false;
  @Input('hidden') hidden = false;
  @Input('kbdLastKeyPressed') kbdLastKeyPressed: string[] = [];
  @Output('warpViewSelectedGTS') warpViewSelectedGTS = new EventEmitter<any>();

  private hide: any = {};
  private LOG: Logger;
  private _debug = false;
  private _hiddenData: number[] = [];

  constructor() {
    this.LOG = new Logger(WarpViewTreeViewComponent, this.debug);
  }

  ngOnInit(): void {
    this.LOG.debug(['ngOnInit'], this.gtsList);
    this.gtsList.forEach((g, index) => {
      this.hide[index + ''] = false;
    });
  }

  toggleVisibility(index: number) {
    this.LOG.debug(['toggleVisibility'], index, this.hide);
    this.hide[index + ''] = !this.hide[index + ''];

  }

  isHidden(index: number) {
    if (!!this.hide[index + '']) {
      return this.hide[index + ''];
    } else {
      return false;
    }
  }

  isGts(node) {
    return GTSLib.isGts(node);
  }

  warpViewSelectedGTSHandler(event) {
    this.LOG.debug(['warpViewSelectedGTS'], event);
    this.warpViewSelectedGTS.emit(event);
  }
}
