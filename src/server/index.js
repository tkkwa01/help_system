//server/index.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080, host: '0.0.0.0' });

wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    const seatNumber = parseInt(ip.split('.').pop()) - 10;

    console.log('A new client connected from:', ip, ' Seat number:', seatNumber);

    ws.on('message', function incoming(data) {
        console.log('Received: %s', data);

        try {
            const message = JSON.parse(data);
            message.seatNumber = seatNumber;

            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        } catch (e) {
            console.error('Error parsing message', e);
        }
    });
});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        console.log(`Received message: ${data}`);
        try {
            const message = JSON.parse(data);

            if (message.type === 'resolve_help_request') {
                console.log(`Resolving help request for seat: ${message.seatNumber}`);
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'remove_highlight', seatNumber: message.seatNumber }));
                    }
                });
            }
        } catch (e) {
            console.error('Error parsing message', e);
        }
    });
});

console.log(`WebSocket server is running on ws://${wss.options.host}:${wss.options.port}`);