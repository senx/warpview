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
import './countBadge.css';
import { $, append } from '../../dom.js';
import { format } from '../../../common/strings.js';
import { Color } from '../../../common/color.js';
import { mixin } from '../../../common/objects.js';
var defaultOpts = {
    badgeBackground: Color.fromHex('#4D4D4D'),
    badgeForeground: Color.fromHex('#FFFFFF')
};
var CountBadge = /** @class */ (function () {
    function CountBadge(container, options) {
        this.count = 0;
        this.options = options || Object.create(null);
        mixin(this.options, defaultOpts, false);
        this.badgeBackground = this.options.badgeBackground;
        this.badgeForeground = this.options.badgeForeground;
        this.badgeBorder = this.options.badgeBorder;
        this.element = append(container, $('.monaco-count-badge'));
        this.countFormat = this.options.countFormat || '{0}';
        this.titleFormat = this.options.titleFormat || '';
        this.setCount(this.options.count || 0);
    }
    CountBadge.prototype.setCount = function (count) {
        this.count = count;
        this.render();
    };
    CountBadge.prototype.setTitleFormat = function (titleFormat) {
        this.titleFormat = titleFormat;
        this.render();
    };
    CountBadge.prototype.render = function () {
        this.element.textContent = format(this.countFormat, this.count);
        this.element.title = format(this.titleFormat, this.count);
        this.applyStyles();
    };
    CountBadge.prototype.style = function (styles) {
        this.badgeBackground = styles.badgeBackground;
        this.badgeForeground = styles.badgeForeground;
        this.badgeBorder = styles.badgeBorder;
        this.applyStyles();
    };
    CountBadge.prototype.applyStyles = function () {
        if (this.element) {
            var background = this.badgeBackground ? this.badgeBackground.toString() : null;
            var foreground = this.badgeForeground ? this.badgeForeground.toString() : null;
            var border = this.badgeBorder ? this.badgeBorder.toString() : null;
            this.element.style.backgroundColor = background;
            this.element.style.color = foreground;
            this.element.style.borderWidth = border ? '1px' : null;
            this.element.style.borderStyle = border ? 'solid' : null;
            this.element.style.borderColor = border;
        }
    };
    return CountBadge;
}());
export { CountBadge };
