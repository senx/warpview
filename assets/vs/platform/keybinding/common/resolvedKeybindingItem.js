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
var ResolvedKeybindingItem = /** @class */ (function () {
    function ResolvedKeybindingItem(resolvedKeybinding, command, commandArgs, when, isDefault) {
        this.resolvedKeybinding = resolvedKeybinding;
        this.keypressParts = resolvedKeybinding ? removeElementsAfterNulls(resolvedKeybinding.getDispatchParts()) : [];
        this.bubble = (command ? command.charCodeAt(0) === 94 /* Caret */ : false);
        this.command = this.bubble ? command.substr(1) : command;
        this.commandArgs = commandArgs;
        this.when = when;
        this.isDefault = isDefault;
    }
    return ResolvedKeybindingItem;
}());
export { ResolvedKeybindingItem };
export function removeElementsAfterNulls(arr) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var element = arr[i];
        if (!element) {
            // stop processing at first encountered null
            return result;
        }
        result.push(element);
    }
    return result;
}
