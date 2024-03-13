import React, { createContext, useState, useEffect } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [websocket, setWebsocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://${location.hostname}:8080`);
        setWebsocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={websocket}>
            {children}
        </WebSocketContext.Provider>
    );
};
