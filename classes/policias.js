const { getH3Index } = require("../helpers/indexh3");
const { PoliciasIndex } = require("./policias-index");

class Policias {



    constructor() {
        this.policias = new Map();
        this.policiasIndexados = new PoliciasIndex();
    }

    size() {
        return this.policias.size;
    };

    agregar(idCliente, lat, lon) {
        // const h3Index = getH3Index(lat, lon);
        const h3Index = getH3Index(lat, lon);

        // borro la ultima ubicacion de policia en policia indexado (Actualizo).
        //optimizar si oldh3Index === h3Index then return 
        var oldh3Index = this.policias.get(idCliente);
        if (oldh3Index != undefined) this.policiasIndexados.quitar(oldh3Index, idCliente);


        this.policias.set(idCliente, h3Index);
        //actulizar policias index
        this.policiasIndexados.agregar(h3Index, idCliente);
        // console.log(this.policiasIndexados);
    };

    desconectar(idCliente) {
        const h3Index = this.policias.get(idCliente);
        this.policias.delete(idCliente);
        //actulizar policias index
        this.policiasIndexados.quitar(h3Index, idCliente);
    };

    // retorna una lista de policias cercanos a mi.
    buscar(lat, lon) {
        return this.policiasIndexados.buscar(lat, lon);
    };


}

module.exports = {
    Policias
}