const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080, host: '0.0.0.0' });

wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    console.log('A new client connected from:', ip);

    // ここでIPアドレスの下2桁を計算し、10を引くなどの処理を行う

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
});

console.log(`WebSocket server is running on ws://${wss.options.host}:${wss.options.port}`);