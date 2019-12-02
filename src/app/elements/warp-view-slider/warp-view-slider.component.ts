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
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import moment from 'moment';
import {Logger} from '../../utils/logger';
import * as noUiSlider from 'nouislider';

/**
 *
 */
@Component({
  selector: 'warpview-slider',
  templateUrl: './warp-view-slider.component.html',
  styleUrls: ['./warp-view-slider.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewSliderComponent implements AfterViewInit {
  @ViewChild('slider', { static: false }) slider: ElementRef<HTMLDivElement>;

  @Input('min') set min(m) {
    this.LOG.debug(['min'], m);
    this._min = m;
    this.setOptions();
  }

  get min() {
    return this._min;
  }

  @Input('max') set max(m) {
    this.LOG.debug(['max'], m);
    this._max = m;
    this.setOptions();
  }

  get max() {
    return this._max;
  }


  @Input('value') value: number;

  @Input('step') set step(step: number) {
    this.LOG.debug(['step'], step);
    if (this._step !== step) {
      this._step = step;
      this.setOptions();
    }
  }

  get step() {
    return this._step;
  }

  @Input('mode') mode = 'timestamp';

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Output('change') change = new EventEmitter();

  _min: number;
  _max: number;
  show = false;
  protected _uiSlider;
  protected _step = 0;
  protected LOG: Logger;
  loaded = false;
  protected manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  protected _debug = false;

  constructor() {
    this.LOG = new Logger(WarpViewSliderComponent, this.debug);
    this.LOG.debug(['constructor'], this.debug);
  }

  ngAfterViewInit(): void {
    this.loaded = false;
    this.setOptions();
  }

  protected setOptions() {
    if (!this._min && !this._max) {
      return;
    }
    this.LOG.debug(['_step'], this._step);
    const tmpVAl = Math.min(Math.max(this.value || Number.MIN_VALUE, this._min), this._max);
    if (tmpVAl !== this.value && this.loaded) {
      this.change.emit(tmpVAl);
    }
    this.value = tmpVAl;
    this.loaded = true;
    this.LOG.debug(['noUiSlider'], this.slider);
    if (this.slider) {
      if (!this._uiSlider) {
        const opts = {
          start: [this.value + 1],
          tooltips: [this.getFormat()],
          range: {min: [this._min], max: [this._max]}
        } as any;
        if (!!this._step && this._step > 0) {
          opts.step = Math.floor((this._max - this._min) / this._step);
        }
        this._uiSlider = noUiSlider.create(this.slider.nativeElement, opts);
        this._uiSlider.on('end', event => {
          this.LOG.debug(['onChange'], event);
          this.value = parseInt(event[0], 10);
          this.change.emit({value: parseInt(event[0], 10)});
        });
      } else {
        this.updateSliderOptions();
      }
    }
  }

  protected updateSliderOptions() {
    // tslint:disable-next-line:no-string-literal
    this.slider.nativeElement['noUiSlider'].set([this.value]);
    const opts = {range: {min: [this._min], max: [this._max]}} as any;
    if (!!this._step && this._step > 0) {
      opts.step = Math.floor((this._max - this._min) / this._step);
    }
    // tslint:disable-next-line:no-string-literal
    this.slider.nativeElement['noUiSlider'].updateOptions(opts);
  }

  protected format(value: number) {
    if (this.mode !== 'timestamp') {
      return moment(value).utc(true).format('YYYY/MM/DD hh:mm:ss');
    } else {
      return value.toString();
    }
  }

  protected getFormat() {
    return {
      to: value => this.format(value),
      from: value => value.replace(',-', '')
    };
  }
}
