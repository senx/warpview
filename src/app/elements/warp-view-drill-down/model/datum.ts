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

import {Moment} from 'moment';

/**
 *
 */
export class Datum {
  date: Moment;
  summary?: Summary[];
  total?: number;
  details?: Detail[];
}

/**
 *
 */
export class Summary {
  color?: string;
  id?: number;
  name: string;
  total: number;
  date?: Moment;
}

/**
 *
 */
export class Detail {
  color?: string;
  date: number;
  id: number;
  name: string;
  value: number;
}
