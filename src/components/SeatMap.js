import React, { useEffect, useState } from 'react';

const SeatMap = () => {
    const [seats, setSeats] = useState([
        [{exists: true, number: 43}, {exists: true, number: 35}, {exists: true, number: 26}, {exists: true, number: 17}, {exists: true, number: 9}, {exists: true, number: 1}],
        [{exists: true, number: 44}, {exists: true, number: 36}, {exists: true, number: 27}, {exists: true, number: 18}, {exists: true, number: 10}, {exists: true, number: 2}],
        [{exists: true, number: 45}, {exists: true, number: 37}, {exists: true, number: 28}, {exists: true, number: 19}, {exists: true, number: 11}, {exists: true, number: 3}],
        [{exists: true, number: 46}, {exists: true, number: 38}, {exists: true, number: 29}, {exists: true, number: 20}, {exists: true, number: 12}, {exists: true, number: 4}],
        [{exists: false}, {exists: false}, {exists: false}, {exists: false}, {exists: false}, {exists: false}],
        [{exists: true, number: 47}, {exists: true, number: 39}, {exists: true, number: 30}, {exists: true, number: 21}, {exists: true, number: 13}, {exists: true, number: 5}],
        [{exists: true, number: 48}, {exists: true, number: 40}, {exists: true, number: 31}, {exists: true, number: 22}, {exists: true, number: 14}, {exists: true, number: 6}],
        [{exists: true, number: 49}, {exists: true, number: 41}, {exists: true, number: 32}, {exists: true, number: 23}, {exists: true, number: 15}, {exists: true, number: 7}],
        [{exists: true, number: 50}, {exists: true, number: 42}, {exists: true, number: 33}, {exists: true, number: 24}, {exists: true, number: 16}, {exists: true, number: 8}],
        [{exists: false}, {exists: false}, {exists: true, number: 34}, {exists: true, number: 25}, {exists: false}, {exists: false}],
    ]);

    useEffect(() => {
        const webSocket = new WebSocket(`ws://${location.hostname}:8080`);

        webSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'help_request') {
                // 席のハイライトを更新する処理
                updateSeatHighlight(message.seatNumber, true);
            } else if (message.type === 'remove_highlight') {
                // 席のハイライトを解除する処理
                updateSeatHighlight(message.seatNumber, false);
            }
        };

        return () => webSocket.close();
    }, []);

    const updateSeatHighlight = (seatNumber, highlighted) => {
        setSeats((prevSeats) => prevSeats.map((row, rowIndex) =>
            row.map((seat, columnIndex) => {
                if (seat.exists && seat.number === seatNumber) {
                    return { ...seat, highlighted };
                }
                return seat;
            })
        ));
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
            {seats.flat().map((seat, index) => (
                <div
                    key={index}
                    style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: seat.highlighted ? 'red' : (seat.exists ? 'grey' : 'white'),
                        border: seat.exists ? '1px solid black' : 'none',
                    }}
                >
                    {seat.exists ? seat.number : ''}
                </div>
            ))}
        </div>
    );
};

export default SeatMap;
