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

import { Component, Element, Event, EventEmitter, Listen, Prop, Watch } from "@stencil/core";
import { GTSLib } from "../../utils/gts.lib";
import { ColorLib } from "../../utils/color-lib";
import { GTS } from "../../model/GTS";
import { Logger } from "../../utils/logger";

@Component({
  tag: 'warp-view-chip',
  styleUrls: [
    'warp-view-chip.scss'
  ]
})
export class WarpViewChip {
  @Prop() name: string;
  @Prop() node: any;
  @Prop() gtsFilter = '';

  _node: any = {
    selected: true,
    gts: GTS
  };

  @Event() warpViewSelectedGTS: EventEmitter;

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(WarpViewChip);

  @Watch('gtsFilter')
  private onGtsFilter(newValue: string, oldValue: string) {
    if(oldValue !== newValue) {
      if(this.gtsFilter !== '') {
        this.setState(new RegExp(this.gtsFilter, 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
      }
    }
  }

  @Listen('document:keyup')
  handleKeyDown(ev: KeyboardEvent) {
    if(ev.key === 'a') {
      this.setState(true);
    }
    if(ev.key === 'n') {
      this.setState(false);
    }
  }

  private colorizeChip() {
    const chip: HTMLElement = this.el.getElementsByClassName('normal')[ 0 ] as HTMLElement;
    if(this._node.selected) {
      chip.style.setProperty('background-color', ColorLib.transparentize(ColorLib.getColor(this._node.gts.id)));
      chip.style.setProperty('border-color', ColorLib.getColor(this._node.gts.id));
    } else {
      chip.style.setProperty('background-color', '#eeeeee');
    }
  }

  /**
   *
   */
  componentWillLoad() {
    this._node = { ...this.node, selected: true };
  }

  /**
   *
   */
  componentDidLoad() {
    if(this.gtsFilter !== '' && new RegExp(this.gtsFilter, 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))) {
      this.setState(false);
    }
    this.colorizeChip();
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
    if(obj === undefined) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return {
        name: key,
        value: obj[ key ],
      };
    });
  }

  /**
   *
   * @param {UIEvent} event
   */
  switchPlotState(event: UIEvent) {
    event.preventDefault();
    this.setState(!this._node.selected);
    return false;
  }

  private setState(state: boolean) {
    this._node = {
      ...this._node,
      selected: state,
      label: GTSLib.serializeGtsMetadata(this._node.gts)
    };
    this.LOG.debug([ 'switchPlotState' ], this._node);
    this.colorizeChip();
    this.warpViewSelectedGTS.emit(this._node);
  }

  render() {
    return <div>
      {this._node && this._node.gts && this._node.gts.l ?
        <span onClick={(event: UIEvent) => this.switchPlotState(event)}><i class="normal"/>
            <span class="gtsInfo">
          <span class='gts-classname'>&nbsp; {this._node.gts.c}</span>
          <span class='gts-separator' innerHTML={'&lcub; '}/>
              {this.toArray(this._node.gts.l).map((label, index) =>
                  <span>
              <span class='gts-labelname'>{label.name}</span>
              <span class='gts-separator'>=</span>
              <span class='gts-labelvalue'>{label.value}</span>
              <span hidden={this.lastIndex(index, this._node.gts.l)}>, </span>
            </span>
              )}
              <span class='gts-separator' innerHTML={' &rcub;'}/>
              {this.toArray(this._node.gts.a).length > 0
                ? <span><span class='gts-separator' innerHTML={'&lcub; '}/>
                  {this.toArray(this._node.gts.a).map((label, index) =>
                      <span>
              <span class='gts-attrname'>{label.name}</span>
              <span class='gts-separator'>=</span>
              <span class='gts-attrvalue'>{label.value}</span>
              <span hidden={this.lastIndex(index, this._node.gts.a)}>, </span>
            </span>
                  )}
                  <span class='gts-separator' innerHTML={' &rcub;'}/></span>
                : ''}
          </span>
          </span>
        : ''
      }
    </div>
  }
}
