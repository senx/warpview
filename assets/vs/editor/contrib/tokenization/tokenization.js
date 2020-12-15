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
import * as nls from '../../../nls.js';
import { EditorAction, registerEditorAction } from '../../browser/editorExtensions.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
var ForceRetokenizeAction = /** @class */ (function (_super) {
    __extends(ForceRetokenizeAction, _super);
    function ForceRetokenizeAction() {
        return _super.call(this, {
            id: 'editor.action.forceRetokenize',
            label: nls.localize('forceRetokenize', "Developer: Force Retokenize"),
            alias: 'Developer: Force Retokenize',
            precondition: undefined
        }) || this;
    }
    ForceRetokenizeAction.prototype.run = function (accessor, editor) {
        if (!editor.hasModel()) {
            return;
        }
        var model = editor.getModel();
        model.resetTokenization();
        var sw = new StopWatch(true);
        model.forceTokenization(model.getLineCount());
        sw.stop();
        console.log("tokenization took " + sw.elapsed());
    };
    return ForceRetokenizeAction;
}(EditorAction));
registerEditorAction(ForceRetokenizeAction);
