/**
 * Spinner component
 */
export class QuantumSpinner {
    constructor() {
        this.theme = 'light';
    }
    render() {
        return h("div", { class: "wrapper" },
            h("div", { class: this.theme + " lds-ring" },
                h("div", null),
                h("div", null),
                h("div", null),
                h("div", null)));
    }
    static get is() { return "quantum-spinner"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "theme": {
            "type": String,
            "attr": "theme"
        }
    }; }
    static get style() { return "/**style-placeholder:quantum-spinner:**/"; }
}
