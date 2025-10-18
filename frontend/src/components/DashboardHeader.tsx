import { Shield, Bell, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  unacknowledgedAlerts: number;
  onAlertsClick: () => void;
}

export default function DashboardHeader({ unacknowledgedAlerts, onAlertsClick }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2.5 rounded-lg shadow-md">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MDAPF</h1>
              <p className="text-sm text-gray-600">Middleware Device Attack Prevention Framework</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onAlertsClick}
              className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-700" />
              {unacknowledgedAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unacknowledgedAlerts}
                </span>
              )}
            </button>

            <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
