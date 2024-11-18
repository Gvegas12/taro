"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientRooms = getClientRooms;
exports.shareRoomsInfo = shareRoomsInfo;
exports.validateAvailableRooms = validateAvailableRooms;
const uuid_1 = require("uuid");
const taro_common_1 = require("taro-common");
/**
 * @returns {string[]} Возвращает ID всех доступных комнат для текущего пользователя
 */
function getClientRooms(io) {
    const { rooms } = io.sockets.adapter;
    return Array.from(rooms.keys()).filter(validateAvailableRooms);
}
/**
 * Создает событие, которое отправляет на клиент все доступные комнаты для текущего пользователя
 */
function shareRoomsInfo(io) {
    io.emit(taro_common_1.SOCKET_ACTIONS.SHARE_ROOMS, {
        rooms: getClientRooms(io),
    });
}
function validateAvailableRooms(roomID) {
    (0, uuid_1.validate)(roomID) && (0, uuid_1.version)(roomID) === 4;
}
