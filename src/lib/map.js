

import 'ol/ol.css';
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style, Text } from 'ol/style';
import Graticule from "ol/layer/Graticule";

// import XYZ from "ol/source/XYZ";




var map;
// TODO : Development static map data server !
var _tileserver = 'http://tiles-kartenn.herrcrazi.tk/';

export default {

    createMap(outletID, tileserver) {
        if (tileserver) {
            _tileserver = tileserver
        }

        var style = new Style({
            fill: new Fill({
                color: '#42424299'
            }),
            stroke: new Stroke({
                color: '#51994999',
                width: 1
            }),
            text: new Text({
                font: '12px Calibri,sans-serif',
                fill: new Fill({
                    color: '#000'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3
                })
            })
        });

        // OpenLayers Map
        map = new OLMap({
            target: outletID,
            // Layers
            layers: [
                new TileLayer({
                    source: new OSM()
                }),

                // new VectorLayer({
                //     source: new VectorSource({
                //         url: _tileserver + "/vector/communes.json",
                //         format: new GeoJSON(),
                //         projection: "EPSG:4326"
                //     }),
                //     style: function (feature) {
                //         style.getText().setText(feature.get('name'));
                //         return style;
                //     }
                // })
                new Graticule({
                    showLabels: true
                })
            ],
            // Viewport
            view: new View({
                projection: "EPSG:3857",
                center: [-390142, 6130000],
                zoom: 9
            })
        })
    },

    getOLMap() {
        return map;
    },

    getLayers() {
        return map.getLayers().getArray();
    },

}
