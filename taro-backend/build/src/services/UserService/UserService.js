"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taro_common_1 = require("taro-common");
const utils_1 = require("../../utils");
class UserService {
    constructor(socket, server) {
        this.socket = socket;
        this.server = server;
    }
    /**
     * Событие Вход в комнату
     */
    onJoinTheRoom() {
        const io = this.server;
        // Отправить информацию о комнате кандидату
        (0, utils_1.shareRoomsInfo)(io);
        this.socket.on(taro_common_1.SOCKET_ACTIONS.JOIN, (config) => {
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
                io.to(clientID).emit(taro_common_1.SOCKET_ACTIONS.ADD_PEER, {
                    peerID: this.socket.id,
                    createOffer: false,
                });
                this.socket.emit(taro_common_1.SOCKET_ACTIONS.ADD_PEER, {
                    peerID: clientID,
                    createOffer: true,
                });
            });
            // Подключаем клиента к комнате
            this.socket.join(roomID);
            // Отправить информацию о комнате после подключения
            (0, utils_1.shareRoomsInfo)(io);
        });
    }
    /**
     * Событие Выйти из комнаты
     */
    onLeaveTheRoom() {
        this.socket.on(taro_common_1.SOCKET_ACTIONS.LEAVE, this.leaveTheRoomEventFn);
    }
    /**
     * Событие Отсоединиться от сервера
     */
    onDisconnectTheRoom() {
        this.socket.on(taro_common_1.SOCKET_ACTIONS.DISCONNECT, this.leaveTheRoomEventFn);
    }
    /**
     * Событие Передача SDP данных (стримы с медиа-данными) TODO
     */
    onRelaySDP() {
        this.socket.on(taro_common_1.SOCKET_ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
            /** Отправить данные новой сессии */
            this.server.to(peerID).emit(taro_common_1.SOCKET_ACTIONS.SESSION_DESCRIPTION, {
                peerID: this.socket.id,
                sessionDescription,
            });
        });
    }
    /**
     * Событие Передача ICE-кандидатов (физические подключения) TODO
     */
    onRelayICE() {
        this.socket.on(taro_common_1.SOCKET_ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
            /** Передать ICE-кандидатов */
            this.server.to(peerID).emit(taro_common_1.SOCKET_ACTIONS.ICE_CANDIDATE, {
                peerID: this.socket.id,
                iceCandidate,
            });
        });
    }
    /**
     * Событие Выход из комнаты
     */
    leaveTheRoomEventFn() {
        var _a;
        const rooms = (_a = this.socket) === null || _a === void 0 ? void 0 : _a.rooms;
        const io = this.server;
        if (rooms) {
            Array.from(rooms)
                // Вытаскиваем созданную клиентом комнату
                .filter(utils_1.validateAvailableRooms)
                .forEach((roomID) => {
                // Получаем всех участников комнаты
                const clients = this.getRoomClientsIDs(roomID);
                // Отправляем уведомление о выходе участников из комнаты
                clients.forEach((clientID) => {
                    io.to(clientID).emit(taro_common_1.SOCKET_ACTIONS.REMOVE_PEER, {
                        peerID: this.socket.id,
                    });
                    this.socket.emit(taro_common_1.SOCKET_ACTIONS.REMOVE_PEER, {
                        peerID: clientID,
                    });
                });
                // Удалить клиента из комнаты
                this.socket.leave(roomID);
            });
        }
        // Отправить информацию о комнате после выхода
        (0, utils_1.shareRoomsInfo)(io);
    }
    /**
     * @param {string} roomID ID текущей комнаты
     * @param {string[]} joinedRooms IDs всех доступных комнат
     * @returns {boolean} Подключен ли пользователь к комнате
     */
    isAlreadyJoined(roomID, joinedRooms) {
        console.log("client joined in room: " + roomID);
        return joinedRooms.includes(roomID);
    }
    /**
     * @param {string} roomID ID текущей комнаты
     * @returns Получить id's участников созвона
     */
    getRoomClientsIDs(roomID) {
        return Array.from(this.server.sockets.adapter.rooms.get(roomID) || []);
    }
}
exports.default = UserService;
