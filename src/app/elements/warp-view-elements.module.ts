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

import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WarpViewChartComponent} from './warp-view-chart/warp-view-chart.component';
import {WarpViewTileComponent} from './warp-view-tile/warp-view-tile.component';
import {WarpViewSpinnerComponent} from './warp-view-spinner/warp-view-spinner.component';
import {createCustomElement} from '@angular/elements';
import {HttpClientModule} from '@angular/common/http';
import {HttpErrorHandler} from '../services/http-error-handler.service';
import {WarpViewToggleComponent} from './warp-view-toggle/warp-view-toggle.component';
import {WarpViewBarComponent} from './warp-view-bar/warp-view-bar.component';
import {WarpViewBubbleComponent} from './warp-view-bubble/warp-view-bubble.component';
import {WarpViewDatagridComponent} from './warp-view-datagrid/warp-view-datagrid.component';
import {WarpViewPaginableComponent} from './warp-view-datagrid/warp-view-paginable/warp-view-paginable.component';
import {WarpViewDisplayComponent} from './warp-view-display/warp-view-display.component';
import {WarpViewDrillDownComponent} from './warp-view-drill-down/warp-view-drill-down.component';
import {CalendarHeatmapComponent} from './warp-view-drill-down/calendar-heatmap/calendar-heatmap.component';
import {WarpViewGtsPopupComponent} from './warp-view-gts-popup/warp-view-gts-popup.component';
import {WarpViewModalComponent} from './warp-view-modal/warp-view-modal.component';
import {WarpViewGtsTreeComponent} from './warp-view-gts-tree/warp-view-gts-tree.component';
import {WarpViewTreeViewComponent} from './warp-view-gts-tree/warp-view-tree-view/warp-view-tree-view.component';
import {WarpViewChipComponent} from './warp-view-gts-tree/warp-view-chip/warp-view-chip.component';
import {WarpViewImageComponent} from './warp-view-image/warp-view-image.component';
import {WarpViewMapComponent} from './warp-view-map/warp-view-map.component';
import {WarpViewHeatmapSlidersComponent} from './warp-view-map/warp-view-heatmap-sliders/warp-view-heatmap-sliders.component';
import {WarpViewPieComponent} from './warp-view-pie/warp-view-pie.component';
import {WarpViewGaugeComponent} from './warp-view-gauge/warp-view-gauge.component';
import {WarpViewAnnotationComponent} from './warp-view-annotation/warp-view-annotation.component';
import {WarpViewPolarComponent} from './warp-view-polar/warp-view-polar.component';
import {WarpViewRadarComponent} from './warp-view-radar/warp-view-radar.component';
import {WarpViewPlotComponent} from './warp-view-plot/warp-view-plot.component';
import {WarpViewResizeComponent} from './warp-view-resize/warp-view-resize.component';
import {WarpViewSliderComponent} from './warp-view-slider/warp-view-slider.component';
import {WarpViewRangeSliderComponent} from './warp-view-range-slider/warp-view-range-slider.component';
import {FormsModule} from '@angular/forms';
import {AngularResizedEventModule} from 'angular-resize-event';
import {SizeService} from '../services/resize.service';
import {WarpViewSpectrumComponent} from './warp-view-spectrum/warp-view-spectrum.component';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import {PlotlyModule} from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    WarpViewTileComponent,
    WarpViewChartComponent,
    WarpViewSpinnerComponent,
    WarpViewToggleComponent,
    WarpViewBarComponent,
    WarpViewBubbleComponent,
    WarpViewDatagridComponent,
    WarpViewPaginableComponent,
    WarpViewDisplayComponent,
    WarpViewDrillDownComponent,
    CalendarHeatmapComponent,
    WarpViewGtsPopupComponent,
    WarpViewModalComponent,
    WarpViewGtsTreeComponent,
    WarpViewTreeViewComponent,
    WarpViewChipComponent,
    WarpViewImageComponent,
    WarpViewMapComponent,
    WarpViewHeatmapSlidersComponent,
    WarpViewPieComponent,
    WarpViewGaugeComponent,
    WarpViewAnnotationComponent,
    WarpViewPolarComponent,
    WarpViewRadarComponent,
    WarpViewPlotComponent,
    WarpViewResizeComponent,
    WarpViewSliderComponent,
    WarpViewRangeSliderComponent,
    WarpViewSpectrumComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularResizedEventModule,
    FormsModule,
    PlotlyModule
  ],
  exports: [
    WarpViewTileComponent,
    WarpViewChartComponent,
    WarpViewSpinnerComponent,
    WarpViewToggleComponent,
    WarpViewBarComponent,
    WarpViewBubbleComponent,
    WarpViewDatagridComponent,
    WarpViewPaginableComponent,
    WarpViewDisplayComponent,
    WarpViewDrillDownComponent,
    CalendarHeatmapComponent,
    WarpViewGtsPopupComponent,
    WarpViewModalComponent,
    WarpViewGtsTreeComponent,
    WarpViewTreeViewComponent,
    WarpViewChipComponent,
    WarpViewImageComponent,
    WarpViewMapComponent,
    WarpViewHeatmapSlidersComponent,
    WarpViewPieComponent,
    WarpViewGaugeComponent,
    WarpViewAnnotationComponent,
    WarpViewPolarComponent,
    WarpViewRadarComponent,
    WarpViewPlotComponent,
    WarpViewResizeComponent,
    WarpViewSliderComponent,
    WarpViewRangeSliderComponent,
    WarpViewSpectrumComponent
  ],
  providers: [HttpErrorHandler, SizeService],
  entryComponents: [
    WarpViewTileComponent,
    WarpViewChartComponent,
    WarpViewSpinnerComponent,
    WarpViewToggleComponent,
    WarpViewBarComponent,
    WarpViewBubbleComponent,
    WarpViewDatagridComponent,
    WarpViewPaginableComponent,
    WarpViewDisplayComponent,
    WarpViewDrillDownComponent,
    CalendarHeatmapComponent,
    WarpViewGtsPopupComponent,
    WarpViewModalComponent,
    WarpViewGtsTreeComponent,
    WarpViewTreeViewComponent,
    WarpViewChipComponent,
    WarpViewImageComponent,
    WarpViewMapComponent,
    WarpViewHeatmapSlidersComponent,
    WarpViewPieComponent,
    WarpViewGaugeComponent,
    WarpViewAnnotationComponent,
    WarpViewPolarComponent,
    WarpViewRadarComponent,
    WarpViewPlotComponent,
    WarpViewResizeComponent,
    WarpViewSliderComponent,
    WarpViewRangeSliderComponent,
    WarpViewSpectrumComponent
  ]
})
export class WarpViewElementsModule {
  constructor(private injector: Injector) {
    [
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
