//HelpRequestForm.js
import React, { useEffect, useState } from 'react';

const issueTypes = {
    1: '資料について質問がある',
    2: '課題について質問がある',
    3: 'コマンドについて質問がある',
    4: '追いつけないので助けて欲しい',
    5: 'パソコン自体の挙動がおかしい'
};

const HelpRequestsList = ({ websocket }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const onMessage = (event) => {
            const message = JSON.parse(event.data);
            // マッピングを使用して問題のテキストを取得
            const issueText = issueTypes[message.issue] || '解決済み';
            setRequests(prev => [...prev, { seatId: message.seatNumber.toString(), issue: issueText }]);
        };

        websocket && websocket.addEventListener('message', onMessage);

        return () => {
            websocket && websocket.removeEventListener('message', onMessage);
        };
    }, [websocket]);

    const handleResolve = (index) => {
        const request = requests[index];
        console.log(`Resolving request at seat: ${request.seatId}`);
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({ type: 'resolve_help_request', seatNumber: parseInt(request.seatId, 10) }));
        }
        setRequests(prev => {
            const updatedRequests = prev.filter((_, i) => i !== index);
            console.log(`Updated requests: `, updatedRequests);
            return updatedRequests;
        });
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
