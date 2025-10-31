import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function PacketSniffing() {
  const [packets, setPackets] = useState([]);

  useEffect(() => {
    socket.on("packet", (data) => {
      setPackets((prev) => [data, ...prev.slice(0, 50)]); // show recent 50
    });
    return () => socket.off("packet");
  }, []);

  return (
    <div className="p-6 bg-black text-green-400 font-mono rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-white">
        📡 Real-time Packet Sniffing
      </h2>
      <div className="h-[500px] overflow-y-scroll space-y-2">
        {packets.map((pkt, i) => (
          <pre
            key={i}
            className="bg-gray-900 p-3 rounded-md border border-gray-700"
          >
            {JSON.stringify(pkt, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
}

