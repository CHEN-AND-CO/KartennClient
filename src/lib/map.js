
import 'ol/ol.css';
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Projection from 'ol/proj/Projection';

import Graticule from "ol/layer/Graticule";

import Select from 'ol/interaction/Select';
import { click, pointerMove, altKeyOnly } from 'ol/events/condition';

import geojsonvt from 'geojson-vt';

var map;
const _tileserver = "http://127.0.0.1:8081/mapdata/vector";


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

        // var styleFunction = function (feature) {
        //     return styles[feature.getGeometry().getType()];
        // };

        // var geojsonObject = require('../../public/fix.bretagne.geojson.min.json');
        // var vectorSource = new VectorSource({
        //   features: (new GeoJSON()).readFeatures(geojsonObject)
        // });

        // OpenLayers Map
        map = new OLMap({
            target: outletID,
            // Layers
            layers: [
                new TileLayer({
                    source: new OSM(),
                    opacity: 1,
                }),
                    
                
                //GeoJSON des communes (lourd)
                // new VectorLayer({
                //     source: new VectorSource({
                //         url: _tileserver + "/fix.bretagne.geojson.min.json",
                //         format: new GeoJSON(),
                //     }),
                // }),
                // new VectorLayer({
                //     source: vectorSource,
                //     style: styleFunction
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

        this.addTownships();
    },

    addTownships() {
        fetch(_tileserver + "/fix_equi.geojson").then(function (response) {
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
            var vectorLayer = new VectorTileLayer({
                source: vectorSource
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
