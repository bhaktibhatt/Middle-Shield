// src/components/PacketSniffing.tsx
// (No 'import React' needed since no hooks or named exports are used, 
// and the new JSX transform handles the JSX conversion)

export default function PacketSniffing(): JSX.Element {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Packet Sniffing</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <p className="text-sm text-gray-600 mb-4">
          This page shows live-captured packets (sample UI). To stream real packets,
          connect to a backend service that supplies pcap events over WebSocket or SSE.
        </p>

        <div className="space-y-3">
          {/* Example: summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-md">
              <div className="text-xs text-gray-500">Captured Packets</div>
              <div className="text-xl font-bold">0</div>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-xs text-gray-500">Unique IPs</div>
              <div className="text-xl font-bold">0</div>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-xs text-gray-500">Suspicious</div>
              <div className="text-xl font-bold">0</div>
            </div>
          </div>

          {/* Example packet table */}
          <div className="overflow-auto">
            <table className="min-w-full text-left">
              <thead>
                {/* UPDATED: Changed text-gray-500 to text-gray-800 for better visibility */}
                <tr className="text-sm text-gray-800 border-b"> 
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Src IP</th>
                  <th className="py-2 px-3">Dst IP</th>
                  <th className="py-2 px-3">Proto</th>
                  <th className="py-2 px-3">Length</th>
                </tr>
              </thead>
              <tbody>
                {/* map over packets state here */}
                <tr>
                  {/* UPDATED: Changed text-gray-700 to text-gray-900 for guaranteed visibility */}
                  <td className="py-2 px-3 text-sm text-gray-900">—</td>
                  <td className="py-2 px-3 text-sm text-gray-900">—</td>
                  <td className="py-2 px-3 text-sm text-gray-900">—</td>
                  <td className="py-2 px-3 text-sm text-gray-900">—</td>
                  <td className="py-2 px-3 text-sm text-gray-900">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Controls: start/stop capture (UI only) */}
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-blue-600 text-white">Start</button>
            <button className="px-4 py-2 rounded border">Stop</button>
          </div>
        </div>
      </div>
    </div>
  );
}