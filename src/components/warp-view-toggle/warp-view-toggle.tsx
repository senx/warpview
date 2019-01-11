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

import {Component, Element, Event, EventEmitter, Prop, State, Watch} from '@stencil/core';

@Component({
  tag: 'warp-view-toggle',
  styleUrl: 'warp-view-toggle.scss',
  shadow: true
})
export class WarpViewToggle {
  @Prop() checked: boolean = false;
  @Prop() text1: string = "";
  @Prop() text2: string = "";

  @Element() el: HTMLElement;

  @State() state: boolean = false;

  @Event() stateChange: EventEmitter;

  componentWillLoad() {
    this.state = this.checked;
  }

  @Watch('checked')
  private onChecked(newValue: boolean) {
    this.state = newValue;
  }

  switched() {
    this.state = !this.state;
    this.stateChange.emit({state: this.state, id: this.el.id});
  }

  render() {
    return <div class="container">
      <div class="text">{this.text1}</div>
      <label class="switch">
        {this.state
          ? <input type="checkbox" class="switch-input" checked onClick={() => this.switched()}/>
          : <input type="checkbox" class="switch-input" onClick={() => this.switched()}/>
        }
        <span class="switch-label"/>
        <span class="switch-handle"/>
      </label>
      <div class="text">{this.text2}</div>
    </div>;
  }
}
