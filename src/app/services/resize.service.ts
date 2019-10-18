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

import {EventEmitter} from '@angular/core';

/**
 *
 */
export class Size {
  /**
   *
   * @param {number} width
   * @param {number} height
   */
  constructor(public width: number, public height: number) {
  }
}

/**
 *
 */
export class SizeService {
  public sizeChanged$: EventEmitter<Size>;

  /**
   *
   */
  constructor() {
    this.sizeChanged$ = new EventEmitter();
  }

  /**
   *
   * @param {Size} size
   */
  public change(size: Size): void {
    this.sizeChanged$.emit(size);
  }
}