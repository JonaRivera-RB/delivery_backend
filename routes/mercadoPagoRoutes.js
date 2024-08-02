const mercadoPagoController = require('../controllers/mercadoPagoController');
const passport = require('passport');

// Export a function that takes an Express app instance as a parameter
module.exports = (app) => {

    app.post('/api/payments/create', passport.authenticate('jwt', {session: false}), mercadoPagoController.createPayment);
};
