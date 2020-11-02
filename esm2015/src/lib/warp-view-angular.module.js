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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarpViewChartComponent } from './elements/warp-view-chart/warp-view-chart.component';
import { WarpViewTileComponent } from './elements/warp-view-tile/warp-view-tile.component';
import { WarpViewSpinnerComponent } from './elements/warp-view-spinner/warp-view-spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { WarpViewToggleComponent } from './elements/warp-view-toggle/warp-view-toggle.component';
import { WarpViewBarComponent } from './elements/warp-view-bar/warp-view-bar.component';
import { WarpViewBubbleComponent } from './elements/warp-view-bubble/warp-view-bubble.component';
import { WarpViewDatagridComponent } from './elements/warp-view-datagrid/warp-view-datagrid.component';
import { WarpViewPaginableComponent } from './elements/warp-view-datagrid/warp-view-paginable/warp-view-paginable.component';
import { WarpViewDisplayComponent } from './elements/warp-view-display/warp-view-display.component';
import { WarpViewDrillDownComponent } from './elements/warp-view-drill-down/warp-view-drill-down.component';
import { CalendarHeatmapComponent } from './elements/warp-view-drill-down/calendar-heatmap/calendar-heatmap.component';
import { WarpViewGtsPopupComponent } from './elements/warp-view-gts-popup/warp-view-gts-popup.component';
import { WarpViewModalComponent } from './elements/warp-view-modal/warp-view-modal.component';
import { WarpViewGtsTreeComponent } from './elements/warp-view-gts-tree/warp-view-gts-tree.component';
import { WarpViewTreeViewComponent } from './elements/warp-view-gts-tree/warp-view-tree-view/warp-view-tree-view.component';
import { WarpViewChipComponent } from './elements/warp-view-gts-tree/warp-view-chip/warp-view-chip.component';
import { WarpViewImageComponent } from './elements/warp-view-image/warp-view-image.component';
import { WarpViewMapComponent } from './elements/warp-view-map/warp-view-map.component';
import { WarpViewHeatmapSlidersComponent } from './elements/warp-view-map/warp-view-heatmap-sliders/warp-view-heatmap-sliders.component';
import { WarpViewPieComponent } from './elements/warp-view-pie/warp-view-pie.component';
import { WarpViewGaugeComponent } from './elements/warp-view-gauge/warp-view-gauge.component';
import { WarpViewAnnotationComponent } from './elements/warp-view-annotation/warp-view-annotation.component';
import { WarpViewPolarComponent } from './elements/warp-view-polar/warp-view-polar.component';
import { WarpViewRadarComponent } from './elements/warp-view-radar/warp-view-radar.component';
import { WarpViewPlotComponent } from './elements/warp-view-plot/warp-view-plot.component';
import { WarpViewResizeComponent } from './elements/warp-view-resize/warp-view-resize.component';
import { WarpViewSliderComponent } from './elements/warp-view-slider/warp-view-slider.component';
import { WarpViewRangeSliderComponent } from './elements/warp-view-range-slider/warp-view-range-slider.component';
import { FormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SizeService } from './services/resize.service';
import { WarpViewSpectrumComponent } from './elements/warp-view-spectrum/warp-view-spectrum.component';
import { PlotlyComponent } from './plotly/plotly.component';
import { WarpViewBoxComponent } from './elements/warp-view-box/warp-view-box.component';
import { WarpView3dLineComponent } from './elements/warp-view-3d-line/warp-view-3d-line.component';
import { WarpViewGlobeComponent } from './elements/warp-view-globe/warp-view-globe.component';
import { WarpViewEventDropComponent } from './elements/warp-view-event-drop/warp-view-event-drop.component';
import { WarpViewResultTileComponent } from './elements/warp-view-result-tile/warp-view-result-tile.component';
export class WarpViewAngularModule {
}
WarpViewAngularModule.decorators = [
    { type: NgModule, args: [{
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
                    WarpViewGlobeComponent,
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
                ],
                imports: [
                    CommonModule,
                    HttpClientModule,
                    AngularResizedEventModule,
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
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
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
                    WarpViewGlobeComponent,
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWFuZ3VsYXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycC12aWV3L3Byb2plY3RzL3dhcnB2aWV3LW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi93YXJwLXZpZXctYW5ndWxhci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sb0RBQW9ELENBQUM7QUFDekYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMERBQTBELENBQUM7QUFDbEcsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDdkUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sd0RBQXdELENBQUM7QUFDL0YsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sa0RBQWtELENBQUM7QUFDdEYsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sd0RBQXdELENBQUM7QUFDL0YsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sNERBQTRELENBQUM7QUFDckcsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0saUZBQWlGLENBQUM7QUFDM0gsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMERBQTBELENBQUM7QUFDbEcsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sZ0VBQWdFLENBQUM7QUFDMUcsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sNkVBQTZFLENBQUM7QUFDckgsT0FBTyxFQUFD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Q3RCLHNCQUFzQjtvQkFDdEIscUJBQXFCO29CQUNyQix1QkFBdUI7b0JBQ3ZCLHVCQUF1QjtvQkFDdkIsNEJBQTRCO29CQUM1Qix5QkFBeUI7b0JBQ3pCLGVBQWU7b0JBQ2Ysb0JBQW9CO29CQUNwQix1QkFBdUI7b0JBQ3ZCLHNCQUFzQjtvQkFDdEIsMEJBQTBCO29CQUMxQiwyQkFBMkI7aUJBQzVCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1dhcnBWaWV3Q2hhcnRDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWNoYXJ0L3dhcnAtdmlldy1jaGFydC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1RpbGVDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXRpbGUvd2FycC12aWV3LXRpbGUuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdTcGlubmVyQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1zcGlubmVyL3dhcnAtdmlldy1zcGlubmVyLmNvbXBvbmVudCc7XG5pbXBvcnQge0h0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7SHR0cEVycm9ySGFuZGxlcn0gZnJvbSAnLi9zZXJ2aWNlcy9odHRwLWVycm9yLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQge1dhcnBWaWV3VG9nZ2xlQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy10b2dnbGUvd2FycC12aWV3LXRvZ2dsZS5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0JhckNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctYmFyL3dhcnAtdmlldy1iYXIuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdCdWJibGVDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWJ1YmJsZS93YXJwLXZpZXctYnViYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3RGF0YWdyaWRDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWRhdGFncmlkL3dhcnAtdmlldy1kYXRhZ3JpZC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1BhZ2luYWJsZUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZGF0YWdyaWQvd2FycC12aWV3LXBhZ2luYWJsZS93YXJwLXZpZXctcGFnaW5hYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3RGlzcGxheUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZGlzcGxheS93YXJwLXZpZXctZGlzcGxheS5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0RyaWxsRG93bkNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZHJpbGwtZG93bi93YXJwLXZpZXctZHJpbGwtZG93bi5jb21wb25lbnQnO1xuaW1wb3J0IHtDYWxlbmRhckhlYXRtYXBDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWRyaWxsLWRvd24vY2FsZW5kYXItaGVhdG1hcC9jYWxlbmRhci1oZWF0bWFwLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3R3RzUG9wdXBDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWd0cy1wb3B1cC93YXJwLXZpZXctZ3RzLXBvcHVwLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3TW9kYWxDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LW1vZGFsL3dhcnAtdmlldy1tb2RhbC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0d0c1RyZWVDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWd0cy10cmVlL3dhcnAtdmlldy1ndHMtdHJlZS5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1RyZWVWaWV3Q29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1ndHMtdHJlZS93YXJwLXZpZXctdHJlZS12aWV3L3dhcnAtdmlldy10cmVlLXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdDaGlwQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1ndHMtdHJlZS93YXJwLXZpZXctY2hpcC93YXJwLXZpZXctY2hpcC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0ltYWdlQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1pbWFnZS93YXJwLXZpZXctaW1hZ2UuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdNYXBDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LW1hcC93YXJwLXZpZXctbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3SGVhdG1hcFNsaWRlcnNDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LW1hcC93YXJwLXZpZXctaGVhdG1hcC1zbGlkZXJzL3dhcnAtdmlldy1oZWF0bWFwLXNsaWRlcnMuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdQaWVDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXBpZS93YXJwLXZpZXctcGllLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3R2F1Z2VDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWdhdWdlL3dhcnAtdmlldy1nYXVnZS5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0Fubm90YXRpb25Db21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWFubm90YXRpb24vd2FycC12aWV3LWFubm90YXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdQb2xhckNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctcG9sYXIvd2FycC12aWV3LXBvbGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3UmFkYXJDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXJhZGFyL3dhcnAtdmlldy1yYWRhci5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1Bsb3RDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXBsb3Qvd2FycC12aWV3LXBsb3QuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdSZXNpemVDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXJlc2l6ZS93YXJwLXZpZXctcmVzaXplLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3U2xpZGVyQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1zbGlkZXIvd2FycC12aWV3LXNsaWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1JhbmdlU2xpZGVyQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1yYW5nZS1zbGlkZXIvd2FycC12aWV3LXJhbmdlLXNsaWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHtGb3Jtc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtBbmd1bGFyUmVzaXplZEV2ZW50TW9kdWxlfSBmcm9tICdhbmd1bGFyLXJlc2l6ZS1ldmVudCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7V2FycFZpZXdTcGVjdHJ1bUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctc3BlY3RydW0vd2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudCc7XG5pbXBvcnQge1Bsb3RseUNvbXBvbmVudH0gZnJvbSAnLi9wbG90bHkvcGxvdGx5LmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3Qm94Q29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1ib3gvd2FycC12aWV3LWJveC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlldzNkTGluZUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctM2QtbGluZS93YXJwLXZpZXctM2QtbGluZS5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0dsb2JlQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1nbG9iZS93YXJwLXZpZXctZ2xvYmUuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdFdmVudERyb3BDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWV2ZW50LWRyb3Avd2FycC12aWV3LWV2ZW50LWRyb3AuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdSZXN1bHRUaWxlQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1yZXN1bHQtdGlsZS93YXJwLXZpZXctcmVzdWx0LXRpbGUuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgV2FycFZpZXdUaWxlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3Q2hhcnRDb21wb25lbnQsXG4gICAgV2FycFZpZXdTcGlubmVyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3VG9nZ2xlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3QmFyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3QnViYmxlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3RGF0YWdyaWRDb21wb25lbnQsXG4gICAgV2FycFZpZXdQYWdpbmFibGVDb21wb25lbnQsXG4gICAgV2FycFZpZXdEaXNwbGF5Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3RHJpbGxEb3duQ29tcG9uZW50LFxuICAgIENhbGVuZGFySGVhdG1hcENvbXBvbmVudCxcbiAgICBXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3TW9kYWxDb21wb25lbnQsXG4gICAgV2FycFZpZXdHdHNUcmVlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3VHJlZVZpZXdDb21wb25lbnQsXG4gICAgV2FycFZpZXdDaGlwQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3SW1hZ2VDb21wb25lbnQsXG4gICAgV2FycFZpZXdNYXBDb21wb25lbnQsXG4gICAgV2FycFZpZXdIZWF0bWFwU2xpZGVyc0NvbXBvbmVudCxcbiAgICBXYXJwVmlld1BpZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0dhdWdlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3QW5ub3RhdGlvbkNvbXBvbmVudCxcbiAgICBXYXJwVmlld1BvbGFyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmFkYXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdQbG90Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmVzaXplQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3U2xpZGVyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmFuZ2VTbGlkZXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdTcGVjdHJ1bUNvbXBvbmVudCxcbiAgICBQbG90bHlDb21wb25lbnQsXG4gICAgV2FycFZpZXdCb3hDb21wb25lbnQsXG4gICAgV2FycFZpZXczZExpbmVDb21wb25lbnQsXG4gICAgV2FycFZpZXdHbG9iZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0V2ZW50RHJvcENvbXBvbmVudCxcbiAgICBXYXJwVmlld1Jlc3VsdFRpbGVDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxuICAgIEFuZ3VsYXJSZXNpemVkRXZlbnRNb2R1bGUsXG4gICAgRm9ybXNNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFdhcnBWaWV3VGlsZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0NoYXJ0Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3U3Bpbm5lckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1RvZ2dsZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0JhckNvbXBvbmVudCxcbiAgICBXYXJwVmlld0J1YmJsZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0RhdGFncmlkQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UGFnaW5hYmxlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3RGlzcGxheUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0RyaWxsRG93bkNvbXBvbmVudCxcbiAgICBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQsXG4gICAgV2FycFZpZXdHdHNQb3B1cENvbXBvbmVudCxcbiAgICBXYXJwVmlld01vZGFsQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3R3RzVHJlZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld1RyZWVWaWV3Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3Q2hpcENvbXBvbmVudCxcbiAgICBXYXJwVmlld0ltYWdlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3TWFwQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3SGVhdG1hcFNsaWRlcnNDb21wb25lbnQsXG4gICAgV2FycFZpZXdQaWVDb21wb25lbnQsXG4gICAgV2FycFZpZXdHYXVnZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0Fubm90YXRpb25Db21wb25lbnQsXG4gICAgV2FycFZpZXdQb2xhckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1JhZGFyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UGxvdENvbXBvbmVudCxcbiAgICBXYXJwVmlld1Jlc2l6ZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld1NsaWRlckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1JhbmdlU2xpZGVyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3U3BlY3RydW1Db21wb25lbnQsXG4gICAgV2FycFZpZXdCb3hDb21wb25lbnQsXG4gICAgV2FycFZpZXczZExpbmVDb21wb25lbnQsXG4gICAgV2FycFZpZXdHbG9iZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0V2ZW50RHJvcENvbXBvbmVudCxcbiAgICBXYXJwVmlld1Jlc3VsdFRpbGVDb21wb25lbnRcbiAgXSxcbiAgcHJvdmlkZXJzOiBbSHR0cEVycm9ySGFuZGxlciwgU2l6ZVNlcnZpY2VdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICBXYXJwVmlld1RpbGVDb21wb25lbnQsXG4gICAgV2FycFZpZXdDaGFydENvbXBvbmVudCxcbiAgICBXYXJwVmlld1NwaW5uZXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdUb2dnbGVDb21wb25lbnQsXG4gICAgV2FycFZpZXdCYXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdCdWJibGVDb21wb25lbnQsXG4gICAgV2FycFZpZXdEYXRhZ3JpZENvbXBvbmVudCxcbiAgICBXYXJwVmlld1BhZ2luYWJsZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0Rpc3BsYXlDb21wb25lbnQsXG4gICAgV2FycFZpZXdEcmlsbERvd25Db21wb25lbnQsXG4gICAgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3R3RzUG9wdXBDb21wb25lbnQsXG4gICAgV2FycFZpZXdNb2RhbENvbXBvbmVudCxcbiAgICBXYXJwVmlld0d0c1RyZWVDb21wb25lbnQsXG4gICAgV2FycFZpZXdUcmVlVmlld0NvbXBvbmVudCxcbiAgICBXYXJwVmlld0NoaXBDb21wb25lbnQsXG4gICAgV2FycFZpZXdJbWFnZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld01hcENvbXBvbmVudCxcbiAgICBXYXJwVmlld0hlYXRtYXBTbGlkZXJzQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UGllQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3R2F1Z2VDb21wb25lbnQsXG4gICAgV2FycFZpZXdBbm5vdGF0aW9uQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UG9sYXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdSYWRhckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1Bsb3RDb21wb25lbnQsXG4gICAgV2FycFZpZXdSZXNpemVDb21wb25lbnQsXG4gICAgV2FycFZpZXdTbGlkZXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdSYW5nZVNsaWRlckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1NwZWN0cnVtQ29tcG9uZW50LFxuICAgIFBsb3RseUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0JveENvbXBvbmVudCxcbiAgICBXYXJwVmlldzNkTGluZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0dsb2JlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3RXZlbnREcm9wQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmVzdWx0VGlsZUNvbXBvbmVudFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3QW5ndWxhck1vZHVsZSB7XG59XG4iXX0=