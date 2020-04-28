
import 'ol/ol.css';
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Graticule from "ol/layer/Graticule";
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Select from 'ol/interaction/Select';
import { click, pointerMove, altKeyOnly } from 'ol/events/condition';

var map;

export default {

    createMap(outletID) {
        var styles = {
            'MultiPolygon': new Style({
                stroke: new Stroke({
                    color: 'rgb(100, 100, 200)',
                    lineDash: [4],
                    width: 3
                }),
                fill: new Fill({
                    color: 'rgba(100, 100, 200, 0.1)'
                })
            }),
            'Polygon': new Style({
                stroke: new Stroke({
                    color: 'rgb(100, 100, 200)',
                    lineDash: [4],
                    width: 3
                }),
                fill: new Fill({
                    color: 'rgba(100, 100, 200, 0.1)'
                })
            })
        };

        var styleFunction = function (feature) {
            return styles[feature.getGeometry().getType()];
        };

        var geojsonObject = require('../../public/fix.bretagne.geojson.min.json');
        var vectorSource = new VectorSource({
          features: (new GeoJSON()).readFeatures(geojsonObject)
        });

        // OpenLayers Map
        map = new OLMap({
            target: outletID,
            // Layers
            layers: [
                new TileLayer({
                    source: new OSM()
                }),

                new VectorLayer({
                    source: vectorSource,
                    style: styleFunction
                }),
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
        });

        var select = new Select({
            condition: click
        });
        var hoover = new Select({
            condition: pointerMove
        });

        map.addInteraction(select);
        select.on('select', function (e) {
            alert(e.selected[0].values_.name);
        });
        map.addInteraction(hoover);
        hoover.on('select', function (e) {
            
        });
    },

    getOLMap() {
        return map;
    },

    getLayers() {
        return map.getLayers().getArray();
    },

}
