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

import {Component, Element, Listen, Method, Prop} from "@stencil/core";

@Component({
  tag: 'warp-view-modal',
  styleUrl: 'warp-view-modal.scss',
  shadow: true
})
export class WarpViewModal {

  @Prop() modalTitle: string = '';
  @Element() el: HTMLElement;

  @Method()
  public open() {
    this.el.style.display = 'block';
    this.el.style.zIndex = '999999';
  }

  @Method()
  public close() {
    this.el.style.display = 'none';
    this.el.style.zIndex = '-1';
  }

  @Listen('document:keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if ('Escape' === ev.key) {
      ev.preventDefault();
      return false;
    }
  }

  @Listen('document:keyup')
  handleKeyUp(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.close();
      return false;
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
