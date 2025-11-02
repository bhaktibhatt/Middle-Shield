import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { spawn } from "child_process";
import path from "path";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let pythonProcess = null;

// 🛰️ Socket connections
io.on("connection", (socket) => {
  console.log("Frontend connected for packet stream");

  // 🚀 Start sniffing
  socket.on("start-sniffing", () => {
    if (pythonProcess) {
      console.log("Sniffer already running.");
      return;
    }

    console.log("🚀 Starting Python packet sniffer...");

    // Path to Python script
    const scriptPath = path.resolve("./packet_sniffer.py");

    // Spawn Python from your virtual environment directly
    pythonProcess = spawn(
      "./venv/bin/python3",
      [scriptPath],
      { cwd: path.resolve("./") } // ensure correct working directory
    );

    // Capture Python stdout and send to console
    pythonProcess.stdout.on("data", (data) => {
      console.log(`[PYTHON]: ${data.toString().trim()}`);
    });

    // Capture Python stderr for debugging
    pythonProcess.stderr.on("data", (data) => {
      console.error(`[PYTHON ERROR]: ${data.toString().trim()}`);
    });

    // When Python exits
    pythonProcess.on("close", (code) => {
      console.log(`Python sniffer stopped (code ${code})`);
      pythonProcess = null;
    });
  });

  // 🛑 Stop sniffing
  socket.on("stop-sniffing", () => {
    if (pythonProcess) {
      console.log("🛑 Stopping Python sniffer...");
      pythonProcess.kill("SIGINT");
      pythonProcess = null;
    } else {
      console.log("Sniffer not running.");
    }
  });
});

// Endpoint to receive packets from Python
app.post("/packet", (req, res) => {
  const packetData = req.body;
  io.emit("packet", packetData);
  res.sendStatus(200);
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Packet backend running on port ${PORT}`);
});

