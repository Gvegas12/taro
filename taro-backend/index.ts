import express from "express";
import http from "http";
import { Server } from "socket.io";
import UserService from "./src/services/UserService/UserService.js";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 5178;

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  const userService = new UserService(socket, io);

  userService.onJoinTheRoom();
  userService.onLeaveTheRoom();
  userService.onDisconnectTheRoom();
  userService.onRelaySDP();
  userService.onRelayICE();
});

server.listen(PORT, () => {
  console.log("Server Started!");
});
