import { Server, Socket } from "socket.io";
declare class UserService {
    private socket;
    private server;
    constructor(socket: Socket, server: Server);
    /**
     * Событие Вход в комнату
     */
    onJoinTheRoom(): void;
    /**
     * Событие Выйти из комнаты
     */
    onLeaveTheRoom(): void;
    /**
     * Событие Отсоединиться от сервера
     */
    onDisconnectTheRoom(): void;
    /**
     * Событие Передача SDP данных (стримы с медиа-данными) TODO
     */
    onRelaySDP(): void;
    /**
     * Событие Передача ICE-кандидатов (физические подключения) TODO
     */
    onRelayICE(): void;
    /**
     * Событие Выход из комнаты
     */
    private leaveTheRoomEventFn;
    /**
     * @param {string} roomID ID текущей комнаты
     * @param {string[]} joinedRooms IDs всех доступных комнат
     * @returns {boolean} Подключен ли пользователь к комнате
     */
    private isAlreadyJoined;
    /**
     * @param {string} roomID ID текущей комнаты
     * @returns Получить id's участников созвона
     */
    private getRoomClientsIDs;
}
export default UserService;
