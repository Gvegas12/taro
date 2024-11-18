import { FC, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { SOCKET_ACTIONS } from "taro-common";
import socket from "@/shared/config/socket";
import { ROUTE_PATHS } from "@/shared/config/router";

interface SocketComponentProps {}

export const SocketComponent: FC<SocketComponentProps> = () => {
  const [rooms, updateRooms] = useState([]);
  const navigate = useNavigate();
  const rootNode = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on(SOCKET_ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
      if (rootNode.current) updateRooms(rooms);
    });
  }, []);

  const joinRoomHandler = (roomID: string) => {
    console.log("joinRoomHandler", { roomID });
    navigate(ROUTE_PATHS.ROOM + roomID);
  };

  const createNewRoomHandler = () => {
    const roomID = v4();
    navigate(ROUTE_PATHS.ROOM + roomID);
    console.log("createNewRoomHandler");
  };

  return (
    <div ref={rootNode}>
      <h1>Av. Rooms</h1>
      <button onClick={createNewRoomHandler}>Create New Room</button>

      <ul>
        {rooms.map((roomID) => (
          <li key={roomID}>
            {roomID}
            <button onClick={() => joinRoomHandler(roomID)}>JOIN ROOM</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
