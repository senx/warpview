/**
 * Parsing result of // @command parameter  in the beginning of the WarpScript
 */
export interface SpecialCommentCommands {
    endpoint?: string;
    timeUnit?: string;
    localMacroSubstitution?: boolean;
    displayPreviewOpt?: string;
}
export interface DocGenerationParams {
    macroName: string;
    wfRepos: string[];
    endpoint: string;
}
/**
 * This is a simplified warpScriptParser, from the one used is VSCode WarpScript extension.
 *
 */
export default class WarpScriptParser {
    /**
     * Unlike parseWarpScriptMacros, this function return a very simple list of statements (as strings), ignoring comments.
     * [ '"HELLO"' '"WORLD"' '+' '2' '2' '*' ]
     */
    static parseWarpScriptStatements(ws: string): string[];
    static extractSpecialComments(executedWarpScript: string): SpecialCommentCommands;
}
