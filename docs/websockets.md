# WebSockets

The backend provides a WebSocket interface for real-time updates on filings.

## Connection

To connect to the WebSocket server, you need a valid JWT. You can obtain a short-lived (1 minute) JWT by making a GET request to the `/auth/ws-token` endpoint.

The WebSocket server is available at the `/filings` namespace.

### Example

```javascript
import { io } from 'socket.io-client';

const token = await getWsToken();

const socket = io('http://localhost:3000/filings', {
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('filing.created', (filing) => {
  console.log('Filing created:', filing);
});

socket.on('filing.updated', (filing) => {
  console.log('Filing updated:', filing);
});

socket.on('filing.moved', (filing) => {
  console.log('Filing moved:', filing);
});

socket.on('filing.removed', (data) => {
  console.log('Filing removed:', data.id);
});
```

## Events

The following events are emitted by the server:

- `filing.created`: A new filing has been created. The payload is the new filing object.
- `filing.updated`: A filing has been updated. The payload is the updated filing object.
- `filing.moved`: A filing has been moved to a new stage. The payload is the updated filing object.
- `filing.removed`: A filing has been removed. The payload is an object with the `id` of the removed filing.
