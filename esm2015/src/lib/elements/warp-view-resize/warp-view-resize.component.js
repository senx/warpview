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
import { Logger } from '../../utils/logger';
/**
 *
 */
export class WarpViewResizeComponent {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.minHeight = '10';
        this.initialHeight = 100;
        this.resize = new EventEmitter();
        this.dragging = false;
        this._debug = false;
        this.LOG = new Logger(WarpViewResizeComponent, this._debug);
    }
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    ngAfterViewInit() {
        this.LOG.debug(['ngAfterViewInit'], this.initialHeight);
        this.renderer.setStyle(this.wrapper.nativeElement, 'height', this.initialHeight + 'px');
        // the click event on the handlebar attach mousemove and mouseup events to document.
        this.handleDiv.nativeElement.addEventListener('mousedown', (ev) => {
            if (0 === ev.button) {
                // keep left click only
                this.moveListener = this.handleDraggingMove.bind(this);
                this.clickUpListener = this.handleDraggingEnd.bind(this);
                document.addEventListener('mousemove', this.moveListener, false);
                document.addEventListener('mouseup', this.clickUpListener, false);
            }
        });
    }
    handleDraggingEnd() {
        this.dragging = false;
        // the mouseup detach mousemove and mouseup events from document.
        if (this.moveListener) {
            document.removeEventListener('mousemove', this.moveListener, false);
            this.moveListener = null;
        }
        if (this.clickUpListener) {
            document.removeEventListener('mouseup', this.clickUpListener, false);
            this.clickUpListener = null;
        }
    }
    handleDraggingMove(ev) {
        ev.preventDefault();
        this.LOG.debug(['handleDraggingMove'], ev);
        // compute Y of the parent div top relative to page
        const yTopParent = this.handleDiv.nativeElement.parentElement.getBoundingClientRect().top
            - document.body.getBoundingClientRect().top;
        // compute new parent height
        let h = ev.pageY - yTopParent + this.handleDiv.nativeElement.getBoundingClientRect().height / 2;
        if (h < parseInt(this.minHeight, 10)) {
            h = parseInt(this.minHeight, 10);
        }
        // apply new height
        this.renderer.setStyle(this.handleDiv.nativeElement.parentElement, 'height', h + 'px');
        this.LOG.debug(['handleDraggingMove'], h);
        this.resize.emit(h);
    }
}
WarpViewResizeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-resize',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper>\n  <ng-content></ng-content>\n  <div class=\"handle\" #handleDiv></div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host .handle,warp-view-resize .handle,warpview-resize .handle{background-color:var(--warp-view-resize-handle-color);background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=\");background-position:50%;background-repeat:no-repeat;bottom:0;height:var(--warp-view-resize-handle-height);position:absolute;width:100%}:host .handle:hover,warp-view-resize .handle:hover,warpview-resize .handle:hover{cursor:row-resize}:host .wrapper,warp-view-resize .wrapper,warpview-resize .wrapper{height:100%;padding-bottom:var(--warp-view-resize-handle-height);position:relative;width:100%}"]
            },] }
];
WarpViewResizeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
WarpViewResizeComponent.propDecorators = {
    handleDiv: [{ type: ViewChild, args: ['handleDiv', { static: true },] }],
    wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
    minHeight: [{ type: Input, args: ['minHeight',] }],
    initialHeight: [{ type: Input, args: ['initialHeight',] }],
    debug: [{ type: Input, args: ['debug',] }],
    resize: [{ type: Output, args: ['resize',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXJlc2l6ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1yZXNpemUvd2FycC12aWV3LXJlc2l6ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFnQixTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekksT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRTFDOztHQUVHO0FBT0gsTUFBTSxPQUFPLHVCQUF1QjtJQXVCbEMsWUFBb0IsRUFBYyxFQUFVLFFBQW1CO1FBQTNDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBcEIzQyxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2Isa0JBQWEsR0FBRyxHQUFHLENBQUM7UUFXMUIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdEMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUlqQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBR3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFuQkQsSUFBb0IsS0FBSyxDQUFDLEtBQWM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFB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LENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQzs7O1lBNUVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixxd0JBQWdEO2dCQUVoRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQVhpQyxVQUFVO1lBQStCLFNBQVM7Ozt3QkFhakYsU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7c0JBQ3JDLFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO3dCQUNuQyxLQUFLLFNBQUMsV0FBVzs0QkFDakIsS0FBSyxTQUFDLGVBQWU7b0JBRXJCLEtBQUssU0FBQyxPQUFPO3FCQVNiLE1BQU0sU0FBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctcmVzaXplJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1yZXNpemUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctcmVzaXplLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdSZXNpemVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnaGFuZGxlRGl2Jywge3N0YXRpYzogdHJ1ZX0pIGhhbmRsZURpdjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnd3JhcHBlcicsIHtzdGF0aWM6IHRydWV9KSB3cmFwcGVyOiBFbGVtZW50UmVmO1xuICBASW5wdXQoJ21pbkhlaWdodCcpIG1pbkhlaWdodCA9ICcxMCc7XG4gIEBJbnB1dCgnaW5pdGlhbEhlaWdodCcpIGluaXRpYWxIZWlnaHQgPSAxMDA7XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBPdXRwdXQoJ3Jlc2l6ZScpIHJlc2l6ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGRyYWdnaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgbW92ZUxpc3RlbmVyOiBFdmVudExpc3RlbmVyO1xuICBwcml2YXRlIGNsaWNrVXBMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjtcbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcbiAgcHJpdmF0ZSBfZGVidWcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdSZXNpemVDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCddLCB0aGlzLmluaXRpYWxIZWlnaHQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCB0aGlzLmluaXRpYWxIZWlnaHQgKyAncHgnKTtcbiAgICAvLyB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGhhbmRsZWJhciBhdHRhY2ggbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGV2ZW50cyB0byBkb2N1bWVudC5cbiAgICB0aGlzLmhhbmRsZURpdi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgaWYgKDAgPT09IGV2LmJ1dHRvbikge1xuICAgICAgICAvLyBrZWVwIGxlZnQgY2xpY2sgb25seVxuICAgICAgICB0aGlzLm1vdmVMaXN0ZW5lciA9IHRoaXMuaGFuZGxlRHJhZ2dpbmdNb3ZlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuY2xpY2tVcExpc3RlbmVyID0gdGhpcy5oYW5kbGVEcmFnZ2luZ0VuZC5iaW5kKHRoaXMpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5jbGlja1VwTGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRHJhZ2dpbmdFbmQoKSB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgIC8vIHRoZSBtb3VzZXVwIGRldGFjaCBtb3VzZW1vdmUgYW5kIG1vdXNldXAgZXZlbnRzIGZyb20gZG9jdW1lbnQuXG4gICAgaWYgKHRoaXMubW92ZUxpc3RlbmVyKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgdGhpcy5tb3ZlTGlzdGVuZXIgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5jbGlja1VwTGlzdGVuZXIpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmNsaWNrVXBMaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgdGhpcy5jbGlja1VwTGlzdGVuZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRHJhZ2dpbmdNb3ZlKGV2OiBNb3VzZUV2ZW50KSB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hhbmRsZURyYWdnaW5nTW92ZSddLCBldik7XG4gICAgLy8gY29tcHV0ZSBZIG9mIHRoZSBwYXJlbnQgZGl2IHRvcCByZWxhdGl2ZSB0byBwYWdlXG4gICAgY29uc3QgeVRvcFBhcmVudCA9IHRoaXMuaGFuZGxlRGl2Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgIC0gZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgLy8gY29tcHV0ZSBuZXcgcGFyZW50IGhlaWdodFxuICAgIGxldCBoID0gZXYucGFnZVkgLSB5VG9wUGFyZW50ICsgdGhpcy5oYW5kbGVEaXYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyO1xuICAgIGlmIChoIDwgcGFyc2VJbnQodGhpcy5taW5IZWlnaHQsIDEwKSkge1xuICAgICAgaCA9IHBhcnNlSW50KHRoaXMubWluSGVpZ2h0LCAxMCk7XG4gICAgfVxuICAgIC8vIGFwcGx5IG5ldyBoZWlnaHRcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuaGFuZGxlRGl2Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCwgJ2hlaWdodCcsIGggKyAncHgnKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hhbmRsZURyYWdnaW5nTW92ZSddLCBoKTtcbiAgICB0aGlzLnJlc2l6ZS5lbWl0KGgpO1xuICB9XG59XG4iXX0=