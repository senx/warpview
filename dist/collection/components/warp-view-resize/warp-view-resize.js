export class WcResize {
    constructor() {
        this.minHeight = "10";
        this.initialHeight = null;
        this.dragging = false;
        this.moveListener = null;
        this.clickUpListener = null;
        this.firstDraw = true;
    }
    onResize(event) {
        event.stopPropagation();
        if (event.detail.h) {
            this.handleDiv.parentElement.style.height = event.detail.h + 'px';
        }
    }
    handleDraggingEnd() {
        this.dragging = false;
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
        let yTopParent = this.handleDiv.parentElement.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        let h = ev.pageY - yTopParent + this.handleDiv.getBoundingClientRect().height / 2;
        if (h < parseInt(this.minHeight)) {
            h = parseInt(this.minHeight);
        }
        this.handleDiv.parentElement.style.height = h + 'px';
    }
    componentDidLoad() {
        if (this.firstDraw && this.initialHeight) {
            this.handleDiv.parentElement.style.height = parseInt(this.initialHeight) + 'px';
        }
        this.handleDiv.addEventListener('mousedown', (ev) => {
            if (0 == ev.button) {
                this.moveListener = this.handleDraggingMove.bind(this);
                this.clickUpListener = this.handleDraggingEnd.bind(this);
                document.addEventListener('mousemove', this.moveListener, false);
                document.addEventListener('mouseup', this.clickUpListener, false);
            }
        });
    }
    render() {
        return h("div", { class: 'wrapper' },
            h("slot", null),
            h("div", { class: "handle", ref: (el) => this.handleDiv = el }));
    }
    static get is() { return "warp-view-resize"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "initialHeight": {
            "type": String,
            "attr": "initial-height"
        },
        "minHeight": {
            "type": String,
            "attr": "min-height"
        }
    }; }
    static get listeners() { return [{
            "name": "resizeMyParent",
            "method": "onResize"
        }]; }
    static get style() { return "/**style-placeholder:warp-view-resize:**/"; }
}
