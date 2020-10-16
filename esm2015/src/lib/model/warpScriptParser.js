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
/**
 * This is a simplified warpScriptParser, from the one used is VSCode WarpScript extension.
 *
 */
export default class WarpScriptParser {
    /**
     * Unlike parseWarpScriptMacros, this function return a very simple list of statements (as strings), ignoring comments.
     * [ '"HELLO"' '"WORLD"' '+' '2' '2' '*' ]
     */
    static parseWarpScriptStatements(ws) {
        let i = 0;
        const result = [];
        while (i < ws.length - 1) { // often test 2 characters
            if (ws.charAt(i) === '<' && ws.charAt(i + 1) === '\'') { // start of a multiline, look for end
                // console.log(i, 'start of multiline');
                const lines = ws.substring(i, ws.length).split('\n');
                let lc = 0;
                while (lc < lines.length && lines[lc].trim() !== '\'>') {
                    i += lines[lc].length + 1;
                    lc++;
                }
                i += lines[lc].length + 1;
                // console.log(i, 'end of multiline');
            }
            if (ws.charAt(i) === '/' && ws.charAt(i + 1) === '*') { // start one multiline comment, seek for end of comment
                // console.log(i, 'start of multiline comment');
                i++;
                while (i < ws.length - 1 && !(ws.charAt(i) === '*' && ws.charAt(i + 1) === '/')) {
                    i++;
                }
                i += 2;
                // console.log(i, 'end of multiline comment');
            }
            if (ws.charAt(i) === '/' && ws.charAt(i + 1) === '/') { // start single line comment, seek for end of line
                // console.log(i, 'start of a comment');
                i++;
                while (i < ws.length - 1 && (ws.charAt(i) !== '\n')) {
                    i++;
                }
                // console.log(i, 'end of a comment');
            }
            if (ws.charAt(i) === '\'') { // start of string, seek for end
                // console.log(i, 'start of string');
                const start = i;
                i++;
                while (i < ws.length && ws.charAt(i) !== '\'' && ws.charAt(i) !== '\n') {
                    i++;
                }
                i++;
                result.push(ws.substring(start, i));
                // console.log(i, 'end of string');
            }
            // start of string, seek for end
            if (ws.charAt(i) === '"') {
                // console.log(i, 'start of string');
                const start = i;
                i++;
                while (i < ws.length && ws.charAt(i) !== '"' && ws.charAt(i) !== '\n') {
                    i++;
                }
                // console.log(i, 'end of string');
                i++;
                result.push(ws.substring(start, i));
            }
            if (ws.charAt(i) === '<' && ws.charAt(i + 1) === '%') { // start of a macro.
                // console.log(i, 'start of macro');
                result.push('<%');
                i += 2;
            }
            if (ws.charAt(i) === '%' && ws.charAt(i + 1) === '>') { // end of a macro.
                // console.log(i, 'end of macro');
                result.push('%>');
                i += 2;
            }
            if (ws.charAt(i) !== ' ' && ws.charAt(i) !== '\n') {
                const start = i;
                while (i < ws.length && ws.charAt(i) !== ' ' && ws.charAt(i) !== '\n') {
                    i++;
                }
                result.push(ws.substring(start, i));
            }
            i++;
        }
        return result;
    }
    static extractSpecialComments(executedWarpScript) {
        const result = {};
        const warpscriptLines = executedWarpScript.split('\n');
        for (let l = 0; l < warpscriptLines.length; l++) {
            const currentLine = warpscriptLines[l];
            if (currentLine.startsWith('//')) {
                // find and extract // @paramname parameters
                const extraParamsPattern = /\/\/\s*@(\w*)\s*(.*)$/g;
                let lineOnMatch;
                const re = RegExp(extraParamsPattern);
                // think about windows... \r\n in mc2 files !
                // noinspection JSAssignmentUsedAsCondition
                while (lineOnMatch = re.exec(currentLine.replace('\r', ''))) {
                    const parameterName = lineOnMatch[1];
                    const parameterValue = lineOnMatch[2];
                    switch (parameterName) {
                        case 'endpoint': //      // @endpoint http://mywarp10server/api/v0/exec
                            result.endpoint = parameterValue; // overrides the Warp10URL configuration
                            break;
                        case 'localmacrosubstitution':
                            result.localMacroSubstitution = ('true' === parameterValue.toLowerCase()); // overrides the substitutionWithLocalMacros
                            break;
                        case 'timeunit':
                            if (['us', 'ms', 'ns'].indexOf(parameterValue.trim()) > -1) {
                                result.timeUnit = parameterValue.trim();
                            }
                            break;
                        case 'preview':
                            switch (parameterValue.toLowerCase().substr(0, 4)) {
                                case 'none':
                                    result.displayPreviewOpt = 'X';
                                    break;
                                case 'gts':
                                    result.displayPreviewOpt = 'G';
                                    break;
                                case 'imag':
                                    result.displayPreviewOpt = 'I';
                                    break;
                                default:
                                    result.displayPreviewOpt = '';
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            else {
                if (l > 0) {
                    break;
                }
                // no more comments at the beginning of the file. two first lines could be empty
            }
        }
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycFNjcmlwdFBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnB2aWV3LWVkaXRvci9wcm9qZWN0cy93YXJwdmlldy1lZGl0b3ItbmcvIiwic291cmNlcyI6WyJzcmMvbGliL21vZGVsL3dhcnBTY3JpcHRQYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFtQkg7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE9BQU8sT0FBTyxnQkFBZ0I7SUFHbkM7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLHlCQUF5QixDQUFDLEVBQVU7UUFFaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBRTVCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsMEJBQTBCO1lBQ3BELElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUUscUNBQXFDO2dCQUM1Rix3Q0FBd0M7Z0JBQ3hDLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9ELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDWCxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7b0JBQ3RELENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDMUIsRUFBRSxFQUFFLENBQUM7aUJBQ047Z0JBQ0QsQ0FBQyxJQUFJ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QUFNO29DQUNULE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUM7b0NBQy9CLE1BQU07Z0NBQ1IsS0FBSyxLQUFLO29DQUNSLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUM7b0NBQy9CLE1BQU07Z0NBQ1IsS0FBSyxNQUFNO29DQUNULE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUM7b0NBQy9CLE1BQU07Z0NBQ1I7b0NBQ0UsTUFBTSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztvQ0FDOUIsTUFBTTs2QkFDVDs0QkFDRCxNQUFNO3dCQUNSOzRCQUNFLE1BQU07cUJBQ1Q7aUJBQ0Y7YUFDRjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ1QsTUFBTTtpQkFDUDtnQkFDRCxnRkFBZ0Y7YUFDakY7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cblxuLyoqXG4gKiBQYXJzaW5nIHJlc3VsdCBvZiAvLyBAY29tbWFuZCBwYXJhbWV0ZXIgIGluIHRoZSBiZWdpbm5pbmcgb2YgdGhlIFdhcnBTY3JpcHRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTcGVjaWFsQ29tbWVudENvbW1hbmRzIHtcbiAgZW5kcG9pbnQ/OiBzdHJpbmc7XG4gIHRpbWVVbml0Pzogc3RyaW5nO1xuICBsb2NhbE1hY3JvU3Vic3RpdHV0aW9uPzogYm9vbGVhbjtcbiAgZGlzcGxheVByZXZpZXdPcHQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRG9jR2VuZXJhdGlvblBhcmFtcyB7XG4gIG1hY3JvTmFtZTogc3RyaW5nO1xuICB3ZlJlcG9zOiBzdHJpbmdbXTtcbiAgZW5kcG9pbnQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGEgc2ltcGxpZmllZCB3YXJwU2NyaXB0UGFyc2VyLCBmcm9tIHRoZSBvbmUgdXNlZCBpcyBWU0NvZGUgV2FycFNjcmlwdCBleHRlbnNpb24uXG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXJwU2NyaXB0UGFyc2VyIHtcblxuXG4gIC8qKlxuICAgKiBVbmxpa2UgcGFyc2VXYXJwU2NyaXB0TWFjcm9zLCB0aGlzIGZ1bmN0aW9uIHJldHVybiBhIHZlcnkgc2ltcGxlIGxpc3Qgb2Ygc3RhdGVtZW50cyAoYXMgc3RyaW5ncyksIGlnbm9yaW5nIGNvbW1lbnRzLlxuICAgKiBbICdcIkhFTExPXCInICdcIldPUkxEXCInICcrJyAnMicgJzInICcqJyBdXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhcnNlV2FycFNjcmlwdFN0YXRlbWVudHMod3M6IHN0cmluZyk6IHN0cmluZ1tdIHtcblxuICAgIGxldCBpID0gMDtcbiAgICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cbiAgICB3aGlsZSAoaSA8IHdzLmxlbmd0aCAtIDEpIHsgLy8gb2Z0ZW4gdGVzdCAyIGNoYXJhY3RlcnNcbiAgICAgIGlmICh3cy5jaGFyQXQoaSkgPT09ICc8JyAmJiB3cy5jaGFyQXQoaSArIDEpID09PSAnXFwnJykgeyAvLyBzdGFydCBvZiBhIG11bHRpbGluZSwgbG9vayBmb3IgZW5kXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGksICdzdGFydCBvZiBtdWx0aWxpbmUnKTtcbiAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gd3Muc3Vic3RyaW5nKGksIHdzLmxlbmd0aCkuc3BsaXQoJ1xcbicpO1xuICAgICAgICBsZXQgbGMgPSAwO1xuICAgICAgICB3aGlsZSAobGMgPCBsaW5lcy5sZW5ndGggJiYgbGluZXNbbGNdLnRyaW0oKSAhPT0gJ1xcJz4nKSB7XG4gICAgICAgICAgaSArPSBsaW5lc1tsY10ubGVuZ3RoICsgMTtcbiAgICAgICAgICBsYysrO1xuICAgICAgICB9XG4gICAgICAgIGkgKz0gbGluZXNbbGNdLmxlbmd0aCArIDE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGksICdlbmQgb2YgbXVsdGlsaW5lJyk7XG4gICAgICB9XG4gICAgICBpZiAod3MuY2hhckF0KGkpID09PSAnLycgJiYgd3MuY2hhckF0KGkgKyAxKSA9PT0gJyonKSB7IC8vIHN0YXJ0IG9uZSBtdWx0aWxpbmUgY29tbWVudCwgc2VlayBmb3IgZW5kIG9mIGNvbW1lbnRcbiAgICAgICAgLy8gY29uc29sZS5sb2coaSwgJ3N0YXJ0IG9mIG11bHRpbGluZSBjb21tZW50Jyk7XG4gICAgICAgIGkrKztcbiAgICAgICAgd2hpbGUgKGkgPCB3cy5sZW5ndGggLSAxICYmICEod3MuY2hhckF0KGkpID09PSAnKicgJiYgd3MuY2hhckF0KGkgKyAxKSA9PT0gJy8nKSkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBpICs9IDI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGksICdlbmQgb2YgbXVsdGlsaW5lIGNvbW1lbnQnKTtcbiAgICAgIH1cbiAgICAgIGlmICh3cy5jaGFyQXQoaSkgPT09ICcvJyAmJiB3cy5jaGFyQXQoaSArIDEpID09PSAnLycpIHsgLy8gc3RhcnQgc2luZ2xlIGxpbmUgY29tbWVudCwgc2VlayBmb3IgZW5kIG9mIGxpbmVcbiAgICAgICAgLy8gY29uc29sZS5sb2coaSwgJ3N0YXJ0IG9mIGEgY29tbWVudCcpO1xuICAgICAgICBpKys7XG4gICAgICAgIHdoaWxlIChpIDwgd3MubGVuZ3RoIC0gMSAmJiAod3MuY2hhckF0KGkpICE9PSAnXFxuJykpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coaSwgJ2VuZCBvZiBhIGNvbW1lbnQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHdzLmNoYXJBdChpKSA9PT0gJ1xcJycpIHsgLy8gc3RhcnQgb2Ygc3RyaW5nLCBzZWVrIGZvciBlbmRcbiAgICAgICAgLy8gY29uc29sZS5sb2coaSwgJ3N0YXJ0IG9mIHN0cmluZycpO1xuICAgICAgICBjb25zdCBzdGFydCA9IGk7XG4gICAgICAgIGkrKztcbiAgICAgICAgd2hpbGUgKGkgPCB3cy5sZW5ndGggJiYgd3MuY2hhckF0KGkpICE9PSAnXFwnJyAmJiB3cy5jaGFyQXQoaSkgIT09ICdcXG4nKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgICAgcmVzdWx0LnB1c2god3Muc3Vic3RyaW5nKHN0YXJ0LCBpKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGksICdlbmQgb2Ygc3RyaW5nJyk7XG4gICAgICB9XG4gICAgICAvLyBzdGFydCBvZiBzdHJpbmcsIHNlZWsgZm9yIGVuZFxuICAgICAgaWYgKHdzLmNoYXJBdChpKSA9PT0gJ1wiJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCAnc3RhcnQgb2Ygc3RyaW5nJyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gaTtcbiAgICAgICAgaSsrO1xuICAgICAgICB3aGlsZSAoaSA8IHdzLmxlbmd0aCAmJiB3cy5jaGFyQXQoaSkgIT09ICdcIicgJiYgd3MuY2hhckF0KGkpICE9PSAnXFxuJykge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCAnZW5kIG9mIHN0cmluZycpO1xuICAgICAgICBpKys7XG4gICAgICAgIHJlc3VsdC5wdXNoKHdzLnN1YnN0cmluZyhzdGFydCwgaSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAod3MuY2hhckF0KGkpID09PSAnPCcgJiYgd3MuY2hhckF0KGkgKyAxKSA9PT0gJyUnKSB7IC8vIHN0YXJ0IG9mIGEgbWFjcm8uXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGksICdzdGFydCBvZiBtYWNybycpO1xuICAgICAgICByZXN1bHQucHVzaCgnPCUnKTtcbiAgICAgICAgaSArPSAyO1xuICAgICAgfVxuXG4gICAgICBpZiAod3MuY2hhckF0KGkpID09PSAnJScgJiYgd3MuY2hhckF0KGkgKyAxKSA9PT0gJz4nKSB7IC8vIGVuZCBvZiBhIG1hY3JvLlxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCAnZW5kIG9mIG1hY3JvJyk7XG4gICAgICAgIHJlc3VsdC5wdXNoKCclPicpO1xuICAgICAgICBpICs9IDI7XG4gICAgICB9XG5cbiAgICAgIGlmICh3cy5jaGFyQXQoaSkgIT09ICcgJyAmJiB3cy5jaGFyQXQoaSkgIT09ICdcXG4nKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gaTtcbiAgICAgICAgd2hpbGUgKGkgPCB3cy5sZW5ndGggJiYgd3MuY2hhckF0KGkpICE9PSAnICcgJiYgd3MuY2hhckF0KGkpICE9PSAnXFxuJykge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQucHVzaCh3cy5zdWJzdHJpbmcoc3RhcnQsIGkpKTtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cblxuICBwdWJsaWMgc3RhdGljIGV4dHJhY3RTcGVjaWFsQ29tbWVudHMoZXhlY3V0ZWRXYXJwU2NyaXB0OiBzdHJpbmcpOiBTcGVjaWFsQ29tbWVudENvbW1hbmRzIHtcbiAgICBjb25zdCByZXN1bHQ6IFNwZWNpYWxDb21tZW50Q29tbWFuZHMgPSB7fTtcbiAgICBjb25zdCB3YXJwc2NyaXB0TGluZXMgPSBleGVjdXRlZFdhcnBTY3JpcHQuc3BsaXQoJ1xcbicpO1xuICAgIGZvciAobGV0IGwgPSAwOyBsIDwgd2FycHNjcmlwdExpbmVzLmxlbmd0aDsgbCsrKSB7XG4gICAgICBjb25zdCBjdXJyZW50TGluZSA9IHdhcnBzY3JpcHRMaW5lc1tsXTtcbiAgICAgIGlmIChjdXJyZW50TGluZS5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgIC8vIGZpbmQgYW5kIGV4dHJhY3QgLy8gQHBhcmFtbmFtZSBwYXJhbWV0ZXJzXG4gICAgICAgIGNvbnN0IGV4dHJhUGFyYW1zUGF0dGVybiA9IC9cXC9cXC9cXHMqQChcXHcqKVxccyooLiopJC9nO1xuICAgICAgICBsZXQgbGluZU9uTWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsO1xuICAgICAgICBjb25zdCByZSA9IFJlZ0V4cChleHRyYVBhcmFtc1BhdHRlcm4pO1xuICAgICAgICAvLyB0aGluayBhYm91dCB3aW5kb3dzLi4uIFxcclxcbiBpbiBtYzIgZmlsZXMgIVxuICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNBc3NpZ25tZW50VXNlZEFzQ29uZGl0aW9uXG4gICAgICAgIHdoaWxlIChsaW5lT25NYXRjaCA9IHJlLmV4ZWMoY3VycmVudExpbmUucmVwbGFjZSgnXFxyJywgJycpKSkge1xuICAgICAgICAgIGNvbnN0IHBhcmFtZXRlck5hbWUgPSBsaW5lT25NYXRjaFsxXTtcbiAgICAgICAgICBjb25zdCBwYXJhbWV0ZXJWYWx1ZSA9IGxpbmVPbk1hdGNoWzJdO1xuICAgICAgICAgIHN3aXRjaCAocGFyYW1ldGVyTmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnZW5kcG9pbnQnOiAgICAgICAgLy8gICAgICAvLyBAZW5kcG9pbnQgaHR0cDovL215d2FycDEwc2VydmVyL2FwaS92MC9leGVjXG4gICAgICAgICAgICAgIHJlc3VsdC5lbmRwb2ludCA9IHBhcmFtZXRlclZhbHVlOyAgIC8vIG92ZXJyaWRlcyB0aGUgV2FycDEwVVJMIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsb2NhbG1hY3Jvc3Vic3RpdHV0aW9uJzpcbiAgICAgICAgICAgICAgcmVzdWx0LmxvY2FsTWFjcm9TdWJzdGl0dXRpb24gPSAoJ3RydWUnID09PSBwYXJhbWV0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKTsgICAvLyBvdmVycmlkZXMgdGhlIHN1YnN0aXR1dGlvbldpdGhMb2NhbE1hY3Jvc1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3RpbWV1bml0JzpcbiAgICAgICAgICAgICAgaWYgKFsndXMnLCAnbXMnLCAnbnMnXS5pbmRleE9mKHBhcmFtZXRlclZhbHVlLnRyaW0oKSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC50aW1lVW5pdCA9IHBhcmFtZXRlclZhbHVlLnRyaW0oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3ByZXZpZXcnOlxuICAgICAgICAgICAgICBzd2l0Y2ggKHBhcmFtZXRlclZhbHVlLnRvTG93ZXJDYXNlKCkuc3Vic3RyKDAsIDQpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgICAgICAgICAgICByZXN1bHQuZGlzcGxheVByZXZpZXdPcHQgPSAnWCc7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdndHMnOlxuICAgICAgICAgICAgICAgICAgcmVzdWx0LmRpc3BsYXlQcmV2aWV3T3B0ID0gJ0cnO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW1hZyc6XG4gICAgICAgICAgICAgICAgICByZXN1bHQuZGlzcGxheVByZXZpZXdPcHQgPSAnSSc7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgcmVzdWx0LmRpc3BsYXlQcmV2aWV3T3B0ID0gJyc7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGwgPiAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm8gbW9yZSBjb21tZW50cyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaWxlLiB0d28gZmlyc3QgbGluZXMgY291bGQgYmUgZW1wdHlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19