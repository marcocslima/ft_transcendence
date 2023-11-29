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
        this.leaveAllRooms(client);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { userName: string; roomId: string },
    ) {
        console.log('Room ID:', data.roomId);
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
        console.log(data);
        console.log(data.roomId);

        this.sendMessageToRoom(data.roomId, data.message, data.userName);
    }

    // private validatePassword(roomId: string, password?: string): boolean {
    //     console.log(roomId);
    //     if (password) console.log(password);
    //     return true;
    // }

    // private joinRoom(
    //     @ConnectedSocket() client: Socket,
    //     roomId: string,
    //     Username: string,
    // ) {
    //     client.join(roomId);
    //     // if (!this.rooms.has(roomId)) {
    //     //     this.rooms.set(roomId, new Set());
    //     // }
    //     // this.rooms.get(roomId).add(this.socket.id);
    //     console.log(Username, roomId);
    //     client.to(roomId).emit('joinedRoom', roomId, Username);
    // }

    private leaveAllRooms(client: Socket) {
        this.rooms.forEach((clients, roomId) => {
            if (clients.has(client.id)) {
                clients.delete(client.id);
                client.leave(roomId);
            }
        });
    }

    private sendMessageToRoom(
        roomId: string,
        message: string,
        userName: string,
    ) {
        console.log(`Recebida mensagem na sala ${roomId}: ${message}`);
        console.log(userName, roomId);
        this.server
            .to(roomId)
            .emit('message', { message: message, userName: userName });
    }
}
