export const SOCKET_ACTIONS = {
  JOIN: "join",
  LEAVE: "leave",
  DISCONNECT: "disconnect",
  SHARE_ROOMS: "share-rooms",
  /** Новое соединение между клиентом и сервером */
  ADD_PEER: "add-peer",
  REMOVE_PEER: "remove-peer",
  /** Передача SDP данных (стримы с медиа-данными) */
  RELAY_SDP: "relay-sdp",
  /** Передача ICE-кандидатов (физические подключения) */
  RELAY_ICE: "relay-ice",
  /** Реакция на ICE-кандидата (физическое подключения) */
  ICE_CANDIDATE: "ice-candidate",
  /** Данные новой сессии */
  SESSION_DESCRIPTION: "session-description",
};
