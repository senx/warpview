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

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Logger} from '../../../utils/logger';
import {GTSLib} from '../../../utils/gts.lib';
import {Param} from '../../../model/param';
import {Observable, Subject, Subscription} from 'rxjs';

@Component({
  selector: 'warpview-tree-view',
  templateUrl: './warp-view-tree-view.component.html',
  styleUrls: ['./warp-view-tree-view.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewTreeViewComponent implements OnInit, OnDestroy {

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
  @Input('params') params: Param[];
  @Input('branch') branch = false;
  @Input('hidden') hidden = false;
  @Input() events: Observable<void>;

  @Output('warpViewSelectedGTS') warpViewSelectedGTS = new EventEmitter<any>();

  hide: any = {};
  initOpen: Subject<void> = new Subject<void>();
  stateChange: Subject<boolean> = new Subject<boolean>();

  private LOG: Logger;
  private _debug = false;
  private _hiddenData: number[] = [];
  private eventsSubscription: Subscription;
  private _kbdLastKeyPressed: string[] = [];

  @Input('kbdLastKeyPressed')
  set kbdLastKeyPressed(kbdLastKeyPressed: string[]) {
    this.LOG.debug(['kbdLastKeyPressed'], kbdLastKeyPressed);
    this._kbdLastKeyPressed = kbdLastKeyPressed;
    if (kbdLastKeyPressed[0] === 'a') {
      this.stateChange.next(true);
    }
    if (kbdLastKeyPressed[0] === 'n') {
      this.stateChange.next(false);
    }
  }

  get kbdLastKeyPressed() {
    return this._kbdLastKeyPressed;
  }

  constructor() {
    this.LOG = new Logger(WarpViewTreeViewComponent, this.debug);
  }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe(() => this.open());
    this.LOG.debug(['ngOnInit'], this.gtsList);
    const size = this.gtsList.length;
    for (let i = 0; i < size; i++) {
      this.hide[i + ''] = false;
    }
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }


  toggleVisibility(index: number) {
    this.LOG.debug(['toggleVisibility'], index, this.hide);
    this.hide[index + ''] = !this.hide[index + ''];
  }

  isHidden(index: number) {
    return !!this.hide[index + ''] ? !!this.hide[index + ''] : false;
  }

  isGts(node) {
    return GTSLib.isGts(node);
  }

  identify(index, item) {
    return index;
  }

  warpViewSelectedGTSHandler(event) {
    // this.LOG.debug(['warpViewSelectedGTS'], event);
    this.warpViewSelectedGTS.emit(event);
  }

  open() {
    this.gtsList.forEach((g, index) => this.hide[index + ''] = true);
    setTimeout(() => this.initOpen.next());
  }
}
