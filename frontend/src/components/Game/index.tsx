import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import PlayerCard from 'components/PlayerCard';
import RoomCard from 'components/RoomCard';
import { Button } from 'antd';
import LeaveRoomModal from 'components/Modal/LeaveRoomModal';
import Court from 'components/Court';
import {
  RoomGame,
  GameData,
  Match,
  MatchPadle,
  initialMatch,
  initialMatchPadle,
} from 'interfaces/gameInterfaces/interfaces';
import './style.css';

let socket: Socket;

export const Game = () => {
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  const [gameData, setGameData] = React.useState<GameData>({
    players: [],
    rooms: [],
    status: '',
    match: false,
    connected: false,
    message: '',
  });

  const [match, setMatch] = React.useState<Match>({} as Match);
  const [padle, setPadle] = React.useState<MatchPadle>({} as MatchPadle);

  socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  const [newMessage, setNewMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(true);
  }, [newMessage]);

  React.useEffect(() => {
    socket.on('connect', () => {
      socket.emit('PlayerConnected', user);
      setGameData(prevGameData => ({
        ...prevGameData,
        connected: true,
        status: 'CONNECTED',
      }));
    });

    socket.on('game', (receivedGame: GameData) => {
      const playersArray = Object.values(receivedGame.players);
      const roomsArray = Object.values(receivedGame.rooms);

      setGameData(prevGameData => ({
        ...prevGameData,
        players: playersArray,
        rooms: roomsArray,
      }));
    });

    socket.on('playerLeftRoom', (data: { message: string }) => {
      setNewMessage(data.message);

      setGameData(prevGameData => ({
        ...prevGameData,
        status: 'LEAVE',
        message: data.message,
        match: false,
      }));
    });

    socket.on('matchStarted', (receivedMacth: Match) => {
      setMatch(receivedMacth);
    });

    socket.on('movePadle', (receivedPadle: MatchPadle) => {
      setPadle(receivedPadle);
    });

    return () => {
      socket.disconnect();
      setNewMessage('Seu adversário se desconectou');
      setGameData(prevGameData => ({
        ...prevGameData,
        connected: false,
        status: 'DISCONNECTED',
      }));
    };
  }, [user]);

  const createRoom = () => {
    socket.emit('CreateRoom', userPlayer);
    setMatch(initialMatch);
    setPadle(initialMatchPadle);
    setGameData(prevGameData => ({
      ...prevGameData,
      match: true,
    }));
  };

  const getInRoom = (room: RoomGame) => {
    if (userPlayer.id !== room.player1.id) {
      room.player2 = userPlayer;
      socket.emit('GetInRoom', room);
      setGameData(prevGameData => ({
        ...prevGameData,
        match: true,
      }));
    } else {
      setGameData(prevGameData => ({
        ...prevGameData,
        status: `Você criou a sala ( ${room.player1.name} ), espere alguém entrar para jogar!`,
      }));
    }
    startMatch();
  };

  const leaveRoom = () => {
    socket.emit('leaveRoom', userPlayer);
    setMatch(initialMatch);
    setPadle(initialMatchPadle);
  };

  const startMatch = () => {
    socket.emit('startMatch', userPlayer);
  };

  const sendKey = (type: string, key: string) => {
    const player = userPlayer.id;
    const padleObj = {
      type,
      key,
      player,
    };
    socket.emit('sendKey', padleObj);
  };

  return (
    <>
      {gameData.match && gameData.connected ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
          }}
        >
          <h1 style={{ padding: '20px' }}>*** PONG ***</h1>
          <div>
            <Court matchData={match} matchPadles={padle} onSendKey={sendKey} />
          </div>
          <div style={{ padding: '20px' }}>
            <Button onClick={leaveRoom}>Sair da sala</Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flex: '70%', marginRight: '30px' }}>
            <h1 style={{ padding: '20px' }}>LOUNGE</h1>
            <h2 style={{ padding: '20px' }}>*** JOGADORES ***</h2>
            <div className="players-container">
              {gameData.players.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            <h2 style={{ padding: '20px' }}>*** SALAS ***</h2>
            <div>
              <Button onClick={createRoom}>Criar sala</Button>
            </div>
            <div className="rooms-container">
              {gameData.rooms.map(room => (
                <RoomCard
                  key={room.room_id}
                  room={room}
                  getInRoom={getInRoom}
                />
              ))}
            </div>
          </div>
          <div>
            <LeaveRoomModal visible={visible} message={newMessage} />
          </div>
        </div>
      )}
    </>
  );
};
