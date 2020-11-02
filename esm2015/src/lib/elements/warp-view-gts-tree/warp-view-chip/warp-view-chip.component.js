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
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { GTS } from '../../../model/GTS';
import { Logger } from '../../../utils/logger';
import { GTSLib } from '../../../utils/gts.lib';
import { ColorLib } from '../../../utils/color-lib';
import { Param } from '../../../model/param';
import { Observable } from 'rxjs';
/**
 *
 */
export class WarpViewChipComponent {
    constructor(renderer) {
        this.renderer = renderer;
        this.param = new Param();
        this.options = new Param();
        this.warpViewSelectedGTS = new EventEmitter();
        // the first character triggers change each filter apply to trigger events. it must be discarded.
        this._gtsFilter = 'x';
        this._debug = false;
        this._hiddenData = [];
        this._node = {
            selected: true,
            gts: GTS,
        };
        this.LOG = new Logger(WarpViewChipComponent, this.debug);
    }
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set hiddenData(hiddenData) {
        if (JSON.stringify(hiddenData) !== JSON.stringify(this._hiddenData)) {
            this._hiddenData = hiddenData;
            this.LOG.debug(['hiddenData'], hiddenData, this._node, this._node.gts, this._node.gts.c);
            if (!!this._node && !!this._node.gts && !!this._node.gts.c) {
                this.setState(this._hiddenData.indexOf(this._node.gts.id) === -1);
            }
        }
    }
    get hiddenData() {
        return this._hiddenData;
    }
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
        if (this._gtsFilter.slice(1) !== '') {
            this.setState(new RegExp(this._gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
        }
        else {
            this.setState(true);
        }
    }
    get gtsFilter() {
        return this._gtsFilter;
    }
    ngOnInit() {
        this._node = Object.assign(Object.assign({}, this.node), { selected: this._hiddenData.indexOf(this.node.gts.id) === -1 });
        if (!!this.events) {
            this.eventsSubscription = this.events.subscribe(state => this.setState(state));
        }
    }
    ngOnDestroy() {
        if (!!this.eventsSubscription) {
            this.eventsSubscription.unsubscribe();
        }
    }
    ngAfterViewInit() {
        if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
            || this.hiddenData.indexOf(this._node.gts.id) > -1) {
            this.setState(false);
        }
        else {
            this.colorizeChip();
        }
    }
    colorizeChip() {
        if (!!this.chip) {
            if (!!this._node.selected) {
                const c = ColorLib.getColor(this._node.gts.id, this.options.scheme);
                const color = (this.param || { datasetColor: c }).datasetColor || c;
                this.renderer.setStyle(this.chip.nativeElement, 'background-color', color);
                this.renderer.setStyle(this.chip.nativeElement, 'border-color', color);
            }
            else {
                this.renderer.setStyle(this.chip.nativeElement, 'background-color', 'transparent');
            }
        }
    }
    toArray(obj) {
        if (obj === undefined) {
            return [];
        }
        return Object.keys(obj).map(key => ({ name: key, value: obj[key] }));
    }
    switchPlotState(event) {
        event.preventDefault();
        this.setState(!this._node.selected);
        return false;
    }
    setState(state) {
        if (this._node && this._node.gts) {
            this.LOG.debug(['switchPlotState'], state, this._node.selected);
            if (this._node.selected !== state) {
                this._node.selected = !!state;
                this.LOG.debug(['switchPlotState'], 'emit');
                this.warpViewSelectedGTS.emit(this._node);
            }
            this.colorizeChip();
        }
    }
    identify(index, item) {
        return index;
    }
}
WarpViewChipComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-chip',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n   <span (click)=\"switchPlotState($event)\" *ngIf=\"_node && _node.gts && _node.gts.l\">\n     <i class=\"normal\" #chip></i>\n     <span class=\"gtsInfo\">\n       <span class='gts-classname'>&nbsp;{{_node.gts.c}}</span>\n       <span class='gts-separator'>&#x007B; </span>\n       <span *ngFor=\"let label of toArray(_node.gts.l); index as index; last as last; trackBy:identify\">\n         <span class='gts-labelname'>{{label.name}}</span>\n         <span class='gts-separator'>=</span>\n         <span class='gts-labelvalue'>{{label.value}}</span>\n         <span [hidden]=\"last\">, </span>\n       </span>\n       <span class=\"gts-separator\"> &#x007D; </span>\n         <span class='gts-separator'>&#x007B; </span>\n         <span *ngFor=\"let label of toArray(_node.gts.a); index as index; last as last; trackBy:identify\">\n           <span class='gts-attrname'>{{label.name}}</span>\n           <span class='gts-separator'>=</span>\n           <span class='gts-attrvalue'>{{label.value}}</span>\n           <span [hidden]=\"last\">, </span>\n         </span>\n       <span class=\"gts-separator\"> &#x007D;</span>\n       </span>\n   </span>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host .normal,:host div span{cursor:pointer}:host .normal{background-color:#bbb;border:2px solid #454545;border-radius:50%;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}"]
            },] }
];
WarpViewChipComponent.ctorParameters = () => [
    { type: Renderer2 }
];
WarpViewChipComponent.propDecorators = {
    chip: [{ type: ViewChild, args: ['chip',] }],
    node: [{ type: Input, args: ['node',] }],
    param: [{ type: Input, args: ['param',] }],
    options: [{ type: Input, args: ['options',] }],
    events: [{ type: Input }],
    debug: [{ type: Input, args: ['debug',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNoaXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycC12aWV3L3Byb2plY3RzL3dhcnB2aWV3LW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZ3RzLXRyZWUvd2FycC12aWV3LWNoaXAvd2FycC12aWV3LWNoaXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzlDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDM0MsT0FBTyxFQUFDLFVBQVUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUU5Qzs7R0FFRztBQU9ILE1BQU0sT0FBTyxxQkFBcUI7SUEwRGhDLFlBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFwRHZCLFVBQUssR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3pCLFlBQU8sR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBdUNoQix3QkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRzdFLGlHQUFpRztRQUN6RixlQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixnQkFBVyxHQUFh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LElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsaUJBQWlCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDM0M7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ2xCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7O1lBbElGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIscXlEQUE4QztnQkFFOUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7WUFuQkMsU0FBUzs7O21CQXVCUixTQUFTLFNBQUMsTUFBTTttQkFFaEIsS0FBSyxTQUFDLE1BQU07b0JBQ1osS0FBSyxTQUFDLE9BQU87c0JBQ2IsS0FBSyxTQUFDLFNBQVM7cUJBQ2YsS0FBSztvQkFFTCxLQUFLLFNBQUMsT0FBTzt5QkFTYixLQUFLLFNBQUMsWUFBWTt3QkFjbEIsS0FBSyxTQUFDLFdBQVc7a0NBYWpCLE1BQU0sU0FBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctY2hpcCcsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctY2hpcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1jaGlwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0NoaXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZXZlbnRzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgQFZpZXdDaGlsZCgnY2hpcCcpIGNoaXA6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0KCdub2RlJykgbm9kZTogYW55O1xuICBASW5wdXQoJ3BhcmFtJykgcGFyYW06IFBhcmFtID0gbmV3IFBhcmFtKCk7XG4gIEBJbnB1dCgnb3B0aW9ucycpIG9wdGlvbnM6IFBhcmFtID0gbmV3IFBhcmFtKCk7XG4gIEBJbnB1dCgpIGV2ZW50czogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICBASW5wdXQoJ2RlYnVnJykgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KCdoaWRkZW5EYXRhJykgc2V0IGhpZGRlbkRhdGEoaGlkZGVuRGF0YTogbnVtYmVyW10pIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkoaGlkZGVuRGF0YSkgIT09IEpTT04uc3RyaW5naWZ5KHRoaXMuX2hpZGRlbkRhdGEpKSB7XG4gICAgICB0aGlzLl9oaWRkZW5EYXRhID0gaGlkZGVuRGF0YTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YSddLCBoaWRkZW5EYXRhLCB0aGlzLl9ub2RlLCB0aGlzLl9ub2RlLmd0cywgdGhpcy5fbm9kZS5ndHMuYyk7XG4gICAgICBpZiAoISF0aGlzLl9ub2RlICYmICEhdGhpcy5fbm9kZS5ndHMgJiYgISF0aGlzLl9ub2RlLmd0cy5jKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5faGlkZGVuRGF0YS5pbmRleE9mKHRoaXMuX25vZGUuZ3RzLmlkKSA9PT0gLTEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBoaWRkZW5EYXRhKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuRGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgnZ3RzRmlsdGVyJykgc2V0IGd0c0ZpbHRlcihndHNGaWx0ZXI6IHN0cmluZykge1xuICAgIHRoaXMuX2d0c0ZpbHRlciA9IGd0c0ZpbHRlcjtcbiAgICBpZiAodGhpcy5fZ3RzRmlsdGVyLnNsaWNlKDEpICE9PSAnJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZShuZXcgUmVnRXhwKHRoaXMuX2d0c0ZpbHRlci5zbGljZSgxKSwgJ2dpJykudGVzdChHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEodGhpcy5fbm9kZS5ndHMpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGd0c0ZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3RzRmlsdGVyO1xuICB9XG5cbiAgQE91dHB1dCgnd2FycFZpZXdTZWxlY3RlZEdUUycpIHdhcnBWaWV3U2VsZWN0ZWRHVFMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuICAvLyB0aGUgZmlyc3QgY2hhcmFjdGVyIHRyaWdnZXJzIGNoYW5nZSBlYWNoIGZpbHRlciBhcHBseSB0byB0cmlnZ2VyIGV2ZW50cy4gaXQgbXVzdCBiZSBkaXNjYXJkZWQuXG4gIHByaXZhdGUgX2d0c0ZpbHRlciA9ICd4JztcbiAgcHJpdmF0ZSBfZGVidWcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaGlkZGVuRGF0YTogbnVtYmVyW10gPSBbXTtcbiAgX25vZGU6IGFueSA9IHtcbiAgICBzZWxlY3RlZDogdHJ1ZSxcbiAgICBndHM6IEdUUyxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdDaGlwQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX25vZGUgPSB7Li4udGhpcy5ub2RlLCBzZWxlY3RlZDogdGhpcy5faGlkZGVuRGF0YS5pbmRleE9mKHRoaXMubm9kZS5ndHMuaWQpID09PSAtMX07XG4gICAgaWYoISF0aGlzLmV2ZW50cykge1xuICAgICAgdGhpcy5ldmVudHNTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50cy5zdWJzY3JpYmUoc3RhdGUgPT4gdGhpcy5zZXRTdGF0ZShzdGF0ZSkpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmKCEhdGhpcy5ldmVudHNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuZXZlbnRzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmd0c0ZpbHRlci5zbGljZSgxKSAhPT0gJycgJiYgbmV3IFJlZ0V4cCh0aGlzLmd0c0ZpbHRlci5zbGljZSgxKSwgJ2dpJykudGVzdChHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEodGhpcy5fbm9kZS5ndHMpKVxuICAgICAgfHwgdGhpcy5oaWRkZW5EYXRhLmluZGV4T2YodGhpcy5fbm9kZS5ndHMuaWQpID4gLTEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbG9yaXplQ2hpcCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29sb3JpemVDaGlwKCkge1xuICAgIGlmICghIXRoaXMuY2hpcCkge1xuICAgICAgaWYgKCEhdGhpcy5fbm9kZS5zZWxlY3RlZCkge1xuICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IodGhpcy5fbm9kZS5ndHMuaWQsIHRoaXMub3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICBjb25zdCBjb2xvciA9ICh0aGlzLnBhcmFtIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaXAubmF0aXZlRWxlbWVudCwgJ2JhY2tncm91bmQtY29sb3InLCBjb2xvcik7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlwLm5hdGl2ZUVsZW1lbnQsICdib3JkZXItY29sb3InLCBjb2xvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpcC5uYXRpdmVFbGVtZW50LCAnYmFja2dyb3VuZC1jb2xvcicsICd0cmFuc3BhcmVudCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvQXJyYXkob2JqKSB7XG4gICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gKHtuYW1lOiBrZXksIHZhbHVlOiBvYmpba2V5XX0pKTtcbiAgfVxuXG4gIHN3aXRjaFBsb3RTdGF0ZShldmVudDogVUlFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSghdGhpcy5fbm9kZS5zZWxlY3RlZCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTdGF0ZShzdGF0ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9ub2RlICYmIHRoaXMuX25vZGUuZ3RzKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3N3aXRjaFBsb3RTdGF0ZSddLCBzdGF0ZSwgdGhpcy5fbm9kZS5zZWxlY3RlZCk7XG4gICAgICBpZiAodGhpcy5fbm9kZS5zZWxlY3RlZCAhPT0gc3RhdGUpIHtcbiAgICAgICAgdGhpcy5fbm9kZS5zZWxlY3RlZCA9ICEhc3RhdGU7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnc3dpdGNoUGxvdFN0YXRlJ10sICdlbWl0Jyk7XG4gICAgICAgIHRoaXMud2FycFZpZXdTZWxlY3RlZEdUUy5lbWl0KHRoaXMuX25vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb2xvcml6ZUNoaXAoKTtcbiAgICB9XG4gIH1cblxuICBpZGVudGlmeShpbmRleCwgaXRlbSkge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxufVxuIl19