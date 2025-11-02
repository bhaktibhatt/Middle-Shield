import express from "express";
import cors from "cors";
import fs from "fs";
import { exec, spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;
const logFile = "/var/tmp/opencanary.log";
let canaryProcess = null;

/* --- Start OpenCanary --- */
app.post("/api/start-opencanary", (req, res) => {
  if (canaryProcess) {
    return res.json({ message: "OpenCanary is already running" });
  }

  const startCmd = `
    cd ~/backend/opencanary || cd ./opencanary
    python3 -m venv venv
    source venv/bin/activate
    opencanaryd --start
  `;

  try {
    canaryProcess = spawn(startCmd, { shell: true });

    canaryProcess.stdout.on("data", (data) => {
      console.log(`OpenCanary: ${data}`);
    });

    canaryProcess.stderr.on("data", (data) => {
      console.error(`OpenCanary Error: ${data}`);
    });

    canaryProcess.on("close", (code) => {
      console.log(`OpenCanary stopped with code ${code}`);
      canaryProcess = null;
    });

    res.json({ message: "OpenCanary started successfully" });
  } catch (err) {
    console.error("Error starting OpenCanary:", err);
    res.status(500).json({ error: "Failed to start OpenCanary" });
  }
});

/* --- Stop OpenCanary --- */
app.post("/api/stop-opencanary", (req, res) => {
  exec("opencanaryd --stop", (error, stdout, stderr) => {
    if (error) {
      console.error("Error stopping OpenCanary:", stderr);
      return res.status(500).json({ error: "Failed to stop OpenCanary" });
    }
    canaryProcess = null;
    res.json({ message: "OpenCanary stopped" });
  });
});

/* --- Get Logs --- */
app.get("/api/opencanary/logs", (req, res) => {
  try {
    if (!fs.existsSync(logFile)) {
      return res.json({ logs: "No logs yet. Waiting for activity..." });
    }
    const data = fs.readFileSync(logFile, "utf8");
    res.json({ logs: data.split("\n").slice(-40).join("\n") });
  } catch (err) {
    console.error("Error reading OpenCanary logs:", err);
    res.status(500).json({ error: "Failed to read log file" });
  }
});

/* --- Start Server --- */
app.listen(PORT, () => {
  console.log(`OpenCanary backend running on port ${PORT}`);
});
