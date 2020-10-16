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
export class EditorUtils {
    static formatElapsedTime(elapsed) {
        if (elapsed < 1000) {
            return elapsed.toFixed(3) + ' ns';
        }
        if (elapsed < 1000000) {
            return (elapsed / 1000).toFixed(3) + ' μs';
        }
        if (elapsed < 1000000000) {
            return (elapsed / 1000000).toFixed(3) + ' ms';
        }
        if (elapsed < 1000000000000) {
            return (elapsed / 1000000000).toFixed(3) + ' s ';
        }
        // Max exec time for nice output: 999.999 minutes (should be OK, timeout should happen before that).
        return (elapsed / 60000000000).toFixed(3) + ' m ';
    }
}
EditorUtils.WARPSCRIPT_LANGUAGE = 'warpscript';
EditorUtils.FLOWS_LANGUAGE = 'flows';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yVXRpbHMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwdmlldy1lZGl0b3IvcHJvamVjdHMvd2FycHZpZXctZWRpdG9yLW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZWRpdG9yL3Byb3ZpZGVycy9lZGl0b3JVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILE1BQU0sT0FBTyxXQUFXO0lBSXRCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFlO1FBQ3RDLElBQUksT0FBTyxHQUFHLElBQUksRUFBRTtZQUNsQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxPQUFPLEdBQUcsT0FBTyxFQUFFO1lBQ3JCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUM1QztRQUNELElBQUksT0FBTyxHQUFHLFVBQVUsRUFBRTtZQUN4QixPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDL0M7UUFDRCxJQUFJLE9BQU8sR0FBRyxhQUFhLEVBQUU7WUFDM0IsT0FBTyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ2xEO1FBQ0Qsb0dBQW9HO1FBQ3BHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUNwRCxDQUFDOztBQWxCTSwrQkFBbUIsR0FBRyxZQUFZLENBQUM7QUFDbkMsMEJBQWMsR0FBRyxPQUFPLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY2xhc3MgRWRpdG9yVXRpbHMge1xuICBzdGF0aWMgV0FSUFNDUklQVF9MQU5HVUFHRSA9ICd3YXJwc2NyaXB0JztcbiAgc3RhdGljIEZMT1dTX0xBTkdVQUdFID0gJ2Zsb3dzJztcblxuICBzdGF0aWMgZm9ybWF0RWxhcHNlZFRpbWUoZWxhcHNlZDogbnVtYmVyKSB7XG4gICAgaWYgKGVsYXBzZWQgPCAxMDAwKSB7XG4gICAgICByZXR1cm4gZWxhcHNlZC50b0ZpeGVkKDMpICsgJyBucyc7XG4gICAgfVxuICAgIGlmIChlbGFwc2VkIDwgMTAwMDAwMCkge1xuICAgICAgcmV0dXJuIChlbGFwc2VkIC8gMTAwMCkudG9GaXhlZCgzKSArICcgzrxzJztcbiAgICB9XG4gICAgaWYgKGVsYXBzZWQgPCAxMDAwMDAwMDAwKSB7XG4gICAgICByZXR1cm4gKGVsYXBzZWQgLyAxMDAwMDAwKS50b0ZpeGVkKDMpICsgJyBtcyc7XG4gICAgfVxuICAgIGlmIChlbGFwc2VkIDwgMTAwMDAwMDAwMDAwMCkge1xuICAgICAgcmV0dXJuIChlbGFwc2VkIC8gMTAwMDAwMDAwMCkudG9GaXhlZCgzKSArICcgcyAnO1xuICAgIH1cbiAgICAvLyBNYXggZXhlYyB0aW1lIGZvciBuaWNlIG91dHB1dDogOTk5Ljk5OSBtaW51dGVzIChzaG91bGQgYmUgT0ssIHRpbWVvdXQgc2hvdWxkIGhhcHBlbiBiZWZvcmUgdGhhdCkuXG4gICAgcmV0dXJuIChlbGFwc2VkIC8gNjAwMDAwMDAwMDApLnRvRml4ZWQoMykgKyAnIG0gJztcbiAgfVxufVxuIl19