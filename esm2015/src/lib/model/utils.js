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
export class Utils {
    static mergeDeep(...sources) {
        // Variables
        const extended = {};
        const deep = true;
        let i = 0;
        // Merge the object into the extended object
        // Loop through each object and conduct a merge
        for (; i < sources.length; i++) {
            const obj = sources[i];
            Utils.merge(obj, extended, deep);
        }
        return extended;
    }
    static merge(obj, extended, deep) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                // If property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = Utils.mergeDeep(extended[prop], obj[prop]);
                }
                else {
                    extended[prop] = obj[prop];
                }
            }
        }
    }
    static toArray(obj) {
        const arr = [];
        Object.keys(obj).forEach(k => arr.push(obj[k]));
        return arr;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwdmlldy1lZGl0b3IvcHJvamVjdHMvd2FycHZpZXctZWRpdG9yLW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9tb2RlbC91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILE1BQU0sT0FBTyxLQUFLO0lBRWhCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFjO1FBQ2hDLFlBQVk7UUFDWixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLDRDQUE0QztRQUM1QywrQ0FBK0M7UUFDL0MsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBUSxFQUFFLFFBQWEsRUFBRSxJQUFhO1FBQ2pELEtBQUssTUFBTSxJQUFJLElBQUksR0FBRyxFQUFFO1lBQ3RCLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDNUIsNkNBQTZDO2dCQUM3QyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssaUJBQWlCLEVBQUU7b0JBQzNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDN0Q7cUJBQU07b0JBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDNUI7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBUTtRQUNyQixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjbGFzcyBVdGlscyB7XG5cbiAgc3RhdGljIG1lcmdlRGVlcCguLi5zb3VyY2VzOiBhbnlbXSk6IGFueSB7XG4gICAgLy8gVmFyaWFibGVzXG4gICAgY29uc3QgZXh0ZW5kZWQgPSB7fTtcbiAgICBjb25zdCBkZWVwID0gdHJ1ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgLy8gTWVyZ2UgdGhlIG9iamVjdCBpbnRvIHRoZSBleHRlbmRlZCBvYmplY3RcbiAgICAvLyBMb29wIHRocm91Z2ggZWFjaCBvYmplY3QgYW5kIGNvbmR1Y3QgYSBtZXJnZVxuICAgIGZvciAoOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgb2JqID0gc291cmNlc1tpXTtcbiAgICAgIFV0aWxzLm1lcmdlKG9iaiwgZXh0ZW5kZWQsIGRlZXApO1xuICAgIH1cblxuICAgIHJldHVybiBleHRlbmRlZDtcbiAgfVxuXG4gIHN0YXRpYyBtZXJnZShvYmo6IGFueSwgZXh0ZW5kZWQ6IGFueSwgZGVlcDogYm9vbGVhbikge1xuICAgIGZvciAoY29uc3QgcHJvcCBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgLy8gSWYgcHJvcGVydHkgaXMgYW4gb2JqZWN0LCBtZXJnZSBwcm9wZXJ0aWVzXG4gICAgICAgIGlmIChkZWVwICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmpbcHJvcF0pID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgICAgIGV4dGVuZGVkW3Byb3BdID0gVXRpbHMubWVyZ2VEZWVwKGV4dGVuZGVkW3Byb3BdLCBvYmpbcHJvcF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4dGVuZGVkW3Byb3BdID0gb2JqW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRvQXJyYXkob2JqOiBhbnkpOiBhbnlbXSB7XG4gICAgY29uc3QgYXJyID0gW107XG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGsgPT4gYXJyLnB1c2gob2JqW2tdKSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxufVxuIl19