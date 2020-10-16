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
import { Range } from 'monaco-editor';
export class W10HoverProvider {
    constructor(languageId) {
        this.languageId = languageId;
    }
    // noinspection JSUnusedLocalSymbols
    _provideHover(model, position, token, provider) {
        const word = model.getWordAtPosition(position);
        if (!!word) {
            const range = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
            const name = word.word;
            const entry = provider[name];
            if (entry && entry.description) {
                const signature = (entry.signature || '').split('\n').map(s => '+ ' + s).join('\n');
                const contents = [
                    { value: '### ' + name },
                    { value: signature },
                    { value: entry.description.replace(/(\/doc\/\w+)/g, x => `https://www.warp10.io${x}`) }
                ];
                return { range, contents: W10HoverProvider.toMarkedStringArray(contents) };
            }
        }
        return undefined;
    }
    static toMarkedStringArray(contents) {
        if (!contents) {
            return void 0;
        }
        if (Array.isArray(contents)) {
            return contents.map(W10HoverProvider.toMarkdownString);
        }
        return [W10HoverProvider.toMarkdownString(contents)];
    }
    static toMarkdownString(entry) {
        if (typeof entry === 'string') {
            return { value: entry };
        }
        return { value: entry.value };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVzEwSG92ZXJQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnB2aWV3LWVkaXRvci9wcm9qZWN0cy93YXJwdmlldy1lZGl0b3ItbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1lZGl0b3IvcHJvdmlkZXJzL1cxMEhvdmVyUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFSCxPQUFPLEVBQWtFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUtyRyxNQUFNLE9BQWdCLGdCQUFnQjtJQUdwQyxZQUFZLFVBQWtCO1FBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFJRCxvQ0FBb0M7SUFDcEMsYUFBYSxDQUFDLEtBQXdCLEVBQUUsUUFBa0IsRUFBRSxLQUF3QixFQUFFLFFBQWE7UUFDakcsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRTtZQUNWLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO2dCQUM5QixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BGLE1BQU0sUUFBUSxHQUFzQjtvQkFDbEMsRUFBQyxLQUFLLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBQztvQkFDdEIsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFDO29CQUNsQixFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsRUFBQztpQkFDdEYsQ0FBQztnQkFDRixPQUFPLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsRUFBVSxDQUFDO2FBQ25GO1NBQ0Y7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRVMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQTJCO1FBQzlELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixPQUFPLEtBQUssQ0FBQyxDQUFDO1NBQ2Y7UUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDM0IsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDeEQ7UUFDRCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQXNCO1FBQ3BELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDdkI7UUFDRCxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUMsQ0FBQztJQUM5QixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge0NhbmNlbGxhdGlvblRva2VuLCBlZGl0b3IsIElNYXJrZG93blN0cmluZywgbGFuZ3VhZ2VzLCBQb3NpdGlvbiwgUmFuZ2V9IGZyb20gJ21vbmFjby1lZGl0b3InO1xuaW1wb3J0IEhvdmVyUHJvdmlkZXIgPSBsYW5ndWFnZXMuSG92ZXJQcm92aWRlcjtcbmltcG9ydCBIb3ZlciA9IGxhbmd1YWdlcy5Ib3ZlcjtcbmltcG9ydCBQcm92aWRlclJlc3VsdCA9IGxhbmd1YWdlcy5Qcm92aWRlclJlc3VsdDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFcxMEhvdmVyUHJvdmlkZXIgaW1wbGVtZW50cyBIb3ZlclByb3ZpZGVyIHtcbiAgbGFuZ3VhZ2VJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGxhbmd1YWdlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubGFuZ3VhZ2VJZCA9IGxhbmd1YWdlSWQ7XG4gIH1cblxuICBhYnN0cmFjdCBwcm92aWRlSG92ZXIobW9kZWw6IGVkaXRvci5JVGV4dE1vZGVsLCBwb3NpdGlvbjogUG9zaXRpb24sIHRva2VuOiBDYW5jZWxsYXRpb25Ub2tlbik6IGxhbmd1YWdlcy5Qcm92aWRlclJlc3VsdDxsYW5ndWFnZXMuSG92ZXI+O1xuXG4gIC8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZExvY2FsU3ltYm9sc1xuICBfcHJvdmlkZUhvdmVyKG1vZGVsOiBlZGl0b3IuSVRleHRNb2RlbCwgcG9zaXRpb246IFBvc2l0aW9uLCB0b2tlbjogQ2FuY2VsbGF0aW9uVG9rZW4sIHByb3ZpZGVyOiBhbnkpOiBQcm92aWRlclJlc3VsdDxIb3Zlcj4ge1xuICAgIGNvbnN0IHdvcmQgPSBtb2RlbC5nZXRXb3JkQXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgaWYgKCEhd29yZCkge1xuICAgICAgY29uc3QgcmFuZ2UgPSBuZXcgUmFuZ2UocG9zaXRpb24ubGluZU51bWJlciwgd29yZC5zdGFydENvbHVtbiwgcG9zaXRpb24ubGluZU51bWJlciwgd29yZC5lbmRDb2x1bW4pO1xuICAgICAgY29uc3QgbmFtZSA9IHdvcmQud29yZDtcbiAgICAgIGNvbnN0IGVudHJ5ID0gcHJvdmlkZXJbbmFtZV07XG4gICAgICBpZiAoZW50cnkgJiYgZW50cnkuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gKGVudHJ5LnNpZ25hdHVyZSB8fCAnJykuc3BsaXQoJ1xcbicpLm1hcChzID0+ICcrICcgKyBzKS5qb2luKCdcXG4nKTtcbiAgICAgICAgY29uc3QgY29udGVudHM6IElNYXJrZG93blN0cmluZ1tdID0gW1xuICAgICAgICAgIHt2YWx1ZTogJyMjIyAnICsgbmFtZX0sXG4gICAgICAgICAge3ZhbHVlOiBzaWduYXR1cmV9LFxuICAgICAgICAgIHt2YWx1ZTogZW50cnkuZGVzY3JpcHRpb24ucmVwbGFjZSgvKFxcL2RvY1xcL1xcdyspL2csIHggPT4gYGh0dHBzOi8vd3d3LndhcnAxMC5pbyR7eH1gKX1cbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIHtyYW5nZSwgY29udGVudHM6IFcxMEhvdmVyUHJvdmlkZXIudG9NYXJrZWRTdHJpbmdBcnJheShjb250ZW50cyl9IGFzIEhvdmVyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyB0b01hcmtlZFN0cmluZ0FycmF5KGNvbnRlbnRzOiBJTWFya2Rvd25TdHJpbmdbXSk6IElNYXJrZG93blN0cmluZ1tdIHtcbiAgICBpZiAoIWNvbnRlbnRzKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb250ZW50cykpIHtcbiAgICAgIHJldHVybiBjb250ZW50cy5tYXAoVzEwSG92ZXJQcm92aWRlci50b01hcmtkb3duU3RyaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIFtXMTBIb3ZlclByb3ZpZGVyLnRvTWFya2Rvd25TdHJpbmcoY29udGVudHMpXTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHRvTWFya2Rvd25TdHJpbmcoZW50cnk6IElNYXJrZG93blN0cmluZyk6IElNYXJrZG93blN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB7dmFsdWU6IGVudHJ5fTtcbiAgICB9XG4gICAgcmV0dXJuIHt2YWx1ZTogZW50cnkudmFsdWV9O1xuICB9XG59XG4iXX0=