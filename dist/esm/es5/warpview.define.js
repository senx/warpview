
// warpview: Custom Elements Define Library, ES Module/es5 Target

import { defineCustomElement } from './warpview.core.js';
import { COMPONENTS } from './warpview.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, COMPONENTS, opts);
}
