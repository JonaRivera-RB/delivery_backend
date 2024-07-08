// Import required modules and dependencies
const jwtStrategy = require('passport-jwt').Strategy; // Import JWT authentication strategy from 'passport-jwt' package
const extractJwt = require('passport-jwt').ExtractJwt; // Import function to extract JWT from request from 'passport-jwt' package
const User = require('../models/user'); // Import User model for database operations
const keys = require('./keys'); // Import secret keys used for JWT encryption and decryption

/**
 * Configure Passport to use JWT (JSON Web Token) authentication strategy.
 * @param {Object} passport - Passport instance.
 */
module.exports = function (passport) {
    // Define options for JWT authentication
    let opts = {};

    // Specify how to extract JWT from the request
    opts.jwtFromRequest = extractJwt.fromAuthHeaderWithScheme('jwt');

    // Specify the secret key used to sign and verify JWTs
    opts.secretOrKey = keys.secretOrKey;

    // Configure Passport to use JWT strategy
    passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
        // Attempt to find user by ID extracted from JWT payload
        User.findById(jwt_payload.id, (error, user) => {
            if (error) {
                // If there's an error, pass it to the done callback with no user
                return done(error, false);
            } else if (user) {
                // If user is found, pass user object to done callback with no error
                return done(null, user);
            } else {
                // If user is not found, pass false to done callback with no error
                return done(null, false);
            }
        });
    }));
};
