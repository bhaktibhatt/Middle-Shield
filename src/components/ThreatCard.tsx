import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { Threat } from '../types';

interface ThreatCardProps {
  threat: Threat;
  deviceName?: string;
}

const severityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};

const severityIcons = {
  low: Shield,
  medium: Clock,
  high: AlertTriangle,
  critical: AlertTriangle,
};

export default function ThreatCard({ threat, deviceName }: ThreatCardProps) {
  const SeverityIcon = severityIcons[threat.severity];
  const timeAgo = new Date(threat.detected_at).toLocaleString();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${severityColors[threat.severity]} p-2 rounded-lg border`}>
            <SeverityIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 capitalize">
              {threat.threat_type.replace(/_/g, ' ')}
            </h3>
            <p className="text-sm text-gray-600">{timeAgo}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${severityColors[threat.severity]} border`}>
          {threat.severity}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{threat.description}</p>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Source IP:</span>
          <span className="font-mono text-gray-900">{threat.source_ip}</span>
        </div>
        {deviceName && (
          <div className="flex justify-between">
            <span className="text-gray-600">Target Device:</span>
            <span className="text-gray-900">{deviceName}</span>
          </div>
        )}
      </div>

      {threat.mitigated ? (
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900">Mitigated</p>
            <p className="text-xs text-green-700">{threat.mitigation_action}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <p className="text-sm font-semibold text-red-900">Active Threat - Action Required</p>
        </div>
      )}
    </div>
  );
}
