import { CancellationToken, editor, languages, Position } from 'monaco-editor';
import { W10HoverProvider } from './W10HoverProvider';
import Hover = languages.Hover;
import ProviderResult = languages.ProviderResult;
export declare class WSHoverProvider extends W10HoverProvider {
    constructor();
    provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<Hover>;
}
