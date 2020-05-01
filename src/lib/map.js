
import 'ol/ol.css';
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Projection from 'ol/proj/Projection';
import { buffer, extend } from 'ol/extent';
import Graticule from "ol/layer/Graticule";

import geojsonvt from 'geojson-vt';

import constants from '../constants';

var map;
const _tileserver = constants.tile_server;
const _townships = constants.township_geojson;

/* MFW I see dirty globals - burn that straight to hell */
/* Then you realize it's Javascript so yeah guess it's fine then */

// Converts geojson-vt data to GeoJSON
var replacer = function (key, value) {
    if (value.geometry) {
        var type;
        var rawType = value.type;
        var geometry = value.geometry;

        if (rawType === 1) {
            type = 'MultiPoint';
            if (geometry.length == 1) {
                type = 'Point';
                geometry = geometry[0];
            }
        } else if (rawType === 2) {
            type = 'MultiLineString';
            if (geometry.length == 1) {
                type = 'LineString';
                geometry = geometry[0];
            }
        } else if (rawType === 3) {
            type = 'Polygon';
            if (geometry.length > 1) {
                type = 'MultiPolygon';
                geometry = [geometry];
            }
        }

        return {
            'type': 'Feature',
            'geometry': {
                'type': type,
                'coordinates': geometry
            },
            'properties': value.tags
        };
    } else {
        return value;
    }
};

var selectedId;
var vectorLayer;

var styles = {
    'default': new Style({
        stroke: new Stroke({
            color: '#999999',
            width: 1
        }),
        fill: new Fill({
            color: 'transparent' // Even though we don't want a visible fill, one is still required for pointer hit detection
        })
    }),
    'hover': new Style({
        stroke: new Stroke({
            color: '#55ff33',
            width: 5
        }),
        fill: new Fill({
            color: '#77ff4455'
        }),
        zIndex: 42 // Somewhere above the other, unselected, features
    })
};

var styleFunction = (feature, resolution) => {
    if (feature.get("name") === selectedId) return styles.hover;
    else return styles.default;
}



export default {

    createMap(outletID) {

        // OpenLayers Map
        map = new OLMap({
            target: outletID,

            // Layers
            layers: [
                new TileLayer({
                    source: new OSM(),
                    // opacity: 0.5,
                }),


                //GeoJSON des communes (lourd)
                // new VectorLayer({
                //     source: new VectorSource({
                //         url: _tileserver + "/fix.bretagne.geojson.min.json",
                //         format: new GeoJSON(),
                //     }),
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
                zoom: 9
            })
        });

        // Handle feature selection with mouse
        map.on('pointermove', (e) => {
            if (e.dragging) return;

            selectedId = null;
            map.forEachFeatureAtPixel(e.pixel, (f) => {
                selectedId = f.get("name");
            })

            vectorLayer.setStyle(styleFunction) // We are forced to re-apply the style function to the whole layer since OL5 doesn't update properly the features' style
        });

        // Handle feature click 
        map.on('click', (e) => {
            let featureExtent;

            // Set the selected style
            map.forEachFeatureAtPixel(e.pixel, (f) => {
                selectedId = f.get("name");
                featureExtent = f.getGeometry().getExtent();
            })
            vectorLayer.setStyle(styleFunction);

            // Zoom to the selected feature
            if (featureExtent) {
                for (const feature of vectorLayer.getSource().getFeaturesInExtent(map.getView().calculateExtent(map.getSize()))) {
                    if (feature.get("name") === selectedId) extend(featureExtent, feature.getGeometry().getExtent());
                }
                map.getView().fit(buffer(featureExtent, 1000), { duration: 500 });
            }
        });

        // Add the vector layer for interactive townships features
        this.addTownships();
    },

    addTownships() {
        fetch(_tileserver + _townships).then(function (response) {
            return response.json();
        }).then(function (json) {
            var tileIndex = geojsonvt(json, {
                extent: 4096,
                debug: 1
            });
            var vectorSource = new VectorTileSource({
                format: new GeoJSON({
                    // Data returned from geojson-vt is in tile pixel units
                    dataProjection: new Projection({
                        code: 'TILE_PIXELS',
                        units: 'tile-pixels',
                        extent: [0, 0, 4096, 4096]
                    })
                }),
                tileUrlFunction: function (tileCoord) {
                    var data = tileIndex.getTile(tileCoord[0], tileCoord[1], tileCoord[2]);
                    var geojson = JSON.stringify({
                        type: 'FeatureCollection',
                        features: data ? data.features : []
                    }, replacer);
                    return 'data:application/json;charset=UTF-8,' + geojson;
                }
            });
            vectorLayer = new VectorTileLayer({
                source: vectorSource,
                style: styleFunction
            });
            map.addLayer(vectorLayer);
        });
    },

    getOLMap() {
        return map;
    },

    getLayers() {
        return map.getLayers().getArray();
    },

}
