/*
 *  Copyright 2020  SenX S.A.S.
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
 *
 */
// @dynamic
export class ChartLib {
    static mergeDeep(base, extended) {
        const obj = Object.assign({}, base);
        for (const prop in extended || {}) {
            // If property is an object, merge properties
            if (Object.prototype.toString.call(extended[prop]) === '[object Object]') {
                obj[prop] = ChartLib.mergeDeep(obj[prop], extended[prop]);
            }
            else {
                obj[prop] = extended[prop];
            }
        }
        return obj;
    }
}
ChartLib.DEFAULT_WIDTH = 640;
ChartLib.DEFAULT_HEIGHT = 480;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtbGliLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycC12aWV3L3Byb2plY3RzL3dhcnB2aWV3LW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi91dGlscy9jaGFydC1saWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsV0FBVztBQUNYLE1BQU0sT0FBTyxRQUFRO0lBS25CLE1BQU0sQ0FBQyxTQUFTLENBQUksSUFBTyxFQUFFLFFBQWE7UUFDeEMsTUFBTSxHQUFHLEdBQUcsa0JBQUssSUFBSSxDQUFNLENBQUM7UUFDNUIsS0FBSyxNQUFNLElBQUksSUFBSSxRQUFRLElBQUksRUFBRSxFQUFFO1lBQ2pDLDZDQUE2QztZQUM3QyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxpQkFBaUIsRUFBRTtnQkFDeEUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzlEO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDNUI7U0FDRjtRQUNELE9BQU8sR0FBUSxDQUFDO0lBQ2xCLENBQUM7O0FBZE0sc0JBQWEsR0FBRyxHQUFHLENBQUM7QUFDcEIsdUJBQWMsR0FBRyxHQUFHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbi8vIEBkeW5hbWljXG5leHBvcnQgY2xhc3MgQ2hhcnRMaWIge1xuXG4gIHN0YXRpYyBERUZBVUxUX1dJRFRIID0gNjQwO1xuICBzdGF0aWMgREVGQVVMVF9IRUlHSFQgPSA0ODA7XG5cbiAgc3RhdGljIG1lcmdlRGVlcDxUPihiYXNlOiBULCBleHRlbmRlZDogYW55KSB7XG4gICAgY29uc3Qgb2JqID0gey4uLiBiYXNlfSBhcyBUO1xuICAgIGZvciAoY29uc3QgcHJvcCBpbiBleHRlbmRlZCB8fCB7fSkge1xuICAgICAgLy8gSWYgcHJvcGVydHkgaXMgYW4gb2JqZWN0LCBtZXJnZSBwcm9wZXJ0aWVzXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4dGVuZGVkW3Byb3BdKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgb2JqW3Byb3BdID0gQ2hhcnRMaWIubWVyZ2VEZWVwPFQ+KG9ialtwcm9wXSwgZXh0ZW5kZWRbcHJvcF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW3Byb3BdID0gZXh0ZW5kZWRbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmogYXMgVDtcbiAgfVxufVxuIl19