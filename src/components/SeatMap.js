import React, { useEffect, useState } from 'react';

const SeatMap = () => {
    const [seats, setSeats] = useState(new Array(20).fill(false)); // 20席を想定
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const webSocket = new WebSocket(`ws://${location.hostname}:8080`);

        webSocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                // 席のハイライトを解除する処理
                if (message.type === 'remove_highlight') {
                    updateSeatHighlight(message.seatNumber, false);
                } else if (message.seatNumber) {
                    // 席のハイライトを更新する処理
                    updateSeatHighlight(message.seatNumber, true);
                }
            } catch (error) {
                console.error('Received message is not valid JSON:', error);
            }
        };
        return () => webSocket.close();
    }, []);

    const updateSeatHighlight = (seatNumber, highlighted) => {
        setSeats((prevSeats) => prevSeats.map((highlight, index) =>
            index === seatNumber - 1 ? highlighted : highlight));
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
