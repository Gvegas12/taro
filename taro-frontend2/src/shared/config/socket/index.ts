import { io, ManagerOptions } from "socket.io-client";

const options: Partial<ManagerOptions> = {
  forceNew: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  timeout: 10000, // 10s timeout
  transports: ["websocket"],
  autoConnect: true,
};

const socket = io("https://5685-147-30-79-5.ngrok-free.app", options);

export default socket;
