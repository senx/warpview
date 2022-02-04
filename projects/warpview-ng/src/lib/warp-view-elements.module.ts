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

import {Injector, NgModule} from '@angular/core';
import {WarpViewChartComponent} from './elements/warp-view-chart/warp-view-chart.component';
import {WarpViewTileComponent} from './elements/warp-view-tile/warp-view-tile.component';
import {WarpViewSpinnerComponent} from './elements/warp-view-spinner/warp-view-spinner.component';
import {createCustomElement} from '@angular/elements';
import {WarpViewToggleComponent} from './elements/warp-view-toggle/warp-view-toggle.component';
import {WarpViewBarComponent} from './elements/warp-view-bar/warp-view-bar.component';
import {WarpViewBubbleComponent} from './elements/warp-view-bubble/warp-view-bubble.component';
import {WarpViewDatagridComponent} from './elements/warp-view-datagrid/warp-view-datagrid.component';
import {WarpViewDrillDownComponent} from './elements/warp-view-drill-down/warp-view-drill-down.component';
import {WarpViewGtsTreeComponent} from './elements/warp-view-gts-tree/warp-view-gts-tree.component';
import {WarpViewImageComponent} from './elements/warp-view-image/warp-view-image.component';
import {WarpViewMapComponent} from './elements/warp-view-map/warp-view-map.component';
import {WarpViewPieComponent} from './elements/warp-view-pie/warp-view-pie.component';
import {WarpViewGaugeComponent} from './elements/warp-view-gauge/warp-view-gauge.component';
import {WarpViewAnnotationComponent} from './elements/warp-view-annotation/warp-view-annotation.component';
import {WarpViewPolarComponent} from './elements/warp-view-polar/warp-view-polar.component';
import {WarpViewRadarComponent} from './elements/warp-view-radar/warp-view-radar.component';
import {WarpViewPlotComponent} from './elements/warp-view-plot/warp-view-plot.component';
import {WarpViewSpectrumComponent} from './elements/warp-view-spectrum/warp-view-spectrum.component';

import {BrowserModule} from '@angular/platform-browser';
import {WarpViewAngularModule} from './warp-view-angular.module';
import {WarpViewBoxComponent} from './elements/warp-view-box/warp-view-box.component';
import {WarpView3dLineComponent} from './elements/warp-view-3d-line/warp-view-3d-line.component';
import {WarpViewGlobeComponent} from './elements/warp-view-globe/warp-view-globe.component';
import {WarpViewEventDropComponent} from './elements/warp-view-event-drop/warp-view-event-drop.component';
import {WarpViewResultTileComponent} from './elements/warp-view-result-tile/warp-view-result-tile.component';

@NgModule({
    declarations: [],
    imports: [
        WarpViewAngularModule,
        BrowserModule,
    ],
    exports: [],
    providers: []
})
export class WarpViewElementsModule {
  constructor(private injector: Injector) {
    [
      {name: 'warp-view-result-tile', component: WarpViewResultTileComponent},
      {name: 'warp-view-event-drop', component: WarpViewEventDropComponent},
      {name: 'warp-view-globe', component: WarpViewGlobeComponent},
      {name: 'warp-view-3dline', component: WarpView3dLineComponent},
      {name: 'warp-view-box', component: WarpViewBoxComponent},
      {name: 'warp-view-chart', component: WarpViewChartComponent},
      {name: 'warp-view-tile', component: WarpViewTileComponent},
      {name: 'warp-view-spinner', component: WarpViewSpinnerComponent},
      {name: 'warp-view-toggle', component: WarpViewToggleComponent},
      {name: 'warp-view-bar', component: WarpViewBarComponent},
      {name: 'warp-view-bubble', component: WarpViewBubbleComponent},
      {name: 'warp-view-datagrid', component: WarpViewDatagridComponent},
      {name: 'warp-view-gts-tree', component: WarpViewGtsTreeComponent},
      {name: 'warp-view-drilldown', component: WarpViewDrillDownComponent},
      {name: 'warp-view-image', component: WarpViewImageComponent},
      {name: 'warp-view-map', component: WarpViewMapComponent},
      {name: 'warp-view-pie', component: WarpViewPieComponent},
      {name: 'warp-view-gauge', component: WarpViewGaugeComponent},
      {name: 'warp-view-annotation', component: WarpViewAnnotationComponent},
      {name: 'warp-view-polar', component: WarpViewPolarComponent},
      {name: 'warp-view-radar', component: WarpViewRadarComponent},
      {name: 'warp-view-plot', component: WarpViewPlotComponent},
      {name: 'warp-view-spectrum', component: WarpViewSpectrumComponent},
    ].forEach(wc => {
      if (!customElements.get(wc.name)) {
        customElements.define(wc.name, createCustomElement(wc.component, {injector: this.injector}));
      }
    });
  }

  ngDoBootstrap() {
  }
}
