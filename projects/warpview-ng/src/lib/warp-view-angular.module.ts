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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WarpViewChartComponent} from './elements/warp-view-chart/warp-view-chart.component';
import {WarpViewTileComponent} from './elements/warp-view-tile/warp-view-tile.component';
import {WarpViewSpinnerComponent} from './elements/warp-view-spinner/warp-view-spinner.component';
import {HttpClientModule} from '@angular/common/http';
import {HttpErrorHandler} from './services/http-error-handler.service';
import {WarpViewToggleComponent} from './elements/warp-view-toggle/warp-view-toggle.component';
import {WarpViewBarComponent} from './elements/warp-view-bar/warp-view-bar.component';
import {WarpViewBubbleComponent} from './elements/warp-view-bubble/warp-view-bubble.component';
import {WarpViewDatagridComponent} from './elements/warp-view-datagrid/warp-view-datagrid.component';
import {WarpViewPaginableComponent} from './elements/warp-view-datagrid/warp-view-paginable/warp-view-paginable.component';
import {WarpViewDisplayComponent} from './elements/warp-view-display/warp-view-display.component';
import {WarpViewDrillDownComponent} from './elements/warp-view-drill-down/warp-view-drill-down.component';
import {CalendarHeatmapComponent} from './elements/warp-view-drill-down/calendar-heatmap/calendar-heatmap.component';
import {WarpViewGtsPopupComponent} from './elements/warp-view-gts-popup/warp-view-gts-popup.component';
import {WarpViewModalComponent} from './elements/warp-view-modal/warp-view-modal.component';
import {WarpViewGtsTreeComponent} from './elements/warp-view-gts-tree/warp-view-gts-tree.component';
import {WarpViewTreeViewComponent} from './elements/warp-view-gts-tree/warp-view-tree-view/warp-view-tree-view.component';
import {WarpViewChipComponent} from './elements/warp-view-gts-tree/warp-view-chip/warp-view-chip.component';
import {WarpViewImageComponent} from './elements/warp-view-image/warp-view-image.component';
import {WarpViewMapComponent} from './elements/warp-view-map/warp-view-map.component';
import {WarpViewHeatmapSlidersComponent} from './elements/warp-view-map/warp-view-heatmap-sliders/warp-view-heatmap-sliders.component';
import {WarpViewPieComponent} from './elements/warp-view-pie/warp-view-pie.component';
import {WarpViewGaugeComponent} from './elements/warp-view-gauge/warp-view-gauge.component';
import {WarpViewAnnotationComponent} from './elements/warp-view-annotation/warp-view-annotation.component';
import {WarpViewPolarComponent} from './elements/warp-view-polar/warp-view-polar.component';
import {WarpViewRadarComponent} from './elements/warp-view-radar/warp-view-radar.component';
import {WarpViewPlotComponent} from './elements/warp-view-plot/warp-view-plot.component';
import {WarpViewResizeComponent} from './elements/warp-view-resize/warp-view-resize.component';
import {WarpViewSliderComponent} from './elements/warp-view-slider/warp-view-slider.component';
import {WarpViewRangeSliderComponent} from './elements/warp-view-range-slider/warp-view-range-slider.component';
import {FormsModule} from '@angular/forms';
import {AngularResizedEventModule} from 'angular-resize-event';
import {SizeService} from './services/resize.service';
import {WarpViewSpectrumComponent} from './elements/warp-view-spectrum/warp-view-spectrum.component';
import { PlotlyComponent } from './plotly/plotly.component';
import { WarpViewBoxComponent } from './elements/warp-view-box/warp-view-box.component';
import { WarpView3dLineComponent } from './elements/warp-view-3d-line/warp-view-3d-line.component';
import {AngularSplitModule} from 'angular-split';
import { WarpViewGlobeComponent } from './elements/warp-view-globe/warp-view-globe.component';

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
    WarpViewSpectrumComponent,
    PlotlyComponent,
    WarpViewBoxComponent,
    WarpView3dLineComponent,
    WarpViewGlobeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularResizedEventModule,
    AngularSplitModule.forRoot(),
    FormsModule
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
    WarpViewSpectrumComponent,
    WarpViewBoxComponent,
    WarpView3dLineComponent,
    WarpViewGlobeComponent,
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
    WarpViewSpectrumComponent,
    PlotlyComponent,
    WarpViewBoxComponent,
    WarpView3dLineComponent,
    WarpViewGlobeComponent
  ]
})
export class WarpViewAngularModule {
}
