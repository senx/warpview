export class WarpViewSpinner {
    constructor() {
        this.message = 'Loading and parsing data...';
    }
    render() {
        return h("div", { class: "wrapper" },
            h("div", { class: " lds-ring" },
                h("div", null),
                h("div", null),
                h("div", null),
                h("div", null)),
            h("h2", null, this.message));
    }
    static get is() { return "warp-view-spinner"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "message": {
            "type": String,
            "attr": "message"
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-spinner:**/"; }
}
