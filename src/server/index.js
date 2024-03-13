const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('A new client connected.');

    ws.on('message', function incoming(data) {
        console.log('Received: %s', data);

        try {
            // 受信したデータをJavaScriptオブジェクトに変換
            const message = JSON.parse(data);

            // 受信したメッセージをそのまま全クライアントにブロードキャスト
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        } catch (e) {
            console.error('Error parsing message', e);
        }
    });

    // 接続されたクライアントに歓迎メッセージを送信
    // ws.send('Welcome to the WebSocket server!');
});

console.log('WebSocket server is running on ws://localhost:8080');
