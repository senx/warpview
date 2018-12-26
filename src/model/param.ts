/*
 *  Copyright 2018  SenX S.A.S.
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
  bgColor?: string;
  fontColor?: string;
  borderColor?: string;
  showLegend?: boolean;
  responsive?: boolean;
  gridLineColor?: string;
  key?: string;
  interpolate?: string;
  type?: string;
  showRangeSelector?: boolean;
  startLat?: number;
  startLong?: number;
  startZoom?: number;
  dotsLimit?: number;
  heatRadius?: number;
  heatBlur?: number;
  heatOpacity?: number;
  heatControls?: boolean;
  mapType?: string;
  autoRefresh?: number;
  showControls?: boolean;
  showGTSTree?: boolean;
  foldGTSTree?: boolean;
  timeMode?: string;
  showDots?: boolean = false;
  timeUnit?: string = 'us';
  minColor?: string;
  maxColor?: string;
}
