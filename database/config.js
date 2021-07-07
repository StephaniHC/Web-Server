//configura la base de datos

const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

    } catch (error) {

        console.log(error);
        throw new Error('Error a la hora de iniciar la DB ver logs');
    }

}

module.exports = {
    dbConnection
}