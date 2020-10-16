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
import * as strings from '../../../base/common/strings.js';
export var createStringBuilder;
if (typeof TextDecoder !== 'undefined') {
    createStringBuilder = function (capacity) { return new StringBuilder(capacity); };
}
else {
    createStringBuilder = function (capacity) { return new CompatStringBuilder(); };
}
var StringBuilder = /** @class */ (function () {
    function StringBuilder(capacity) {
        this._decoder = new TextDecoder('UTF-16LE');
        this._capacity = capacity | 0;
        this._buffer = new Uint16Array(this._capacity);
        this._completedStrings = null;
        this._bufferLength = 0;
    }
    StringBuilder.prototype.reset = function () {
        this._completedStrings = null;
        this._bufferLength = 0;
    };
    StringBuilder.prototype.build = function () {
        if (this._completedStrings !== null) {
            this._flushBuffer();
            return this._completedStrings.join('');
        }
        return this._buildBuffer();
    };
    StringBuilder.prototype._buildBuffer = function () {
        if (this._bufferLength === 0) {
            return '';
        }
        var view = new Uint16Array(this._buffer.buffer, 0, this._bufferLength);
        return this._decoder.decode(view);
    };
    StringBuilder.prototype._flushBuffer = function () {
        var bufferString = this._buildBuffer();
        this._bufferLength = 0;
        if (this._completedStrings === null) {
            this._completedStrings = [bufferString];
        }
        else {
            this._completedStrings[this._completedStrings.length] = bufferString;
        }
    };
    StringBuilder.prototype.write1 = function (charCode) {
        var remainingSpace = this._capacity - this._bufferLength;
        if (remainingSpace <= 1) {
            if (remainingSpace === 0 || strings.isHighSurrogate(charCode)) {
                this._flushBuffer();
            }
        }
        this._buffer[this._bufferLength++] = charCode;
    };
    StringBuilder.prototype.appendASCII = function (charCode) {
        if (this._bufferLength === this._capacity) {
            // buffer is full
            this._flushBuffer();
        }
        this._buffer[this._bufferLength++] = charCode;
    };
    StringBuilder.prototype.appendASCIIString = function (str) {
        var strLen = str.length;
        if (this._bufferLength + strLen >= this._capacity) {
            // This string does not fit in the remaining buffer space
            this._flushBuffer();
            this._completedStrings[this._completedStrings.length] = str;
            return;
        }
        for (var i = 0; i < strLen; i++) {
            this._buffer[this._bufferLength++] = str.charCodeAt(i);
        }
    };
    return StringBuilder;
}());
var CompatStringBuilder = /** @class */ (function () {
    function CompatStringBuilder() {
        this._pieces = [];
        this._piecesLen = 0;
    }
    CompatStringBuilder.prototype.reset = function () {
        this._pieces = [];
        this._piecesLen = 0;
    };
    CompatStringBuilder.prototype.build = function () {
        return this._pieces.join('');
    };
    CompatStringBuilder.prototype.write1 = function (charCode) {
        this._pieces[this._piecesLen++] = String.fromCharCode(charCode);
    };
    CompatStringBuilder.prototype.appendASCII = function (charCode) {
        this._pieces[this._piecesLen++] = String.fromCharCode(charCode);
    };
    CompatStringBuilder.prototype.appendASCIIString = function (str) {
        this._pieces[this._piecesLen++] = str;
    };
    return CompatStringBuilder;
}());
