const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Frontend connected for packet stream");
});

// Endpoint for Python script to send packets
app.post("/packet", (req, res) => {
  const packetData = req.body;
  io.emit("packet", packetData);
  res.sendStatus(200);
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Packet backend running on port ${PORT}`);
});

