/*
 *  Copyright 2020  SenX S.A.S.
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
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {WarpViewSliderComponent} from '../warp-view-slider/warp-view-slider.component';
import {Logger} from '../../utils/logger';
import * as noUiSlider from 'nouislider';

/**
 *
 */
@Component({
  selector: 'warpview-range-slider',
  templateUrl: './warp-view-range-slider.component.html',
  styleUrls: ['./warp-view-range-slider.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewRangeSliderComponent extends WarpViewSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('slider', { static: false }) slider: ElementRef<HTMLDivElement>;
  @Input('minValue') minValue: number;
  @Input('maxValue') maxValue: number;

  constructor() {
    super();
    this.LOG = new Logger(WarpViewRangeSliderComponent, this.debug);
    this.LOG.debug(['constructor'], this.debug);
  }

  ngOnInit(): void {
    this.setOptions();
    this.minValue = this.minValue || this._min;
    this.maxValue = this.maxValue || this._max;
  }

  ngAfterViewInit(): void {
    this.loaded = false;
    this.setOptions();
  }

  onChange(val) {
    this.change.emit({value: this.minValue, highValue: this.maxValue});
    this.LOG.debug(['onChange'], val, {value: this.minValue, highValue: this.maxValue});
  }

  protected setOptions() {
    this.LOG.debug(['setOptions'], this._min, this._max);
    if (!this._min && !this._max) {
      return;
    }
    this.loaded = true;
    this.value = Math.max(this.value || Number.MIN_VALUE, this._min);
    this.LOG.debug(['noUiSlider'], this.slider);
    if (this.slider) {
      if (!this._uiSlider) {
        const opts = {
          start: [this.minValue, this.maxValue],
          connect: true,
          tooltips: [this.getFormat(), this.getFormat()],
          range: {min: [this._min], max: [this._max]}
        } as any;
        if (!!this._step && this._step > 0) {
          opts.step = Math.floor((this._max - this._min) / this._step);
        }
        const uiSlider = noUiSlider.create(this.slider.nativeElement, opts);
        uiSlider.on('end', event => {
          this.LOG.debug(['onChange'], event);
          this.change.emit({
            min: parseInt(event[0], 10),
            max: parseInt(event[1], 10)
          });
        });
      } else {
        this.updateSliderOptions();
      }
    }
  }
}
