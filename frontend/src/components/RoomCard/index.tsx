import * as React from 'react';
import { Avatar } from 'antd';
import './style.css';

interface Room {
  room_id: string;
  player_id: string;
  player_name: string;
  player_avatar: string;
}

interface RoomCardProps {
  room: Room;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => (
  <div key={room.room_id} className="room-card">
    <Avatar
      src={room.player_avatar}
      style={{ backgroundColor: getRandomColor() }}
    >
      Sala
      {/* {room.player_name.substring(0, 1).toUpperCase()} */}
    </Avatar>
    <div className="room-info">
      <p className="room-name">{room.player_name}</p>
    </div>
  </div>
);

export default RoomCard;
