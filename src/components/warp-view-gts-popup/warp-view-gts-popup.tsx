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

  private LOG: Logger = new Logger(WarpViewGtsPopup);
  @State() current: number = 0;

  @Listen('document:keyup')
  handleKeyDown(ev: KeyboardEvent) {
    this.LOG.debug(['document:keyup'], ev);
    if (ev.key === 'k') {
      this.showPopup();
    }
    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      this.current = Math.max(0, this.current - 1);
      return false;
    }
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      this.current = Math.min(this.displayed.length - 1, this.current + 1);
    }
    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.show = false;
    }
    if (ev.key === ' ') {
      this.warpViewSelectedGTS.emit()
    }
  }

  @Watch('hiddenData')
  private onHideData(newValue: number[], oldValue: number[]) {
    if (oldValue.length !== newValue.length) {
      this.LOG.debug(['hiddenData'], newValue);
      this.prepareData();
    }
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
      const bottom = Math.max(0, this.current - Math.ceil(this.maxToShow / 2));
      const gts = GTSLib.flatDeep([this.gtsList.data]); //.filter(g => this.hiddenData.filter((h) => h === g.id).length === 0);
      this.displayed = gts.slice(bottom, Math.min(gts.length, bottom + this.maxToShow)) as any[];
      this.LOG.debug(['prepareData'], bottom, this.displayed)
    }
  }

  componentDidLoad() {
    this.prepareData();
  }

  render() {
    return <div>{
      this.show
        ? <div class="popup">
          <ul>
            {this.displayed.map((gts, index) =>
              <li class={this.current === index ? 'selected' : ''}>
                <div class="round"
                     style={{
                       'background-color': ColorLib.transparentize(ColorLib.getColor(gts.id)),
                       'border-color': ColorLib.getColor(gts.id)
                     }}></div>
                <span innerHTML={GTSLib.formatLabel(GTSLib.serializeGtsMetadata(gts))}></span>
              </li>
            )}
          </ul>
        </div>
        : ''
    }</div>
  }
}
