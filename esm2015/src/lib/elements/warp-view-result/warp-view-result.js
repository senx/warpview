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
import { GTSLib } from '../../model/gts.lib';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { JsonLib } from '../../model/jsonLib';
export class WarpViewResult {
    constructor(gtsLib) {
        this.gtsLib = gtsLib;
        this.theme = 'light';
        this.config = {};
        this.loading = false;
    }
    get result() {
        return this._res;
    }
    ;
    set result(res) {
        this._res = res;
        this._result = new JsonLib().parse(res || '[]', undefined);
        this._resultStr = (this._result || []).map(l => {
            const lstr = JSON.stringify(l);
            if (lstr.startsWith('[') || lstr.startsWith('{')) {
                return lstr;
            }
            else {
                return l;
            }
        });
    }
    isArray(arr) {
        return this.gtsLib.isArray(arr);
    }
}
WarpViewResult.decorators = [
    { type: Component, args: [{
                selector: 'warpview-result',
                template: "<!--\n  ~  Copyright 2020 SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<div [class]=\"'wrapper-result ' + theme\">\n  <div *ngIf=\"_result && isArray(_result)\" [class]=\"theme + ' raw'\">\n    <span *ngFor=\"let line of _resultStr; let index= index; let isFirst = first;\" class=\"line\">\n      <pre class=\"line-num\">{{isFirst? '[TOP]' : index + 1}}</pre>\n      <pre class=\"line-content\" [innerHTML]=\"line\"></pre>\n    </span>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.Emulated,
                styles: ["/*!\n *  Copyright 2020 SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */:host,warpview-result{overflow-y:auto;position:relative}:host .wrapper-result,warpview-result .wrapper-result{width:100%}:host .loader .spinner,warpview-result .loader .spinner{-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite;border:5px solid #f3f3f3;border-radius:50%;border-top-color:#555;bottom:0;height:50px;left:0;margin:auto;overflow:visible;position:fixed;right:0;top:0;width:50px;z-index:999}:host .loader:after,warpview-result .loader:after{background-color:rgba(0,0,0,.3);content:\"\";display:block;height:100%;left:0;position:absolute;top:0;width:100%}:host .wrapper.dark,warpview-result .wrapper.dark{--warp-view-spinner-color:#f3f3f3;background-color:#1e1e1e!important;color:#fff}:host .wrapper.light,warpview-result .wrapper.light{background-color:#fff!important;color:#000}:host .wrapper .loader,warpview-result .wrapper .loader{background-color:rgba(0,0,0,.3);bottom:0;left:0;position:absolute;right:0;top:0;z-index:1}:host .wrapper .loader .spinner,warpview-result .wrapper .loader .spinner{-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite;border-bottom-color:transparent;border-left-color:transparent;border-radius:50%;border-right-color:transparent;border-style:solid;border-top-color:var(--warp-view-spinner-color,#5899da);height:50px;left:calc(50% - 25px);margin:auto;overflow:visible;position:absolute;top:calc(50% - 25px);width:50px;z-index:999}:host .raw,warpview-result .raw{display:flex;flex-flow:column;font-family:Droid Sans Mono,Courier New,monospace,Droid Sans Fallback;font-size:14px;font-weight:400;letter-spacing:0;line-height:19px}:host .raw.light,warpview-result .raw.light{background-color:#fff!important;color:#343a40}:host .raw.light pre,warpview-result .raw.light pre{color:#343a40;font-family:Droid Sans Mono,Courier New,monospace,Droid Sans Fallback;font-size:14px;font-weight:400;height:auto;line-height:19px;min-height:19px;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word}:host .raw.light .line-num,warpview-result .raw.light .line-num{color:#2b91af}:host .raw.dark,warpview-result .raw.dark{background-color:#1e1e1e!important;color:#fff}:host .raw.dark pre,warpview-result .raw.dark pre{color:#fff;font-size:14px;height:auto;line-height:19px;min-height:19px;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word}:host .raw.dark .line-num,warpview-result .raw.dark .line-num{color:#5a5a5a}:host .raw .line,warpview-result .raw .line{display:block;max-width:calc(100% - 4em)}:host .raw .line-num,warpview-result .raw .line-num{float:left;margin:0;padding:.3em .5em .3em .3em;text-align:right;width:4em}:host .raw .line-content,warpview-result .raw .line-content{border-left:1px solid #5a5a5a;display:block;margin:0 0 0 5em;max-width:calc(100% - 4em);padding:.3em .3em .3em 1em}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(1turn)}}@keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}"]
            },] }
];
WarpViewResult.ctorParameters = () => [
    { type: GTSLib }
];
WarpViewResult.propDecorators = {
    theme: [{ type: Input }],
    config: [{ type: Input }],
    loading: [{ type: Input }],
    result: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXJlc3VsdC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnB2aWV3LWVkaXRvci9wcm9qZWN0cy93YXJwdmlldy1lZGl0b3ItbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1yZXN1bHQvd2FycC12aWV3LXJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFRNUMsTUFBTSxPQUFPLGNBQWM7SUEyQnpCLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBekJ6QixVQUFLLEdBQUcsT0FBTyxDQUFDO1FBQ2hCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDcEIsWUFBTyxHQUFHLEtBQUssQ0FBQztJQXdCekIsQ0FBQztJQW5CRCxJQUNJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUFBLENBQUM7SUFFRixJQUFJLE1BQU0sQ0FBQyxHQUFXO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDN0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDaEQsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTTtnQkFDTCxPQUFPLENBQUMsQ0FBQzthQUNWO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBS0QsT0FBTyxDQUFDLEdBQVE7UUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7OztZQXRDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsNmdDQUFzQztnQkFFdEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFFBQVE7O2FBQzFDOzs7WUFUTyxNQUFNOzs7b0JBWVgsS0FBSztxQkFDTCxLQUFLO3NCQUNMLEtBQUs7cUJBS0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi9tb2RlbC9ndHMubGliJztcbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtKc29uTGlifSBmcm9tICcuLi8uLi9tb2RlbC9qc29uTGliJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctcmVzdWx0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1yZXN1bHQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1yZXN1bHQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZFxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1Jlc3VsdCB7XG5cbiAgQElucHV0KCkgdGhlbWUgPSAnbGlnaHQnO1xuICBASW5wdXQoKSBjb25maWc6IG9iamVjdCA9IHt9O1xuICBASW5wdXQoKSBsb2FkaW5nID0gZmFsc2U7XG4gIF9yZXM6IHN0cmluZztcbiAgX3Jlc3VsdDogYW55W107XG4gIF9yZXN1bHRTdHI6IGFueVtdO1xuXG4gIEBJbnB1dCgpXG4gIGdldCByZXN1bHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzO1xuICB9O1xuXG4gIHNldCByZXN1bHQocmVzOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yZXMgPSByZXM7XG4gICAgdGhpcy5fcmVzdWx0ID0gbmV3IEpzb25MaWIoKS5wYXJzZShyZXMgfHwgJ1tdJywgdW5kZWZpbmVkKTtcbiAgICB0aGlzLl9yZXN1bHRTdHIgPSAodGhpcy5fcmVzdWx0IHx8IFtdKS5tYXAobCA9PiB7XG4gICAgICBjb25zdCBsc3RyID0gSlNPTi5zdHJpbmdpZnkobCk7XG4gICAgICBpZiAobHN0ci5zdGFydHNXaXRoKCdbJykgfHwgbHN0ci5zdGFydHNXaXRoKCd7JykpIHtcbiAgICAgICAgcmV0dXJuIGxzdHI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZ3RzTGliOiBHVFNMaWIpIHtcbiAgfVxuXG4gIGlzQXJyYXkoYXJyOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5ndHNMaWIuaXNBcnJheShhcnIpO1xuICB9XG59XG4iXX0=