const categoriesController = require('../controllers/categoriesController');
const passport = require('passport');

// Export a function that takes an Express app instance as a parameter
module.exports = (app, upload) => {

    app.post('/api/categories/create', passport.authenticate('jwt', {session: false}), upload.array('image', 1), categoriesController.create);

    app.get('/api/categories/getAll', passport.authenticate('jwt', { session: false }), categoriesController.getAll);
};
