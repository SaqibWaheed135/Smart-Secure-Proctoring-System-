const socketIo = require('socket.io');

function setupWebSocketServer(server) {
    // Initialize Socket.io with the HTTP server
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:3000', // Replace with your frontend URL if different
            methods: ['GET', 'POST'],
        },
    });

    // WebSocket connection setup
    io.on('connection', (socket) => {
        console.log('New WebSocket connection');

        // Listen for messages from the client
        socket.on('preCheckComplete', (data) => {
            console.log('Message from client:', data);

            // Broadcast a message to all connected clients
            // io.emit('message', { text: 'Hello from the server!' });
            socket.broadcast.emit('preCheckStatus',data);
        });

        socket.on('postCheckComplete', (data) => {
            console.log('Message from client:', data);
           socket.broadcast.emit('openLiveStream',data);
        })

        socket.on('testEnded', (data) => {
            console.log('Message from client:', data);

            // Broadcast a message to all connected clients
            // io.emit('message', { text: 'Hello from the server!' });
            socket.broadcast.emit('testEnded',data);
        });

        // Handle WebSocket disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });


    // Return the io instance if needed elsewhere
    return io;
}

module.exports = setupWebSocketServer;