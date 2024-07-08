// Import the 'getAll' method from the '../models/user' module
const { getAll, update, findDeliveryMen } = require('../models/user');

// Import the 'User' object from the '../models/user' module
const User = require('../models/user');
const Rol = require('../models/rol');

const bcrypt = require('bcryptjs'); // Import the bcrypt library for password hashing
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for token generation and verification
const keys = require('../config/keys'); // Import secret keys for token encryption
const storage = require('../utils/cloud_storage');

// Export an object containing asynchronous functions for user operations
module.exports = {
    // Asynchronous function 'getAll' responsible for handling requests to fetch all users
    async getAll(request, response, next) {
        try {
            // Call the 'getAll' method of the 'User' object to fetch all users from the database
            const data = await User.getAll();

            // Log the retrieved users to the console
            console.log(`Users: ${data}`);

            // Return a JSON response with the retrieved users and a 200 OK status code
            return response.status(200).json(data);
        } catch (error) {
            // If an error occurs, log the error to the console
            console.error('Error al obtener el usuario:', error);

            // Return a JSON response with an error message and a 500 Internal Server Error status code
            return response.status(500).json({
                success: false,
                message: `Error al obtener el usuario: ${error.message}`
            });
        }
    },

    // Asynchronous function 'register' responsible for handling user registration requests
    async register(request, response, next) {
        try {
            const user = request.body; // Extract user data from request body
            const data = await User.create(user); // Call the 'create' method of the 'User' object to create a new user in the database

            await Rol.create(data.id, 1);

            const token = jwt.sign({ id: data.id, email: user.email }, keys.secretOrKey, {});

            // Construct data object with user details and session token
            const myData = {
                id: data.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                image: user.image,
                session_token: `JWT ${token}`
            };

            // Return a JSON response with a success message, user ID, and a 201 Created status code
            return response.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: myData
            });
        } catch (error) {
            console.log(`Error: ${error}`); // Log the error to the console
            return response.status(501).json({ // Return a JSON response with an error message and a 501 Internal Server Error status code
                success: false,
                message: `Error al registrar el usuario: ${error}`
            });
        }
    },

    // Asynchronous function 'login' responsible for handling user login requests
    async login(request, response, next) {
        try {
            const email = request.body.email; // Extract email and password from request body
            const password = request.body.password;

            const myUser = await User.findByEmail(email); // Call the 'findByEmail' method of the 'User' object to find a user by email in the database

            if (!myUser) { // If user is not found, return a JSON response with an error message and a 401 Unauthorized status code
                return response.status(200).json({
                    success: false,
                    message: 'Correo no encontrado.',
                    data: {}
                })
            }

            // Compare password provided with hashed password stored in the database using bcrypt library
            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) { // If password is valid, generate JWT token using jsonwebtoken library
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {});

                // Construct data object with user details and session token
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                };

                await User.updateSessionToken(myUser.id, `JWT ${token}`);
                
                // Return a JSON response with success message, user data, and a 201 Created status code
                return response.status(200).json({
                    success: true,
                    message: 'Usuario autenticado correctamente.',
                    data: data
                });
            } else {
                // If password is invalid, return a JSON response with an error message and a 401 Unauthorized status code
                return response.status(200).json({
                    success: false,
                    message: 'Contraseña incorrecta.',
                    data: {}
                });
            }
        } catch (error) {
            console.log(`Error: ${error}`); // Log the error to the console
            return response.status(500).json({ // Return a JSON response with an error message and a 501 Internal Server Error status code
                success: false,
                message: `Error al obtener al usuario. ${error}`,
                data: {}
            });
        }
    },


    async updateImage(request, response, next) {
        try {
            console.log('Usuario', request.body.image);
            console.log('Usuario', request.body.id);

            const userID = request.body.id;

            const files = request.files;
            let image = "";

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    image = url;
                }
            }

            await User.updateImage(userID, image);

            return response.status(201).json({
                success: true,
                message: `Los imagen del usuario se ha actualizado correctamente`,
                data: {
                    image: image
                }
            })

        } catch (error) {
            console.log(`Error: ${error}`); // Log the error to the console
            return response.status(500).json({ // Return a JSON response with an error message and a 501 Internal Server Error status code
                success: false,
                message: `Hubo un error al actualizar la imagen`,
                data: {}
            });
        }
    },

    async update(request, response, next) {
        try {
            console.log('usuario', response.body);

            const user = JSON.parse(request.body.user);

            console.log('usuario parseado', user);

            const files = request.files;

            if(files.length > 0) {
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }
            }

            console.log('usuario pa guardar', user);
            await User.update(user);

            return response.status(201).json({
                success: true, 
                message: 'Los datos del usuario se han actualizado correctamente',
                data: user
            });
        }
        catch (error) {
            console.log(`Error: ${error}`); // Log the error to the console
            return response.status(500).json({ // Return a JSON response with an error message and a 501 Internal Server Error status code
                success: false,
                message: `Hubo un error al actualizar la imagen`,
                data: {}
            });
        }
    },

    async updateWithoutImage(request, response, next) {
        try {
            const user = request.body;

            console.log('usuario pa guardar', user);
            
            await User.update(user);

            return response.status(201).json({
                success: true,
                message: 'Los datos del usuario se han actualizado correctamente',
                data: user
            });
        }
        catch (error) {
            console.log(`Error: ${error}`); // Log the error to the console
            return response.status(500).json({ // Return a JSON response with an error message and a 501 Internal Server Error status code
                success: false,
                message: `Hubo un error al actualizar la imagen`,
                data: {}
            });
        }
    },

    async findDeliveryMen(request, response, next) {
        try {
            const data = await User.findDeliveryMen();

            return response.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return response.status(501).json({
                success: false,
                message: `Error al obtener los repartidores`
            });
        }
    }
};
