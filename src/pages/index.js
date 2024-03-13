import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function HelpRequestForm() {
    const [issue, setIssue] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // WebSocketクライアントの初期化
        const webSocket = new WebSocket('ws://localhost:8080');
        webSocket.onopen = () => console.log('WebSocket Connected');
        webSocket.onclose = () => console.log('WebSocket Disconnected');
        webSocket.onmessage = (message) => {
            console.log('Message from server:', message.data);
        };
        setWs(webSocket);

        // コンポーネントのアンマウント時にWebSocketをクローズ
        return () => {
            webSocket.close();
        };
    }, []);

    const handleChange = (event) => {
        setIssue(event.target.value);
    };

    const handleHelpClick = () => {
        if (ws) {
            // サーバーに選択された問題の情報を送信
            ws.send(JSON.stringify({ issue: issue }));
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={handleHelpClick}>Help</Button>
            <FormControl fullWidth>
                <InputLabel id="issue-select-label">困っていること</InputLabel>
                <Select
                    labelId="issue-select-label"
                    id="issue-select"
                    value={issue}
                    label="困っていること"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>資料について質問がある</MenuItem>
                    <MenuItem value={20}>課題について質問がある</MenuItem>
                    <MenuItem value={30}>コマンドについて質問がある</MenuItem>
                    <MenuItem value={40}>追いつけないので助けて欲しい</MenuItem>
                    <MenuItem value={50}>パソコン自体の挙動がおかしい</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
