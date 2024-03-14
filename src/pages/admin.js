//admin.js
import React, { useState, useEffect } from 'react';
import SeatMap from '../components/SeatMap';
import HelpRequestsList from '../components/HelpRequestsList';

const AdminPage = () => {
    const [websocket, setWebsocket] = useState(null);

    useEffect(() => {
        // WebSocket接続を確立
        const ws = new WebSocket(`ws://${location.hostname}:8080`);

        ws.onopen = () => {
            console.log('WebSocket connection established');
            setWebsocket(ws); // WebSocket接続を状態に保存
        };

        ws.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        // コンポーネントのクリーンアップ時にWebSocket接続をクローズ
        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h1>管理者画面</h1>
            {websocket && <SeatMap websocket={websocket} />}
            {websocket && <HelpRequestsList websocket={websocket} />}
        </div>
    );
};

export default AdminPage;
