import { CancellationToken, editor, languages, Position, Thenable } from 'monaco-editor';
import CompletionList = languages.CompletionList;
import CompletionItemProvider = languages.CompletionItemProvider;
import IReadOnlyModel = editor.IReadOnlyModel;
import CompletionContext = languages.CompletionContext;
export declare abstract class W10CompletionItemProvider implements CompletionItemProvider {
    languageId: string;
    protected constructor(languageId: string);
    abstract provideCompletionItems(model: IReadOnlyModel, position: Position, _context: CompletionContext, token: CancellationToken): Thenable<CompletionList>;
    abstract transformKeyWord(keyword: string): string;
    protected _provideCompletionItems(model: editor.IReadOnlyModel, position: Position, _context: languages.CompletionContext, token: CancellationToken, source: any, snippets: any): Thenable<languages.CompletionList>;
    private static getType;
}
