// src/components/Honeypot.tsx

import React from 'react';

// Define the structure for a Honeypot instance data
interface HoneypotData {
  id: number;
  name: string;
  status: 'Active' | 'Inactive' | 'Compromised';
  ipAddress: string;
  deploymentTime: string;
  threatLevel: 'Low' | 'Medium' | 'High';
}

// Dummy data for demonstration
const mockHoneypots: HoneypotData[] = [
  {
    id: 1,
    name: 'Web Server Trap',
    status: 'Active',
    ipAddress: '192.168.10.50',
    deploymentTime: '2025-10-01 10:00',
    threatLevel: 'Low',
  },
  {
    id: 2,
    name: 'SCADA PLC Lure',
    status: 'Active',
    ipAddress: '10.0.0.100',
    deploymentTime: '2025-09-15 14:30',
    threatLevel: 'Medium',
  },
];

const Honeypot: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Honeypot Management & Analytics</h2>
      <p>Deploy, monitor, and analyze decoy systems to gather threat intelligence on potential attackers targeting your middleware.</p>

      <div style={styles.summaryContainer}>
        <div style={styles.summaryCard}>
          <h3>Total Honeypots</h3>
          <p style={styles.count}>{mockHoneypots.length}</p>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: '3px solid #FFC107' }}>
          <h3>Compromised</h3>
          <p style={styles.count}>0</p>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: '3px solid #28A745' }}>
          <h3>Active Threats Detected</h3>
          <p style={styles.count}>3</p>
        </div>
      </div>

      <h3 style={{ marginTop: '30px' }}>Deployed Honeypots</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>IP Address</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Threat Level</th>
            <th style={styles.th}>Deployment Time</th>
          </tr>
        </thead>
        <tbody>
          {mockHoneypots.map((pot) => (
            <tr key={pot.id}>
              <td style={styles.td}>{pot.name}</td>
              <td style={styles.td}>{pot.ipAddress}</td>
              <td style={styles.td}>
                <span style={{ color: pot.status === 'Active' ? 'green' : 'red', fontWeight: 'bold' }}>
                  {pot.status}
                </span>
              </td>
              <td style={styles.td}>{pot.threatLevel}</td>
              <td style={styles.td}>{pot.deploymentTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Basic inline styling for demonstration (You should use index.css or styled-components)
const styles: { [key: string]: React.CSSProperties } = {
  summaryContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  summaryCard: {
    flex: 1,
    padding: '15px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '5px',
    borderLeft: '3px solid #007BFF',
  },
  count: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '5px 0 0 0',
    color: '#343A40',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
  },
  th: {
    borderBottom: '2px solid #6c757d',
    padding: '12px 8px',
    textAlign: 'left',
    backgroundColor: '#e9ecef',
  },
  td: {
    borderBottom: '1px solid #dee2e6',
    padding: '12px 8px',
  },
};

export default Honeypot;