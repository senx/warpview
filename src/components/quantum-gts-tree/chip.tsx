/*
 *
 *    Copyright 2016  Cityzen Data
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

import {Component, Element, Event, EventEmitter, Prop} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";
import {ColorLib} from "../../utils/color-lib";
import {GTS} from "../../model/GTS";
import {Logger} from "../../utils/logger";

@Component({
  tag: 'quantum-chip',
  styleUrls: [
    'chip.scss'
  ]
})
export class QuantumChip {
  @Prop() name: string;
  @Prop() index: number;
  @Prop() node: any;
  _node: any = {
    selected: true,
    gts: GTS
  };

  @Event() quantumSelectedGTS: EventEmitter;

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(QuantumChip);

  /**
   *
   * @param {boolean} state
   * @returns {string}
   */
  private gtsColor(state: boolean): string {
    if (state) {
      return ColorLib.getColor(this.index);
    } else {
      return '#bbbbbb';
    }
  }

  /**
   *
   */
  componentWillLoad() {
    this._node = {...this.node, selected: true};
  }

  /**
   *
   */
  componentDidLoad() {
    (this.el.getElementsByClassName('normal')[0] as HTMLElement).style.setProperty('background-color', this.gtsColor(this._node.selected));
  }

  /**
   *
   * @param index
   * @param obj
   * @returns {boolean}
   * @private
   */
  private lastIndex(index, obj) {
    let array = this.toArray(obj);
    return (index === array.length - 1);
  }

  /**
   *
   * @param obj
   * @returns {any}
   * @private
   */
  private toArray(obj) {
    if (obj === undefined) {
      return [];
    }
    return Object.keys(obj).map(function (key) {
      return {
        name: key,
        value: obj[key],
      };
    });
  }

  /**
   *
   * @param {UIEvent} event
   */
  switchPlotState(event: UIEvent) {
    this._node = {
      ...this._node,
      selected: !this._node.selected,
      label: GTSLib.serializeGtsMetadata(this._node.gts)
    };
    this.LOG.debug(['switchPlotState'], [this._node]);
    (this.el.getElementsByClassName('normal')[0] as HTMLElement).style.setProperty('background-color', this.gtsColor(this._node.selected));
    this.quantumSelectedGTS.emit(this._node);
  }

  render() {
    return (
      <div>
        {this._node && this._node.gts && this._node.gts.l ?
          <span><i class="normal"/>
            <span class="gtsInfo" onClick={(event: UIEvent) => this.switchPlotState(event)}>
          <span class='gts-classname'>{this._node.gts.c}</span>
          <span class='gts-separator' innerHTML={'&lcub; '}/>
              {this.toArray(this._node.gts.l).map((label, labelIndex) =>
                  <span>
              <span class='gts-labelname'>{label.name}</span>
              <span class='gts-separator'>=</span>
              <span class='gts-labelvalue'>{label.value}</span>
              <span hidden={this.lastIndex(labelIndex, this._node.gts.l)}>, </span>
            </span>
              )}
              <span class='gts-separator' innerHTML={' &rcub;'}/>
          </span>
          </span>
          : ''
        }
      </div>
    )
  }
}
