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
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { toDisposable } from '../../../base/common/lifecycle.js';
import * as platform from '../../registry/common/platform.js';
import { Emitter } from '../../../base/common/event.js';
export var IThemeService = createDecorator('themeService');
export function themeColorFromId(id) {
    return { id: id };
}
// base themes
export var DARK = 'dark';
export var LIGHT = 'light';
export var HIGH_CONTRAST = 'hc';
export function getThemeTypeSelector(type) {
    switch (type) {
        case DARK: return 'vs-dark';
        case HIGH_CONTRAST: return 'hc-black';
        default: return 'vs';
    }
}
// static theming participant
export var Extensions = {
    ThemingContribution: 'base.contributions.theming'
};
var ThemingRegistry = /** @class */ (function () {
    function ThemingRegistry() {
        this.themingParticipants = [];
        this.themingParticipants = [];
        this.onThemingParticipantAddedEmitter = new Emitter();
    }
    ThemingRegistry.prototype.onThemeChange = function (participant) {
        var _this = this;
        this.themingParticipants.push(participant);
        this.onThemingParticipantAddedEmitter.fire(participant);
        return toDisposable(function () {
            var idx = _this.themingParticipants.indexOf(participant);
            _this.themingParticipants.splice(idx, 1);
        });
    };
    ThemingRegistry.prototype.getThemingParticipants = function () {
        return this.themingParticipants;
    };
    return ThemingRegistry;
}());
var themingRegistry = new ThemingRegistry();
platform.Registry.add(Extensions.ThemingContribution, themingRegistry);
export function registerThemingParticipant(participant) {
    return themingRegistry.onThemeChange(participant);
}
