import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./PacketSniffing.css";

const socket = io("http://localhost:5000");

export default function PacketSniffing() {
  const [packets, setPackets] = useState([]);
  const [isSniffing, setIsSniffing] = useState(false);

  useEffect(() => {
    if (isSniffing) {
      socket.on("packet", (data) => {
        setPackets((prev) => [data, ...prev.slice(0, 50)]);
      });
    }
    return () => socket.off("packet");
  }, [isSniffing]);

  const startSniffing = () => {
    setIsSniffing(true);
    socket.emit("start-sniffing");
  };

  const stopSniffing = () => {
    setIsSniffing(false);
    socket.emit("stop-sniffing");
  };

  return (
    <div className="packet-sniffing-page">
      <h2 className="page-title">📡 Real-time Packet Sniffing</h2>
      <p className="page-subtitle">
        Monitor and analyze live network traffic in real-time.
      </p>

      <div className="control-panel">
        <h3>Control Panel</h3>
        <div className="button-row">
          <button
            className={`run-btn ${isSniffing ? "active" : ""}`}
            onClick={startSniffing}
            disabled={isSniffing}
          >
            ▶ {isSniffing ? "Sniffing..." : "Start Packet Sniffing"}
          </button>

          <button
            className={`stop-btn ${!isSniffing ? "disabled" : ""}`}
            onClick={stopSniffing}
            disabled={!isSniffing}
          >
            ⏹ Stop Sniffing
          </button>
        </div>
      </div>

      <div className="packet-display">
        {packets.length === 0 ? (
          <p className="no-data">
            {isSniffing
              ? "Listening for packets..."
              : "Click 'Start Packet Sniffing' to begin capturing packets."}
          </p>
        ) : (
          packets.map((pkt, i) => (
            <div key={i} className="packet-box">
              <pre>{JSON.stringify(pkt, null, 2)}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

