import { Server } from "socket.io";
import { IRoom } from "taro-common";
/**
 * @returns {string[]} Возвращает ID всех доступных комнат для текущего пользователя
 */
export declare function getClientRooms(io: Server): IRoom["id"][];
/**
 * Создает событие, которое отправляет на клиент все доступные комнаты для текущего пользователя
 */
export declare function shareRoomsInfo(io: Server): void;
export declare function validateAvailableRooms(roomID: IRoom["id"]): void;
