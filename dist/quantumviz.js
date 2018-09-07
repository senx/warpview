/*! Built with http://stenciljs.com */
(function(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components) {

    function init(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCorePolyfilled, hydratedCssClass, components, HTMLElementPrototype, App, x, y, scriptElm, orgComponentOnReady) {
    // create global namespace if it doesn't already exist
    App = win[namespace] = win[namespace] || {};
    App.components = components;
    y = components.filter(function (c) { return c[2]; }).map(function (c) { return c[0]; });
    if (y.length) {
        // auto hide components until they been fully hydrated
        // reusing the "x" and "i" variables from the args for funzies
        x = doc.createElement('style');
        x.innerHTML = y.join() + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
        x.setAttribute('data-styles', '');
        doc.head.insertBefore(x, doc.head.firstChild);
    }
    // create a temporary array to store the resolves
    // before the core file has fully loaded
    App.$r = [];
    // add componentOnReady to HTMLElement.prototype
    orgComponentOnReady = HTMLElementPrototype.componentOnReady;
    HTMLElementPrototype.componentOnReady = function componentOnReady(cb) {
        const elm = this;
        // there may be more than one app on the window so
        // call original HTMLElement.prototype.componentOnReady
        // if one exists already
        orgComponentOnReady && orgComponentOnReady.call(elm);
        function executor(resolve) {
            if (App.$r) {
                // core file hasn't loaded yet
                // so let's throw it in this temporary queue
                // and when the core does load it'll handle these
                App.$r.push([elm, resolve]);
            }
            else {
                // core has finished loading because there's no temporary queue
                // call the core's logic to handle this
                App.componentOnReady(elm, resolve);
            }
        }
        if (cb) {
            // just a callback
            return executor(cb);
        }
        // callback wasn't provided, let's return a promise
        if (win.Promise) {
            // use native/polyfilled promise
            return new Promise(executor);
        }
        // promise may not have been polyfilled yet
        return { then: executor };
    };
    // figure out the script element for this current script
    y = doc.querySelectorAll('script');
    for (x = y.length - 1; x >= 0; x--) {
        scriptElm = y[x];
        if (scriptElm.src || scriptElm.hasAttribute('data-resources-url')) {
            break;
        }
    }
    // get the resource path attribute on this script element
    y = scriptElm.getAttribute('data-resources-url');
    if (y) {
        // the script element has a data-resources-url attribute, always use that
        resourcesUrl = y;
    }
    if (!resourcesUrl && scriptElm.src) {
        // we don't have an exact resourcesUrl, so let's
        // figure it out relative to this script's src and app's filesystem namespace
        y = scriptElm.src.split('/').slice(0, -1);
        resourcesUrl = (y.join('/')) + (y.length ? '/' : '') + fsNamespace + '/';
    }
    // request the core this browser needs
    // test for native support of custom elements and fetch
    // if either of those are not supported, then use the core w/ polyfills
    // also check if the page was build with ssr or not
    x = doc.createElement('script');
    if (usePolyfills(win, win.location, x, 'import("")')) {
        // requires the es5/polyfilled core
        x.src = resourcesUrl + appCorePolyfilled;
    }
    else {
        // let's do this!
        x.src = resourcesUrl + appCore;
        x.setAttribute('type', 'module');
        x.setAttribute('crossorigin', true);
    }
    x.setAttribute('data-resources-url', resourcesUrl);
    x.setAttribute('data-namespace', fsNamespace);
    doc.head.appendChild(x);
}
function usePolyfills(win, location, scriptElm, dynamicImportTest) {
    // fyi, dev mode has verbose if/return statements
    // but it minifies to a nice 'lil one-liner ;)
    if (location.search.indexOf('core=esm') > 0) {
        // force esm build
        return false;
    }
    if ((location.search.indexOf('core=es5') > 0) ||
        (location.protocol === 'file:') ||
        (!(win.customElements && win.customElements.define)) ||
        (!win.fetch) ||
        (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) ||
        (!('noModule' in scriptElm))) {
        // es5 build w/ polyfills
        return true;
    }
    // final test to see if this browser support dynamic imports
    return doesNotSupportsDynamicImports(dynamicImportTest);
}
function doesNotSupportsDynamicImports(dynamicImportTest) {
    try {
        new Function(dynamicImportTest);
        return false;
    }
    catch (e) { }
    return true;
}


    init(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components);

    })(window, document, "quantumviz","quantumviz",0,"quantumviz.core.js","es5-build-disabled.js","hydrated",[["quantum-annotation","quantum-annotation",1,[["chartTitle",1,0,"chart-title",2],["data",1,0,1,2],["el",7],["height",2,0,1,2],["hiddenData",1,0,"hidden-data",2],["options",1,0,1,2],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["timeMax",1,0,"time-max",4],["timeMin",1,0,"time-min",4],["width",1,0,1,2]],1],["quantum-bubble","quantum-bubble",1,[["chartTitle",1,0,"chart-title",2],["data",1,0,1,2],["el",7],["height",1,0,1,2],["options",1],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["timeMax",1,0,"time-max",4],["timeMin",1,0,"time-min",4],["unit",1,0,1,2],["width",1,0,1,2]],1],["quantum-chart","quantum-chart",1,[["alone",1,0,1,3],["chartTitle",1,0,"chart-title",2],["config",1,0,1,2],["data",1,0,1,2],["el",7],["height",1,0,1,2],["hiddenData",1,0,"hidden-data",2],["options",1,0,1,2],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["timeMax",1,0,"time-max",4],["timeMin",1,0,"time-min",4],["toBase64Image",6],["type",1,0,1,2],["unit",1,0,1,2],["width",1,0,1,2],["xView",1,0,"x-view",2],["yView",1,0,"y-view",2]],1],["quantum-chip","quantum-chip",1,[["el",7],["index",1,0,1,4],["name",1,0,1,2],["node",1,0,1,1]]],["quantum-dygraphs","quantum-dygraphs",1,[["data",1,0,1,2],["el",7],["hiddenData",1,0,"hidden-data",2],["options",1,0,1,2],["responsive",1,0,1,3],["theme",1,0,1,2]]],["quantum-gts-tree","quantum-chip",1,[["data",1,0,1,2],["theme",1,0,1,2]]],["quantum-heatmap-sliders","quantum-heatmap-sliders",0,[["blurValue",1,0,"blur-value",4],["el",7],["maxBlurValue",1,0,"max-blur-value",4],["maxRadiusValue",1,0,"max-radius-value",4],["minBlurValue",1,0,"min-blur-value",4],["minRadiusValue",1,0,"min-radius-value",4],["radiusValue",1,0,"radius-value",4]],1],["quantum-map","quantum-heatmap-sliders",1,[["data",1,0,1,2],["dotsLimit",1,0,"dots-limit",4],["el",7],["heatBlur",1,0,"heat-blur",4],["heatControls",1,0,"heat-controls",3],["heatData",1,0,"heat-data",2],["heatOpacity",1,0,"heat-opacity",4],["heatRadius",1,0,"heat-radius",4],["height",1,0,1,2],["mapTitle",1,0,"map-title",2],["responsive",1,0,1,3],["startLat",1,0,"start-lat",4],["startLong",1,0,"start-long",4],["startZoom",1,0,"start-zoom",4],["width",1,0,1,2]],1,[["heatRadiusDidChange","radiuschange"],["heatBlurDidChange","blurChange"],["heatOpacityDidChange","opacityChange"]]],["quantum-multi-charts","quantum-multi-charts",1,[["chartTitle",1,0,"chart-title",2],["data",1,0,1,2],["el",7],["height",1,0,1,2],["hiddenData",1,0,"hidden-data",2],["options",1,0,1,2],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["timeMax",1,0,"time-max",4],["timeMin",1,0,"time-min",4],["type",1,0,1,2],["unit",1,0,1,2],["wc",7],["width",1,0,1,2]],1,[["chartInfos","chartInfosWatcher"],["xZoom","xZoomListener"],["xSliderValueChanged","xSliderListener"]]],["quantum-pie","quantum-bubble",1,[["chartTitle",1,0,"chart-title",2],["data",1,0,1,2],["el",7],["height",1,0,1,2],["options",1],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["type",1,0,1,2],["unit",1,0,1,2],["width",1,0,1,2]],1],["quantum-polar","quantum-bubble",1,[["chartTitle",1,0,"chart-title",2],["data",1,0,1,2],["el",7],["height",1,0,1,2],["options",1],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["type",1,0,1,2],["unit",1,0,1,2],["width",1,0,1,2]],1],["quantum-radar","quantum-radar",1,[["chartTitle",1,0,"chart-title",2],["data",1,0,1,2],["el",7],["height",1,0,1,2],["options",1],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["unit",1,0,1,2],["width",1,0,1,2]],1],["quantum-scatter","quantum-bubble",1,[["chartTitle",1,0,"chart-title",2],["data",1,0,1,2],["el",7],["height",1,0,1,2],["options",1],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["timeMax",1,0,"time-max",4],["timeMin",1,0,"time-min",4],["unit",1,0,1,2],["width",1,0,1,2]],1],["quantum-tile","quantum-bubble",1,[["chartTitle",1,0,"chart-title",2],["data",5],["responsive",1,0,1,3],["showLegend",1,0,"show-legend",3],["type",1,0,1,2],["unit",1,0,1,2],["url",1,0,1,2],["wsElement",7]],1],["quantum-toggle","quantum-toggle",1,[["checked",1,0,1,3],["option",1,0,1,2],["state",5],["text1",1,0,"text-1",2],["text2",1,0,"text-2",2]],1],["quantum-tree-view","quantum-chip",1,[["branch",1,0,1,3],["gtsList",1,0,"gts-list",1],["theme",1,0,1,2]]]],HTMLElement.prototype);