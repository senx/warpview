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
/**
 * An event describing that a model has been reset to a new value.
 * @internal
 */
var ModelRawFlush = /** @class */ (function () {
    function ModelRawFlush() {
        this.changeType = 1 /* Flush */;
    }
    return ModelRawFlush;
}());
export { ModelRawFlush };
/**
 * An event describing that a line has changed in a model.
 * @internal
 */
var ModelRawLineChanged = /** @class */ (function () {
    function ModelRawLineChanged(lineNumber, detail) {
        this.changeType = 2 /* LineChanged */;
        this.lineNumber = lineNumber;
        this.detail = detail;
    }
    return ModelRawLineChanged;
}());
export { ModelRawLineChanged };
/**
 * An event describing that line(s) have been deleted in a model.
 * @internal
 */
var ModelRawLinesDeleted = /** @class */ (function () {
    function ModelRawLinesDeleted(fromLineNumber, toLineNumber) {
        this.changeType = 3 /* LinesDeleted */;
        this.fromLineNumber = fromLineNumber;
        this.toLineNumber = toLineNumber;
    }
    return ModelRawLinesDeleted;
}());
export { ModelRawLinesDeleted };
/**
 * An event describing that line(s) have been inserted in a model.
 * @internal
 */
var ModelRawLinesInserted = /** @class */ (function () {
    function ModelRawLinesInserted(fromLineNumber, toLineNumber, detail) {
        this.changeType = 4 /* LinesInserted */;
        this.fromLineNumber = fromLineNumber;
        this.toLineNumber = toLineNumber;
        this.detail = detail;
    }
    return ModelRawLinesInserted;
}());
export { ModelRawLinesInserted };
/**
 * An event describing that a model has had its EOL changed.
 * @internal
 */
var ModelRawEOLChanged = /** @class */ (function () {
    function ModelRawEOLChanged() {
        this.changeType = 5 /* EOLChanged */;
    }
    return ModelRawEOLChanged;
}());
export { ModelRawEOLChanged };
/**
 * An event describing a change in the text of a model.
 * @internal
 */
var ModelRawContentChangedEvent = /** @class */ (function () {
    function ModelRawContentChangedEvent(changes, versionId, isUndoing, isRedoing) {
        this.changes = changes;
        this.versionId = versionId;
        this.isUndoing = isUndoing;
        this.isRedoing = isRedoing;
    }
    ModelRawContentChangedEvent.prototype.containsEvent = function (type) {
        for (var i = 0, len = this.changes.length; i < len; i++) {
            var change = this.changes[i];
            if (change.changeType === type) {
                return true;
            }
        }
        return false;
    };
    ModelRawContentChangedEvent.merge = function (a, b) {
        var changes = [].concat(a.changes).concat(b.changes);
        var versionId = b.versionId;
        var isUndoing = (a.isUndoing || b.isUndoing);
        var isRedoing = (a.isRedoing || b.isRedoing);
        return new ModelRawContentChangedEvent(changes, versionId, isUndoing, isRedoing);
    };
    return ModelRawContentChangedEvent;
}());
export { ModelRawContentChangedEvent };
/**
 * @internal
 */
var InternalModelContentChangeEvent = /** @class */ (function () {
    function InternalModelContentChangeEvent(rawContentChangedEvent, contentChangedEvent) {
        this.rawContentChangedEvent = rawContentChangedEvent;
        this.contentChangedEvent = contentChangedEvent;
    }
    InternalModelContentChangeEvent.prototype.merge = function (other) {
        var rawContentChangedEvent = ModelRawContentChangedEvent.merge(this.rawContentChangedEvent, other.rawContentChangedEvent);
        var contentChangedEvent = InternalModelContentChangeEvent._mergeChangeEvents(this.contentChangedEvent, other.contentChangedEvent);
        return new InternalModelContentChangeEvent(rawContentChangedEvent, contentChangedEvent);
    };
    InternalModelContentChangeEvent._mergeChangeEvents = function (a, b) {
        var changes = [].concat(a.changes).concat(b.changes);
        var eol = b.eol;
        var versionId = b.versionId;
        var isUndoing = (a.isUndoing || b.isUndoing);
        var isRedoing = (a.isRedoing || b.isRedoing);
        var isFlush = (a.isFlush || b.isFlush);
        return {
            changes: changes,
            eol: eol,
            versionId: versionId,
            isUndoing: isUndoing,
            isRedoing: isRedoing,
            isFlush: isFlush
        };
    };
    return InternalModelContentChangeEvent;
}());
export { InternalModelContentChangeEvent };
