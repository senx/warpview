import { CancellationToken, editor, languages, Position, Thenable } from 'monaco-editor';
import { W10CompletionItemProvider } from './W10CompletionItemProvider';
import CompletionList = languages.CompletionList;
import IReadOnlyModel = editor.IReadOnlyModel;
import CompletionContext = languages.CompletionContext;
export declare class FLoWSCompletionItemProvider extends W10CompletionItemProvider {
    constructor();
    transformKeyWord(keyword: string): string;
    provideCompletionItems(model: IReadOnlyModel, position: Position, _context: CompletionContext, token: CancellationToken): Thenable<CompletionList>;
}
