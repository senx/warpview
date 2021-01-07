/*
 *  Copyright 2020 SenX S.A.S.
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
 */

var ElementsDragAndDropData = /** @class */ (function () {
    function ElementsDragAndDropData(elements) {
        this.elements = elements;
    }
    ElementsDragAndDropData.prototype.update = function (dataTransfer) {
        // no-op
    };
    ElementsDragAndDropData.prototype.getData = function () {
        return this.elements;
    };
    return ElementsDragAndDropData;
}());
export { ElementsDragAndDropData };
var ExternalElementsDragAndDropData = /** @class */ (function () {
    function ExternalElementsDragAndDropData(elements) {
        this.elements = elements;
    }
    ExternalElementsDragAndDropData.prototype.update = function (dataTransfer) {
        // no-op
    };
    ExternalElementsDragAndDropData.prototype.getData = function () {
        return this.elements;
    };
    return ExternalElementsDragAndDropData;
}());
export { ExternalElementsDragAndDropData };
var DesktopDragAndDropData = /** @class */ (function () {
    function DesktopDragAndDropData() {
        this.types = [];
        this.files = [];
    }
    DesktopDragAndDropData.prototype.update = function (dataTransfer) {
        if (dataTransfer.types) {
            this.types = [];
            Array.prototype.push.apply(this.types, dataTransfer.types);
        }
        if (dataTransfer.files) {
            this.files = [];
            Array.prototype.push.apply(this.files, dataTransfer.files);
            this.files = this.files.filter(function (f) { return f.size || f.type; });
        }
    };
    DesktopDragAndDropData.prototype.getData = function () {
        return {
            types: this.types,
            files: this.files
        };
    };
    return DesktopDragAndDropData;
}());
export { DesktopDragAndDropData };
