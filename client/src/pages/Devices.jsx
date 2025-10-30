import './Devices.css';

function Devices() {
  const devices = [
    {
      name: 'Core Switch 01',
      type: 'Switch',
      icon: '💻',
      status: 'online',
      ipAddress: '192.168.1.1',
      location: 'Data Center A - Rack 1',
      firmware: 'v2.3.1'
    },
    {
      name: 'Edge Router 01',
      type: 'Router',
      icon: '🌐',
      status: 'online',
      ipAddress: '192.168.1.2',
      location: 'Data Center A - Rack 2',
      firmware: 'v3.1.4'
    },
    {
      name: 'Firewall 01',
      type: 'Firewall',
      icon: '🛡️',
      status: 'warning',
      ipAddress: '192.168.1.3',
      location: 'Data Center A - Rack 3',
      firmware: 'v4.2.0'
    },
    {
      name: 'Core Switch 02',
      type: 'Switch',
      icon: '💻',
      status: 'online',
      ipAddress: '192.168.1.4',
      location: 'Data Center B - Rack 1',
      firmware: 'v2.3.1'
    },
    {
      name: 'Load Balancer 01',
      type: 'Load Balancer',
      icon: '⚡',
      status: 'online',
      ipAddress: '192.168.1.5',
      location: 'Data Center A - Rack 4',
      firmware: 'v5.1.0'
    }
  ];

  return (
    <div className="devices-page">
      <h1>Network Devices</h1>
      <div className="devices-grid">
        {devices.map((device, index) => (
          <div key={index} className="device-card-full">
            <div className="device-card-header">
              <div className="device-card-icon">{device.icon}</div>
              <div className={`device-card-status ${device.status}`}>
                ● {device.status.toUpperCase()}
              </div>
            </div>
            <h3>{device.name}</h3>
            <div className="device-card-type">{device.type}</div>
            <div className="device-card-details">
              <div className="device-detail-row">
                <span className="device-detail-label">IP Address:</span>
                <span className="device-detail-value">{device.ipAddress}</span>
              </div>
              <div className="device-detail-row">
                <span className="device-detail-label">Location:</span>
                <span className="device-detail-value">{device.location}</span>
              </div>
              <div className="device-detail-row">
                <span className="device-detail-label">Firmware:</span>
                <span className="device-detail-value">{device.firmware}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Devices;
