

import 'ol/ol.css';
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import TopoJSON from 'ol/format/TopoJSON';

import CircleStyle from 'ol/style/Circle';

import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';

import { Fill, Stroke, Style, Text } from 'ol/style';
import Graticule from "ol/layer/Graticule";
import XYZ from 'ol/source/XYZ';

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
                color: '#88888888'
            }),
            stroke: new Stroke({
                color: '#519949',
                width: 1
            })
        });

        // OpenLayers Map
        map = new OLMap({
            target: outletID,
            // Layers
            layers: [
                new TileLayer({
                    source: new OSM(),
                    opacity: 1,
                    // projection: "EPSG:3857"
                }),
                    
                
                //GeoJSON des communes (lourd)
                new VectorLayer({
                    source: new VectorSource({
                        url: _tileserver + "/vector/fix.bretagne.geojson.min.json",
                        format: new GeoJSON(),
                    }),
                }),

                // Fond vectoriel d'Arcgis (pas stylé)
                // new VectorTileLayer({
                //     source: new VectorTileSource({
                //         url: "http://127.0.0.1:8081/vector/com.mvt",
                //         format: new MVT()
                //     }),
                //     declutter: true,
                //     style: style
                // }),

                new Graticule({
                    showLabels: true
                })
            ],
            // Viewport
            view: new View({
                projection: "EPSG:3857",
                center: [-390142, 6130000],
                // center: [-2,47],
                zoom: 8
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
