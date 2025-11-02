import "./Suricata.css";
import { useState } from "react";

function Suricata() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [logData, setLogData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRunSuricata = async () => {
    alert("🚀 Starting Suricata Engine... Please wait.");

    try {
      const res = await fetch("http://localhost:5000/api/run-suricata", {
        method: "POST",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to start Suricata");
      }

      const data = await res.json();
      if (data.message && data.message.toLowerCase().includes("error")) {
        throw new Error(data.message);
      }

      setIsRunning(true);
      alert("✅ Suricata Engine Started Successfully!");
      console.log(data.message || "Suricata started!");
    } catch (err) {
      alert("❌ Suricata failed to start: " + err.message);
      setIsRunning(false);
    }
  };

  const fetchLogs = async (endpoint, tabName) => {
    setLoading(true);
    setActiveTab(tabName);
    setLogData("");

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`);
      if (!res.ok) throw new Error(`Failed to fetch ${tabName}`);
      const text = await res.text();
      setLogData(text || "No logs available.");
    } catch (err) {
      setLogData(`❌ Error loading ${tabName}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suricata-page">
      <h1 className="page-title">Suricata IDS/IPS</h1>
      <p className="page-description">
        Intrusion Detection and Prevention System for network traffic monitoring and threat detection.
      </p>

      <div className="control-panel">
        <h2>Control Panel</h2>
        <div className="button-row">
          <button
            className={`run-btn ${isRunning ? "active" : ""}`}
            onClick={handleRunSuricata}
            disabled={isRunning}
          >
            {isRunning ? "✅ Suricata Running" : "▶️ Run Suricata"}
          </button>

          <button
            className={`stop-btn ${activeTab === "logs" ? "blue" : ""}`}
            onClick={() => fetchLogs("live-logs", "logs")}
          >
            📄 View Logs
          </button>

          <button
            className={`stop-btn ${activeTab === "alerts" ? "blue" : ""}`}
            onClick={() => fetchLogs("alerts", "alerts")}
          >
            ⚠️ View Alerts
          </button>

          <button
            className={`stop-btn ${activeTab === "drops" ? "blue" : ""}`}
            onClick={() => fetchLogs("drops", "drops")}
          >
            🚫 Drop Logs
          </button>
        </div>
      </div>

      {/* Log display section */}
      <div className="log-section">
        {loading ? (
          <p className="loading-text">⏳ Loading {activeTab}...</p>
        ) : logData ? (
          <pre className="log-box">{logData}</pre>
        ) : (
          <p className="placeholder-text">Click a button above to view logs.</p>
        )}
      </div>
    </div>
  );
}

export default Suricata;

