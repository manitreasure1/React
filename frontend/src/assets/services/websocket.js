class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
  }

  connect() {
    this.ws = new WebSocket(process.env.REACT_APP_WS_URL);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      this.ws.send(JSON.stringify({
        type: 'auth',
        token: localStorage.getItem('token')
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const subscribers = this.subscribers.get(data.type) || [];
      subscribers.forEach(callback => callback(data));
    };

    this.ws.onclose = () => {
      console.log('WebSocket Disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType);
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const wsService = new WebSocketService();
export default wsService; 