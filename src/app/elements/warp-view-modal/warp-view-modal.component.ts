/*
 * Copyright 2019 SenX S.A.S.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'warpview-modal',
  templateUrl: './warp-view-modal.component.html',
  styleUrls: ['./warp-view-modal.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewModalComponent implements AfterViewInit {


  @Input('modalTitle') modalTitle = '';
  @Input('kbdLastKeyPressed') kbdLastKeyPressed: string[] = [];

  @Output('warpViewModalOpen') warpViewModalOpen = new EventEmitter<any>();
  @Output('warpViewModalClose') warpViewModalClose = new EventEmitter<any>();

  private opened = false;

  public open() {
    this.el.nativeElement.style.display = 'block';
    this.el.nativeElement.style.zIndex = '999999';
    this.opened = true;
    this.warpViewModalOpen.emit({});
  }

  public close() {
    this.el.nativeElement.style.display = 'none';
    this.el.nativeElement.style.zIndex = '-1';
    this.opened = false;
    this.warpViewModalClose.emit({});
  }

  public isOpened(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      resolve(this.opened);
    });
  }

  @HostListener('kbdLastKeyPressed', ['$event'])
  handleKeyDown($event: string[]) {
    if ('Escape' === $event[0]) {
      this.close();
    }
  }

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.el.nativeElement.addEventListener('click', (event: any) => {
      if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
        this.close();
      }
    });
  }
}
