import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Overview from "./pages/Overview";
import Devices from "./pages/Devices";
import Threats from "./pages/Threats";
import PreventionRules from "./pages/PreventionRules";
import PacketSniffing from "./pages/PacketSniffing";
import Honeypots from "./pages/Honeypots";
import Suricata from "./pages/Suricata";
import "./App.css";

function App() {
  const tabs = [
    { path: "/", label: "Overview" },
    { path: "/devices", label: "Devices" },
    { path: "/threats", label: "Threats" },
    { path: "/prevention", label: "Prevention Rules" },
    { path: "/packet", label: "Packet Sniffing" },
    { path: "/honeypots", label: "Honeypots" },
    { path: "/suricata", label: "Suricata" },
  ];

  return (
    <Router>
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

        {/* Navigation Bar */}
        <nav className="nav-tabs">
          {tabs.map((tab) => (
            <Link key={tab.path} to={tab.path} className="nav-tab">
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Route Rendering */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/prevention" element={<PreventionRules />} />
            <Route path="/packet" element={<PacketSniffing />} />
            <Route path="/honeypots" element={<Honeypots />} />
            <Route path="/suricata" element={<Suricata />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

