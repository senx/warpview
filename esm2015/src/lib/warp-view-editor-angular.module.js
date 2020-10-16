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
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { WarpViewEditorComponent } from './elements/warp-view-editor/warp-view-editor.component';
import { WarpViewImageResult } from './elements/warp-view-image-result/warp-view-image-result';
import { WarpViewRawResultComponent } from './elements/warp-view-raw-result/warp-view-raw-result.component';
import { WarpViewResult } from './elements/warp-view-result/warp-view-result';
import { BrowserModule } from '@angular/platform-browser';
import { GTSLib } from './model/gts.lib';
export class WarpViewEditorAngularModule {
}
WarpViewEditorAngularModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    WarpViewEditorComponent,
                    WarpViewImageResult,
                    WarpViewResult,
                    WarpViewRawResultComponent
                ],
                imports: [
                    CommonModule,
                    BrowserModule,
                    HttpClientModule,
                    FormsModule
                ],
                exports: [
                    WarpViewEditorComponent,
                    WarpViewImageResult,
                    WarpViewResult,
                    WarpViewRawResultComponent
                ],
                providers: [GTSLib],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                entryComponents: [
                    WarpViewEditorComponent,
                    WarpViewImageResult,
                    WarpViewResult,
                    WarpViewRawResultComponent
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWVkaXRvci1hbmd1bGFyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnB2aWV3LWVkaXRvci9wcm9qZWN0cy93YXJwdmlldy1lZGl0b3ItbmcvIiwic291cmNlcyI6WyJzcmMvbGliL3dhcnAtdmlldy1lZGl0b3ItYW5ndWxhci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLHNCQUFzQixFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLHdEQUF3RCxDQUFDO0FBQy9GLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBEQUEwRCxDQUFDO0FBQzdGLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGdFQUFnRSxDQUFDO0FBQzFHLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUM1RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDeEQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBOEJ2QyxNQUFNLE9BQU8sMkJBQTJCOzs7WUE1QnZDLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUU7b0JBQ1osdUJBQXVCO29CQUN2QixtQkFBbUI7b0JBQ25CLGNBQWM7b0JBQ2QsMEJBQTBCO2lCQUMzQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixhQUFhO29CQUNiLGdCQUFnQjtvQkFDaEIsV0FBVztpQkFDWjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsdUJBQXVCO29CQUN2QixtQkFBbUI7b0JBQ25CLGNBQWM7b0JBQ2QsMEJBQTBCO2lCQUMzQjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2dCQUNqQyxlQUFlLEVBQUU7b0JBQ2YsdUJBQXVCO29CQUN2QixtQkFBbUI7b0JBQ25CLGNBQWM7b0JBQ2QsMEJBQTBCO2lCQUMzQjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NVU1RPTV9FTEVNRU5UU19TQ0hFTUEsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1dhcnBWaWV3RWRpdG9yQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1lZGl0b3Ivd2FycC12aWV3LWVkaXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0ltYWdlUmVzdWx0fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1pbWFnZS1yZXN1bHQvd2FycC12aWV3LWltYWdlLXJlc3VsdCc7XG5pbXBvcnQge1dhcnBWaWV3UmF3UmVzdWx0Q29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1yYXctcmVzdWx0L3dhcnAtdmlldy1yYXctcmVzdWx0LmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3UmVzdWx0fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1yZXN1bHQvd2FycC12aWV3LXJlc3VsdCc7XG5pbXBvcnQge0Jyb3dzZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4vbW9kZWwvZ3RzLmxpYic7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFdhcnBWaWV3RWRpdG9yQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3SW1hZ2VSZXN1bHQsXG4gICAgV2FycFZpZXdSZXN1bHQsXG4gICAgV2FycFZpZXdSYXdSZXN1bHRDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBCcm93c2VyTW9kdWxlLFxuICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgRm9ybXNNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFdhcnBWaWV3RWRpdG9yQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3SW1hZ2VSZXN1bHQsXG4gICAgV2FycFZpZXdSZXN1bHQsXG4gICAgV2FycFZpZXdSYXdSZXN1bHRDb21wb25lbnRcbiAgXSxcbiAgcHJvdmlkZXJzOiBbR1RTTGliXSxcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICBXYXJwVmlld0VkaXRvckNvbXBvbmVudCxcbiAgICBXYXJwVmlld0ltYWdlUmVzdWx0LFxuICAgIFdhcnBWaWV3UmVzdWx0LFxuICAgIFdhcnBWaWV3UmF3UmVzdWx0Q29tcG9uZW50XG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3RWRpdG9yQW5ndWxhck1vZHVsZSB7XG59XG4iXX0=