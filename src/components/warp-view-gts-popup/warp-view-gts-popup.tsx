/*
 *  Copyright 2018  SenX S.A.S.
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

import {Component, Event, EventEmitter, Listen, Method, Prop, State, Watch} from "@stencil/core";
import {DataModel} from "../../model/dataModel";
import {GTSLib} from "../../utils/gts.lib";
import {Logger} from "../../utils/logger";
import {GTS} from "../../model/GTS";
import {WarpViewModal} from "../warp-view-modal/warp-view-modal";

@Component({
  tag: 'warp-view-gts-popup',
  styleUrl: 'warp-view-gts-popup.scss',
  shadow: true
})
export class WarpViewGtsPopup {
  @Prop() gtsList: DataModel = new DataModel();
  @Prop() maxToShow: number = 5;
  @Prop() hiddenData: number[] = [];
  @Prop() debug = false;
  @Prop() kbdLastKeyPressed: string[] = [];

  @Event() warpViewSelectedGTS: EventEmitter;

  @State() private displayed: any[] = [];
  @State() current: number = 0;

  private _gts: any[] = [];
  private modal: WarpViewModal;
  private modalOpenned: boolean = false;
  private LOG: Logger;

  @Listen('warpViewModalOpen')
  onWarpViewModalOpen() {
    this.modalOpenned = true;
  }

  @Listen('warpViewModalClose')
  onWarpViewModalClose() {
    this.modalOpenned = false;
  }

  @Watch('kbdLastKeyPressed')
  handleKeyDown(key: string[]) {
    if (key[0] === 's' && !this.modalOpenned) {
      this.showPopup();
    } else if (this.modalOpenned) {
      switch (key[0]) {
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
          return true;
      }
    }
  }

  @Method()
  public isOpened(): Promise<boolean> {
    return this.modal.isOpened();
  }

  @Watch('hiddenData')
  private onHideData(newValue: number[], oldValue: number[]) {
    this.LOG.debug(['hiddenData'], newValue);
    this.prepareData();
  }

  @Watch('gtsList')
  private onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    this.LOG.debug(['data'], newValue);
    this.prepareData();
  }

  private showPopup() {
    this.current = 0;
    this.prepareData();
    this.modal.open();
  }

  private prepareData() {
    if (this.gtsList && this.gtsList.data) {
      this._gts = GTSLib.flatDeep([this.gtsList.data]);
      this.displayed = this._gts.slice(
        Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)),
        Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0)))
      ) as any[];
      this.LOG.debug(['prepareData'], this.displayed)
    }
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewGtsPopup, this.debug);
  }

  componentDidLoad() {
    this.prepareData();
  }

  render() {
    // reusing the warp-view-chip, without passing keyboard events.
    // STENCIL BUG. mapping this.displayed should work... but including webcomponents inside slot is not working correctly at all. hence the trick to set display none.
    return <warp-view-modal kbdLastKeyPressed={this.kbdLastKeyPressed} modalTitle="GTS Selector" ref={(el: any) => {
      this.modal = el as WarpViewModal
    }}>
      {this.current > 0 ? <div class="up-arrow"/> : ''}
      <ul>
        {this._gts.map((gts, index) => {
            return <li class={this.current == index ? 'selected' : ''}
                       style={this.displayed.find(g => g.id === gts.id) ? {} : {'display': 'none'}}>
              <warp-view-chip node={{gts: gts}} name={gts.c} hiddenData={this.hiddenData}/>
            </li>
          }
        )}
      </ul>
      {this.current < this._gts.length - 1 ? <div class="down-arrow"/> : ''}
    </warp-view-modal>

  }

}
