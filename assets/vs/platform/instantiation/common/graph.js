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
import { isEmptyObject } from '../../../base/common/types.js';
import { forEach } from '../../../base/common/collections.js';
function newNode(data) {
    return {
        data: data,
        incoming: Object.create(null),
        outgoing: Object.create(null)
    };
}
var Graph = /** @class */ (function () {
    function Graph(_hashFn) {
        this._hashFn = _hashFn;
        this._nodes = Object.create(null);
        // empty
    }
    Graph.prototype.roots = function () {
        var ret = [];
        forEach(this._nodes, function (entry) {
            if (isEmptyObject(entry.value.outgoing)) {
                ret.push(entry.value);
            }
        });
        return ret;
    };
    Graph.prototype.insertEdge = function (from, to) {
        var fromNode = this.lookupOrInsertNode(from), toNode = this.lookupOrInsertNode(to);
        fromNode.outgoing[this._hashFn(to)] = toNode;
        toNode.incoming[this._hashFn(from)] = fromNode;
    };
    Graph.prototype.removeNode = function (data) {
        var key = this._hashFn(data);
        delete this._nodes[key];
        forEach(this._nodes, function (entry) {
            delete entry.value.outgoing[key];
            delete entry.value.incoming[key];
        });
    };
    Graph.prototype.lookupOrInsertNode = function (data) {
        var key = this._hashFn(data);
        var node = this._nodes[key];
        if (!node) {
            node = newNode(data);
            this._nodes[key] = node;
        }
        return node;
    };
    Graph.prototype.isEmpty = function () {
        for (var _key in this._nodes) {
            return false;
        }
        return true;
    };
    Graph.prototype.toString = function () {
        var data = [];
        forEach(this._nodes, function (entry) {
            data.push(entry.key + ", (incoming)[" + Object.keys(entry.value.incoming).join(', ') + "], (outgoing)[" + Object.keys(entry.value.outgoing).join(',') + "]");
        });
        return data.join('\n');
    };
    return Graph;
}());
export { Graph };
