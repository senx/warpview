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

import {Component, Element, Event, EventEmitter, Listen, Method, Prop, Watch, State} from "@stencil/core";

@Component({
  tag: 'warp-view-modal',
  styleUrl: 'warp-view-modal.scss',
  shadow: true
})
export class WarpViewModal {

  @Prop() modalTitle: string = '';
  @Prop() kbdLastKeyPressed:string[] = [];

  @Element() el: HTMLElement;
  @Event() warpViewModalOpen: EventEmitter;
  @Event() warpViewModalClose: EventEmitter;

  private opened: boolean = false;


  @Method()
  public open() {
    this.el.style.display = 'block';
    this.el.style.zIndex = '999999';
    this.opened = true;
    this.warpViewModalOpen.emit({});
  }

  @Method()
  public close() {
    this.el.style.display = 'none';
    this.el.style.zIndex = '-1';
    this.opened = false;
    this.warpViewModalClose.emit({});
  }

  @Method()
  public isOpened(): boolean {
    return this.opened;
  }

  @Watch('kbdLastKeyPressed')
  handleKeyDown(key:string[]) {
    if ('Escape' === key[0]) {
      this.close();
    }
  }

  componentDidLoad() {
    this.el.addEventListener('click', (event: any) => {
      if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
        this.close()
      }
    });
  }

  render() {
    return <div class="popup">
      <div class="header">
        <div class="title" innerHTML={this.modalTitle}/>
        <div class="close" onClick={() => this.close()}>&times;</div>
      </div>
      <div class="body">
        <slot/>
      </div>
    </div>
  }

}
