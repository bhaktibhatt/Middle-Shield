import './Honeypots.css';
import { useState, useEffect } from 'react';

function Honeypots() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState("");

  const handleStartOpenCanary = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/start-opencanary", {
        method: "POST",
      });

      if (res.ok) {
        setIsRunning(true);
      } else {
        console.error("Failed to start OpenCanary");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("❌ Error connecting to backend. Check if backend is running.");
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/opencanary/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || "No logs yet...");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchLogs, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="honeypot-page">
      <h1 className="page-title">🍯 Honeypot Control Panel</h1>

      <div className="control-panel">
        <button
          className={`run-btn ${isRunning ? "active" : ""}`}
          onClick={handleStartOpenCanary}
        >
          {isRunning ? "OpenCanary Running" : "Start OpenCanary"}
        </button>
      </div>

      <div className="log-section">
        <h2>OpenCanary Logs</h2>
        <div className="log-box">
          <pre>{logs}</pre>
        </div>
      </div>
    </div>
  );
}

export default Honeypots;

