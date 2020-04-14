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

import {AfterViewChecked, Component} from '@angular/core';
import moment from 'moment';
import {Logger} from '../../../../projects/warpview-ng/src/lib/utils/logger';
import {HighlightService} from '../HighlightService';

@Component({
  selector: 'warpview-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements AfterViewChecked {
  private LOG: Logger;
  private highlighted = false;

  max = moment().valueOf();
  min = moment().subtract(6, 'month').valueOf();

  constructor(private highlightService: HighlightService) {
    this.LOG = new Logger(GettingStartedComponent, true);
  }

  ngAfterViewChecked() {
    if (!this.highlighted) {
      this.highlightService.highlightAll();
      this.highlighted = true;
    }
  }

  onSliderChange(event) {
    this.LOG.debug(['onSliderChange'], event);
  }

  onRangeSliderChange(event) {
    this.LOG.debug(['onRangeSliderChange'], event);
  }
}
