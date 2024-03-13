import React, { useState, useContext } from 'react';
import { WebSocketContext } from '@/contexts/WebSocketContext';

const HelpRequestForm = () => {
    const [selectedIssue, setSelectedIssue] = useState('');
    const ws = useContext(WebSocketContext); // WebSocket接続をコンテキストから取得

    const handleSubmit = (event) => {
        event.preventDefault();
        if (ws && ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                type: 'help_request',
                issue: selectedIssue,
            });
            ws.send(message);
            console.log('Help request sent:', selectedIssue);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                問題の種類:
                <select value={selectedIssue} onChange={(e) => setSelectedIssue(e.target.value)}>
                    <option value="">選択してください</option>
                    <option value="documents">資料について質問がある</option>
                    <option value="assignment">課題について質問がある</option>
                    <option value="commands">コマンドについて質問がある</option>
                    <option value="catch_up">追いつけないので助けて欲しい</option>
                    <option value="pc_issue">パソコン自体の挙動がおかしい</option>
                </select>
            </label>
            <button type="submit">ヘルプを要求</button>
        </form>
    );
};

export default HelpRequestForm;
