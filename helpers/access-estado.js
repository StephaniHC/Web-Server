const getEstado = (role) => {

}

const esEstadoDenegadoRol = (estado) => {
    switch (estado) {
        case "habilitado":
            return false;
            break;
        case "inhabilitado":
            return true;
            break;
        case "pendiente":
            return true;
            break;
        default:
            return true;
            break;

    }
}

module.exports = {
    esEstadoDenegadoRol
}