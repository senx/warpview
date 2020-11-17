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
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {GTS} from '../../../model/GTS';
import {Logger} from '../../../utils/logger';
import {GTSLib} from '../../../utils/gts.lib';
import {ColorLib} from '../../../utils/color-lib';
import {Param} from '../../../model/param';
import {Observable, Subscription} from 'rxjs';

/**
 *
 */
@Component({
  selector: 'warpview-chip',
  templateUrl: './warp-view-chip.component.html',
  styleUrls: ['./warp-view-chip.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewChipComponent implements OnInit, AfterViewInit, OnDestroy {
  private eventsSubscription: Subscription;

  @ViewChild('chip') chip: ElementRef;

  @Input('node') node: any;
  @Input('param') param: Param = new Param();
  @Input('options') options: Param = new Param();
  @Input() events: Observable<boolean>;

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    if (JSON.stringify(hiddenData) !== JSON.stringify(this._hiddenData)) {
      this._hiddenData = hiddenData;
      this.LOG.debug(['hiddenData'], hiddenData, this._node, this._node.gts, this._node.gts.c);
      if (!!this._node && !!this._node.gts && !!this._node.gts.c) {
        this.setState(this._hiddenData.indexOf(this._node.gts.id) === -1);
      }
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

  @Output('warpViewSelectedGTS') warpViewSelectedGTS = new EventEmitter<any>();

  private LOG: Logger;
  // the first character triggers change each filter apply to trigger events. it must be discarded.
  private _gtsFilter = 'x';
  private _debug = false;
  private _hiddenData: number[] = [];
  _node: any = {
    selected: true,
    gts: GTS,
  };

  constructor(private renderer: Renderer2) {
    this.LOG = new Logger(WarpViewChipComponent, this.debug);
  }

  ngOnInit(): void {
    this._node = {...this.node, selected: this._hiddenData.indexOf(this.node.gts.id) === -1};
    if (!!this.events) {
      this.eventsSubscription = this.events.subscribe(state => this.setState(state));
    }
  }

  ngOnDestroy() {
    if (!!this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
      || this.hiddenData.indexOf(this._node.gts.id) > -1) {
      this.setState(false);
    } else {
      this.colorizeChip();
    }
  }

  private colorizeChip() {
    if (!!this.chip) {
      if (!!this._node.selected) {
        const c = ColorLib.getColor(this._node.gts.id, this.options.scheme);
        const color = (this.param || {datasetColor: c}).datasetColor || c;
        this.renderer.setStyle(this.chip.nativeElement, 'background-color', color);
        this.renderer.setStyle(this.chip.nativeElement, 'border-color', color);
      } else {
        this.renderer.setStyle(this.chip.nativeElement, 'background-color', 'transparent');
      }
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
      this.LOG.debug(['switchPlotState'], state, this._node.selected);
      if (this._node.selected !== state) {
        this._node.selected = !!state;
        this.LOG.debug(['switchPlotState'], 'emit');
        this.warpViewSelectedGTS.emit(this._node);
      }
      this.colorizeChip();
    }
  }

  identify(index, item) {
    return index;
  }
}
