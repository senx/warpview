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

// Common data transfers
export var DataTransfers = {
    /**
     * Application specific resource transfer type
     */
    RESOURCES: 'ResourceURLs',
    /**
     * Browser specific transfer type to download
     */
    DOWNLOAD_URL: 'DownloadURL',
    /**
     * Browser specific transfer type for files
     */
    FILES: 'Files',
    /**
     * Typically transfer type for copy/paste transfers.
     */
    TEXT: 'text/plain'
};
var DragAndDropData = /** @class */ (function () {
    function DragAndDropData(data) {
        this.data = data;
    }
    DragAndDropData.prototype.update = function () {
        // noop
    };
    DragAndDropData.prototype.getData = function () {
        return this.data;
    };
    return DragAndDropData;
}());
export { DragAndDropData };
export var StaticDND = {
    CurrentDragAndDropData: undefined
};
