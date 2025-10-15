import { useState, useEffect } from 'react';
import { Activity, Server, AlertTriangle, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import DashboardHeader from './components/DashboardHeader';
import StatCard from './components/StatCard';
import DeviceCard from './components/DeviceCard';
import ThreatCard from './components/ThreatCard';
import AlertPanel from './components/AlertPanel';
import RuleCard from './components/RuleCard';
import NetworkChart from './components/NetworkChart';
import { supabase } from './lib/supabase';
import { Device, Threat, Alert, PreventionRule, NetworkMetric, } from './types';
import PacketSniffing from './components/PacketSniffing';
import Honeypot from './components/Honeypot';

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<PreventionRule[]>([]);
  const [metrics, setMetrics] = useState<NetworkMetric[]>([]);
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'devices' | 'threats' | 'rules' | 'packet-sniffing' | 'honeypot'>('overview');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const fetchData = async () => {
    const [devicesRes, threatsRes, alertsRes, rulesRes, metricsRes] = await Promise.all([
      supabase.from('devices').select('*').order('created_at', { ascending: false }),
      supabase.from('threats').select('*').order('detected_at', { ascending: false }).limit(10),
      supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('prevention_rules').select('*').order('created_at', { ascending: false }),
      supabase.from('network_metrics').select('*').order('timestamp', { ascending: false }).limit(100),
    ]);

    if (devicesRes.data) setDevices(devicesRes.data);
    if (threatsRes.data) setThreats(threatsRes.data);
    if (alertsRes.data) setAlerts(alertsRes.data);
    if (rulesRes.data) setRules(rulesRes.data);
    if (metricsRes.data) setMetrics(metricsRes.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;
  const activeThreats = threats.filter(t => !t.mitigated).length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const criticalDevices = devices.filter(d => d.status === 'critical' || d.status === 'warning').length;
  const activeRules = rules.filter(r => r.enabled).length;

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  const selectedDeviceMetrics = selectedDeviceId
    ? metrics.filter(m => m.device_id === selectedDeviceId).slice(0, 20)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader
        unacknowledgedAlerts={unacknowledgedAlerts}
        onAlertsClick={() => setIsAlertPanelOpen(true)}
      />

      <div className="px-6 py-8">
        <div className="mb-6">
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm inline-flex">
            <button
              onClick={() => setSelectedView('overview')}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                selectedView === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('devices')}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                selectedView === 'devices'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Devices
            </button>
            <button
              onClick={() => setSelectedView('threats')}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                selectedView === 'threats'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Threats
            </button>
            <button
              onClick={() => setSelectedView('rules')}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                selectedView === 'rules'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Prevention Rules
            </button>

            <button
              onClick={() => setSelectedView('packet-sniffing')}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
              selectedView === 'packet-sniffing'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Packet Sniffing
        </button>

        <button
          onClick={() => setSelectedView('honeypot')}
          className={`px-6 py-2.5 rounded-md font-medium transition-all ${
          selectedView === 'honeypot'
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
          }`}
          >
        Honeypots
        </button>

        {/*{selectedView === 'honeypot' && (
        <div>
        <Honeypot />
        </div>
         )} */}



          </div>
        </div>

        {selectedView === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard
                title="Total Devices"
                value={devices.length}
                icon={Server}
                trend={{ value: '12%', isPositive: true }}
                color="blue"
              />
              <StatCard
                title="Online Devices"
                value={onlineDevices}
                icon={Activity}
                color="green"
              />
              <StatCard
                title="Active Threats"
                value={activeThreats}
                icon={AlertTriangle}
                trend={{ value: '8%', isPositive: false }}
                color="red"
              />
              <StatCard
                title="Critical Alerts"
                value={unacknowledgedAlerts}
                icon={AlertTriangle}
                color="yellow"
              />
              <StatCard
                title="Active Rules"
                value={`${activeRules}/${rules.length}`}
                icon={Shield}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Network Devices</h2>
                <div className="grid grid-cols-1 gap-4">
                  {devices.slice(0, 4).map((device) => (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      onClick={() => {
                        setSelectedDeviceId(device.id);
                        setSelectedView('devices');
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Threats</h2>
                <div className="space-y-4">
                  {threats.slice(0, 3).map((threat) => {
                    const device = devices.find(d => d.id === threat.target_device_id);
                    return (
                      <ThreatCard
                        key={threat.id}
                        threat={threat}
                        deviceName={device?.name}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedView === 'devices' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Network Devices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onClick={() => setSelectedDeviceId(device.id)}
                  />
                ))}
              </div>
            </div>

            {selectedDevice && selectedDeviceMetrics.length > 0 && (
              <div className="mb-8">
                <NetworkChart
                  metrics={selectedDeviceMetrics}
                  deviceName={selectedDevice.name}
                />
              </div>
            )}
          </>
        )}

        {selectedView === 'threats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Threat Detection Log</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {threats.map((threat) => {
                const device = devices.find(d => d.id === threat.target_device_id);
                return (
                  <ThreatCard
                    key={threat.id}
                    threat={threat}
                    deviceName={device?.name}
                  />
                );
              })}
            </div>
          </div>
        )}

        {selectedView === 'rules' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Attack Prevention Rules</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rules.map((rule) => (
                <RuleCard key={rule.id} rule={rule} onRefresh={fetchData} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isAlertPanelOpen && (
        <AlertPanel
          alerts={alerts}
          onClose={() => setIsAlertPanelOpen(false)}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
}

export default App;
