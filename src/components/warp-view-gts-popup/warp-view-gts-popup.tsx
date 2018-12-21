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

import {Component, Event, EventEmitter, Prop, State} from "@stencil/core";
import {DataModel} from "../../model/dataModel";
import {ColorLib} from "../../utils/color-lib";
import {GTSLib} from "../../utils/gts.lib";

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
  private current: number = 0;
  componentDidLoad() {
    const bottom = this.current - Math.ceil(this.maxToShow / 2);
    this.displayed = this.gtsList.data.slice(bottom,  Math.min(this.gtsList.data.length, bottom + this.maxToShow)) as any[];
  }

  render() {
    return  <div>{
      this.show
        ? <div class="popup">
          <ul>
            { this.displayed.map(gts =>
              <li>
                <div class="round" style={ {'background-color' : ColorLib.transparentize(gts.id),  'border-color': ''}}></div>
                {GTSLib.formatLabel(GTSLib.serializeGtsMetadata(gts.name))}
              </li>
            )}
            </ul>;
        </div>
        : ''
    }</div>
  }
}
