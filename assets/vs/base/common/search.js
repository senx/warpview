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
import * as strings from './strings.js';
export function buildReplaceStringWithCasePreserved(matches, pattern) {
    if (matches && (matches[0] !== '')) {
        if (matches[0].toUpperCase() === matches[0]) {
            return pattern.toUpperCase();
        }
        else if (matches[0].toLowerCase() === matches[0]) {
            return pattern.toLowerCase();
        }
        else if (strings.containsUppercaseCharacter(matches[0][0])) {
            if (validateSpecificSpecialCharacter(matches, pattern, '-')) {
                return buildReplaceStringForSpecificSpecialCharacter(matches, pattern, '-');
            }
            else {
                return pattern[0].toUpperCase() + pattern.substr(1);
            }
        }
        else {
            // we don't understand its pattern yet.
            return pattern;
        }
    }
    else {
        return pattern;
    }
}
function validateSpecificSpecialCharacter(matches, pattern, specialCharacter) {
    var doesConatinSpecialCharacter = matches[0].indexOf(specialCharacter) !== -1 && pattern.indexOf(specialCharacter) !== -1;
    return doesConatinSpecialCharacter && matches[0].split(specialCharacter).length === pattern.split(specialCharacter).length;
}
function buildReplaceStringForSpecificSpecialCharacter(matches, pattern, specialCharacter) {
    var splitPatternAtSpecialCharacter = pattern.split(specialCharacter);
    var splitMatchAtSpecialCharacter = matches[0].split(specialCharacter);
    var replaceString = '';
    splitPatternAtSpecialCharacter.forEach(function (splitValue, index) {
        replaceString += buildReplaceStringWithCasePreserved([splitMatchAtSpecialCharacter[index]], splitValue) + specialCharacter;
    });
    return replaceString.slice(0, -1);
}
