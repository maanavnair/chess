import { useEffect, useState } from "react"

const WS_URL = "ws://localhost:8080";


export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            console.log("connected");
            setSocket(ws);
        }

        ws.onclose = () => {
            console.log("disconnected");
            setSocket(null);
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            setSocket(null);
        }
    }, [])

    return socket;
}