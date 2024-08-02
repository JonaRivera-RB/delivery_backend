const mercadoPago = require('mercadopago');
const Order = require('../models/orders');
const OrderHasProducts = require('../models/orderHasProducts');

mercadoPago.configure({
    sandbox: true,
    access_token: 'TEST-4723731826179182-072401-7ead923c4525b55d21165fb5eb5299fc-424674793'
});

module.exports = {

    async createPayment(req, res, next) {

        let payment = req.body;

        console.log('Datos enviados', payment);

        const payment_data = {
            transaction_amount: payment.transaction_amount,
            token: payment.token,
            description: payment.description,
            installments: payment.installments,
            payment_method_id: payment.payment_method_id,
            issuer_id: payment.issuer_id,
            payer: {
              email: payment.payer.email,
            }
        };

        const data = await mercadoPago.payment.create(payment_data).catch((err) => {
            console.log('Error:', err);
            return res.status(501).json({
                message: `Error al crear el pago: ${err}`,
                success: false,
                error: err 
            });
        })

        if (data) {
            // EL PAGO SE REALIZO CORRECTAMENTE

            let order = payment.order;
            order.status = 'PAGADO';
            const orderData = await Order.create(order);
            
            console.log('LA ORDEN SE CREO CORRECTAMENTE');

            // RECORRER TODOS LOS PRODUCTOS AGREGADOS A LA ORDEN
            for (const product of order.products) {
                await OrderHasProducts.create(orderData.id, product.id, product.quantity);
            }

            console.log('Respuesta de mercado pago', data.response);

            return res.status(201).json({
                message: `El pago se ha realizo correctamente`,
                success: true,
                data: data.response 
            })
        }
        else {
            // EL PAGO NO SE REALIZO CORRECTAMENTE
            return res.status(501).json({
                message: `Error algun dato esta mal en la peticion`,
                success: false
            });
        }

    }

}