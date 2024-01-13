import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

const usersInRooms = {};
@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
    },
})
export class ChannelGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    private rooms: Map<string, Set<string>> = new Map();

    handleConnection(client: Socket) {
        console.log(`Usuário conectado: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Usuário desconectado: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { userName: string; roomId: string },
    ) {
        client.join(data.roomId);

        if (!usersInRooms[client.id]) {
            usersInRooms[client.id] = [];
        }
        usersInRooms[client.id].push(data.roomId);
        this.server
            .to(data.roomId)
            .emit('joinedRoom', data.roomId, data.userName);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody()
        data: {
            roomId: string;
            message: string;
            userName: string;
        },
    ) {
        this.sendMessageToRoom(data.roomId, data.message, data.userName);
    }

    private sendMessageToRoom(
        roomId: string,
        message: string,
        userName: string,
    ) {
        this.server
            .to(roomId)
            .emit('message', { message: message, userName: userName });
    }
}