
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt.guard';
import { FilingsService } from './filings.service';

@WebSocketGateway({ namespace: '/filings' })
export class FilingsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly filingsService: FilingsService) {}

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return data;
  }
}
