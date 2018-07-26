import Leaflet from 'leaflet';
export class QuantumHeatmap {
    constructor() {
        this.mapTitle = "";
        this.responsive = false;
    }
    /*
      drawMap(){
        let ctx = this.el.shadowRoot.querySelector("#myMap");
        this._map = new L.Map(ctx);
        this._map.setView(new L.LatLng(51.505, -0.09), 13);
        var layer =new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: "attribution test" });
        layer.addTo(this._map);
      }
    */
    drawMap() {
        let ctx = this.el.shadowRoot.querySelector('#mymap');
        this._map = Leaflet.map(ctx).setView([51.505, -0.09], 13);
        const myIcon = Leaflet.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png'
        });
        //  Leaflet.marker([50.6311634, 3.0599573], {icon: myIcon}).bindPopup('Je suis là').addTo(this._map).openPopup();
        Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this._map);
    }
    componentDidLoad() {
        this.drawMap();
    }
    render() {
        return (h("div", null,
            h("h1", null, this.mapTitle),
            h("div", { class: "map-container" },
                h("div", { id: "mymap", style: { 'width': '100%', 'height': '400px' } }))));
    }
    static get is() { return "quantum-heatmap"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "height": {
            "type": Number,
            "attr": "height"
        },
        "mapTitle": {
            "type": String,
            "attr": "map-title"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "width": {
            "type": Number,
            "attr": "width"
        }
    }; }
    static get style() { return "/**style-placeholder:quantum-heatmap:**/"; }
}
