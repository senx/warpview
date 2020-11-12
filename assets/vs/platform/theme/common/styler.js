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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { inputBackground, inputForeground, inputBorder, foreground, editorBackground, contrastBorder, listFocusBackground, listFocusForeground, listActiveSelectionBackground, listActiveSelectionForeground, listInactiveSelectionForeground, listInactiveSelectionBackground, listInactiveFocusBackground, listHoverBackground, listHoverForeground, listDropBackground, pickerGroupBorder, pickerGroupForeground, widgetShadow, inputValidationInfoBorder, inputValidationInfoBackground, inputValidationWarningBorder, inputValidationWarningBackground, inputValidationErrorBorder, inputValidationErrorBackground, activeContrastBorder, badgeBackground, badgeForeground, progressBarBackground, inputValidationInfoForeground, inputValidationWarningForeground, inputValidationErrorForeground, menuForeground, menuBackground, menuSelectionForeground, menuSelectionBackground, menuSelectionBorder, menuBorder, menuSeparatorBackground, darken, listFilterWidgetOutline, listFilterWidgetNoMatchesOutline, listFilterWidgetBackground, treeIndentGuidesStroke } from './colorRegistry.js';
import { mixin } from '../../../base/common/objects.js';
export function computeStyles(theme, styleMap) {
    var styles = Object.create(null);
    for (var key in styleMap) {
        var value = styleMap[key];
        if (typeof value === 'string') {
            styles[key] = theme.getColor(value);
        }
        else if (typeof value === 'function') {
            styles[key] = value(theme);
        }
    }
    return styles;
}
export function attachStyler(themeService, styleMap, widgetOrCallback) {
    function applyStyles(theme) {
        var styles = computeStyles(themeService.getTheme(), styleMap);
        if (typeof widgetOrCallback === 'function') {
            widgetOrCallback(styles);
        }
        else {
            widgetOrCallback.style(styles);
        }
    }
    applyStyles(themeService.getTheme());
    return themeService.onThemeChange(applyStyles);
}
export function attachBadgeStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        badgeBackground: (style && style.badgeBackground) || badgeBackground,
        badgeForeground: (style && style.badgeForeground) || badgeForeground,
        badgeBorder: contrastBorder
    }, widget);
}
export function attachQuickOpenStyler(widget, themeService, style) {
    return attachStyler(themeService, {
        foreground: (style && style.foreground) || foreground,
        background: (style && style.background) || editorBackground,
        borderColor: style && style.borderColor || contrastBorder,
        widgetShadow: style && style.widgetShadow || widgetShadow,
        progressBarBackground: style && style.progressBarBackground || progressBarBackground,
        pickerGroupForeground: style && style.pickerGroupForeground || pickerGroupForeground,
        pickerGroupBorder: style && style.pickerGroupBorder || pickerGroupBorder,
        inputBackground: (style && style.inputBackground) || inputBackground,
        inputForeground: (style && style.inputForeground) || inputForeground,
        inputBorder: (style && style.inputBorder) || inputBorder,
        inputValidationInfoBorder: (style && style.inputValidationInfoBorder) || inputValidationInfoBorder,
        inputValidationInfoBackground: (style && style.inputValidationInfoBackground) || inputValidationInfoBackground,
        inputValidationInfoForeground: (style && style.inputValidationInfoForeground) || inputValidationInfoForeground,
        inputValidationWarningBorder: (style && style.inputValidationWarningBorder) || inputValidationWarningBorder,
        inputValidationWarningBackground: (style && style.inputValidationWarningBackground) || inputValidationWarningBackground,
        inputValidationWarningForeground: (style && style.inputValidationWarningForeground) || inputValidationWarningForeground,
        inputValidationErrorBorder: (style && style.inputValidationErrorBorder) || inputValidationErrorBorder,
        inputValidationErrorBackground: (style && style.inputValidationErrorBackground) || inputValidationErrorBackground,
        inputValidationErrorForeground: (style && style.inputValidationErrorForeground) || inputValidationErrorForeground,
        listFocusBackground: (style && style.listFocusBackground) || listFocusBackground,
        listFocusForeground: (style && style.listFocusForeground) || listFocusForeground,
        listActiveSelectionBackground: (style && style.listActiveSelectionBackground) || darken(listActiveSelectionBackground, 0.1),
        listActiveSelectionForeground: (style && style.listActiveSelectionForeground) || listActiveSelectionForeground,
        listFocusAndSelectionBackground: style && style.listFocusAndSelectionBackground || listActiveSelectionBackground,
        listFocusAndSelectionForeground: (style && style.listFocusAndSelectionForeground) || listActiveSelectionForeground,
        listInactiveSelectionBackground: (style && style.listInactiveSelectionBackground) || listInactiveSelectionBackground,
        listInactiveSelectionForeground: (style && style.listInactiveSelectionForeground) || listInactiveSelectionForeground,
        listInactiveFocusBackground: (style && style.listInactiveFocusBackground) || listInactiveFocusBackground,
        listHoverBackground: (style && style.listHoverBackground) || listHoverBackground,
        listHoverForeground: (style && style.listHoverForeground) || listHoverForeground,
        listDropBackground: (style && style.listDropBackground) || listDropBackground,
        listFocusOutline: (style && style.listFocusOutline) || activeContrastBorder,
        listSelectionOutline: (style && style.listSelectionOutline) || activeContrastBorder,
        listHoverOutline: (style && style.listHoverOutline) || activeContrastBorder
    }, widget);
}
export function attachListStyler(widget, themeService, overrides) {
    return attachStyler(themeService, mixin(overrides || Object.create(null), defaultListStyles, false), widget);
}
export var defaultListStyles = {
    listFocusBackground: listFocusBackground,
    listFocusForeground: listFocusForeground,
    listActiveSelectionBackground: darken(listActiveSelectionBackground, 0.1),
    listActiveSelectionForeground: listActiveSelectionForeground,
    listFocusAndSelectionBackground: listActiveSelectionBackground,
    listFocusAndSelectionForeground: listActiveSelectionForeground,
    listInactiveSelectionBackground: listInactiveSelectionBackground,
    listInactiveSelectionForeground: listInactiveSelectionForeground,
    listInactiveFocusBackground: listInactiveFocusBackground,
    listHoverBackground: listHoverBackground,
    listHoverForeground: listHoverForeground,
    listDropBackground: listDropBackground,
    listFocusOutline: activeContrastBorder,
    listSelectionOutline: activeContrastBorder,
    listHoverOutline: activeContrastBorder,
    listFilterWidgetBackground: listFilterWidgetBackground,
    listFilterWidgetOutline: listFilterWidgetOutline,
    listFilterWidgetNoMatchesOutline: listFilterWidgetNoMatchesOutline,
    listMatchesShadow: widgetShadow,
    treeIndentGuidesStroke: treeIndentGuidesStroke
};
export var defaultMenuStyles = {
    shadowColor: widgetShadow,
    borderColor: menuBorder,
    foregroundColor: menuForeground,
    backgroundColor: menuBackground,
    selectionForegroundColor: menuSelectionForeground,
    selectionBackgroundColor: menuSelectionBackground,
    selectionBorderColor: menuSelectionBorder,
    separatorColor: menuSeparatorBackground
};
export function attachMenuStyler(widget, themeService, style) {
    return attachStyler(themeService, __assign({}, defaultMenuStyles, style), widget);
}
