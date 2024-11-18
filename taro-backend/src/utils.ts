import { Server } from "socket.io";
import { validate, version } from "uuid";
import { IRoom, SOCKET_ACTIONS } from "taro-common";

/**
 * @returns {string[]} Возвращает ID всех доступных комнат для текущего пользователя
 */
export function getClientRooms(io: Server): IRoom["id"][] {
  const { rooms } = io.sockets.adapter;

  return Array.from(rooms.keys()).filter(validateAvailableRooms);
}

/**
 * Создает событие, которое отправляет на клиент все доступные комнаты для текущего пользователя
 */
export function shareRoomsInfo(io: Server) {
  io.emit(SOCKET_ACTIONS.SHARE_ROOMS, {
    rooms: getClientRooms(io),
  });
}

export function validateAvailableRooms(roomID: IRoom["id"]) {
  validate(roomID) && version(roomID) === 4;
}
