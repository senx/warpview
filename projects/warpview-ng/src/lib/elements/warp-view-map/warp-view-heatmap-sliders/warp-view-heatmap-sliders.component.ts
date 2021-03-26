/*
 *  Copyright 2021  SenX S.A.S.
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

import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'warpview-heatmap-sliders',
  templateUrl: './warp-view-heatmap-sliders.component.html',
  styleUrls: ['./warp-view-heatmap-sliders.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewHeatmapSlidersComponent {

  @Input('radiusValue') radiusValue: number;
  @Input('minRadiusValue') minRadiusValue: number;
  @Input('maxRadiusValue') maxRadiusValue: number;
  @Input('blurValue') blurValue: number;
  @Input('minBlurValue') minBlurValue: number;
  @Input('maxBlurValue') maxBlurValue: number;

  @Output('heatRadiusDidChange') heatRadiusDidChange = new EventEmitter<any>();
  @Output('heatBlurDidChange') heatBlurDidChange = new EventEmitter<any>();
  @Output('heatOpacityDidChange') heatOpacityDidChange = new EventEmitter<any>();

  radiusChanged(value) {
    this.heatRadiusDidChange.emit(value);
  }

  blurChanged(value) {
    this.heatBlurDidChange.emit(value);
  }

  opacityChanged(value) {
    this.heatOpacityDidChange.emit(value);
  }
}
