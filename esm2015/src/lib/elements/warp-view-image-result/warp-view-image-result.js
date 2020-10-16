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
import { Logger } from '../../model/logger';
import { JsonLib } from '../../model/jsonLib';
export class WarpViewImageResult {
    constructor(gtsLib) {
        this.gtsLib = gtsLib;
        this.config = {};
        // tslint:disable-next-line:variable-name
        this._theme = 'light';
        // tslint:disable-next-line:variable-name
        this._debug = false;
        this.loading = false;
        this.imageList = [];
        this.LOG = new Logger(WarpViewImageResult, this._debug);
    }
    set debug(debug) {
        if (typeof debug === 'string') {
            debug = 'true' === debug;
        }
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set result(res) {
        this._res = res;
        this._result = new JsonLib().parse(res || '[]', undefined);
        this.loading = true;
        this.LOG.debug(['isArray'], 'The new value of result is: ', res);
        if (res && this.gtsLib.isArray(this._result)) {
            this.imageList = this._result.filter((v) => {
                return ((typeof (v) === 'string') && (String(v).startsWith('data:image/png;base64,')));
            });
        }
        else {
            this.imageList = [];
        }
        this.loading = false;
    }
    get result() {
        return this._res;
    }
    set theme(newValue) {
        this._theme = newValue;
    }
    get theme() {
        return this._theme;
    }
    isArray(arr) {
        return this.gtsLib.isArray(arr);
    }
}
WarpViewImageResult.decorators = [
    { type: Component, args: [{
                selector: 'warpview-image-result',
                template: "<!--\n  ~  Copyright 2020 SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n<div [class]=\"'wrapper-result ' + _theme\">\n  <div *ngIf=\"_result && isArray(_result)\" [class]=\"_theme + ' image'\">\n    <div *ngFor=\"let img of imageList; let i = index\" class=\"image\"><h2>Image {{i + 1}}</h2>\n      <img [src]=\"img\" alt=\"Image\"/>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.Emulated,
                styles: ["/*!\n *  Copyright 2020 SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */:host .wrapper-result{padding:10px}:host img{background-color:#fff;background-image:linear-gradient(45deg,#efefef 25%,transparent 0,transparent 75%,#efefef 0,#efefef),linear-gradient(45deg,#efefef 25%,transparent 0,transparent 75%,#efefef 0,#efefef);background-position:0 0,10px 10px;background-size:21px 21px;border:1.1px solid var(--warp-view-image-border-color,#404040)}"]
            },] }
];
WarpViewImageResult.ctorParameters = () => [
    { type: GTSLib }
];
WarpViewImageResult.propDecorators = {
    debug: [{ type: Input }],
    result: [{ type: Input }],
    theme: [{ type: Input }],
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWltYWdlLXJlc3VsdC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnB2aWV3LWVkaXRvci9wcm9qZWN0cy93YXJwdmlldy1lZGl0b3ItbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1pbWFnZS1yZXN1bHQvd2FycC12aWV3LWltYWdlLXJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBUTVDLE1BQU0sT0FBTyxtQkFBbUI7SUF1RDlCLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBZHpCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFNN0IseUNBQXlDO1FBQ3pDLFdBQU0sR0FBRyxPQUFPLENBQUM7UUFDakIseUNBQXlDO1FBQ3pDLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGNBQVMsR0FBYSxFQUFFLENBQUM7UUFJdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQXZERCxJQUFhLEtBQUssQ0FBQyxLQUF1QjtRQUN4QyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixLQUFLLEdBQUcsTUFBTSxLQUFLLEtBQUssQ0FBQztTQUMxQjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVELElBQWEsTUFBTSxDQUFDLEdBQVc7UUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsOEJBQThCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakUsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRTtnQkFDOUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RixDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUNyQjtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQWEsS0FBSyxDQUFDLFFBQWdCO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQW9CRCxPQUFPLENBQUMsR0FBUTtRQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7O1lBbkVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxnN0JBQTRDO2dCQUU1QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsUUFBUTs7YUFDMUM7OztZQVZPLE1BQU07OztvQkFhWCxLQUFLO3FCQVlMLEtBQUs7b0JBbUJMLEtBQUs7cUJBUUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi9tb2RlbC9ndHMubGliJztcbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL21vZGVsL2xvZ2dlcic7XG5pbXBvcnQge0pzb25MaWJ9IGZyb20gJy4uLy4uL21vZGVsL2pzb25MaWInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1pbWFnZS1yZXN1bHQnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWltYWdlLXJlc3VsdC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWltYWdlLXJlc3VsdC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3SW1hZ2VSZXN1bHQge1xuXG4gIEBJbnB1dCgpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgZGVidWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBkZWJ1ZyA9ICd0cnVlJyA9PT0gZGVidWc7XG4gICAgfVxuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCByZXN1bHQocmVzOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yZXMgPSByZXM7XG4gICAgdGhpcy5fcmVzdWx0ID0gbmV3IEpzb25MaWIoKS5wYXJzZShyZXMgfHwgJ1tdJywgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaXNBcnJheSddLCAnVGhlIG5ldyB2YWx1ZSBvZiByZXN1bHQgaXM6ICcsIHJlcyk7XG4gICAgaWYgKHJlcyAmJiB0aGlzLmd0c0xpYi5pc0FycmF5KHRoaXMuX3Jlc3VsdCkpIHtcbiAgICAgIHRoaXMuaW1hZ2VMaXN0ID0gdGhpcy5fcmVzdWx0LmZpbHRlcigodjogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiAoKHR5cGVvZiAodikgPT09ICdzdHJpbmcnKSAmJiAoU3RyaW5nKHYpLnN0YXJ0c1dpdGgoJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnKSkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW1hZ2VMaXN0ID0gW107XG4gICAgfVxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IHJlc3VsdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yZXM7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgdGhlbWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3RoZW1lID0gbmV3VmFsdWU7XG4gIH1cblxuICBnZXQgdGhlbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdGhlbWU7XG4gIH1cblxuICBASW5wdXQoKSBjb25maWc6IG9iamVjdCA9IHt9O1xuXG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgX3Jlc3VsdDogYW55W107XG4gIF9yZXM6IHN0cmluZztcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgX3RoZW1lID0gJ2xpZ2h0JztcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgX2RlYnVnID0gZmFsc2U7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgaW1hZ2VMaXN0OiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZ3RzTGliOiBHVFNMaWIpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdJbWFnZVJlc3VsdCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgaXNBcnJheShhcnI6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmd0c0xpYi5pc0FycmF5KGFycik7XG4gIH1cbn1cbiJdfQ==