const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

io.on("connection", (socket) => {
    console.log("Player connected");

    socket.on("join-room", (roomId, player) => {
        socket.join(roomId);

        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }

        rooms[roomId].push(player);

        io.to(roomId).emit("update-players", rooms[roomId]);
    });

    socket.on("shoot", (data) => {
        io.to(data.roomId).emit("player-shot", data);
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running");
});