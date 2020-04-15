

import 'ol/ol.css';
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
// import Graticule from "ol/";
// import ImageLayer from 'ol/layer/Image';
// import Projection from "ol/proj/Projection";
// import { get as getProjection } from "ol/proj";
// import XYZ from "ol/source/XYZ";
// import { register } from 'ol/proj/proj4';
// import proj4 from 'proj4';


// proj4.defs('ESRI:53009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 ' +
//     '+b=6371000 +units=m +no_defs');
// register(proj4);

// // Configure the Sphere Mollweide projection object with an extent,
// // and a world extent. These are required for the Graticule.
// var sphereMollweideProjection = new Projection({
//     code: 'ESRI:53009',
//     extent: [-9009954.605703328 * 2, -9009954.605703328,
//     9009954.605703328 * 2, 9009954.605703328],
//     worldExtent: [-179, -89.99, 179, 89.99]
// });


var map;
// const _tileserver = 'http://tiles-arii.herrcrazi.tk/tiles/';

// const defaultOptions = {
//     title: 'KSP Layer',
//     opacity: 1,
//     layerIcon: 'images/body-kerbin.png'
// }

export default {

    createMap(outletID) {
        // if (tileserver) {
        //     _tileserver = tileserver
        // }

        // OpenLayers Map
        map = new OLMap({
            target: outletID,
            // Layers
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                // new Graticule({
                //     map: map,
                //     showLabels: false
                // })
            ],
            // Viewport
            view: new View({
                projection: "EPSG:3857",
                center: [-306142, 6142746],
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

    // addKerbalLayer(layerData, options) {
    //     let layer = new TileLayer({
    //         ...{
    //             source: new XYZ({
    //                 tileUrlFunction: function (coordinate) {

    //                     if (coordinate === null) return undefined;

    //                     // TMS Style URL
    //                     var z = coordinate[0] - 1;
    //                     var x = coordinate[1];
    //                     var y = coordinate[2] + Math.pow(2, z);
    //                     var url = _tileserver + layerData.url + z + '/' + x + '/' + y + '.png';

    //                     return url;
    //                 },
    //                 projection: 'EPSG:4326',
    //             })
    //         },
    //         ...defaultOptions,
    //         ...{
    //             title: layerData.title,
    //             mapDataSource: layerData.source,
    //             type: layerData.type,
    //             body: layerData.body,
    //             layerIcon: layerData.layerIcon,
    //             tilesUrl: layerData.url,
    //             extent: sphereMollweideProjection.getExtent()
    //         },
    //         ...options
    //     });

    //     map.addLayer(layer)
    // }
}
