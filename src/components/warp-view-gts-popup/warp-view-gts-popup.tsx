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

import {Component, Event, EventEmitter, Listen, Prop, State, Watch} from "@stencil/core";
import {DataModel} from "../../model/dataModel";
import {ColorLib} from "../../utils/color-lib";
import {GTSLib} from "../../utils/gts.lib";
import {Logger} from "../../utils/logger";
import {GTS} from "../../model/GTS";

@Component({
  tag: 'warp-view-gts-popup',
  styleUrl: 'warp-view-gts-popup.scss',
  shadow: true
})
export class WarpViewGtsPopup {
  @Prop() gtsList: DataModel = new DataModel();
  @Prop() maxToShow: number = 5;
  @Prop() hiddenData: number[] = [];

  @Event() warpViewSelectedGTS: EventEmitter;

  @State() private show: boolean = false;
  @State() private displayed: any[] = [];
  @State() current: number = 0;


  private _gts: any[] = [];
  private chips: HTMLElement[] = [];
  private LOG: Logger = new Logger(WarpViewGtsPopup);

  @Listen('document:keydown')
  handleKeyDown(e: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'Escape', ' '].indexOf(e.key) > -1) {
      e.preventDefault();
      return false;
    }
  }

  @Listen('document:keyup')
  handleKeyUp(ev: KeyboardEvent) {
    this.LOG.debug(['document:keyup'], ev);
    switch (ev.key) {
      case 'k':
        ev.preventDefault();
        this.showPopup();
        break;
      case'ArrowUp':
        ev.preventDefault();
        this.current = Math.max(0, this.current - 1);
        this.prepareData();
        break;
      case 'ArrowDown':
        ev.preventDefault();
        this.current = Math.min(this._gts.length - 1, this.current + 1);
        this.prepareData();
        break;
      case ' ':
        ev.preventDefault();
        this.warpViewSelectedGTS.emit({
          gts: this.displayed[this.current],
          selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
        });
        break;
      case 'Escape':
        this.show = false;
        break;
      default:
        return true;
    }
    return false;
  }

  @Watch('hiddenData')
  private onHideData(newValue: number[]) {
    this.LOG.debug(['hiddenData'], newValue);
    this.prepareData();
    this.colorizeChips();
  }

  @Watch('gtsList')
  private onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.prepareData();
    }
  }

  private showPopup() {
    this.current = 0;
    this.prepareData();
    this.show = true;
  }

  private prepareData() {
    if (this.gtsList) {
      this._gts = GTSLib.flatDeep([this.gtsList.data]);
      this.displayed = this._gts.slice(
        Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)),
        Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0)))
      ) as any[];
      this.LOG.debug(['prepareData'], this.displayed)
    }
  }

  private colorizeChips() {
    this.chips.map((chip, index) => {
      if (this.hiddenData.indexOf(this.displayed[index].id) === -1) {
        chip.style.setProperty('background-color', ColorLib.transparentize(ColorLib.getColor(this.displayed[index].id)));
        chip.style.setProperty('border-color', ColorLib.getColor(this.displayed[index].id));
      } else {
        chip.style.setProperty('background-color', '#eeeeee');
      }
    });
  }

  componentDidLoad() {
    this.prepareData();
  }

  render() {
    return <div>{
      this.show
        ? <div class="popup">
          <div class="header">
            <div class="close" onClick={() => {
              this.show = false
            }}>&times;</div>
          </div>
          <div class="body">
            {this.current > 0 ? <div class="up-arrow"/> : ''}
            <ul>
              {this._gts.map((gts, index) =>
                this.displayed.find(g => g.id === gts.id)
                  ? <li class={this.current === index ? 'selected' : ''}>
                    <div class="round"
                         ref={(el) => this.chips[index] = el as HTMLInputElement}
                         style={{
                           'background-color': ColorLib.transparentize(ColorLib.getColor(gts.id)),
                           'border-color': ColorLib.getColor(gts.id)
                         }}/>
                    <span innerHTML={GTSLib.formatLabel(GTSLib.serializeGtsMetadata(gts))}/>
                  </li>

                  : ''
              )}
            </ul>
            {this.current < this._gts.length - 1 ? <div class="down-arrow"/> : ''}
          </div>
        </div>
        : ''
    }</div>
  }
}
