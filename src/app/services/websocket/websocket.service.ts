import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-seat'),
      reconnectDelay: 5000,
    });
    this.client.activate();
  }

  subscribeToSeatExpired(scheduleId: number, callback: (seatId: number) => void) {
    this.client.onConnect = () => {
      this.client.subscribe(`/topic/seat-expired/${scheduleId}`, (message: IMessage) => {
        const seatId = parseInt(message.body);
        callback(seatId);
        this.client.publish({
          destination: '/app/acknowledge',
          body: JSON.stringify({ seatId, status: 'received' })
        });
      });
    };
  }
}
