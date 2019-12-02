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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 *
 */
@Component({
  selector: 'warpview-toggle',
  templateUrl: './warp-view-toggle.component.html',
  styleUrls: ['./warp-view-toggle.component.scss']
})
export class WarpViewToggleComponent implements OnInit {
  @Input('checked') set checked(state: boolean) {
    this.state = state;
  }

  get checked(): boolean {
    return this.state;
  }

  @Input('text1') text1 = '';
  @Input('text2') text2 = '';

  @Output('stateChange') stateChange = new EventEmitter<any>();

  state = false;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    this.state = this.checked;
  }

  switched() {
    this.state = !this.state;
    this.stateChange.emit({state: this.state, id: this.el.nativeElement.id});
  }
}
