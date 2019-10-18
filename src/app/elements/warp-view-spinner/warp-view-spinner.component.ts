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

import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'warpview-spinner',
  templateUrl: './warp-view-spinner.component.html',
  styleUrls: ['./warp-view-spinner.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewSpinnerComponent implements OnInit {

  @Input() message: string = 'Loading and parsing data...';

  constructor() {
  }

  ngOnInit() {
  }

}