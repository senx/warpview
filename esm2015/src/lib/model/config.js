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
export class Config {
    constructor() {
        this.buttons = {
            class: ''
        };
        this.execButton = {
            class: '',
            label: 'Execute'
        };
        this.datavizButton = {
            class: '',
            label: 'Visualize'
        };
        this.hover = true;
        this.readOnly = false;
        this.messageClass = '';
        this.errorClass = '';
        this.editor = {
            quickSuggestionsDelay: 10,
            quickSuggestions: true,
            tabSize: 2,
            minLineNumber: 10,
            enableDebug: false,
            rawResultsReadOnly: true
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycHZpZXctZWRpdG9yL3Byb2plY3RzL3dhcnB2aWV3LWVkaXRvci1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvbW9kZWwvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBS0gsTUFBTSxPQUFPLE1BQU07SUFBbkI7UUFDRSxZQUFPLEdBQWtCO1lBQ3ZCLEtBQUssRUFBRSxFQUFFO1NBQ1YsQ0FBQztRQUNGLGVBQVUsR0FBa0I7WUFDMUIsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDO1FBQ0Ysa0JBQWEsR0FBa0I7WUFDN0IsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFLLEVBQUUsV0FBVztTQUNuQixDQUFDO1FBQ0YsVUFBSyxHQUFJLElBQUksQ0FBQztRQUNkLGFBQVEsR0FBSSxLQUFLLENBQUM7UUFDbEIsaUJBQVksR0FBSSxFQUFFLENBQUM7UUFDbkIsZUFBVSxHQUFJLEVBQUUsQ0FBQztRQUNqQixXQUFNLEdBQWlCO1lBQ3JCLHFCQUFxQixFQUFFLEVBQUU7WUFDekIsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixPQUFPLEVBQUUsQ0FBQztZQUNWLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQztJQUNKLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7QnV0dG9uQ29uZmlnfSBmcm9tICcuL2J1dHRvbkNvbmZpZyc7XG5pbXBvcnQge0VkaXRvckNvbmZpZ30gZnJvbSAnLi9lZGl0b3JDb25maWcnO1xuXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcbiAgYnV0dG9ucz86IEJ1dHRvbkNvbmZpZyA9IHtcbiAgICBjbGFzczogJydcbiAgfTtcbiAgZXhlY0J1dHRvbj86IEJ1dHRvbkNvbmZpZyA9IHtcbiAgICBjbGFzczogJycsXG4gICAgbGFiZWw6ICdFeGVjdXRlJ1xuICB9O1xuICBkYXRhdml6QnV0dG9uPzogQnV0dG9uQ29uZmlnID0ge1xuICAgIGNsYXNzOiAnJyxcbiAgICBsYWJlbDogJ1Zpc3VhbGl6ZSdcbiAgfTtcbiAgaG92ZXI/ID0gdHJ1ZTtcbiAgcmVhZE9ubHk/ID0gZmFsc2U7XG4gIG1lc3NhZ2VDbGFzcz8gPSAnJztcbiAgZXJyb3JDbGFzcz8gPSAnJztcbiAgZWRpdG9yOiBFZGl0b3JDb25maWcgPSB7XG4gICAgcXVpY2tTdWdnZXN0aW9uc0RlbGF5OiAxMCxcbiAgICBxdWlja1N1Z2dlc3Rpb25zOiB0cnVlLFxuICAgIHRhYlNpemU6IDIsXG4gICAgbWluTGluZU51bWJlcjogMTAsXG4gICAgZW5hYmxlRGVidWc6IGZhbHNlLFxuICAgIHJhd1Jlc3VsdHNSZWFkT25seTogdHJ1ZVxuICB9O1xufVxuIl19