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
export var ListAriaRootRole;
(function (ListAriaRootRole) {
    /** default tree structure role */
    ListAriaRootRole["TREE"] = "tree";
    /** role='tree' can interfere with screenreaders reading nested elements inside the tree row. Use FORM in that case. */
    ListAriaRootRole["FORM"] = "form";
})(ListAriaRootRole || (ListAriaRootRole = {}));
