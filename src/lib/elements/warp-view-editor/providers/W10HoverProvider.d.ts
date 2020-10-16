import { CancellationToken, editor, IMarkdownString, languages, Position } from 'monaco-editor';
import HoverProvider = languages.HoverProvider;
import Hover = languages.Hover;
import ProviderResult = languages.ProviderResult;
export declare abstract class W10HoverProvider implements HoverProvider {
    languageId: string;
    constructor(languageId: string);
    abstract provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.Hover>;
    _provideHover(model: editor.ITextModel, position: Position, token: CancellationToken, provider: any): ProviderResult<Hover>;
    protected static toMarkedStringArray(contents: IMarkdownString[]): IMarkdownString[];
    private static toMarkdownString;
}
