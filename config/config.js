// Import the 'bluebird' library to handle promises efficiently
const promise = require('bluebird');

// Configure options for the 'pg-promise' library, specifying 'bluebird' as the preferred promise library
const options = {
    promiseLib: promise,
    // Optionally define a custom query method (not used in this example)
    query: (event) => {
        // Custom query method implementation (not utilized in this example)
    }
};

// Import the 'pg-promise' library and pass the specified options
const pgp = require('pg-promise')(options);

// Access the types module of pg-promise to manipulate data types more effectively
const types = pgp.pg.types;

// Define a custom type parser for type OID 1114 (timestamp with time zone)
types.setTypeParser(1114, function (stringValue) {
    // Custom type parser implementation (simply returns the string value as is)
    return stringValue;
});

// Database configuration object containing connection parameters
const databaseConfig = {
    host: '127.0.0.1', // Specify the database host address
    port: 5432, // Specify the database port number
    database: 'delivery_db', // Specify the name of the database
    user: 'postgres', // Specify the username for database authentication
    password: 'misa' // Specify the password for database authentication
};

// Create a new instance of the pg-promise library configured with the specified database connection details
const db = pgp(databaseConfig);

// Export the configured database connection for use in other parts of the application
module.exports = db;
