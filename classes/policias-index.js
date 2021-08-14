/* 
#Nota
Policias Indexados:
Map<String, List<String> > 
*/

const { getH3Index, gethexRing } = require("../helpers/indexh3");

class PoliciasIndex {


    constructor() {
        this.policiasIndexados = new Map();
    }


    size() {
            return this.policiasIndexados.size;
        }
        // 
    buscar(lat, lon) {
        var clientes = [];
        const cantidad = 2;
        const h3Index = getH3Index(lat, lon);
        var nivel = 0;
        var poligonos = gethexRing(h3Index, nivel)

        while (clientes.length <= cantidad && nivel < 10) {
            poligonos.forEach(h3Idx => {
                let auxCliente = this.obtenerPoliciasPorHexagono(h3Idx);
                if (auxCliente.length > 0) {
                    clientes.push(...auxCliente);
                }
            });
            nivel++;
            poligonos = gethexRing(h3Index, nivel);
        }
        return clientes;



    }

    agregar(h3Index, idCliente) {
        var policias = this.policiasIndexados.get(h3Index);

        //   console.log("agregar - policias indexados ", policias);
        if (policias != undefined) {
            //si no existe h3Index en policias entondes lo agreda
            if (!policias.includes(idCliente)) {
                policias.push(idCliente);
            }
        } else {
            this.policiasIndexados.set(h3Index, [idCliente])
        }
        // console.log(...this.policiasIndexados);
        // console.log(this.policiasIndexados.size);
    }

    quitar(h3Index, idCliente) {
        var policias = this.policiasIndexados.get(h3Index);
        if (policias != undefined) {

            if (policias.length == 1) { // solo es un policia
                this.policiasIndexados.delete(h3Index);
            } else {
                //eliminamos al cliente de policias
                policias = policias.filter(ele => ele !== idCliente);
                this.policiasIndexados.set(h3Index, policias);
            }
        }
    }

    obtenerPoliciasPorHexagono(h3Index) {
        var policias = this.policiasIndexados.get(h3Index);
        if (policias != undefined) {
            return policias;
        }
        return [];
    }
}



module.exports = {
    PoliciasIndex
}