import { useState } from 'react';
import './App.css';
import Overview from './pages/Overview';
import Devices from './pages/Devices';
import Threats from './pages/Threats';
import PreventionRules from './pages/PreventionRules';
import PacketSniffing from './pages/PacketSniffing';
import Honeypots from './pages/Honeypots';
import Suricata from './pages/Suricata';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'devices', label: 'Devices' },
    { id: 'threats', label: 'Threats' },
    { id: 'prevention', label: 'Prevention Rules' },
    { id: 'packet', label: 'Packet Sniffing' },
    { id: 'honeypots', label: 'Honeypots' },
    { id: 'suricata', label: 'Suricata' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'devices':
        return <Devices />;
      case 'threats':
        return <Threats />;
      case 'prevention':
        return <PreventionRules />;
      case 'packet':
        return <PacketSniffing />;
      case 'honeypots':
        return <Honeypots />;
      case 'suricata':
        return <Suricata />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">🛡️</div>
          <div className="header-title">
            <h1>MiddleShield</h1>
            <p>Middleware Device Attack Prevention Framework</p>
          </div>
        </div>
        <div className="header-right">
          <button className="icon-button">🔔</button>
          <button className="icon-button">⚙️</button>
        </div>
      </header>

      <nav className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
