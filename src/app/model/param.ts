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
export class Param {
  scheme?: string = 'WARP10';
  bgColor?: string;
  fontColor?: string;
  borderColor?: string;
  gridLineColor?: string;
  showLegend?: boolean;
  responsive?: boolean;
  key?: string;
  interpolate?: string;
  type?: string;
  showRangeSelector?: boolean;
  startLat?: number;
  startLong?: number;
  startZoom?: number;
  dotsLimit?: number;
  autoRefresh?: number;
  showControls?: boolean = true;
  showGTSTree?: boolean;
  foldGTSTree?: boolean;
  timeMode?: string;
  showDots? = false;
  delta?: number;
  timeUnit? = 'us';
  minColor?: string;
  maxColor?: string;
  popupButtonValidateClass?: string;
  popupButtonValidateLabel?: string;
  timeZone? = 'UTC';
  map?: {
    tiles?: string[];
    heatRadius?: number;
    heatBlur?: number;
    heatOpacity?: number;
    heatControls?: boolean;
    mapType?: string;
    showTimeSlider?: boolean;
    showTimeRange?: boolean;
    timeSliderMin?: number;
    timeSliderMax?: number;
    timeSliderStep?: number;
    timeSliderMode?: string;
    timeStart?: number,
    timeSpan?: number,
    timeSpanList?: any[]
  } = {
    tiles: [],
    showTimeSlider: false,
    showTimeRange: false,
    timeSliderMode: 'timestamp'
  };
  bounds?: {
    minDate?: number;
    maxDate?: number;
    yRanges?: [number, number];
  } = {};
}
