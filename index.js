require('dotenv').config();
const express = require('express');
const app = express();

const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

// MongoDB Connection
const ConnectDB = require('./Config/database');
ConnectDB();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const corsOptions = {
    origin: ["http://localhost:5173", "https://jobportal-5f7t.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Job Portal API');
});
app.use('/', require('./Routes/indexRoute'));

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://jobportal-5f7t.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});

// Store socket.io instance globally to access in controllers
app.set("io", io);

// Socket.IO events
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Start server using HTTP server (important for socket.io to work)
server.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server running with Socket.IO on http://localhost:${PORT}`);
});
