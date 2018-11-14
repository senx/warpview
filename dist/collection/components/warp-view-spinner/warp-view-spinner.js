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
