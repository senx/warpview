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
export class Param {
  scheme = 'WARP10';
  bgColor?: string;
  datasetColor?: string;
  fontColor?: string;
  borderColor?: string;
  showlegend = false;
  responsive?: boolean;
  horizontal = false;
  stacked = false;
  key?: string;
  unit?: string;
  type?: string;
  showRangeSelector?: boolean;
  autoRefresh?: number;
  showControls = true;
  showErrors = true;
  showStatus = true;
  expandAnnotation = false;
  showGTSTree?: boolean;
  foldGTSTree?: boolean;
  timeMode?: 'timestamp' | 'date' | 'custom' | 'duration';
  showDots = false;
  delta?: number;
  timeUnit: 'us' | 'ms' | 'ns' = 'us';
  minColor?: string;
  maxColor?: string;
  startColor?: string;
  endColor?: string;
  numColorSteps?: number;
  split?: 'Y' | 'M' | 'D' | 'h' | 'm' | 's';
  popupButtonValidateClass?: string;
  popupButtonValidateLabel?: string;
  timeZone = 'UTC';
  properties?: any;
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
    timeSliderMode?: 'timestamp' | 'date' | 'custom';
    timeStart?: number,
    timeSpan?: number,
    startLat?: number;
    startLong?: number;
    startZoom?: number;
    timeSpanList?: any[],
    animate?: boolean;
  } = {
    tiles: [],
    showTimeSlider: false,
    showTimeRange: false,
    timeSliderMode: 'timestamp'
  };
  bounds: {
    minDate?: number;
    maxDate?: number;
    yRanges?: [number, number];
  } = {};
  histo?: {
    histnorm: 'percent' | 'probability' | 'density' | 'probability density';
    histfunc: 'count' | 'sum' | 'avg' | 'min' | 'max';
  };
  maxValue: number;
  isRefresh?: boolean;
  elemsCount?: number;
  windowed?: number;
}
