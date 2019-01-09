export class WarpViewModal {
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
    static get style() { return "/**style-placeholder:warp-view-modal:**/"; }
}
