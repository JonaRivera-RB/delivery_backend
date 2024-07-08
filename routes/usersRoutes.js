const usersController = require('../controllers/usersController');
const passport = require('passport');

// Export a function that takes an Express app instance as a parameter
module.exports = (app, upload) => {

    // Define a GET route '/getAll' that maps to the getAll method of the users controller
    app.get('/api/users/getAll', usersController.getAll);

    // Define a POST route '/create' that maps to the register method of the users controller
    app.post('/api/users/create', usersController.register);

    // Define a POST route '/login' that maps to the login method of the users controller
    app.post('/api/users/login', usersController.login);

    app.put('/api/users/updateImage', upload.array(`image`, 1), usersController.updateImage);

    app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), usersController.update);

    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', { session: false }), usersController.updateWithoutImage);

    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', {session: false}), usersController.findDeliveryMen);
};
