"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_ACTIONS = void 0;
var SOCKET_ACTIONS;
(function (SOCKET_ACTIONS) {
    SOCKET_ACTIONS["JOIN"] = "join";
    SOCKET_ACTIONS["LEAVE"] = "leave";
    SOCKET_ACTIONS["DISCONNECT"] = "disconnect";
    SOCKET_ACTIONS["SHARE_ROOMS"] = "share-rooms";
    /** Новое соединение между клиентом и сервером */
    SOCKET_ACTIONS["ADD_PEER"] = "add-peer";
    SOCKET_ACTIONS["REMOVE_PEER"] = "remove-peer";
    /** Передача SDP данных (стримы с медиа-данными) */
    SOCKET_ACTIONS["RELAY_SDP"] = "relay-sdp";
    /** Передача ICE-кандидатов (физические подключения) */
    SOCKET_ACTIONS["RELAY_ICE"] = "relay-ice";
    /** Реакция на ICE-кандидата (физическое подключения) */
    SOCKET_ACTIONS["ICE_CANDIDATE"] = "ice-candidate";
    /** Данные новой сессии */
    SOCKET_ACTIONS["SESSION_DESCRIPTION"] = "session-description";
})(SOCKET_ACTIONS || (exports.SOCKET_ACTIONS = SOCKET_ACTIONS = {}));
