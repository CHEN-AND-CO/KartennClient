
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

const _tileserver = constants.tile_server;
const _townships = constants.township_geojson;


/* MFW I see dirty globals - burn that straight to hell */
/* Then you realize it's Javascript so yeah guess it's fine then */

var map;
var vectorLayer;
var townships_raw;
var selectedId, hoveredId;

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
            color: '#999999',
            width: 3
        }),
        fill: new Fill({
            color: '#ffffff99'
        }),
        zIndex: 42 // Somewhere above the other, unselected, features
    }),
    'selected': new Style({
        stroke: new Stroke({
            color: '#55ff33',
            width: 5
        }),
        fill: new Fill({
            color: '#77ff4455'
        }),
        zIndex: 43
    })
};

var styleFunction = (feature, resolution) => {
    if (feature.get("name") === selectedId) return styles.selected;
    else if (feature.get("name") === hoveredId) return styles.hover;
    else return styles.default;
}

var _cMapReady = function () {}
function _call_onMapReady() {
    _cMapReady();
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

        // Add the vector layer for interactive townships features
        this.addTownships();

        // Handle feature selection with mouse
        map.on('pointermove', (e) => {
            if (e.dragging) return;
            
            let feature = null;
            map.forEachFeatureAtPixel(e.pixel, (f) => {
                feature = f;
            })
            // Set the 'hovering' style
            this.selectFeature(feature);
        });

        // Handle feature click 
        map.on('click', (e) => {
            let feature = null;

            map.forEachFeatureAtPixel(e.pixel, (f) => {
                feature = f;
            })
            // Set the 'selected' style and zoom the view to the full feature
            this.focusFeature(feature);
        });

        console.log("Map created")
    },

    addTownships() {
        fetch(_tileserver + _townships).then(function (response) {
            return response.json();
        }).then(function (json) {
            townships_raw = json;
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
            console.log("Township layer added")
            _call_onMapReady();
        });
    },

    onMapReady(callback) {
        _cMapReady = callback;
    },

    getOLMap() {
        return map;
    },

    getLayers() {
        return map.getLayers().getArray();
    },

    getTownships() {
        let townships = [];

        for (const feature of townships_raw.features) {
            townships.push({
                name: feature.properties.name,
                insee: feature.properties.tags['ref:INSEE'],
                postcode: feature.properties.tags['addr:postcode']
            });
        }
        return townships;
    },

    getFeatureByName(name) {
        for ( const feature of vectorLayer.getSource().getFeaturesInExtent( map.getView().calculateExtent(map.getSize()) ) ) {
            if (feature.get("name") === name) return feature;
        }
        return null;
    },

    getFeatureByTag(tag, value) {
        for (const feature of vectorLayer.getSource().getFeaturesInExtent(map.getView().calculateExtent(map.getSize()))) {
            if (feature.get("tags") && feature.get("tags")[tag] === value) return feature;
        }
        return null;
    },

    selectFeature(f) {
        if (f) hoveredId = f.get("name");
        else hoveredId = null;

        vectorLayer.setStyle(styleFunction);
    },

    focusFeature(f) {
        if (f) {
            selectedId = f.get("name");
            
            // Expand feature extent to nearby tiles if the whole feature spans across multiple tiles
            let featureExtent = f.getGeometry().getExtent();
            for (const feature of vectorLayer.getSource().getFeaturesInExtent(map.getView().calculateExtent(map.getSize()))) {
                if (feature.get("name") === selectedId) extend(featureExtent, feature.getGeometry().getExtent());
            }       
            map.getView().fit(buffer(featureExtent, 1000), { duration: 500 });

        } else {
            selectedId = null;
        }
        vectorLayer.setStyle(styleFunction);
    }
}
