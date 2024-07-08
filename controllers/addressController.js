const { findByUser } = require('../models/address');
const Address = require('../models/address');
const { create } = require('../models/product');

module.exports = {
    async create(request, response, next) {
        try {
            const address = request.body;
            const data = await Address.create(address);

            return response.status(201).json({
                success: true,
                message: 'La dirección se creo correctamente',
                data: {
                    'id': data.id
                }
            })
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error creadno la dirección',
                error: error
            })
        }
    },

    async findByUser(request, response, next) {
        try {
            const id_user = request.params.id_user;
            const data = await Address.findByUser(id_user);
            return response.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error obteniendo la dirección',
                error: error
            });
        }
    }
}