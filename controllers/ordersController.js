const Order = require('../models/orders');
const OrderHasProduct = require('../models/orderHasProducts');
const OrderHasProducts = require('../models/orderHasProducts');
const { findByStatus } = require('../models/orders');
const timeRelative = require('../utils/time_relative');

module.exports = {

    async findByStatus(request, response, next) {
        try {
            const status = request.params.status;
            let data = await Order.findByStatus(status);
            console.log(`Status ${JSON.stringify(data)}`);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            return response.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error al tratar de obtener las ordenes',
                error: error
            })
        }
    },

    async create(request, response, next) {
        try {
            let order = request.body;
            order.status = 'PAGADO';
            const data = await Order.create(order);

            for(const product of order.products) {
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return response.status(201).json({
                success: true,
                message: 'La orden se creo correctamente',
                data: {
                    'id': data.id
                }
            })
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            })
        }
    },

    async findByClientAndStatus(request, response, next) {
        try {
            const status = request.params.status;
            const id_client = request.params.id_client;
            
            let data = await Order.findByClientAndStatus(id_client, status);
            console.log(`Status ${JSON.stringify(data)}`);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log('order: ', data);

            return response.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error al tratar de obtener las ordenes',
                error: error
            })
        }
    },

    async updateToDispatched(request, response, next) {
        try {
            let order = request.body;
            order.status = 'DESPACHADO';
            await Order.update(order);

            return response.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            })
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            })
        }
    },

    async updateToOnTheWay(request, response, next) {
        try {
            let order = request.body;
            order.status = 'EN CAMINO';
            await Order.update(order);

            return response.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            })
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            })
        }
    },

    async updateToDelivery(request, response, next) {
        try {
            let order = request.body;
            order.status = 'ENTREGADO';
            await Order.update(order);

            return response.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            })
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            })
        }
    },

    async findByDeliveryAndStatus(request, response, next) {
        try {
            const status = request.params.status;
            const id_delivery = request.params.id_delivery;

            let data = await Order.findByDeliveryAndStatus(id_delivery, status);
            console.log(`Status ${JSON.stringify(data)}`);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log('order: ', data);

            return response.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return response.status(501).json({
                success: false,
                message: 'Hubo un error al tratar de obtener las ordenes',
                error: error
            })
        }
    },
}