import express from "express";
import fs from "fs";
import cors from "cors";
import { exec } from "child_process";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

const logFile = "/var/log/suricata/eve.json";

/* --- 1️⃣ Restart Suricata --- */
app.post("/api/start-suricata", (req, res) => {
  const cmd = "sudo systemctl restart suricata";
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error restarting Suricata: ${stderr}`);
      return res.status(500).json({ success: false, message: stderr });
    }
    console.log("✅ Suricata restarted successfully");
    res.json({ success: true, message: "Suricata restarted successfully." });
  });
});

/* --- 2️⃣ Run Suricata Engine (restart + start engine) --- */
app.post("/api/run-suricata", (req, res) => {
  // First restart, then start engine
  const command = `
    echo "⚙ Restarting Suricata..."
    sudo systemctl restart suricata
    echo "🚀 Starting Suricata engine..."
    sudo suricata -c /etc/suricata/suricata.yaml -q 0
  `;

  // Execute combined commands
  const process = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Suricata run error:", stderr || error.message);
      return res.status(500).json({ error: stderr || error.message });
    }
    console.log("✅ Suricata engine started successfully");
    res.json({ message: "Suricata engine started successfully." });
  });

  // Stream output for debugging (optional)
  process.stdout.on("data", (data) => console.log(data.toString()));
  process.stderr.on("data", (data) => console.error(data.toString()));
});


/* --- 3️⃣ Stream fast.log live --- */
app.get("/api/live-logs", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const tail = exec("sudo tail -f /var/log/suricata/fast.log");
  tail.stdout.pipe(res);
  req.on("close", () => tail.kill());
});

/* --- 4️⃣ Helper: Read last few MBs of eve.json --- */
async function readLastBytes(filePath, bytes) {
  try {
    const stats = await fs.promises.stat(filePath);
    const start = Math.max(0, stats.size - bytes);
    const buffer = Buffer.alloc(stats.size - start);
    const fd = await fs.promises.open(filePath, "r");
    await fd.read(buffer, 0, buffer.length, start);
    await fd.close();
    return buffer.toString("utf8");
  } catch (err) {
    console.error("❌ File read error:", err.message);
    throw new Error("Unable to read eve.json");
  }
}

/* --- 5️⃣ Parse JSON safely --- */
function safeParse(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null; // skip malformed lines
  }
}

/* --- 6️⃣ Format log entries --- */
function formatEntry(json) {
  return {
    timestamp: json.timestamp || "N/A",
    event_type: json.event_type || "N/A",
    src_ip: json.src_ip || json.flow?.src_ip || "N/A",
    dest_ip: json.dest_ip || json.flow?.dest_ip || "N/A",
    signature: json.alert?.signature || "N/A",
    action: json.alert?.action || json.flow?.action || "N/A",
  };
}

/* --- 7️⃣ Alerts API --- */
app.get("/api/alerts", async (req, res) => {
  try {
    const content = await readLastBytes(logFile, 2_000_000);
    const alerts = content
      .split("\n")
      .filter(Boolean)
      .map(safeParse)
      .filter((e) => e && e.event_type === "alert")
      .map(formatEntry);

    res.json(alerts.slice(-100));
  } catch (err) {
    console.error("❌ Alerts error:", err.message);
    res.status(500).json({ error: "Failed to read alerts" });
  }
});

/* --- 8️⃣ Drops API --- */
app.get("/api/drops", async (req, res) => {
  try {
    const content = await readLastBytes(logFile, 2_000_000);
    const drops = content
      .split("\n")
      .filter(Boolean)
      .map(safeParse)
      .filter((e) => e && (e.action === "drop" || e.flow?.action === "drop"))
      .map(formatEntry);

    res.json(drops.slice(-100));
  } catch (err) {
    console.error("❌ Drops error:", err.message);
    res.status(500).json({ error: "Failed to read drops" });
  }
});

/* --- 9️⃣ Logs API --- */
app.get("/api/logs", async (req, res) => {
  try {
    const content = await readLastBytes(logFile, 2_000_000);
    const logs = content
      .split("\n")
      .filter(Boolean)
      .map(safeParse)
      .filter((e) => e) // skip nulls
      .map(formatEntry);

    res.json(logs.slice(-100));
  } catch (err) {
    console.error("❌ Logs error:", err.message);
    res.status(500).json({ error: "Failed to read logs" });
  }
});

/* --- 🔟 Start Server --- */
app.listen(PORT, () =>
  console.log(`🚀 Suricata Backend API running → http://localhost:${PORT}`)
);

