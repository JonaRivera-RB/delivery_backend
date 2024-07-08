// Import the database configuration from the '../config/config' file
const db = require('../config/config');
const bcrypt = require('bcryptjs'); // Import the bcrypt library for password hashing

// Define an empty object 'User' to hold user-related methods
const User = {};

// Define a method 'getAll' on the 'User' object to fetch all users from the database
User.getAll = async () => {
    // Define the SQL query to select all users from the 'users' table
    const sql = 'SELECT * FROM users';

    // Execute the SQL query using the database connection and return the result
    return db.manyOrNone(sql);
}

// Define a method 'create' on the 'User' object to create a new user in the database
User.create = async (user) => {
    // Hash the user's password using bcrypt with a salt factor of 10
    const hash = await bcrypt.hash(user.password, 10);

    // Define the SQL query to insert a new user into the 'users' table
    const sql = `
    INSERT INTO users(email, name, lastname, phone, image, password, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;

    // Execute the SQL query with user data and hashed password, and return the ID of the newly created user
    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        hash,
        new Date(),
        new Date()
    ]);
};

// Define a method 'findById' on the 'User' object to find a user by ID in the database
User.findById = async (id, callback) => {
    const sql = `SELECT * FROM users WHERE id = $1`;

    // Execute the SQL query with the user ID and invoke the callback function with the result
    return db.oneOrNone(sql, id).then(user => {
        callback(null, user);
    });
}

// Define a method 'findByEmail' on the 'User' object to find a user by email in the database
User.findByEmail = async (email, callback) => {
    const sql = `
    select
	u.id,
    u.name,
	u.email,
	u.lastname,
	u.image,
	u.phone,
	u.password,
	u.session_token,
	json_agg(
		json_build_object(
    'id', role.id,
    'name', role.name,
    'imagen', role.image
)
	) as roles

	FROM
		users AS u
	INNER JOIN
		user_has_roles AS user_roles
	ON
		user_roles.id_user = u.id
	INNER JOIN
		roles AS role
	ON
		role.id = user_roles.id_role
	WHERE
		u.email = $1
	group by
		u.id
    `;

    // Execute the SQL query with the user email and return the result
    return db.oneOrNone(sql, email);
}

User.updateImage = async (id, image) => {
    const sql = `
    UPDATE
        users
    SET
        image = $2,
        updated_at = $3
    WHERE
        id = $1
    `;

    return db.none(sql, [
        id,
        image,
        new Date()
    ]);
}

User.update = async (user) => {

    console.log('usuario parseado2', user);
    const sql = `
    UPDATE
        users
    SET
    name = $2,
    lastname = $3,
    phone = $4,
    image = $5,
    updated_at = $6
    WHERE
        id = $1
    `;

    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);
}

User.updateSessionToken = async (id_user, session_token) => {
    
    const sql = `
    UPDATE
        users
    SET
    session_token = $2
    WHERE
        id = $1
    `;

    return db.none(sql, [
        id_user,
        session_token
    ]);
}

// Define a method 'findByEmail' on the 'User' object to find a user by email in the database
User.findDeliveryMen = async => {
    const sql = `
    select
	u.id,
    u.name,
	u.email,
	u.lastname,
	u.image,
	u.phone,
	u.password,
	u.session_token
	FROM
		users AS u
	INNER JOIN
		user_has_roles AS UHR
	ON
		UHR.id_user = u.id
	INNER JOIN
		roles AS R
	ON
		R.id = UHR.id_role
	WHERE
		R.id = UHR.id_role
    `;

    // Execute the SQL query with the user email and return the result
    return db.manyOrNone(sql);
}

// Export the 'User' object to make it accessible from other parts of the application
module.exports = User;
