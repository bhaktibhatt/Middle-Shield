import { NetworkMetric } from '../types';

interface NetworkChartProps {
  metrics: NetworkMetric[];
  deviceName: string;
}

export default function NetworkChart({ metrics, deviceName }: NetworkChartProps) {
  const latestMetric = metrics[0];

  if (!latestMetric) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">{deviceName} - Metrics</h3>
        <p className="text-gray-600 text-center py-8">No metrics available</p>
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-bold text-gray-900 mb-6">{deviceName} - Real-time Metrics</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium mb-1">CPU Usage</p>
          <p className="text-2xl font-bold text-blue-900">{latestMetric.cpu_usage.toFixed(1)}%</p>
          <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${latestMetric.cpu_usage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 font-medium mb-1">Memory Usage</p>
          <p className="text-2xl font-bold text-purple-900">{latestMetric.memory_usage.toFixed(1)}%</p>
          <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full transition-all duration-300"
              style={{ width: `${latestMetric.memory_usage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Bandwidth In</p>
          <p className="text-xl font-bold text-gray-900">{formatBytes(latestMetric.bandwidth_in)}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Bandwidth Out</p>
          <p className="text-xl font-bold text-gray-900">{formatBytes(latestMetric.bandwidth_out)}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Active Connections</p>
          <p className="text-xl font-bold text-gray-900">{latestMetric.active_connections.toLocaleString()}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Dropped Packets</p>
          <p className="text-xl font-bold text-gray-900">{latestMetric.dropped_packets.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
