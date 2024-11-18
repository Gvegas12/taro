import { RoomID } from "../../types";
import { SOCKET_ACTIONS } from "taro-common";
import { Server, Socket } from "socket.io";
import { shareRoomsInfo, validateAvailableRooms } from "../../utils";

class UserService {
  constructor(private socket: Socket, private server: Server) {}

  /**
   * Событие Вход в комнату
   */
  onJoinTheRoom() {
    const io = this.server;

    // Отправить информацию о комнате кандидату
    shareRoomsInfo(io);

    this.socket.on(SOCKET_ACTIONS.JOIN, (config) => {
      const { room: roomID } = config;
      const { rooms: joinedRooms } = this.socket;

      console.log("connection", { room: roomID, joinedRooms: joinedRooms });

      if (this.isAlreadyJoined(roomID, Array.from(joinedRooms))) {
        return console.warn(`Already joined to ${roomID}`);
      }

      // Получить информацию о клиентах в комнате
      const clients = this.getRoomClientsIDs(roomID);

      // Обмениваемся пирами TODO
      clients.forEach((clientID) => {
        io.to(clientID).emit(SOCKET_ACTIONS.ADD_PEER, {
          peerID: this.socket.id,
          createOffer: false,
        });

        this.socket.emit(SOCKET_ACTIONS.ADD_PEER, {
          peerID: clientID,
          createOffer: true,
        });
      });

      // Подключаем клиента к комнате
      this.socket.join(roomID);

      // Отправить информацию о комнате после подключения
      shareRoomsInfo(io);
    });
  }

  /**
   * Событие Выйти из комнаты
   */
  onLeaveTheRoom() {
    this.socket.on(SOCKET_ACTIONS.LEAVE, this.leaveTheRoomEventFn);
  }

  /**
   * Событие Отсоединиться от сервера
   */
  onDisconnectTheRoom() {
    this.socket.on(SOCKET_ACTIONS.DISCONNECT, this.leaveTheRoomEventFn);
  }

  /**
   * Событие Передача SDP данных (стримы с медиа-данными) TODO
   */
  onRelaySDP() {
    this.socket.on(
      SOCKET_ACTIONS.RELAY_SDP,
      ({ peerID, sessionDescription }) => {
        /** Отправить данные новой сессии */
        this.server.to(peerID).emit(SOCKET_ACTIONS.SESSION_DESCRIPTION, {
          peerID: this.socket.id,
          sessionDescription,
        });
      }
    );
  }

  /**
   * Событие Передача ICE-кандидатов (физические подключения) TODO
   */
  onRelayICE() {
    this.socket.on(SOCKET_ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
      /** Передать ICE-кандидатов */
      this.server.to(peerID).emit(SOCKET_ACTIONS.ICE_CANDIDATE, {
        peerID: this.socket.id,
        iceCandidate,
      });
    });
  }

  /**
   * Событие Выход из комнаты
   */
  private leaveTheRoomEventFn() {
    const rooms = this.socket?.rooms;
    const io = this.server;

    if (rooms) {
      Array.from(rooms)
        // Вытаскиваем созданную клиентом комнату
        .filter(validateAvailableRooms)
        .forEach((roomID) => {
          // Получаем всех участников комнаты
          const clients = this.getRoomClientsIDs(roomID);

          // Отправляем уведомление о выходе участников из комнаты
          clients.forEach((clientID) => {
            io.to(clientID).emit(SOCKET_ACTIONS.REMOVE_PEER, {
              peerID: this.socket.id,
            });

            this.socket.emit(SOCKET_ACTIONS.REMOVE_PEER, {
              peerID: clientID,
            });
          });

          // Удалить клиента из комнаты
          this.socket.leave(roomID);
        });
    }

    // Отправить информацию о комнате после выхода
    shareRoomsInfo(io);
  }

  /**
   * @param {string} roomID ID текущей комнаты
   * @param {string[]} joinedRooms IDs всех доступных комнат
   * @returns {boolean} Подключен ли пользователь к комнате
   */
  private isAlreadyJoined(roomID: RoomID, joinedRooms: RoomID[]): boolean {
    console.log("client joined in room: " + roomID);

    return joinedRooms.includes(roomID);
  }

  /**
   * @param {string} roomID ID текущей комнаты
   * @returns Получить id's участников созвона
   */
  private getRoomClientsIDs(roomID: RoomID): string[] {
    return Array.from(this.server.sockets.adapter.rooms.get(roomID) || []);
  }
}

export default UserService;
