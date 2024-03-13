import React, { useEffect, useState } from 'react';

const SeatMap = () => {
    const [seats, setSeats] = useState(new Array(20).fill(false)); // 20席を想定
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // WebSocket接続を開始
        const webSocket = new WebSocket('ws://localhost:8080');
        setWs(webSocket);

        webSocket.onmessage = (event) => {
            try {
                // サーバーからのメッセージを受信し、JSON形式であるか試みて解析
                const message = JSON.parse(event.data);
                // JSON形式の場合、席のハイライト状態を更新
                updateSeatHighlight(message.seatNumber);
            } catch (error) {
                // 受信したメッセージがJSON形式でない場合は、ここで処理される
                console.error('Received message is not valid JSON:', error);
            }
        };

        return () => {
            webSocket.close();
        };
    }, []);

    const updateSeatHighlight = (seatNumber) => {
        setSeats((prevSeats) => prevSeats.map((highlighted, index) =>
            index === seatNumber - 1 ? true : highlighted)); // 席番号は1から始まると想定
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {seats.map((highlighted, index) => (
                <div
                    key={index}
                    style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: highlighted ? 'red' : 'grey',
                    }}
                >
                    {index + 1}
                </div>
            ))}
        </div>
    );
};

export default SeatMap;
