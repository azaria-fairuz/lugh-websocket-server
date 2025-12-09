import { parse } from "url";
import { Elysia, t } from "elysia";

interface FrameMessage {
    width: number;
    height: number;
    camera_id: string;
    data: string;
}

const app = new Elysia();
const clients = new Set<any>();

app.ws("/frames", {
    query: t.Object({
        type: t.String()
    }),

    open(ws) {
        const id = crypto.randomUUID();
        const { type } = ws.data.query ?? "client";

        clients.add(ws);
        console.log(`[WS] New client connected`);
    },

    message(ws, message) {
        const data = message as FrameMessage;
        const now = new Date();

        // console.log(`[${now.toISOString()}] Received frame from camera: ${data.camera_id}, width: ${data.width}, height: ${data.height}`);

        if (app.server) {
            for (const client of clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            }
        }
    },

    close(ws) {
        clients.delete(ws);
        console.log(`[WS] A client disconnected`);
    }
});

app.listen(8502);

console.log("[WS] listening on ws://localhost:8502/frames");
