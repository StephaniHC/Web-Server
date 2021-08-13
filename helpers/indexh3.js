const h3 = require("h3-js");
const geojson2h3 = require("geojson2h3");

//retorna el ring  N
getkRing = (h3Index, kRing) => {
    const h3Kring = h3.kRing(h3Index, kRing);
    return geojson2h3.h3SetToMultiPolygonFeature(h3Kring);
}

//retorna el ring  N
gethexRing = (h3Index, ringSize) => {
    return h3.hexRing(h3Index, ringSize); //const h3HexRing 
    // return geojson2h3.h3SetToMultiPolygonFeature(h3HexRing); // retorna una serie de elementos
}

getH3Index = (lat, lon) => {
    //obtiene el index del hexagono
    return h3.geoToH3(lon, lat, 9);
}

module.exports = {
    gethexRing,
    getH3Index,
    getkRing
}