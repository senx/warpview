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
import { ModelDecorationOptions } from '../../common/model/textModel.js';
var FoldingDecorationProvider = /** @class */ (function () {
    function FoldingDecorationProvider(editor) {
        this.editor = editor;
        this.autoHideFoldingControls = true;
    }
    FoldingDecorationProvider.prototype.getDecorationOption = function (isCollapsed) {
        if (isCollapsed) {
            return FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION;
        }
        else if (this.autoHideFoldingControls) {
            return FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION;
        }
        else {
            return FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION;
        }
    };
    FoldingDecorationProvider.prototype.deltaDecorations = function (oldDecorations, newDecorations) {
        return this.editor.deltaDecorations(oldDecorations, newDecorations);
    };
    FoldingDecorationProvider.prototype.changeDecorations = function (callback) {
        return this.editor.changeDecorations(callback);
    };
    FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        afterContentClassName: 'inline-folded',
        linesDecorationsClassName: 'folding collapsed'
    });
    FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        linesDecorationsClassName: 'folding'
    });
    FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        linesDecorationsClassName: 'folding alwaysShowFoldIcons'
    });
    return FoldingDecorationProvider;
}());
export { FoldingDecorationProvider };
