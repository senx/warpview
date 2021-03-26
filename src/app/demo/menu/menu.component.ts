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

import {Component, Input} from '@angular/core';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'warpview-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() theme: string;
  menu = [
    {
      title: 'Getting Started',
      slug: '/getting-started'
    },
    {
      title: 'Default',
      slug: '/demo/default'
    },
    {
      title: 'Plot',
      slug: '/demo/plot'
    },
    {
      title: 'Line charts',
      slug: '/demo/chart'
    },
    {
      title: '3D line charts',
      slug: '/demo/line3d'
    },
    {
      title: '3D globe',
      slug: '/demo/globe'
    },
    {
      title: 'Spectrum charts',
      slug: '/demo/spectrum'
    },
    {
      title: 'Bar chart',
      slug: '/demo/bar'
    },
    {
      title: 'Bubble chart',
      slug: '/demo/bubble'
    },
    {
      title: 'Box chart',
      slug: '/demo/box'
    },
    {
      title: 'Data grid',
      slug: '/demo/datagrid'
    },
    {
      title: 'Data display',
      slug: '/demo/display'
    },
    {
      title: 'Data drilldown',
      slug: '/demo/drilldown'
    },
    {
      title: 'GTS tree',
      slug: '/demo/gts-tree'
    },
    {
      title: 'Images',
      slug: '/demo/image'
    },
    {
      title: 'Map',
      slug: '/demo/map'
    },
    {
      title: 'Pie / Donut chart',
      slug: '/demo/pie'
    },
    {
      title: 'Gauge',
      slug: '/demo/gauge'
    },
    {
      title: 'Annotation',
      slug: '/demo/annotation'
    },
    {
      title: 'Drops',
      slug: '/demo/drops'
    },
    {
      title: 'Polar',
      slug: '/demo/polar'
    },
    {
      title: 'Radar',
      slug: '/demo/radar'
    },
    {
      title: 'Small tests',
      slug: '/small'
    }
  ];

  constructor(private settingsService: SettingsService) {
    settingsService.settingsAdded$.subscribe(evt => {
      this.theme = evt.settings.theme;
    });
  }
}
