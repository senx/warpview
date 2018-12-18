/*! Built with http://stenciljs.com */
const { h } = window.warpview;

/*
 *  Copyright 2018  SenX S.A.S.
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
/**
 * Spinner component
 */
class WarpViewSpinner {
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
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host .wrapper {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 230px; }\n  :host .wrapper h2 {\n    text-align: center;\n    display: inline-block;\n    position: absolute;\n    width: 50%;\n    height: 64px;\n    margin: auto;\n    bottom: 0;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n    transform: translate(-50%, -50%); }\n  :host .wrapper .lds-ring {\n    display: inline-block;\n    position: absolute;\n    width: 64px;\n    height: 64px;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n    transform: translate(-50%, -50%); }\n    :host .wrapper .lds-ring div {\n      -webkit-box-sizing: border-box;\n      box-sizing: border-box;\n      display: block;\n      position: absolute;\n      width: 51px;\n      height: 51px;\n      margin: 6px;\n      border: 6px solid;\n      border-radius: 50%;\n      -webkit-animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;\n      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;\n      border-color: var(--warp-view-spinner-color, #5899DA) transparent transparent transparent; }\n    :host .wrapper .lds-ring div:nth-child(1) {\n      -webkit-animation-delay: -0.45s;\n      animation-delay: -0.45s; }\n    :host .wrapper .lds-ring div:nth-child(2) {\n      -webkit-animation-delay: -0.3s;\n      animation-delay: -0.3s; }\n    :host .wrapper .lds-ring div:nth-child(3) {\n      -webkit-animation-delay: -0.15s;\n      animation-delay: -0.15s; }\n\n\@-webkit-keyframes lds-ring {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n\@keyframes lds-ring {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }"; }
}

export { WarpViewSpinner };
