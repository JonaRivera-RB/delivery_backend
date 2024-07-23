// Import the 'http' module to create an HTTP server
const http = require('http');

// Import the Express application from the './app' file
const app = require('./app');

// Configure the port on which the server will run.
// If the 'PORT' environment variable is defined, that value will be used; otherwise, the default port 3000 will be used.
const port = process.env.PORT || 3000;

// Set the port in the Express application
app.set('port', port);

// Create the HTTP server with the Express application
const server = http.createServer(app);

const io = require('socket.io')(server);
const orderDeliverySocket = require('./sockets/orders_delivery_socket');


//CALL SOCKET 
orderDeliverySocket(io);

// The server listens for requests on the specified port and IP address '192.168.1.64'.
// Once the server has started successfully, the callback function is executed and a message is printed to the console.
//ipconfig getifaddr en0 obtener ip conectado a wifi || localhost
server.listen(port, '192.168.1.103', () => {
    console.log(`Node.js application started on port ${port}`);
});
