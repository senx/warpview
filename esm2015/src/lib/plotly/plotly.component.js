import { Component, ElementRef, EventEmitter, Input, IterableDiffers, KeyValueDiffers, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Plotlyjs from 'plotly.js-dist';
import { Plots } from 'plotly.js-dist';
import { Logger } from '../utils/logger';
export class PlotlyComponent {
    constructor(iterableDiffers, el, keyValueDiffers) {
        this.iterableDiffers = iterableDiffers;
        this.el = el;
        this.keyValueDiffers = keyValueDiffers;
        this.defaultClassName = 'js-plotly-plot';
        this._debug = false;
        this.revision = 0;
        this.useResizeHandler = false;
        this.updateOnLayoutChange = true;
        this.updateOnDataChange = true;
        this.updateOnlyWithRevision = true;
        this.initialized = new EventEmitter();
        this.update = new EventEmitter();
        this.purge = new EventEmitter();
        this.error = new EventEmitter();
        this.afterExport = new EventEmitter();
        this.afterPlot = new EventEmitter();
        this.animated = new EventEmitter();
        this.animatingFrame = new EventEmitter();
        this.animationInterrupted = new EventEmitter();
        this.autoSize = new EventEmitter();
        this.beforeExport = new EventEmitter();
        this.buttonClicked = new EventEmitter();
        this.click = new EventEmitter();
        this.plotly_click = new EventEmitter();
        this.clickAnnotation = new EventEmitter();
        this.deselect = new EventEmitter();
        this.doubleClick = new EventEmitter();
        this.framework = new EventEmitter();
        this.hover = new EventEmitter();
        this.legendClick = new EventEmitter();
        this.legendDoubleClick = new EventEmitter();
        this.relayout = new EventEmitter();
        this.restyle = new EventEmitter();
        this.redraw = new EventEmitter();
        this.selected = new EventEmitter();
        this.selecting = new EventEmitter();
        this.sliderChange = new EventEmitter();
        this.sliderEnd = new EventEmitter();
        this.sliderStart = new EventEmitter();
        this.transitioning = new EventEmitter();
        this.transitionInterrupted = new EventEmitter();
        this.unhover = new EventEmitter();
        this.relayouting = new EventEmitter();
        this.eventNames = [
            // 'afterExport',
            //   'afterPlot', // 'animated', 'animatingFrame', 'animationInterrupted', 'autoSize',
            // 'beforeExport', 'buttonClicked', 'clickAnnotation', 'deselect', 'doubleClick', 'framework',
            'hover', 'unhover',
            // 'legendClick', 'legendDoubleClick',
            'relayout',
        ];
        this.LOG = new Logger(PlotlyComponent, this.debug);
    }
    /*
     this.LOG.debug(['ngOnChanges'], changes);
        const revision: SimpleChange = changes.revision;
        if (changes.debug) {
          this.debug = changes.debug.currentValue;
        }
        if (!!changes.data && !deepEqual(changes.data.currentValue, changes.data.previousValue)) {
          this.updatePlot();
        } else if (!changes.layout && ((revision && !revision.isFirstChange()) || !!changes.data || !!changes.config)) {
          this.updatePlot();
        }
        if (!!changes.debug) {
          this.LOG.setDebug(changes.debug.currentValue);
        }
        this.updateWindowResizeHandler();
        this.LOG.debug(['ngOnChanges'], changes);
     */
    set data(data) {
        this._data = data;
        this.updatePlot();
        this.updateWindowResizeHandler();
    }
    get data() {
        return this._data;
    }
    set layout(layout) {
        this._layout = layout;
        if (!!this._data && !!this.plotEl.nativeElement) {
            try {
                Plotlyjs.relayout(this.plotEl.nativeElement, layout);
                this.updateWindowResizeHandler();
            }
            catch (e) {
                //
            }
        }
    }
    get layout() {
        return this._layout;
    }
    set config(config) {
        this._config = config;
        this.updatePlot();
        this.updateWindowResizeHandler();
    }
    get config() {
        return this._config;
    }
    set debug(debug) {
        this._debug = debug;
    }
    get debug() {
        return this._debug;
    }
    ngOnInit() {
        this.createPlot().then(() => {
            const figure = this.createFigure();
            this.LOG.debug(['figure'], figure);
            this.initialized.emit(this.plotlyInstance);
        });
    }
    ngOnDestroy() {
        if (typeof this.resizeHandler === 'function') {
            this.getWindow().removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = undefined;
        }
        const figure = this.createFigure();
        this.purge.emit(figure);
        this.remove(this.plotlyInstance);
    }
    ngDoCheck() {
        if (this.updateOnlyWithRevision) {
            return false;
        }
        let shouldUpdate = false;
        if (this.updateOnLayoutChange) {
            if (this.layoutDiffer) {
                const layoutHasDiff = this.layoutDiffer.diff(this.layout);
                if (layoutHasDiff) {
                    shouldUpdate = true;
                }
            }
            else if (this.layout) {
                this.layoutDiffer = this.keyValueDiffers.find(this.layout).create();
            }
            else {
                this.layoutDiffer = undefined;
            }
        }
        if (this.updateOnDataChange) {
            if (this.dataDiffer) {
                const dataHasDiff = this.dataDiffer.diff(this.data);
                if (dataHasDiff) {
                    shouldUpdate = true;
                }
            }
            else if (Array.isArray(this.data)) {
                this.dataDiffer = this.iterableDiffers.find(this.data).create(this.dataDifferTrackBy);
            }
            else {
                this.dataDiffer = undefined;
            }
        }
        if (shouldUpdate && this.plotlyInstance) {
            this.updatePlot();
        }
    }
    getWindow() {
        return window;
    }
    getBoundingClientRect() {
        return this.rect;
    }
    getClassName() {
        let classes = [this.defaultClassName];
        if (Array.isArray(this.className)) {
            classes = classes.concat(this.className);
        }
        else if (!!this.className) {
            classes.push(this.className);
        }
        return classes.join(' ');
    }
    restyleChart(properties, curves) {
        Plotlyjs.restyle(this.plotlyInstance, properties, curves);
    }
    createPlot() {
        this.LOG.debug(['createPlot'], this.data, this.layout, this.config, this.plotlyInstance);
        return Plotlyjs.react(this.plotEl.nativeElement, this.data, this.layout, this.config).then(plotlyInstance => {
            this.rect = this.el.nativeElement.getBoundingClientRect();
            this.plotlyInstance = plotlyInstance;
            this.LOG.debug(['plotlyInstance'], plotlyInstance);
            this.getWindow().gd = this.debug ? plotlyInstance : undefined;
            this.eventNames.forEach(name => {
                const eventName = `plotly_${name.toLowerCase()}`;
                // @ts-ignore
                plotlyInstance.on(eventName, (data) => {
                    this.LOG.debug(['plotlyEvent', eventName], data);
                    this[name].emit(data);
                });
            });
            plotlyInstance.on('plotly_click', (data) => {
                this.click.emit(data);
                this.plotly_click.emit(data);
            });
            this.updateWindowResizeHandler();
            this.afterPlot.emit(plotlyInstance);
        }, err => {
            console.error('Error while plotting:', err);
            this.error.emit(err);
        });
    }
    createFigure() {
        const p = this.plotlyInstance;
        return {
            data: p.data,
            layout: p.layout,
            frames: p._transitionData ? p._transitionData._frames : null
        };
    }
    updatePlot() {
        this.LOG.debug(['updatePlot'], this.data, this.layout, Object.assign({}, this.config));
        if (!this.plotlyInstance) {
            const error = new Error(`Plotly component wasn't initialized`);
            this.error.emit(error);
            return;
        }
        Plotlyjs.purge(this.plotlyInstance);
        this.createPlot().then(() => {
            const figure = this.createFigure();
            this.update.emit(figure);
        }, err => {
            console.error('Error while updating plot:', err);
            this.error.emit(err);
        });
    }
    updateWindowResizeHandler() {
        if (this.useResizeHandler) {
            if (this.resizeHandler === undefined) {
                this.resizeHandler = () => setTimeout(() => Plots.resize(this.plotlyInstance));
                this.getWindow().addEventListener('resize', this.resizeHandler);
            }
        }
        else {
            if (typeof this.resizeHandler === 'function') {
                this.getWindow().removeEventListener('resize', this.resizeHandler);
                this.resizeHandler = undefined;
            }
        }
    }
    dataDifferTrackBy(_, item) {
        const obj = Object.assign({}, item, { uid: '' });
        return JSON.stringify(obj);
    }
    remove(div) {
        Plotlyjs.purge(div);
        delete this.plotlyInstance;
    }
    resize(layout) {
        Plotlyjs.relayout(this.plotEl.nativeElement, layout);
    }
}
PlotlyComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-plotly',
                template: "<div #plot [attr.id]=\"divId\" [className]=\"getClassName()\" [ngStyle]=\"style\"></div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}.js-plotly-plot .plotly,.js-plotly-plot .plotly div{direction:ltr;font-family:Open Sans,verdana,arial,sans-serif;margin:0;padding:0}.js-plotly-plot .plotly button,.js-plotly-plot .plotly input{font-family:Open Sans,verdana,arial,sans-serif}.js-plotly-plot .plotly button:focus,.js-plotly-plot .plotly input:focus{outline:none}.js-plotly-plot .plotly a,.js-plotly-plot .plotly a:hover{text-decoration:none}.js-plotly-plot .plotly .crisp{shape-rendering:crispEdges}.js-plotly-plot .plotly .user-select-none{-moz-user-select:none;-ms-user-select:none;-o-user-select:none;-webkit-user-select:none;user-select:none}.js-plotly-plot .plotly svg{overflow:hidden}.js-plotly-plot .plotly svg a{fill:#447adb}.js-plotly-plot .plotly svg a:hover{fill:#3c6dc5}.js-plotly-plot .plotly .main-svg{left:0;pointer-events:none;position:absolute;top:0}.js-plotly-plot .plotly .main-svg .draglayer{pointer-events:all}.js-plotly-plot .plotly .cursor-default{cursor:default}.js-plotly-plot .plotly .cursor-pointer{cursor:pointer}.js-plotly-plot .plotly .cursor-crosshair{cursor:crosshair}.js-plotly-plot .plotly .cursor-move{cursor:move}.js-plotly-plot .plotly .cursor-col-resize{cursor:col-resize}.js-plotly-plot .plotly .cursor-row-resize{cursor:row-resize}.js-plotly-plot .plotly .cursor-ns-resize{cursor:ns-resize}.js-plotly-plot .plotly .cursor-ew-resize{cursor:ew-resize}.js-plotly-plot .plotly .cursor-sw-resize{cursor:sw-resize}.js-plotly-plot .plotly .cursor-s-resize{cursor:s-resize}.js-plotly-plot .plotly .cursor-se-resize{cursor:se-resize}.js-plotly-plot .plotly .cursor-w-resize{cursor:w-resize}.js-plotly-plot .plotly .cursor-e-resize{cursor:e-resize}.js-plotly-plot .plotly .cursor-nw-resize{cursor:nw-resize}.js-plotly-plot .plotly .cursor-n-resize{cursor:n-resize}.js-plotly-plot .plotly .cursor-ne-resize{cursor:ne-resize}.js-plotly-plot .plotly .cursor-grab{cursor:-webkit-grab;cursor:grab}.js-plotly-plot .plotly .modebar{position:absolute;right:2px;top:2px}.js-plotly-plot .plotly .ease-bg{transition:background-color .3s ease 0s}.js-plotly-plot .plotly .modebar--hover>:not(.watermark){opacity:0;transition:opacity .3s ease 0s}.js-plotly-plot .plotly:hover .modebar--hover .modebar-group{opacity:1}.js-plotly-plot .plotly .modebar-group{box-sizing:border-box;display:inline-block;float:left;padding-left:8px;position:relative;vertical-align:middle;white-space:nowrap}.js-plotly-plot .plotly .modebar-btn{box-sizing:border-box;cursor:pointer;font-size:16px;height:22px;line-height:normal;padding:3px 4px;position:relative}.js-plotly-plot .plotly .modebar-btn svg{position:relative;top:2px}.js-plotly-plot .plotly .modebar.vertical{align-content:flex-end;display:flex;flex-direction:column;flex-wrap:wrap;max-height:100%}.js-plotly-plot .plotly .modebar.vertical svg{top:-1px}.js-plotly-plot .plotly .modebar.vertical .modebar-group{display:block;float:none;padding-bottom:8px;padding-left:0}.js-plotly-plot .plotly .modebar.vertical .modebar-group .modebar-btn{display:block;text-align:center}.js-plotly-plot .plotly [data-title]:after,.js-plotly-plot .plotly [data-title]:before{display:none;opacity:0;pointer-events:none;position:absolute;right:50%;top:110%;transform:translateZ(0);z-index:1001}.js-plotly-plot .plotly [data-title]:hover:after,.js-plotly-plot .plotly [data-title]:hover:before{display:block;opacity:1}.js-plotly-plot .plotly [data-title]:before{background:transparent;border:6px solid transparent;border-bottom-color:#69738a;content:\"\";margin-right:-6px;margin-top:-12px;position:absolute;z-index:1002}.js-plotly-plot .plotly [data-title]:after{background:#69738a;border-radius:2px;color:#fff;content:attr(data-title);font-size:12px;line-height:12px;margin-right:-18px;padding:8px 10px;white-space:nowrap}.js-plotly-plot .plotly .vertical [data-title]:after,.js-plotly-plot .plotly .vertical [data-title]:before{right:200%;top:0}.js-plotly-plot .plotly .vertical [data-title]:before{border:6px solid transparent;border-left-color:#69738a;margin-right:-30px;margin-top:8px}.js-plotly-plot .plotly .select-outline{fill:none;shape-rendering:crispEdges;stroke-width:1}.js-plotly-plot .plotly .select-outline-1{stroke:#fff}.js-plotly-plot .plotly .select-outline-2{stroke:#000;stroke-dasharray:2px 2px}.plotly-notifier{font-family:Open Sans,verdana,arial,sans-serif;font-size:10pt;max-width:180px;position:fixed;right:20px;top:50px;z-index:10000}.plotly-notifier p{margin:0}.plotly-notifier .notifier-note{-ms-hyphens:auto;-webkit-hyphens:auto;background-color:#8c97af;background-color:rgba(140,151,175,.9);border:1px solid #fff;color:#fff;hyphens:auto;margin:0;max-width:250px;min-width:180px;overflow-wrap:break-word;padding:10px;word-wrap:break-word;z-index:3000}.plotly-notifier .notifier-close{background:none;border:none;color:#fff;float:right;font-size:20px;font-weight:700;line-height:20px;opacity:.8;padding:0 5px}.plotly-notifier .notifier-close:hover{color:#444;cursor:pointer;text-decoration:none}:host{height:100%;width:100%}:host .ylines-above{stroke:var(--warp-view-chart-grid-color)!important}:host .modebar-btn path,:host .xtick>text,:host .ytick>text{fill:var(--warp-view-font-color)!important}"]
            },] }
];
PlotlyComponent.ctorParameters = () => [
    { type: IterableDiffers },
    { type: ElementRef },
    { type: KeyValueDiffers }
];
PlotlyComponent.propDecorators = {
    plotEl: [{ type: ViewChild, args: ['plot', { static: true },] }],
    data: [{ type: Input }],
    layout: [{ type: Input }],
    config: [{ type: Input }],
    debug: [{ type: Input }],
    frames: [{ type: Input }],
    style: [{ type: Input }],
    divId: [{ type: Input }],
    revision: [{ type: Input }],
    className: [{ type: Input }],
    useResizeHandler: [{ type: Input }],
    updateOnLayoutChange: [{ type: Input }],
    updateOnDataChange: [{ type: Input }],
    updateOnlyWithRevision: [{ type: Input }],
    initialized: [{ type: Output }],
    update: [{ type: Output }],
    purge: [{ type: Output }],
    error: [{ type: Output }],
    afterExport: [{ type: Output }],
    afterPlot: [{ type: Output }],
    animated: [{ type: Output }],
    animatingFrame: [{ type: Output }],
    animationInterrupted: [{ type: Output }],
    autoSize: [{ type: Output }],
    beforeExport: [{ type: Output }],
    buttonClicked: [{ type: Output }],
    click: [{ type: Output }],
    plotly_click: [{ type: Output }],
    clickAnnotation: [{ type: Output }],
    deselect: [{ type: Output }],
    doubleClick: [{ type: Output }],
    framework: [{ type: Output }],
    hover: [{ type: Output }],
    legendClick: [{ type: Output }],
    legendDoubleClick: [{ type: Output }],
    relayout: [{ type: Output }],
    restyle: [{ type: Output }],
    redraw: [{ type: Output }],
    selected: [{ type: Output }],
    selecting: [{ type: Output }],
    sliderChange: [{ type: Output }],
    sliderEnd: [{ type: Output }],
    sliderStart: [{ type: Output }],
    transitioning: [{ type: Output }],
    transitionInterrupted: [{ type: Output }],
    unhover: [{ type: Output }],
    relayouting: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxvdGx5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvcGxvdGx5L3Bsb3RseS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFFTCxlQUFlLEVBRWYsZUFBZSxFQUdmLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sS0FBSyxRQUFRLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUEwQyxLQUFLLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5RSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFjdkMsTUFBTSxPQUFPLGVBQWU7SUFzSTFCLFlBQ1MsZUFBZ0MsRUFDaEMsRUFBYyxFQUNkLGVBQWdDO1FBRmhDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2Qsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBeEkvQixxQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUt0QyxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBeUVkLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFFekIseUJBQW9CLEdBQUcsSUFBSSxDQUFDO1FBQzVCLHVCQUFrQixHQUFHLElBQUksQ0FBQztRQUMxQiwyQkFBc0IsR0FBRyxJQUFJLENBQUM7UUFFN0IsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBcUIsQ0FBQztRQUNwRCxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwQyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNuQyxVQUFLLEdBQUcsSUFBSSxZ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LE1BQU07MEJBQ04sTUFBTTs0QkFDTixNQUFNO29DQUNOLE1BQU07c0JBQ04sTUFBTTswQkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcixcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBLZXlWYWx1ZURpZmZlcixcbiAgS2V5VmFsdWVEaWZmZXJzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgUGxvdGx5anMgZnJvbSAncGxvdGx5LmpzLWRpc3QnO1xuaW1wb3J0IHtDb25maWcsIERhdGEsIExheW91dCwgUGxvdGx5SFRNTEVsZW1lbnQsIFBsb3RzfSBmcm9tICdwbG90bHkuanMtZGlzdCc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcblxuZXhwb3J0IGludGVyZmFjZSBGaWd1cmUge1xuICBkYXRhOiBEYXRhW107XG4gIGxheW91dDogUGFydGlhbDxMYXlvdXQ+O1xuICBmcmFtZXM6IFBhcnRpYWw8Q29uZmlnPjtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctcGxvdGx5JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3Bsb3RseS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Bsb3RseS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgUGxvdGx5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIERvQ2hlY2sge1xuICBwcm90ZWN0ZWQgZGVmYXVsdENsYXNzTmFtZSA9ICdqcy1wbG90bHktcGxvdCc7XG4gIHByb3RlY3RlZCBMT0c6IExvZ2dlcjtcbiAgcHJpdmF0ZSBfZGF0YTtcbiAgcHJpdmF0ZSBfbGF5b3V0O1xuICBwcml2YXRlIF9jb25maWc7XG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIHB1YmxpYyBwbG90bHlJbnN0YW5jZTogUGxvdGx5SFRNTEVsZW1lbnQ7XG4gIHB1YmxpYyByZXNpemVIYW5kbGVyPzogKGluc3RhbmNlOiBQbG90bHlIVE1MRWxlbWVudCkgPT4gdm9pZDtcbiAgcHVibGljIGxheW91dERpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgZGF0YURpZmZlcjogSXRlcmFibGVEaWZmZXI8UGFydGlhbDxhbnk+PjtcblxuICBAVmlld0NoaWxkKCdwbG90Jywge3N0YXRpYzogdHJ1ZX0pIHBsb3RFbDogRWxlbWVudFJlZjtcblxuICAvKlxuICAgdGhpcy5MT0cuZGVidWcoWyduZ09uQ2hhbmdlcyddLCBjaGFuZ2VzKTtcbiAgICAgIGNvbnN0IHJldmlzaW9uOiBTaW1wbGVDaGFuZ2UgPSBjaGFuZ2VzLnJldmlzaW9uO1xuICAgICAgaWYgKGNoYW5nZXMuZGVidWcpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZyA9IGNoYW5nZXMuZGVidWcuY3VycmVudFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKCEhY2hhbmdlcy5kYXRhICYmICFkZWVwRXF1YWwoY2hhbmdlcy5kYXRhLmN1cnJlbnRWYWx1ZSwgY2hhbmdlcy5kYXRhLnByZXZpb3VzVmFsdWUpKSB7XG4gICAgICAgIHRoaXMudXBkYXRlUGxvdCgpO1xuICAgICAgfSBlbHNlIGlmICghY2hhbmdlcy5sYXlvdXQgJiYgKChyZXZpc2lvbiAmJiAhcmV2aXNpb24uaXNGaXJzdENoYW5nZSgpKSB8fCAhIWNoYW5nZXMuZGF0YSB8fCAhIWNoYW5nZXMuY29uZmlnKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZVBsb3QoKTtcbiAgICAgIH1cbiAgICAgIGlmICghIWNoYW5nZXMuZGVidWcpIHtcbiAgICAgICAgdGhpcy5MT0cuc2V0RGVidWcoY2hhbmdlcy5kZWJ1Zy5jdXJyZW50VmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVXaW5kb3dSZXNpemVIYW5kbGVyKCk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nT25DaGFuZ2VzJ10sIGNoYW5nZXMpO1xuICAgKi9cbiAgQElucHV0KCkgc2V0IGRhdGEoZGF0YTogUGFydGlhbDxhbnk+W10pIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICB0aGlzLnVwZGF0ZVBsb3QoKTtcbiAgICB0aGlzLnVwZGF0ZVdpbmRvd1Jlc2l6ZUhhbmRsZXIoKTtcbiAgfVxuXG4gIGdldCBkYXRhKCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBsYXlvdXQobGF5b3V0OiBQYXJ0aWFsPGFueT4pIHtcbiAgICB0aGlzLl9sYXlvdXQgPSBsYXlvdXQ7XG4gICAgaWYgKCEhdGhpcy5fZGF0YSAmJiAhIXRoaXMucGxvdEVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIFBsb3RseWpzLnJlbGF5b3V0KHRoaXMucGxvdEVsLm5hdGl2ZUVsZW1lbnQsIGxheW91dCk7XG4gICAgICAgIHRoaXMudXBkYXRlV2luZG93UmVzaXplSGFuZGxlcigpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvL1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBsYXlvdXQoKTogUGFydGlhbDxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0O1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGNvbmZpZyhjb25maWc6IFBhcnRpYWw8Q29uZmlnPikge1xuICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnVwZGF0ZVBsb3QoKTtcbiAgICB0aGlzLnVwZGF0ZVdpbmRvd1Jlc2l6ZUhhbmRsZXIoKTtcbiAgfVxuXG4gIGdldCBjb25maWcoKTogUGFydGlhbDxDb25maWc+IHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgfVxuXG4gIGdldCBkZWJ1ZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoKSBmcmFtZXM/OiBQYXJ0aWFsPGFueT5bXTtcbiAgQElucHV0KCkgc3R5bGU/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIEBJbnB1dCgpIGRpdklkPzogc3RyaW5nO1xuICBASW5wdXQoKSByZXZpc2lvbiA9IDA7XG4gIEBJbnB1dCgpIGNsYXNzTmFtZT86IHN0cmluZyB8IHN0cmluZ1tdO1xuICBASW5wdXQoKSB1c2VSZXNpemVIYW5kbGVyID0gZmFsc2U7XG5cbiAgQElucHV0KCkgdXBkYXRlT25MYXlvdXRDaGFuZ2UgPSB0cnVlO1xuICBASW5wdXQoKSB1cGRhdGVPbkRhdGFDaGFuZ2UgPSB0cnVlO1xuICBASW5wdXQoKSB1cGRhdGVPbmx5V2l0aFJldmlzaW9uID0gdHJ1ZTtcblxuICBAT3V0cHV0KCkgaW5pdGlhbGl6ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPFBsb3RseUhUTUxFbGVtZW50PigpO1xuICBAT3V0cHV0KCkgdXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcjxGaWd1cmU+KCk7XG4gIEBPdXRwdXQoKSBwdXJnZSA9IG5ldyBFdmVudEVtaXR0ZXI8RmlndXJlPigpO1xuICBAT3V0cHV0KCkgZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPEVycm9yPigpO1xuXG4gIEBPdXRwdXQoKSBhZnRlckV4cG9ydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGFmdGVyUGxvdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGFuaW1hdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYW5pbWF0aW5nRnJhbWUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBhbmltYXRpb25JbnRlcnJ1cHRlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGF1dG9TaXplID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYmVmb3JlRXhwb3J0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYnV0dG9uQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcGxvdGx5X2NsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgY2xpY2tBbm5vdGF0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkb3VibGVDbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGZyYW1ld29yayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgbGVnZW5kQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBsZWdlbmREb3VibGVDbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHJlbGF5b3V0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcmVzdHlsZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHJlZHJhdyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2VsZWN0aW5nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2xpZGVyQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2xpZGVyRW5kID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2xpZGVyU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSB0cmFuc2l0aW9uaW5nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgdHJhbnNpdGlvbkludGVycnVwdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgdW5ob3ZlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHJlbGF5b3V0aW5nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHB1YmxpYyBldmVudE5hbWVzID0gW1xuICAgIC8vICdhZnRlckV4cG9ydCcsXG4gICAgLy8gICAnYWZ0ZXJQbG90JywgLy8gJ2FuaW1hdGVkJywgJ2FuaW1hdGluZ0ZyYW1lJywgJ2FuaW1hdGlvbkludGVycnVwdGVkJywgJ2F1dG9TaXplJyxcbiAgICAvLyAnYmVmb3JlRXhwb3J0JywgJ2J1dHRvbkNsaWNrZWQnLCAnY2xpY2tBbm5vdGF0aW9uJywgJ2Rlc2VsZWN0JywgJ2RvdWJsZUNsaWNrJywgJ2ZyYW1ld29yaycsXG4gICAgJ2hvdmVyJywgJ3VuaG92ZXInLFxuICAgIC8vICdsZWdlbmRDbGljaycsICdsZWdlbmREb3VibGVDbGljaycsXG4gICAgJ3JlbGF5b3V0JyxcbiAgICAvLyAncmVzdHlsZScsICdyZWRyYXcnLCAnc2VsZWN0ZWQnLCAnc2VsZWN0aW5nJywgJ3NsaWRlckNoYW5nZScsXG4gICAgLy8gJ3NsaWRlckVuZCcsICdzbGlkZXJTdGFydCcsICd0cmFuc2l0aW9uaW5nJywgJ3RyYW5zaXRpb25JbnRlcnJ1cHRlZCcsICdyZWxheW91dGluZydcbiAgXTtcbiAgcmVjdDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBpdGVyYWJsZURpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIGtleVZhbHVlRGlmZmVyczogS2V5VmFsdWVEaWZmZXJzXG4gICkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihQbG90bHlDb21wb25lbnQsIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jcmVhdGVQbG90KCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBmaWd1cmUgPSB0aGlzLmNyZWF0ZUZpZ3VyZSgpO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydmaWd1cmUnXSwgZmlndXJlKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQuZW1pdCh0aGlzLnBsb3RseUluc3RhbmNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5yZXNpemVIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmdldFdpbmRvdygpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplSGFuZGxlciBhcyBhbnkpO1xuICAgICAgdGhpcy5yZXNpemVIYW5kbGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGZpZ3VyZSA9IHRoaXMuY3JlYXRlRmlndXJlKCk7XG4gICAgdGhpcy5wdXJnZS5lbWl0KGZpZ3VyZSk7XG4gICAgdGhpcy5yZW1vdmUodGhpcy5wbG90bHlJbnN0YW5jZSk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMudXBkYXRlT25seVdpdGhSZXZpc2lvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgaWYgKHRoaXMudXBkYXRlT25MYXlvdXRDaGFuZ2UpIHtcbiAgICAgIGlmICh0aGlzLmxheW91dERpZmZlcikge1xuICAgICAgICBjb25zdCBsYXlvdXRIYXNEaWZmID0gdGhpcy5sYXlvdXREaWZmZXIuZGlmZih0aGlzLmxheW91dCk7XG4gICAgICAgIGlmIChsYXlvdXRIYXNEaWZmKSB7XG4gICAgICAgICAgc2hvdWxkVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxheW91dCkge1xuICAgICAgICB0aGlzLmxheW91dERpZmZlciA9IHRoaXMua2V5VmFsdWVEaWZmZXJzLmZpbmQodGhpcy5sYXlvdXQpLmNyZWF0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sYXlvdXREaWZmZXIgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudXBkYXRlT25EYXRhQ2hhbmdlKSB7XG4gICAgICBpZiAodGhpcy5kYXRhRGlmZmVyKSB7XG4gICAgICAgIGNvbnN0IGRhdGFIYXNEaWZmID0gdGhpcy5kYXRhRGlmZmVyLmRpZmYodGhpcy5kYXRhKTtcbiAgICAgICAgaWYgKGRhdGFIYXNEaWZmKSB7XG4gICAgICAgICAgc2hvdWxkVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRoaXMuZGF0YSkpIHtcbiAgICAgICAgdGhpcy5kYXRhRGlmZmVyID0gdGhpcy5pdGVyYWJsZURpZmZlcnMuZmluZCh0aGlzLmRhdGEpLmNyZWF0ZSh0aGlzLmRhdGFEaWZmZXJUcmFja0J5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGF0YURpZmZlciA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNob3VsZFVwZGF0ZSAmJiB0aGlzLnBsb3RseUluc3RhbmNlKSB7XG4gICAgICB0aGlzLnVwZGF0ZVBsb3QoKTtcbiAgICB9XG4gIH1cblxuICBnZXRXaW5kb3coKTogYW55IHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkge1xuICAgIHJldHVybiB0aGlzLnJlY3Q7XG4gIH1cblxuICBnZXRDbGFzc05hbWUoKTogc3RyaW5nIHtcbiAgICBsZXQgY2xhc3NlcyA9IFt0aGlzLmRlZmF1bHRDbGFzc05hbWVdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY2xhc3NOYW1lKSkge1xuICAgICAgY2xhc3NlcyA9IGNsYXNzZXMuY29uY2F0KHRoaXMuY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKCEhdGhpcy5jbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCh0aGlzLmNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICB9XG5cbiAgcmVzdHlsZUNoYXJ0KHByb3BlcnRpZXM6IGFueSwgY3VydmVzOiBhbnlbXSkge1xuICAgIFBsb3RseWpzLnJlc3R5bGUodGhpcy5wbG90bHlJbnN0YW5jZSwgcHJvcGVydGllcywgY3VydmVzKTtcbiAgfVxuXG4gIGNyZWF0ZVBsb3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjcmVhdGVQbG90J10sIHRoaXMuZGF0YSwgdGhpcy5sYXlvdXQsIHRoaXMuY29uZmlnLCB0aGlzLnBsb3RseUluc3RhbmNlKTtcbiAgICByZXR1cm4gUGxvdGx5anMucmVhY3QodGhpcy5wbG90RWwubmF0aXZlRWxlbWVudCwgdGhpcy5kYXRhLCB0aGlzLmxheW91dCwgdGhpcy5jb25maWcpLnRoZW4ocGxvdGx5SW5zdGFuY2UgPT4ge1xuICAgICAgdGhpcy5yZWN0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdGhpcy5wbG90bHlJbnN0YW5jZSA9IHBsb3RseUluc3RhbmNlO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydwbG90bHlJbnN0YW5jZSddLCBwbG90bHlJbnN0YW5jZSk7XG4gICAgICB0aGlzLmdldFdpbmRvdygpLmdkID0gdGhpcy5kZWJ1ZyA/IHBsb3RseUluc3RhbmNlIDogdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLmV2ZW50TmFtZXMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYHBsb3RseV8ke25hbWUudG9Mb3dlckNhc2UoKX1gO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHBsb3RseUluc3RhbmNlLm9uKGV2ZW50TmFtZSwgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsncGxvdGx5RXZlbnQnLCBldmVudE5hbWVdLCBkYXRhKTtcbiAgICAgICAgICAodGhpc1tuYW1lXSBhcyBFdmVudEVtaXR0ZXI8YW55PikuZW1pdChkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgcGxvdGx5SW5zdGFuY2Uub24oJ3Bsb3RseV9jbGljaycsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5jbGljay5lbWl0KGRhdGEpO1xuICAgICAgICB0aGlzLnBsb3RseV9jbGljay5lbWl0KGRhdGEpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMudXBkYXRlV2luZG93UmVzaXplSGFuZGxlcigpO1xuICAgICAgdGhpcy5hZnRlclBsb3QuZW1pdChwbG90bHlJbnN0YW5jZSk7XG4gICAgfSwgZXJyID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHdoaWxlIHBsb3R0aW5nOicsIGVycik7XG4gICAgICB0aGlzLmVycm9yLmVtaXQoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUZpZ3VyZSgpOiBGaWd1cmUge1xuICAgIGNvbnN0IHA6IGFueSA9IHRoaXMucGxvdGx5SW5zdGFuY2U7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHAuZGF0YSxcbiAgICAgIGxheW91dDogcC5sYXlvdXQsXG4gICAgICBmcmFtZXM6IHAuX3RyYW5zaXRpb25EYXRhID8gcC5fdHJhbnNpdGlvbkRhdGEuX2ZyYW1lcyA6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlUGxvdCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZVBsb3QnXSwgdGhpcy5kYXRhLCB0aGlzLmxheW91dCwgey4uLnRoaXMuY29uZmlnfSk7XG4gICAgaWYgKCF0aGlzLnBsb3RseUluc3RhbmNlKSB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgUGxvdGx5IGNvbXBvbmVudCB3YXNuJ3QgaW5pdGlhbGl6ZWRgKTtcbiAgICAgIHRoaXMuZXJyb3IuZW1pdChlcnJvcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFBsb3RseWpzLnB1cmdlKHRoaXMucGxvdGx5SW5zdGFuY2UpO1xuICAgIHRoaXMuY3JlYXRlUGxvdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgZmlndXJlID0gdGhpcy5jcmVhdGVGaWd1cmUoKTtcbiAgICAgIHRoaXMudXBkYXRlLmVtaXQoZmlndXJlKTtcbiAgICB9LCBlcnIgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igd2hpbGUgdXBkYXRpbmcgcGxvdDonLCBlcnIpO1xuICAgICAgdGhpcy5lcnJvci5lbWl0KGVycik7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVXaW5kb3dSZXNpemVIYW5kbGVyKCkge1xuICAgIGlmICh0aGlzLnVzZVJlc2l6ZUhhbmRsZXIpIHtcbiAgICAgIGlmICh0aGlzLnJlc2l6ZUhhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnJlc2l6ZUhhbmRsZXIgPSAoKSA9PiBzZXRUaW1lb3V0KCgpID0+IFBsb3RzLnJlc2l6ZSh0aGlzLnBsb3RseUluc3RhbmNlKSk7XG4gICAgICAgIHRoaXMuZ2V0V2luZG93KCkuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVIYW5kbGVyIGFzIGFueSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5yZXNpemVIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuZ2V0V2luZG93KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVIYW5kbGVyIGFzIGFueSk7XG4gICAgICAgIHRoaXMucmVzaXplSGFuZGxlciA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkYXRhRGlmZmVyVHJhY2tCeShfOiBudW1iZXIsIGl0ZW06IGFueSk6IGFueSB7XG4gICAgY29uc3Qgb2JqID0gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSwge3VpZDogJyd9KTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgfVxuXG5cbiAgcmVtb3ZlKGRpdjogUGxvdGx5SFRNTEVsZW1lbnQpIHtcbiAgICBQbG90bHlqcy5wdXJnZShkaXYpO1xuICAgIGRlbGV0ZSB0aGlzLnBsb3RseUluc3RhbmNlO1xuICB9XG5cbiAgcmVzaXplKGxheW91dDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IGFueSB9KSB7XG4gICAgUGxvdGx5anMucmVsYXlvdXQodGhpcy5wbG90RWwubmF0aXZlRWxlbWVudCwgbGF5b3V0KTtcbiAgfVxufVxuIl19