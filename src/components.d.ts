/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';


import {
  DataModel,
} from './model/dataModel';
import {
  GTS,
} from './model/GTS';
import {
  Param,
} from './model/param';
import {
  Datum,
} from './components/warp-view-drilldown/datum';


export namespace Components {

  interface WarpViewAnnotation {
    'data': DataModel | DataModel[] | GTS[] | string;
    'height': string;
    'hiddenData': number[];
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'standalone': boolean;
    'timeMax': number;
    'timeMin': number;
    'width': string;
  }
  interface WarpViewAnnotationAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | DataModel[] | GTS[] | string;
    'height'?: string;
    'hiddenData'?: number[];
    'onPointHover'?: (event: CustomEvent) => void;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'standalone'?: boolean;
    'timeMax'?: number;
    'timeMin'?: number;
    'width'?: string;
  }

  interface WarpViewBar {
    'data': DataModel | DataModel[] | GTS[] | string;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'unit': string;
    'width': string;
  }
  interface WarpViewBarAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | DataModel[] | GTS[] | string;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'unit'?: string;
    'width'?: string;
  }

  interface WarpViewBubble {
    'data': DataModel | DataModel[] | GTS[] | string;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'unit': string;
    'width': string;
  }
  interface WarpViewBubbleAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | DataModel[] | GTS[] | string;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'unit'?: string;
    'width'?: string;
  }

  interface WarpViewChart {
    'data': DataModel | GTS[] | string;
    'getTimeClip': () => Promise<[number, number]>;
    'hiddenData': number[];
    'options': Param;
    'responsive': boolean;
    'standalone': boolean;
    'type': string;
    'unit': string;
  }
  interface WarpViewChartAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | GTS[] | string;
    'hiddenData'?: number[];
    'onBoundsDidChange'?: (event: CustomEvent) => void;
    'onPointHover'?: (event: CustomEvent) => void;
    'onWarpViewChartResize'?: (event: CustomEvent) => void;
    'options'?: Param;
    'responsive'?: boolean;
    'standalone'?: boolean;
    'type'?: string;
    'unit'?: string;
  }

  interface WarpViewDatagrid {
    'data': DataModel | any[] | string;
    'elemsCount': number;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'width': string;
  }
  interface WarpViewDatagridAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | any[] | string;
    'elemsCount'?: number;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'width'?: string;
  }

  interface WarpViewPaginable {
    'data': { name: string, values: any[], headers: string[] };
    'elemsCount': number;
    'options': Param;
  }
  interface WarpViewPaginableAttributes extends StencilHTMLAttributes {
    'data'?: { name: string, values: any[], headers: string[] };
    'elemsCount'?: number;
    'options'?: Param;
  }

  interface WarpViewDisplay {
    'data': DataModel | DataModel[] | any[] | string | number;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'unit': string;
    'width': string;
  }
  interface WarpViewDisplayAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | DataModel[] | any[] | string | number;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'unit'?: string;
    'width'?: string;
  }

  interface CalendarHeatmap {
    'data': Datum[];
    'maxColor': string;
    'minColor': string;
    'overview': string;
  }
  interface CalendarHeatmapAttributes extends StencilHTMLAttributes {
    'data'?: Datum[];
    'maxColor'?: string;
    'minColor'?: string;
    'onHandler'?: (event: CustomEvent) => void;
    'onOnChange'?: (event: CustomEvent) => void;
    'overview'?: string;
  }

  interface WarpViewDrilldown {
    'data': DataModel | any[] | string;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'width': string;
  }
  interface WarpViewDrilldownAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | any[] | string;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'width'?: string;
  }

  interface WarpViewGtsPopup {
    'gtsList': DataModel;
    'hiddenData': number[];
    'maxToShow': number;
  }
  interface WarpViewGtsPopupAttributes extends StencilHTMLAttributes {
    'gtsList'?: DataModel;
    'hiddenData'?: number[];
    'maxToShow'?: number;
    'onWarpViewSelectedGTS'?: (event: CustomEvent) => void;
  }

  interface WarpViewChip {
    'gtsFilter': string;
    'hiddenData': number[];
    'name': string;
    'node': any;
  }
  interface WarpViewChipAttributes extends StencilHTMLAttributes {
    'gtsFilter'?: string;
    'hiddenData'?: number[];
    'name'?: string;
    'node'?: any;
    'onWarpViewSelectedGTS'?: (event: CustomEvent) => void;
  }

  interface WarpViewGtsTree {
    'data': DataModel | DataModel[] | GTS[] | string;
    'gtsFilter': string;
    'hiddenData': number[];
    'options': Param;
  }
  interface WarpViewGtsTreeAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | DataModel[] | GTS[] | string;
    'gtsFilter'?: string;
    'hiddenData'?: number[];
    'options'?: Param;
  }

  interface WarpViewTreeView {
    'branch': boolean;
    'gtsFilter': string;
    'gtsList': any[];
    'hidden': boolean;
    'hiddenData': number[];
  }
  interface WarpViewTreeViewAttributes extends StencilHTMLAttributes {
    'branch'?: boolean;
    'gtsFilter'?: string;
    'gtsList'?: any[];
    'hidden'?: boolean;
    'hiddenData'?: number[];
  }

  interface WarpViewImage {
    'data': DataModel | any[] | string;
    'height': string;
    'imageTitle': string;
    'options': Param;
    'responsive': boolean;
    'width': string;
  }
  interface WarpViewImageAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | any[] | string;
    'height'?: string;
    'imageTitle'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'width'?: string;
  }

  interface WarpViewHeatmapSliders {
    'blurValue': number;
    'maxBlurValue': number;
    'maxRadiusValue': number;
    'minBlurValue': number;
    'minRadiusValue': number;
    'radiusValue': number;
  }
  interface WarpViewHeatmapSlidersAttributes extends StencilHTMLAttributes {
    'blurValue'?: number;
    'maxBlurValue'?: number;
    'maxRadiusValue'?: number;
    'minBlurValue'?: number;
    'minRadiusValue'?: number;
    'onHeatBlurDidChange'?: (event: CustomEvent) => void;
    'onHeatOpacityDidChange'?: (event: CustomEvent) => void;
    'onHeatRadiusDidChange'?: (event: CustomEvent) => void;
    'radiusValue'?: number;
  }

  interface WarpViewMap {
    'data': any;
    'heatData': any[];
    'height': number;
    'hiddenData': number[];
    'options': any;
    'resize': () => void;
    'responsive': boolean;
    'width': number;
  }
  interface WarpViewMapAttributes extends StencilHTMLAttributes {
    'data'?: any;
    'heatData'?: any[];
    'height'?: number;
    'hiddenData'?: number[];
    'options'?: any;
    'responsive'?: boolean;
    'width'?: number;
  }

  interface WarpViewModal {
    'close': () => void;
    'modalTitle': string;
    'open': () => void;
  }
  interface WarpViewModalAttributes extends StencilHTMLAttributes {
    'modalTitle'?: string;
  }

  interface WarpViewPie {
    'data': DataModel | any[] | string;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'width': string;
  }
  interface WarpViewPieAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | any[] | string;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'width'?: string;
  }

  interface WarpViewPlot {
    'data': string | GTS[] | DataModel;
    'getTimeClip': () => Promise<[number, number]>;
    'gtsFilter': string;
    'height': string;
    'options': string | Param;
    'responsive': boolean;
    'showLegend': boolean;
    'width': string;
  }
  interface WarpViewPlotAttributes extends StencilHTMLAttributes {
    'data'?: string | GTS[] | DataModel;
    'gtsFilter'?: string;
    'height'?: string;
    'options'?: string | Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'width'?: string;
  }

  interface WarpViewPolar {
    'data': DataModel | any[] | string;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'width': string;
  }
  interface WarpViewPolarAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | any[] | string;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'width'?: string;
  }

  interface WarpViewRadar {
    'data': DataModel | any[] | string;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'width': string;
  }
  interface WarpViewRadarAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | any[] | string;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'width'?: string;
  }

  interface WarpViewScatter {
    'data': DataModel | GTS[] | string;
    'height': string;
    'options': Param;
    'responsive': boolean;
    'showLegend': boolean;
    'unit': string;
    'width': string;
  }
  interface WarpViewScatterAttributes extends StencilHTMLAttributes {
    'data'?: DataModel | GTS[] | string;
    'height'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'unit'?: string;
    'width'?: string;
  }

  interface WarpViewSpinner {
    'message': string;
  }
  interface WarpViewSpinnerAttributes extends StencilHTMLAttributes {
    'message'?: string;
  }

  interface WarpViewTile {
    'chartTitle': string;
    'gtsFilter': string;
    'options': Param;
    'resize': () => void;
    'responsive': boolean;
    'showLegend': boolean;
    'type': string;
    'unit': string;
    'url': string;
  }
  interface WarpViewTileAttributes extends StencilHTMLAttributes {
    'chartTitle'?: string;
    'gtsFilter'?: string;
    'options'?: Param;
    'responsive'?: boolean;
    'showLegend'?: boolean;
    'type'?: string;
    'unit'?: string;
    'url'?: string;
  }

  interface WarpViewToggle {
    'checked': boolean;
    'text1': string;
    'text2': string;
  }
  interface WarpViewToggleAttributes extends StencilHTMLAttributes {
    'checked'?: boolean;
    'onStateChange'?: (event: CustomEvent) => void;
    'text1'?: string;
    'text2'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'WarpViewAnnotation': Components.WarpViewAnnotation;
    'WarpViewBar': Components.WarpViewBar;
    'WarpViewBubble': Components.WarpViewBubble;
    'WarpViewChart': Components.WarpViewChart;
    'WarpViewDatagrid': Components.WarpViewDatagrid;
    'WarpViewPaginable': Components.WarpViewPaginable;
    'WarpViewDisplay': Components.WarpViewDisplay;
    'CalendarHeatmap': Components.CalendarHeatmap;
    'WarpViewDrilldown': Components.WarpViewDrilldown;
    'WarpViewGtsPopup': Components.WarpViewGtsPopup;
    'WarpViewChip': Components.WarpViewChip;
    'WarpViewGtsTree': Components.WarpViewGtsTree;
    'WarpViewTreeView': Components.WarpViewTreeView;
    'WarpViewImage': Components.WarpViewImage;
    'WarpViewHeatmapSliders': Components.WarpViewHeatmapSliders;
    'WarpViewMap': Components.WarpViewMap;
    'WarpViewModal': Components.WarpViewModal;
    'WarpViewPie': Components.WarpViewPie;
    'WarpViewPlot': Components.WarpViewPlot;
    'WarpViewPolar': Components.WarpViewPolar;
    'WarpViewRadar': Components.WarpViewRadar;
    'WarpViewScatter': Components.WarpViewScatter;
    'WarpViewSpinner': Components.WarpViewSpinner;
    'WarpViewTile': Components.WarpViewTile;
    'WarpViewToggle': Components.WarpViewToggle;
  }

  interface StencilIntrinsicElements {
    'warp-view-annotation': Components.WarpViewAnnotationAttributes;
    'warp-view-bar': Components.WarpViewBarAttributes;
    'warp-view-bubble': Components.WarpViewBubbleAttributes;
    'warp-view-chart': Components.WarpViewChartAttributes;
    'warp-view-datagrid': Components.WarpViewDatagridAttributes;
    'warp-view-paginable': Components.WarpViewPaginableAttributes;
    'warp-view-display': Components.WarpViewDisplayAttributes;
    'calendar-heatmap': Components.CalendarHeatmapAttributes;
    'warp-view-drilldown': Components.WarpViewDrilldownAttributes;
    'warp-view-gts-popup': Components.WarpViewGtsPopupAttributes;
    'warp-view-chip': Components.WarpViewChipAttributes;
    'warp-view-gts-tree': Components.WarpViewGtsTreeAttributes;
    'warp-view-tree-view': Components.WarpViewTreeViewAttributes;
    'warp-view-image': Components.WarpViewImageAttributes;
    'warp-view-heatmap-sliders': Components.WarpViewHeatmapSlidersAttributes;
    'warp-view-map': Components.WarpViewMapAttributes;
    'warp-view-modal': Components.WarpViewModalAttributes;
    'warp-view-pie': Components.WarpViewPieAttributes;
    'warp-view-plot': Components.WarpViewPlotAttributes;
    'warp-view-polar': Components.WarpViewPolarAttributes;
    'warp-view-radar': Components.WarpViewRadarAttributes;
    'warp-view-scatter': Components.WarpViewScatterAttributes;
    'warp-view-spinner': Components.WarpViewSpinnerAttributes;
    'warp-view-tile': Components.WarpViewTileAttributes;
    'warp-view-toggle': Components.WarpViewToggleAttributes;
  }


  interface HTMLWarpViewAnnotationElement extends Components.WarpViewAnnotation, HTMLStencilElement {}
  var HTMLWarpViewAnnotationElement: {
    prototype: HTMLWarpViewAnnotationElement;
    new (): HTMLWarpViewAnnotationElement;
  };

  interface HTMLWarpViewBarElement extends Components.WarpViewBar, HTMLStencilElement {}
  var HTMLWarpViewBarElement: {
    prototype: HTMLWarpViewBarElement;
    new (): HTMLWarpViewBarElement;
  };

  interface HTMLWarpViewBubbleElement extends Components.WarpViewBubble, HTMLStencilElement {}
  var HTMLWarpViewBubbleElement: {
    prototype: HTMLWarpViewBubbleElement;
    new (): HTMLWarpViewBubbleElement;
  };

  interface HTMLWarpViewChartElement extends Components.WarpViewChart, HTMLStencilElement {}
  var HTMLWarpViewChartElement: {
    prototype: HTMLWarpViewChartElement;
    new (): HTMLWarpViewChartElement;
  };

  interface HTMLWarpViewDatagridElement extends Components.WarpViewDatagrid, HTMLStencilElement {}
  var HTMLWarpViewDatagridElement: {
    prototype: HTMLWarpViewDatagridElement;
    new (): HTMLWarpViewDatagridElement;
  };

  interface HTMLWarpViewPaginableElement extends Components.WarpViewPaginable, HTMLStencilElement {}
  var HTMLWarpViewPaginableElement: {
    prototype: HTMLWarpViewPaginableElement;
    new (): HTMLWarpViewPaginableElement;
  };

  interface HTMLWarpViewDisplayElement extends Components.WarpViewDisplay, HTMLStencilElement {}
  var HTMLWarpViewDisplayElement: {
    prototype: HTMLWarpViewDisplayElement;
    new (): HTMLWarpViewDisplayElement;
  };

  interface HTMLCalendarHeatmapElement extends Components.CalendarHeatmap, HTMLStencilElement {}
  var HTMLCalendarHeatmapElement: {
    prototype: HTMLCalendarHeatmapElement;
    new (): HTMLCalendarHeatmapElement;
  };

  interface HTMLWarpViewDrilldownElement extends Components.WarpViewDrilldown, HTMLStencilElement {}
  var HTMLWarpViewDrilldownElement: {
    prototype: HTMLWarpViewDrilldownElement;
    new (): HTMLWarpViewDrilldownElement;
  };

  interface HTMLWarpViewGtsPopupElement extends Components.WarpViewGtsPopup, HTMLStencilElement {}
  var HTMLWarpViewGtsPopupElement: {
    prototype: HTMLWarpViewGtsPopupElement;
    new (): HTMLWarpViewGtsPopupElement;
  };

  interface HTMLWarpViewChipElement extends Components.WarpViewChip, HTMLStencilElement {}
  var HTMLWarpViewChipElement: {
    prototype: HTMLWarpViewChipElement;
    new (): HTMLWarpViewChipElement;
  };

  interface HTMLWarpViewGtsTreeElement extends Components.WarpViewGtsTree, HTMLStencilElement {}
  var HTMLWarpViewGtsTreeElement: {
    prototype: HTMLWarpViewGtsTreeElement;
    new (): HTMLWarpViewGtsTreeElement;
  };

  interface HTMLWarpViewTreeViewElement extends Components.WarpViewTreeView, HTMLStencilElement {}
  var HTMLWarpViewTreeViewElement: {
    prototype: HTMLWarpViewTreeViewElement;
    new (): HTMLWarpViewTreeViewElement;
  };

  interface HTMLWarpViewImageElement extends Components.WarpViewImage, HTMLStencilElement {}
  var HTMLWarpViewImageElement: {
    prototype: HTMLWarpViewImageElement;
    new (): HTMLWarpViewImageElement;
  };

  interface HTMLWarpViewHeatmapSlidersElement extends Components.WarpViewHeatmapSliders, HTMLStencilElement {}
  var HTMLWarpViewHeatmapSlidersElement: {
    prototype: HTMLWarpViewHeatmapSlidersElement;
    new (): HTMLWarpViewHeatmapSlidersElement;
  };

  interface HTMLWarpViewMapElement extends Components.WarpViewMap, HTMLStencilElement {}
  var HTMLWarpViewMapElement: {
    prototype: HTMLWarpViewMapElement;
    new (): HTMLWarpViewMapElement;
  };

  interface HTMLWarpViewModalElement extends Components.WarpViewModal, HTMLStencilElement {}
  var HTMLWarpViewModalElement: {
    prototype: HTMLWarpViewModalElement;
    new (): HTMLWarpViewModalElement;
  };

  interface HTMLWarpViewPieElement extends Components.WarpViewPie, HTMLStencilElement {}
  var HTMLWarpViewPieElement: {
    prototype: HTMLWarpViewPieElement;
    new (): HTMLWarpViewPieElement;
  };

  interface HTMLWarpViewPlotElement extends Components.WarpViewPlot, HTMLStencilElement {}
  var HTMLWarpViewPlotElement: {
    prototype: HTMLWarpViewPlotElement;
    new (): HTMLWarpViewPlotElement;
  };

  interface HTMLWarpViewPolarElement extends Components.WarpViewPolar, HTMLStencilElement {}
  var HTMLWarpViewPolarElement: {
    prototype: HTMLWarpViewPolarElement;
    new (): HTMLWarpViewPolarElement;
  };

  interface HTMLWarpViewRadarElement extends Components.WarpViewRadar, HTMLStencilElement {}
  var HTMLWarpViewRadarElement: {
    prototype: HTMLWarpViewRadarElement;
    new (): HTMLWarpViewRadarElement;
  };

  interface HTMLWarpViewScatterElement extends Components.WarpViewScatter, HTMLStencilElement {}
  var HTMLWarpViewScatterElement: {
    prototype: HTMLWarpViewScatterElement;
    new (): HTMLWarpViewScatterElement;
  };

  interface HTMLWarpViewSpinnerElement extends Components.WarpViewSpinner, HTMLStencilElement {}
  var HTMLWarpViewSpinnerElement: {
    prototype: HTMLWarpViewSpinnerElement;
    new (): HTMLWarpViewSpinnerElement;
  };

  interface HTMLWarpViewTileElement extends Components.WarpViewTile, HTMLStencilElement {}
  var HTMLWarpViewTileElement: {
    prototype: HTMLWarpViewTileElement;
    new (): HTMLWarpViewTileElement;
  };

  interface HTMLWarpViewToggleElement extends Components.WarpViewToggle, HTMLStencilElement {}
  var HTMLWarpViewToggleElement: {
    prototype: HTMLWarpViewToggleElement;
    new (): HTMLWarpViewToggleElement;
  };

  interface HTMLElementTagNameMap {
    'warp-view-annotation': HTMLWarpViewAnnotationElement
    'warp-view-bar': HTMLWarpViewBarElement
    'warp-view-bubble': HTMLWarpViewBubbleElement
    'warp-view-chart': HTMLWarpViewChartElement
    'warp-view-datagrid': HTMLWarpViewDatagridElement
    'warp-view-paginable': HTMLWarpViewPaginableElement
    'warp-view-display': HTMLWarpViewDisplayElement
    'calendar-heatmap': HTMLCalendarHeatmapElement
    'warp-view-drilldown': HTMLWarpViewDrilldownElement
    'warp-view-gts-popup': HTMLWarpViewGtsPopupElement
    'warp-view-chip': HTMLWarpViewChipElement
    'warp-view-gts-tree': HTMLWarpViewGtsTreeElement
    'warp-view-tree-view': HTMLWarpViewTreeViewElement
    'warp-view-image': HTMLWarpViewImageElement
    'warp-view-heatmap-sliders': HTMLWarpViewHeatmapSlidersElement
    'warp-view-map': HTMLWarpViewMapElement
    'warp-view-modal': HTMLWarpViewModalElement
    'warp-view-pie': HTMLWarpViewPieElement
    'warp-view-plot': HTMLWarpViewPlotElement
    'warp-view-polar': HTMLWarpViewPolarElement
    'warp-view-radar': HTMLWarpViewRadarElement
    'warp-view-scatter': HTMLWarpViewScatterElement
    'warp-view-spinner': HTMLWarpViewSpinnerElement
    'warp-view-tile': HTMLWarpViewTileElement
    'warp-view-toggle': HTMLWarpViewToggleElement
  }

  interface ElementTagNameMap {
    'warp-view-annotation': HTMLWarpViewAnnotationElement;
    'warp-view-bar': HTMLWarpViewBarElement;
    'warp-view-bubble': HTMLWarpViewBubbleElement;
    'warp-view-chart': HTMLWarpViewChartElement;
    'warp-view-datagrid': HTMLWarpViewDatagridElement;
    'warp-view-paginable': HTMLWarpViewPaginableElement;
    'warp-view-display': HTMLWarpViewDisplayElement;
    'calendar-heatmap': HTMLCalendarHeatmapElement;
    'warp-view-drilldown': HTMLWarpViewDrilldownElement;
    'warp-view-gts-popup': HTMLWarpViewGtsPopupElement;
    'warp-view-chip': HTMLWarpViewChipElement;
    'warp-view-gts-tree': HTMLWarpViewGtsTreeElement;
    'warp-view-tree-view': HTMLWarpViewTreeViewElement;
    'warp-view-image': HTMLWarpViewImageElement;
    'warp-view-heatmap-sliders': HTMLWarpViewHeatmapSlidersElement;
    'warp-view-map': HTMLWarpViewMapElement;
    'warp-view-modal': HTMLWarpViewModalElement;
    'warp-view-pie': HTMLWarpViewPieElement;
    'warp-view-plot': HTMLWarpViewPlotElement;
    'warp-view-polar': HTMLWarpViewPolarElement;
    'warp-view-radar': HTMLWarpViewRadarElement;
    'warp-view-scatter': HTMLWarpViewScatterElement;
    'warp-view-spinner': HTMLWarpViewSpinnerElement;
    'warp-view-tile': HTMLWarpViewTileElement;
    'warp-view-toggle': HTMLWarpViewToggleElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
