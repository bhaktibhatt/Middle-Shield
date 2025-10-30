import './Suricata.css';

function Suricata() {
  const handleRunSuricata = () => {
    alert('Running Suricata...');
  };

  const handleViewLogs = () => {
    window.open('/suricata/logs', '_blank');
  };

  const handleViewAlerts = () => {
    window.open('/suricata/alerts', '_blank');
  };

  const handleViewDropLogs = () => {
    window.open('/suricata/drop-logs', '_blank');
  };

  return (
    <div className="suricata-page">
      <div className="suricata-header">
        <div className="suricata-title-section">
          <h1>Suricata IDS/IPS</h1>
          <p className="suricata-description">
            Intrusion Detection and Prevention System for network traffic monitoring and threat detection
          </p>
        </div>
      </div>

      <div className="suricata-status-card">
        <div className="status-indicator">
          <div className="status-dot active"></div>
          <span className="status-text">System Active</span>
        </div>
        <div className="status-info">
          <div className="status-item">
            <span className="status-label">Last Updated:</span>
            <span className="status-value">2/10/2025, 10:15:42 pm</span>
          </div>
          <div className="status-item">
            <span className="status-label">Rules Loaded:</span>
            <span className="status-value">32,456</span>
          </div>
          <div className="status-item">
            <span className="status-label">Alerts Today:</span>
            <span className="status-value">147</span>
          </div>
        </div>
      </div>

      <div className="suricata-controls">
        <h2>Control Panel</h2>
        <div className="controls-grid">
          <button className="control-button primary" onClick={handleRunSuricata}>
            <div className="control-icon">▶️</div>
            <div className="control-content">
              <div className="control-title">Run Suricata</div>
              <div className="control-subtitle">Start network monitoring</div>
            </div>
          </button>

          <button className="control-button" onClick={handleViewLogs}>
            <div className="control-icon">📄</div>
            <div className="control-content">
              <div className="control-title">View Logs</div>
              <div className="control-subtitle">Open in new tab</div>
            </div>
          </button>

          <button className="control-button" onClick={handleViewAlerts}>
            <div className="control-icon">⚠️</div>
            <div className="control-content">
              <div className="control-title">View Alerts</div>
              <div className="control-subtitle">Open in new tab</div>
            </div>
          </button>

          <button className="control-button" onClick={handleViewDropLogs}>
            <div className="control-icon">🚫</div>
            <div className="control-content">
              <div className="control-title">View Drop Logs</div>
              <div className="control-subtitle">Open in new tab</div>
            </div>
          </button>
        </div>
      </div>

      <div className="suricata-stats">
        <h2>Statistics</h2>
        <div className="stats-cards">
          <div className="stat-card-suricata">
            <div className="stat-icon-suricata">📊</div>
            <div className="stat-info">
              <div className="stat-value-suricata">2,456,789</div>
              <div className="stat-label-suricata">Packets Analyzed</div>
            </div>
          </div>
          <div className="stat-card-suricata">
            <div className="stat-icon-suricata">🔍</div>
            <div className="stat-info">
              <div className="stat-value-suricata">1,234</div>
              <div className="stat-label-suricata">Threats Detected</div>
            </div>
          </div>
          <div className="stat-card-suricata">
            <div className="stat-icon-suricata">🛡️</div>
            <div className="stat-info">
              <div className="stat-value-suricata">98.7%</div>
              <div className="stat-label-suricata">Detection Rate</div>
            </div>
          </div>
          <div className="stat-card-suricata">
            <div className="stat-icon-suricata">⏱️</div>
            <div className="stat-info">
              <div className="stat-value-suricata">45ms</div>
              <div className="stat-label-suricata">Avg Response Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon critical">⚠️</div>
            <div className="activity-content">
              <div className="activity-title">Port Scan Detected</div>
              <div className="activity-time">2 minutes ago</div>
            </div>
            <div className="activity-badge critical">Critical</div>
          </div>
          <div className="activity-item">
            <div className="activity-icon warning">⚡</div>
            <div className="activity-content">
              <div className="activity-title">Suspicious Traffic Pattern</div>
              <div className="activity-time">15 minutes ago</div>
            </div>
            <div className="activity-badge warning">Warning</div>
          </div>
          <div className="activity-item">
            <div className="activity-icon info">ℹ️</div>
            <div className="activity-content">
              <div className="activity-title">Rule Update Completed</div>
              <div className="activity-time">1 hour ago</div>
            </div>
            <div className="activity-badge info">Info</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suricata;
