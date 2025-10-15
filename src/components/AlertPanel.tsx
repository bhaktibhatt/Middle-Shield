import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Alert } from '../types';
import { supabase } from '../lib/supabase';

interface AlertPanelProps {
  alerts: Alert[];
  onClose: () => void;
  onRefresh: () => void;
}

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertTriangle,
};

const alertColors = {
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  critical: 'bg-red-50 border-red-200 text-red-900',
};

export default function AlertPanel({ alerts, onClose, onRefresh }: AlertPanelProps) {
  const handleAcknowledge = async (alertId: string) => {
    await supabase
      .from('alerts')
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq('id', alertId);
    onRefresh();
  };

  const unacknowledged = alerts.filter(a => !a.acknowledged);
  const acknowledged = alerts.filter(a => a.acknowledged);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Alerts</h2>
            <p className="text-sm text-gray-600">
              {unacknowledged.length} unacknowledged alerts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {unacknowledged.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Unacknowledged</h3>
              <div className="space-y-3">
                {unacknowledged.map((alert) => {
                  const Icon = alertIcons[alert.alert_level];
                  return (
                    <div
                      key={alert.id}
                      className={`${alertColors[alert.alert_level]} border rounded-lg p-4`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold mb-1">{alert.message}</p>
                          <p className="text-sm opacity-80">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {acknowledged.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Acknowledged</h3>
              <div className="space-y-3">
                {acknowledged.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-75"
                  >
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{alert.message}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Acknowledged at {new Date(alert.acknowledged_at!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alerts.length === 0 && (
            <div className="text-center py-16">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear</h3>
              <p className="text-gray-600">No alerts at this time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
