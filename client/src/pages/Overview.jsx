import './Overview.css';

function Overview() {
  const stats = [
    {
      icon: '💻',
      label: 'Total Devices',
      value: '5',
      change: '↑ 12%',
      changeColor: 'green',
      color: '#2563eb'
    },
    {
      icon: '✓',
      label: 'Online Devices',
      value: '4',
      change: '',
      changeColor: '',
      color: '#10b981'
    },
    {
      icon: '⚠️',
      label: 'Active Threats',
      value: '1',
      change: '↓ 8%',
      changeColor: 'red',
      color: '#ef4444'
    },
    {
      icon: '⚠️',
      label: 'Critical Alerts',
      value: '0',
      change: '',
      changeColor: '',
      color: '#f59e0b'
    },
    {
      icon: '🛡️',
      label: 'Active Rules',
      value: '5/6',
      change: '',
      changeColor: '',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="overview-page">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value-row">
                <div className="stat-value">{stat.value}</div>
                {stat.change && (
                  <div className={`stat-change ${stat.changeColor}`}>{stat.change}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="network-devices-section">
          <h2>Network Devices</h2>
          <div className="device-card">
            <div className="device-header">
              <div className="device-icon">💻</div>
              <div className="device-status online">● ONLINE</div>
            </div>
            <h3>Core Switch 01</h3>
            <div className="device-type">Switch</div>
            <div className="device-details">
              <div className="detail-row">
                <span className="detail-label">IP Address:</span>
                <span className="detail-value">192.168.1.1</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">Data Center A - Rack 1</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Firmware:</span>
                <span className="detail-value">v2.3.1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-threats-section">
          <h2>Recent Threats</h2>
          <div className="threat-card">
            <div className="threat-header">
              <div className="threat-icon">⚠️</div>
              <div className="threat-badge critical">CRITICAL</div>
            </div>
            <h3>Mac Flooding</h3>
            <div className="threat-time">2/10/2025, 10:03:28 pm</div>
            <p className="threat-description">
              MAC flooding attack in progress - CAM table exhaustion detected
            </p>
            <div className="threat-details">
              <div className="detail-row">
                <span className="detail-label">Source IP:</span>
                <span className="detail-value">10.0.3.78</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Target Device:</span>
                <span className="detail-value">Core Switch 02</span>
              </div>
            </div>
            <div className="threat-action">
              <span className="action-icon">⚠️</span>
              <span>Active Threat - Action Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
