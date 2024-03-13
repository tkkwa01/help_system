import React, { useEffect, useState } from 'react';

const HelpRequestsList = ({ websocket }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const onMessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'help_request') {
                setRequests(prev => [...prev, message]);
            }
        };

        websocket.addEventListener('message', onMessage);

        return () => {
            websocket.removeEventListener('message', onMessage);
        };
    }, [websocket]);

    const handleResolve = (index) => {
        setRequests(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2>ヘルプ要求リスト</h2>
            <ul>
                {requests.map((request, index) => (
                    <li key={index}>
                        席番号: {request.seatId}, 問題: {request.issue}
                        <button onClick={() => handleResolve(index)}>対応済み</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HelpRequestsList;
