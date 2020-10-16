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
import { languages } from 'monaco-editor';
var IndentAction = languages.IndentAction;
export class WSLanguageConfiguration {
    getConfiguration() {
        return {
            wordPattern: /[^\s\t]+/,
            comments: {
                lineComment: '//',
                blockComment: ['/**', '*/'],
            },
            brackets: [
                ['{', '}'],
                ['[', ']'],
                ['(', ')'],
                ['<%', '%>'],
                ['<\'', '\'>'],
                ['[[', ']]'],
            ],
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '<%', close: '%>' },
                { open: '[[', close: ']]' },
                { open: ' \'', close: '\'', notIn: ['string', 'comment'] },
                { open: '<\'', close: '\'>' },
                { open: '"', close: '"', notIn: ['string'] },
                { open: '`', close: '`', notIn: ['string', 'comment'] },
                { open: '/**', close: ' */', notIn: ['string'] },
            ],
            surroundingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '[[', close: ']]' },
                { open: '<%', close: '%>' },
                { open: '<\'', close: '\'>' },
                { open: '\'', close: '\'' },
                { open: '"', close: '"' },
                { open: '`', close: '`' },
            ],
            onEnterRules: [
                {
                    // e.g. /** | */
                    beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
                    afterText: /^\s*\*\/$/,
                    action: { indentAction: IndentAction.IndentOutdent, appendText: ' * ' },
                },
                {
                    // e.g. /** ...|
                    beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
                    action: { indentAction: IndentAction.None, appendText: ' * ' },
                },
                {
                    // e.g.  * ...|
                    beforeText: /^(\t|( {2}))* \*( ([^*]|\*(?!\/))*)?$/,
                    action: { indentAction: IndentAction.None, appendText: '* ' },
                },
                {
                    // e.g.  */|
                    beforeText: /^(\t|( {2}))* \*\/\s*$/,
                    action: { indentAction: IndentAction.None, removeText: 1 },
                },
            ],
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV1NMYW5ndWFnZUNvbmZpZ3VyYXRpb24uanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwdmlldy1lZGl0b3IvcHJvamVjdHMvd2FycHZpZXctZWRpdG9yLW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZWRpdG9yL3Byb3ZpZGVycy9XU0xhbmd1YWdlQ29uZmlndXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUdILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsSUFBTyxZQUFZLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztBQUU3QyxNQUFNLE9BQU8sdUJBQXVCO0lBQ2xDLGdCQUFnQjtRQUNkLE9BQU87WUFDTCxXQUFXLEVBQUUsVUFBVTtZQUN2QixRQUFRLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7YUFDNUI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO2dCQUNWLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztnQkFDVixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7Z0JBQ1YsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNaLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztnQkFDZCxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7YUFDYjtZQUNELGdCQUFnQixFQUFFO2dCQUNoQixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDdkIsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUM7Z0JBQ3ZCLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFDO2dCQUN2QixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztnQkFDekIsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7Z0JBQ3pCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsRUFBQztnQkFDeEQsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUM7Z0JBQzNCLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFDO2dCQUMxQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUM7Z0JBQ3JELEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFDO2FBQy9DO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2hCLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFDO2dCQUN2QixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDdkIsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUM7Z0JBQ3ZCLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO2dCQUN6QixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztnQkFDekIsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUM7Z0JBQzNCLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO2dCQUN6QixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDdkIsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUM7YUFDeEI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1o7b0JBQ0UsZ0JBQWdCO29CQUNoQixVQUFVLEVBQUUsbUNBQW1DO29CQUMvQyxTQUFTLEVBQUUsV0FBVztvQkFDdEIsTUFBTSxFQUFFLEVBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQztpQkFDdEU7Z0JBQ0Q7b0JBQ0UsZ0JBQWdCO29CQUNoQixVQUFVLEVBQUUsbUNBQW1DO29CQUMvQyxNQUFNLEVBQUUsRUFBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFDO2lCQUM3RDtnQkFDRDtvQkFDRSxlQUFlO29CQUNmLFVBQVUsRUFBRSx1Q0FBdUM7b0JBQ25ELE1BQU0sRUFBRSxFQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUM7aUJBQzVEO2dCQUNEO29CQUNFLFlBQVk7b0JBQ1osVUFBVSxFQUFFLHdCQUF3QjtvQkFDcEMsTUFBTSxFQUFFLEVBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBQztpQkFDekQ7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbmltcG9ydCB7bGFuZ3VhZ2VzfSBmcm9tICdtb25hY28tZWRpdG9yJztcbmltcG9ydCBJbmRlbnRBY3Rpb24gPSBsYW5ndWFnZXMuSW5kZW50QWN0aW9uO1xuXG5leHBvcnQgY2xhc3MgV1NMYW5ndWFnZUNvbmZpZ3VyYXRpb24ge1xuICBnZXRDb25maWd1cmF0aW9uKCk6IGxhbmd1YWdlcy5MYW5ndWFnZUNvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkUGF0dGVybjogL1teXFxzXFx0XSsvLFxuICAgICAgY29tbWVudHM6IHtcbiAgICAgICAgbGluZUNvbW1lbnQ6ICcvLycsXG4gICAgICAgIGJsb2NrQ29tbWVudDogWycvKionLCAnKi8nXSxcbiAgICAgIH0sXG4gICAgICBicmFja2V0czogW1xuICAgICAgICBbJ3snLCAnfSddLFxuICAgICAgICBbJ1snLCAnXSddLFxuICAgICAgICBbJygnLCAnKSddLFxuICAgICAgICBbJzwlJywgJyU+J10sXG4gICAgICAgIFsnPFxcJycsICdcXCc+J10sXG4gICAgICAgIFsnW1snLCAnXV0nXSxcbiAgICAgIF0sXG4gICAgICBhdXRvQ2xvc2luZ1BhaXJzOiBbXG4gICAgICAgIHtvcGVuOiAneycsIGNsb3NlOiAnfSd9LFxuICAgICAgICB7b3BlbjogJ1snLCBjbG9zZTogJ10nfSxcbiAgICAgICAge29wZW46ICcoJywgY2xvc2U6ICcpJ30sXG4gICAgICAgIHtvcGVuOiAnPCUnLCBjbG9zZTogJyU+J30sXG4gICAgICAgIHtvcGVuOiAnW1snLCBjbG9zZTogJ11dJ30sXG4gICAgICAgIHtvcGVuOiAnIFxcJycsIGNsb3NlOiAnXFwnJywgbm90SW46IFsnc3RyaW5nJywgJ2NvbW1lbnQnXX0sXG4gICAgICAgIHtvcGVuOiAnPFxcJycsIGNsb3NlOiAnXFwnPid9LFxuICAgICAgICB7b3BlbjogJ1wiJywgY2xvc2U6ICdcIicsIG5vdEluOiBbJ3N0cmluZyddfSxcbiAgICAgICAge29wZW46ICdgJywgY2xvc2U6ICdgJywgbm90SW46IFsnc3RyaW5nJywgJ2NvbW1lbnQnXX0sXG4gICAgICAgIHtvcGVuOiAnLyoqJywgY2xvc2U6ICcgKi8nLCBub3RJbjogWydzdHJpbmcnXX0sXG4gICAgICBdLFxuICAgICAgc3Vycm91bmRpbmdQYWlyczogW1xuICAgICAgICB7b3BlbjogJ3snLCBjbG9zZTogJ30nfSxcbiAgICAgICAge29wZW46ICdbJywgY2xvc2U6ICddJ30sXG4gICAgICAgIHtvcGVuOiAnKCcsIGNsb3NlOiAnKSd9LFxuICAgICAgICB7b3BlbjogJ1tbJywgY2xvc2U6ICddXSd9LFxuICAgICAgICB7b3BlbjogJzwlJywgY2xvc2U6ICclPid9LFxuICAgICAgICB7b3BlbjogJzxcXCcnLCBjbG9zZTogJ1xcJz4nfSxcbiAgICAgICAge29wZW46ICdcXCcnLCBjbG9zZTogJ1xcJyd9LFxuICAgICAgICB7b3BlbjogJ1wiJywgY2xvc2U6ICdcIid9LFxuICAgICAgICB7b3BlbjogJ2AnLCBjbG9zZTogJ2AnfSxcbiAgICAgIF0sXG4gICAgICBvbkVudGVyUnVsZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIC8vIGUuZy4gLyoqIHwgKi9cbiAgICAgICAgICBiZWZvcmVUZXh0OiAvXlxccypcXC9cXCpcXCooPyFcXC8pKFteKl18XFwqKD8hXFwvKSkqJC8sXG4gICAgICAgICAgYWZ0ZXJUZXh0OiAvXlxccypcXCpcXC8kLyxcbiAgICAgICAgICBhY3Rpb246IHtpbmRlbnRBY3Rpb246IEluZGVudEFjdGlvbi5JbmRlbnRPdXRkZW50LCBhcHBlbmRUZXh0OiAnICogJ30sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBlLmcuIC8qKiAuLi58XG4gICAgICAgICAgYmVmb3JlVGV4dDogL15cXHMqXFwvXFwqXFwqKD8hXFwvKShbXipdfFxcKig/IVxcLykpKiQvLFxuICAgICAgICAgIGFjdGlvbjoge2luZGVudEFjdGlvbjogSW5kZW50QWN0aW9uLk5vbmUsIGFwcGVuZFRleHQ6ICcgKiAnfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIC8vIGUuZy4gICogLi4ufFxuICAgICAgICAgIGJlZm9yZVRleHQ6IC9eKFxcdHwoIHsyfSkpKiBcXCooIChbXipdfFxcKig/IVxcLykpKik/JC8sXG4gICAgICAgICAgYWN0aW9uOiB7aW5kZW50QWN0aW9uOiBJbmRlbnRBY3Rpb24uTm9uZSwgYXBwZW5kVGV4dDogJyogJ30sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBlLmcuICAqL3xcbiAgICAgICAgICBiZWZvcmVUZXh0OiAvXihcXHR8KCB7Mn0pKSogXFwqXFwvXFxzKiQvLFxuICAgICAgICAgIGFjdGlvbjoge2luZGVudEFjdGlvbjogSW5kZW50QWN0aW9uLk5vbmUsIHJlbW92ZVRleHQ6IDF9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=