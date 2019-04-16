/*
 *  Copyright 2019  SenX S.A.S.
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
export class WcResize {
    constructor() {
        /**
         * Minimum height in pixel. default 10px.
         */
        this.minHeight = "10";
        /**
         * If set, force the initial height to the given value in px.
         */
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
        //the mouseup detach mousemove and mouseup events from document.
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
        //compute Y of the parent div top relative to page
        let yTopParent = this.handleDiv.parentElement.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        //compute new parent height 
        let h = ev.pageY - yTopParent + this.handleDiv.getBoundingClientRect().height / 2;
        if (h < parseInt(this.minHeight)) {
            h = parseInt(this.minHeight);
        }
        //apply new height
        this.handleDiv.parentElement.style.height = h + 'px';
    }
    componentDidLoad() {
        if (this.firstDraw && this.initialHeight) {
            this.handleDiv.parentElement.style.height = parseInt(this.initialHeight) + 'px';
        }
        //the click event on the handlebar attach mousemove and mouseup events to document.
        this.handleDiv.addEventListener('mousedown', (ev) => {
            if (0 == ev.button) { //keep left click only
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
