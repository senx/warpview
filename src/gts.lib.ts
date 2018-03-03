export class GTSLib {

    color = ['#F44336', '#9C27B0', '#3F51B5', '#2196F3', '#009688', '#CDDC39', '#8BC34A', '#FFC107', '#795548', '#607D8B']
    getColor(i) {
        return this.color[i % this.color.length]
    }

    unique(arr) {
        var u = {}, a = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
    transparentize(color, alpha: number): string {
        return 'rgba(' + this.hexToRgb(color).concat(alpha).join(',') + ')';
    }

    gtsToScatter(gts) {
        var datasets = []
        gts.forEach(d => {
            for (var i = 0; i < d.gts.length; i++) {
                var g = d.gts[i]
                var data = []
                g.v.forEach(d => {
                    data.push({x: d[0] / 10000, y :d[d.length - 1]})
                })
                var color = this.getColor(i)
                if (d.params && d.params[i] && d.params[i].color) {
                    color = d.params[i].color
                }
                var label = `${g.c} - ${JSON.stringify(g.l)}`
                if (d.params && d.params[i] && d.params[i].key) {
                    label = d.params[i].key
                }
                var ds = {
                    label: label,
                    data: data,
                    pointRadius: 2,
                    fill: false,
                    borderColor: color,
                    backgroundColor: this.transparentize(color, 0.5)
                }
                if (d.params && d.params[i] && d.params[i].interpolate) {
                    switch (d.params[i].interpolate) {
                        case 'line':
                            ds['lineTension'] = 0
                            break;
                        case 'spline':
                            break;
                        case 'area':
                            ds.fill = true
                    }
                }
                datasets.push(ds)
            }
        });
        console.log(datasets)
        return { datasets: datasets, ticks: [] }
    }
    gtsToData(gts) {
        var datasets = []
        var ticks = []
        gts.forEach(d => {
            for (var i = 0; i < d.gts.length; i++) {
                var g = d.gts[i]
                var data = []
                g.v.forEach(d => {
                    ticks.push(d[0] / 10000)
                    data.push(d[d.length - 1])
                })
                var color = this.getColor(i)
                if (d.params && d.params[i] && d.params[i].color) {
                    color = d.params[i].color
                }
                var label = `${g.c} - ${JSON.stringify(g.l)}`
                if (d.params && d.params[i] && d.params[i].key) {
                    label = d.params[i].key
                }
                var ds = {
                    label: label,
                    data: data,
                    pointRadius: 2,
                    fill: false,
                    borderColor: color,
                    backgroundColor: this.transparentize(color, 0.5)
                }
                if (d.params && d.params[i] && d.params[i].interpolate) {
                    switch (d.params[i].interpolate) {
                        case 'line':
                            ds['lineTension'] = 0
                            break;
                        case 'spline':
                            break;
                        case 'area':
                            ds.fill = true
                    }
                }
                datasets.push(ds)
            }
        });
        return { datasets: datasets, ticks: this.unique(ticks) }
    }
}