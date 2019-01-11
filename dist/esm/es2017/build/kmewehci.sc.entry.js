import { h } from '../warpview.core.js';

class WarpViewModal {
    constructor() {
        this.modalTitle = '';
    }
    open() {
        this.el.style.display = 'block';
        this.el.style.zIndex = '999999';
        this.warpViewModalOpen.emit({});
    }
    close() {
        this.el.style.display = 'none';
        this.el.style.zIndex = '-1';
        this.warpViewModalClose.emit({});
    }
    handleKeyDown(ev) {
        if ('Escape' === ev.key) {
            ev.preventDefault();
            return false;
        }
    }
    handleKeyUp(ev) {
        if (ev.key === 'Escape') {
            ev.preventDefault();
            this.close();
            return false;
        }
    }
    componentDidLoad() {
        this.el.addEventListener('click', (event) => {
            if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
                this.close();
            }
        });
    }
    render() {
        return h("div", { class: "popup" },
            h("div", { class: "header" },
                h("div", { class: "title", innerHTML: this.modalTitle }),
                h("div", { class: "close", onClick: () => this.close() }, "\u00D7")),
            h("div", { class: "body" },
                h("slot", null)));
    }
    static get is() { return "warp-view-modal"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "close": {
            "method": true
        },
        "el": {
            "elementRef": true
        },
        "modalTitle": {
            "type": String,
            "attr": "modal-title"
        },
        "open": {
            "method": true
        }
    }; }
    static get events() { return [{
            "name": "warpViewModalOpen",
            "method": "warpViewModalOpen",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "warpViewModalClose",
            "method": "warpViewModalClose",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "document:keydown",
            "method": "handleKeyDown"
        }, {
            "name": "document:keyup",
            "method": "handleKeyUp"
        }]; }
    static get style() { return ".sc-warp-view-modal-h{position:fixed;top:0;left:0;z-index:0;display:none;height:100%;overflow:hidden;background-color:rgba(0,0,0,.3)}.sc-warp-view-modal-h, .sc-warp-view-modal-h   .popup.sc-warp-view-modal{width:100%;outline:0}.sc-warp-view-modal-h   .popup.sc-warp-view-modal{position:relative;height:auto;background-color:var(--warpview-popup-bg-color,#fff);top:10%;z-index:999999;background-clip:padding-box;border:1px solid var(--warpview-popup-border-color,rgba(0,0,0,.2));border-radius:.3rem;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;pointer-events:auto;margin:1.75rem auto}\@media (min-width:576px){.sc-warp-view-modal-h   .popup.sc-warp-view-modal{max-width:800px}}.sc-warp-view-modal-h   .popup.sc-warp-view-modal   .header.sc-warp-view-modal{background-color:var(--warpview-popup-header-bg-color,#ddd);display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:justify;justify-content:space-between;padding:1rem 1rem;border-bottom:1px solid #e9ecef;border-top-left-radius:.3rem;border-top-right-radius:.3rem}.sc-warp-view-modal-h   .popup.sc-warp-view-modal   .header.sc-warp-view-modal   .title.sc-warp-view-modal{margin-bottom:0;line-height:1.5;color:var(--warpview-popup-title-color,#888)}.sc-warp-view-modal-h   .popup.sc-warp-view-modal   .header.sc-warp-view-modal   .close.sc-warp-view-modal{padding:1rem 1rem;margin:-1rem -1rem -1rem auto;cursor:pointer;color:var(--warpview-popup-close-color,#888)}.sc-warp-view-modal-h   .popup.sc-warp-view-modal   .body.sc-warp-view-modal{position:relative;background-color:var(--warpview-popup-body-bg-color,#fff);color:var(--warpview-popup-body-color,#000);height:auto;padding:10px}"; }
}

export { WarpViewModal };
