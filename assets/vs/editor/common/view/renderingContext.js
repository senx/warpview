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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RestrictedRenderingContext = /** @class */ (function () {
    function RestrictedRenderingContext(viewLayout, viewportData) {
        this._viewLayout = viewLayout;
        this.viewportData = viewportData;
        this.scrollWidth = this._viewLayout.getScrollWidth();
        this.scrollHeight = this._viewLayout.getScrollHeight();
        this.visibleRange = this.viewportData.visibleRange;
        this.bigNumbersDelta = this.viewportData.bigNumbersDelta;
        var vInfo = this._viewLayout.getCurrentViewport();
        this.scrollTop = vInfo.top;
        this.scrollLeft = vInfo.left;
        this.viewportWidth = vInfo.width;
        this.viewportHeight = vInfo.height;
    }
    RestrictedRenderingContext.prototype.getScrolledTopFromAbsoluteTop = function (absoluteTop) {
        return absoluteTop - this.scrollTop;
    };
    RestrictedRenderingContext.prototype.getVerticalOffsetForLineNumber = function (lineNumber) {
        return this._viewLayout.getVerticalOffsetForLineNumber(lineNumber);
    };
    RestrictedRenderingContext.prototype.getDecorationsInViewport = function () {
        return this.viewportData.getDecorationsInViewport();
    };
    return RestrictedRenderingContext;
}());
export { RestrictedRenderingContext };
var RenderingContext = /** @class */ (function (_super) {
    __extends(RenderingContext, _super);
    function RenderingContext(viewLayout, viewportData, viewLines) {
        var _this = _super.call(this, viewLayout, viewportData) || this;
        _this._viewLines = viewLines;
        return _this;
    }
    RenderingContext.prototype.linesVisibleRangesForRange = function (range, includeNewLines) {
        return this._viewLines.linesVisibleRangesForRange(range, includeNewLines);
    };
    RenderingContext.prototype.visibleRangeForPosition = function (position) {
        return this._viewLines.visibleRangeForPosition(position);
    };
    return RenderingContext;
}(RestrictedRenderingContext));
export { RenderingContext };
var LineVisibleRanges = /** @class */ (function () {
    function LineVisibleRanges(lineNumber, ranges) {
        this.lineNumber = lineNumber;
        this.ranges = ranges;
    }
    return LineVisibleRanges;
}());
export { LineVisibleRanges };
var HorizontalRange = /** @class */ (function () {
    function HorizontalRange(left, width) {
        this.left = Math.round(left);
        this.width = Math.round(width);
    }
    HorizontalRange.prototype.toString = function () {
        return "[" + this.left + "," + this.width + "]";
    };
    return HorizontalRange;
}());
export { HorizontalRange };
