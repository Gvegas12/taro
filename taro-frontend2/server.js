import path from "path";
import express from "express";
import http from "http";
import SOCKET_ACTIONS from "./socket/actions.js";
import { version, validate } from "uuid";

const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);

const PORT = 5174;

function validateAvailableRooms(roomID) {
  validate(roomID) && version(roomID) === 4;
}

/**
 * @returns Возвращает ID всех доступных комнат для текущего пользователя
 */
function getClientRooms() {
  const { rooms } = io.sockets.adapter;

  return Array.from(rooms.keys()).filter(validateAvailableRooms);
}

/**
 * Создает событие, которое отправляет на клиент все доступные комнаты для текущего пользователя
 */
function shareRoomsInfo() {
  io.emit(SOCKET_ACTIONS.SHARE_ROOMS, {
    rooms: getClientRooms(),
  });
}

io.on("connection", (socket) => {
  shareRoomsInfo();

  socket.on(SOCKET_ACTIONS.JOIN, (config) => {
    const { room: roomID } = config;
    const { rooms: joinedRooms } = socket;

    console.log("connection", { room: roomID, joinedRooms: joinedRooms });

    if (Array.from(joinedRooms).includes(roomID)) {
      console.log("client joined in room: " + roomID);

      return console.warn(`Already joined to ${roomID}`);
    }

    // Получить id's участников созвона
    const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

    console.log({ clients });

    clients.forEach((clientID) => {
      io.to(clientID).emit(SOCKET_ACTIONS.ADD_PEER, {
        peerID: socket.id,
        createOffer: false,
      });

      socket.emit(SOCKET_ACTIONS.ADD_PEER, {
        peerID: clientID,
        createOffer: true,
      });
    });

    socket.join(roomID);
    shareRoomsInfo();
  });

  function leaveRoom() {
    const { rooms } = socket;

    Array.from(rooms)
      // LEAVE ONLY CLIENT CREATED ROOM
      .filter(validateAvailableRooms)
      .forEach((roomID) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

        clients.forEach((clientID) => {
          io.to(clientID).emit(SOCKET_ACTIONS.REMOVE_PEER, {
            peerID: socket.id,
          });

          socket.emit(SOCKET_ACTIONS.REMOVE_PEER, {
            peerID: clientID,
          });
        });

        socket.leave(roomID);
      });

    shareRoomsInfo();
  }

  socket.on(SOCKET_ACTIONS.LEAVE, leaveRoom);
  socket.on(SOCKET_ACTIONS.DISCONNECT, leaveRoom);

  socket.on(SOCKET_ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
    io.to(peerID).emit(SOCKET_ACTIONS.SESSION_DESCRIPTION, {
      peerID: socket.id,
      sessionDescription,
    });
  });

  socket.on(SOCKET_ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
    io.to(peerID).emit(SOCKET_ACTIONS.ICE_CANDIDATE, {
      peerID: socket.id,
      iceCandidate,
    });
  });
});

/* const publicPath = path.join(__dirname, "build");

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
 */

server.listen(PORT, () => {
  console.log("Server Started!");
});
