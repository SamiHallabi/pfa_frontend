
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = {};
    }

    connect(callback) {
        const socket = new SockJS('http://localhost:8080/theater-websocket');
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, () => {
            this.connected = true;
            if (callback) callback();
        }, (error) => {
            console.error('STOMP connection error:', error);
            setTimeout(() => {
                this.connect(callback);
            }, 5000);
        });
    }

    subscribe(destination, callback) {
        if (!this.connected) {
            this.connect(() => this.subscribe(destination, callback));
            return;
        }

        if (!this.subscriptions[destination]) {
            this.subscriptions[destination] = this.stompClient.subscribe(destination, (message) => {
                const payload = JSON.parse(message.body);
                callback(payload);
            });
        }
    }

    unsubscribe(destination) {
        if (this.subscriptions[destination]) {
            this.subscriptions[destination].unsubscribe();
            delete this.subscriptions[destination];
        }
    }

    send(destination, body) {
        if (!this.connected) {
            this.connect(() => this.send(destination, body));
            return;
        }

        this.stompClient.send(destination, {}, JSON.stringify(body));
    }

    disconnect() {
        if (this.stompClient && this.connected) {
            this.stompClient.disconnect();
            this.connected = false;
            this.subscriptions = {};
        }
    }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;