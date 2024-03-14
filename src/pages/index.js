//pages/index.js
import React, { useState, useEffect } from 'react';
import { Button, InputLabel, MenuItem, FormControl, Select, Grid } from '@mui/material';

export default function HelpRequestForm() {
    const [issue, setIssue] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // WebSocketクライアントの初期化
        const webSocket = new WebSocket(`ws://${location.hostname}:8080`);
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
        if (ws && issue) {
            ws.send(JSON.stringify({ type: 'help_request', issue: issue }));
        }
    };

    return (
        <Grid container direction="column" alignItems="center" justifyContent="flex-start" style={{ minHeight: '100vh', paddingTop: '25vh' }}>
            <Grid item>
                <FormControl fullWidth style={{ width: '50%', minWidth: '300px', maxWidth: '600px' }}>
                    <InputLabel id="issue-select-label">困っていること</InputLabel>
                    <Select
                        labelId="issue-select-label"
                        id="issue-select"
                        value={issue}
                        label="困っていること"
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    >
                        <MenuItem value={1}>資料について質問がある</MenuItem>
                        <MenuItem value={2}>課題について質問がある</MenuItem>
                        <MenuItem value={3}>コマンドについて質問がある</MenuItem>
                        <MenuItem value={4}>追いつけないので助けて欲しい</MenuItem>
                        <MenuItem value={5}>パソコン自体の挙動がおかしい</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item style={{ marginTop: '20px' }}>
                <Button variant="contained" onClick={handleHelpClick}>Help</Button>
            </Grid>
        </Grid>
    );
}
