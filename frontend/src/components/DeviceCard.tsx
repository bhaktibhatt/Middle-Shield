import { Server, Router, Shield, Activity } from 'lucide-react';
import { Device } from '../types';

interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

const deviceIcons = {
  switch: Server,
  router: Router,
  firewall: Shield,
  load_balancer: Activity,
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
};

const statusTextColors = {
  online: 'text-green-700',
  offline: 'text-gray-700',
  warning: 'text-yellow-700',
  critical: 'text-red-700',
};

export default function DeviceCard({ device, onClick }: DeviceCardProps) {
  const Icon = deviceIcons[device.device_type];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer hover:border-blue-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-slate-700" />
        </div>
        <div className="flex items-center space-x-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusColors[device.status]} animate-pulse`}></span>
          <span className={`text-xs font-semibold uppercase ${statusTextColors[device.status]}`}>
            {device.status}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-1 text-lg">{device.name}</h3>
      <p className="text-sm text-gray-600 mb-3 capitalize">{device.device_type.replace('_', ' ')}</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">IP Address:</span>
          <span className="font-mono text-gray-900">{device.ip_address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="text-gray-900 truncate ml-2">{device.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Firmware:</span>
          <span className="text-gray-900">{device.firmware_version}</span>
        </div>
      </div>
    </div>
  );
}
