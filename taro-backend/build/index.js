"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const UserService_js_1 = __importDefault(require("./src/services/UserService/UserService.js"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PORT = process.env.PORT || 5178;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    const userService = new UserService_js_1.default(socket, io);
    userService.onJoinTheRoom();
    userService.onLeaveTheRoom();
    userService.onDisconnectTheRoom();
    userService.onRelaySDP();
    userService.onRelayICE();
});
server.listen(PORT, () => {
    console.log("Server Started!");
});
