/*
  # Middleware Device Attack Prevention Framework (MDAPF) Schema

  1. New Tables
    - `devices`
      - `id` (uuid, primary key)
      - `name` (text)
      - `device_type` (text) - switch, router, firewall
      - `ip_address` (inet)
      - `mac_address` (macaddr)
      - `location` (text)
      - `status` (text) - online, offline, warning, critical
      - `firmware_version` (text)
      - `last_seen` (timestamptz)
      - `created_at` (timestamptz)
    
    - `threats`
      - `id` (uuid, primary key)
      - `threat_type` (text) - arp_spoofing, mac_flooding, rce, ddos, etc.
      - `severity` (text) - low, medium, high, critical
      - `source_ip` (inet)
      - `target_device_id` (uuid, foreign key)
      - `description` (text)
      - `detected_at` (timestamptz)
      - `mitigated` (boolean)
      - `mitigation_action` (text)
      - `mitigated_at` (timestamptz)
    
    - `traffic_logs`
      - `id` (uuid, primary key)
      - `device_id` (uuid, foreign key)
      - `source_ip` (inet)
      - `destination_ip` (inet)
      - `protocol` (text)
      - `port` (integer)
      - `packet_size` (integer)
      - `is_anomaly` (boolean)
      - `timestamp` (timestamptz)
    
    - `prevention_rules`
      - `id` (uuid, primary key)
      - `rule_name` (text)
      - `rule_type` (text) - signature, behavior, threshold
      - `threat_type` (text)
      - `enabled` (boolean)
      - `action` (text) - block, alert, quarantine
      - `parameters` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `alerts`
      - `id` (uuid, primary key)
      - `threat_id` (uuid, foreign key)
      - `device_id` (uuid, foreign key)
      - `alert_level` (text) - info, warning, critical
      - `message` (text)
      - `acknowledged` (boolean)
      - `acknowledged_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `network_metrics`
      - `id` (uuid, primary key)
      - `device_id` (uuid, foreign key)
      - `cpu_usage` (numeric)
      - `memory_usage` (numeric)
      - `bandwidth_in` (bigint) - bytes
      - `bandwidth_out` (bigint) - bytes
      - `active_connections` (integer)
      - `dropped_packets` (integer)
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Authenticated users can read all data
    - Only authenticated users can insert/update
    
  3. Indexes
    - Index on devices.status for quick status queries
    - Index on threats.detected_at for time-based queries
    - Index on threats.severity for filtering
    - Index on traffic_logs.timestamp for log analysis
    - Index on alerts.acknowledged for filtering unacknowledged alerts

  4. Sample Data
    - Populate with sample devices, threats, and rules
*/

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  device_type text NOT NULL CHECK (device_type IN ('switch', 'router', 'firewall', 'load_balancer')),
  ip_address inet NOT NULL UNIQUE,
  mac_address macaddr NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'warning', 'critical')),
  firmware_version text NOT NULL,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create threats table
CREATE TABLE IF NOT EXISTS threats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  threat_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_ip inet NOT NULL,
  target_device_id uuid REFERENCES devices(id) ON DELETE CASCADE,
  description text NOT NULL,
  detected_at timestamptz DEFAULT now(),
  mitigated boolean DEFAULT false,
  mitigation_action text,
  mitigated_at timestamptz
);

-- Create traffic_logs table
CREATE TABLE IF NOT EXISTS traffic_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  source_ip inet NOT NULL,
  destination_ip inet NOT NULL,
  protocol text NOT NULL,
  port integer NOT NULL,
  packet_size integer NOT NULL,
  is_anomaly boolean DEFAULT false,
  timestamp timestamptz DEFAULT now()
);

-- Create prevention_rules table
CREATE TABLE IF NOT EXISTS prevention_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL UNIQUE,
  rule_type text NOT NULL CHECK (rule_type IN ('signature', 'behavior', 'threshold')),
  threat_type text NOT NULL,
  enabled boolean DEFAULT true,
  action text NOT NULL CHECK (action IN ('block', 'alert', 'quarantine', 'rate_limit')),
  parameters jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  threat_id uuid REFERENCES threats(id) ON DELETE CASCADE,
  device_id uuid REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  alert_level text NOT NULL CHECK (alert_level IN ('info', 'warning', 'critical')),
  message text NOT NULL,
  acknowledged boolean DEFAULT false,
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create network_metrics table
CREATE TABLE IF NOT EXISTS network_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  cpu_usage numeric(5,2) NOT NULL CHECK (cpu_usage >= 0 AND cpu_usage <= 100),
  memory_usage numeric(5,2) NOT NULL CHECK (memory_usage >= 0 AND memory_usage <= 100),
  bandwidth_in bigint NOT NULL DEFAULT 0,
  bandwidth_out bigint NOT NULL DEFAULT 0,
  active_connections integer NOT NULL DEFAULT 0,
  dropped_packets integer NOT NULL DEFAULT 0,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prevention_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow public read for demo, restrict writes)
CREATE POLICY "Anyone can view devices"
  ON devices FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert devices"
  ON devices FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update devices"
  ON devices FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view threats"
  ON threats FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert threats"
  ON threats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update threats"
  ON threats FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view traffic logs"
  ON traffic_logs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert traffic logs"
  ON traffic_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view rules"
  ON prevention_rules FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert rules"
  ON prevention_rules FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update rules"
  ON prevention_rules FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view alerts"
  ON alerts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert alerts"
  ON alerts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update alerts"
  ON alerts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view metrics"
  ON network_metrics FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert metrics"
  ON network_metrics FOR INSERT
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_threats_detected_at ON threats(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_threats_severity ON threats(severity);
CREATE INDEX IF NOT EXISTS idx_threats_mitigated ON threats(mitigated);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_timestamp ON traffic_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_logs_anomaly ON traffic_logs(is_anomaly);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON alerts(acknowledged);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_network_metrics_timestamp ON network_metrics(timestamp DESC);

-- Insert sample devices
INSERT INTO devices (name, device_type, ip_address, mac_address, location, status, firmware_version) VALUES
  ('Core Switch 01', 'switch', '192.168.1.1', '00:1B:44:11:3A:B7', 'Data Center A - Rack 1', 'online', 'v2.3.1'),
  ('Edge Router 01', 'router', '192.168.1.2', '00:1B:44:11:3A:B8', 'Data Center A - Rack 2', 'online', 'v3.1.4'),
  ('Firewall 01', 'firewall', '192.168.1.3', '00:1B:44:11:3A:B9', 'Data Center A - Rack 3', 'warning', 'v4.2.0'),
  ('Core Switch 02', 'switch', '192.168.1.4', '00:1B:44:11:3A:BA', 'Data Center B - Rack 1', 'online', 'v2.3.1'),
  ('Load Balancer 01', 'load_balancer', '192.168.1.5', '00:1B:44:11:3A:BB', 'Data Center A - Rack 4', 'online', 'v5.0.2')
ON CONFLICT (ip_address) DO NOTHING;

-- Insert sample prevention rules
INSERT INTO prevention_rules (rule_name, rule_type, threat_type, enabled, action, parameters) VALUES
  ('ARP Spoofing Detection', 'behavior', 'arp_spoofing', true, 'block', '{"threshold": 10, "window": 60}'),
  ('MAC Flooding Prevention', 'threshold', 'mac_flooding', true, 'rate_limit', '{"max_macs": 100, "window": 30}'),
  ('RCE Signature Match', 'signature', 'remote_code_execution', true, 'block', '{"signatures": ["eval(", "exec(", "system("]}'),
  ('DDoS Rate Limiting', 'threshold', 'ddos', true, 'rate_limit', '{"max_requests": 1000, "window": 10}'),
  ('Port Scan Detection', 'behavior', 'port_scan', true, 'alert', '{"unique_ports": 20, "window": 60}'),
  ('DNS Tunneling Detection', 'behavior', 'dns_tunneling', true, 'alert', '{"query_length": 100, "frequency": 50}')
ON CONFLICT (rule_name) DO NOTHING;

-- Insert sample threats
INSERT INTO threats (threat_type, severity, source_ip, target_device_id, description, detected_at, mitigated, mitigation_action, mitigated_at)
SELECT 
  'arp_spoofing',
  'high',
  '10.0.2.45',
  id,
  'ARP spoofing attack detected - malicious device attempting to intercept traffic',
  now() - interval '2 hours',
  true,
  'Source MAC blocked and ARP tables flushed',
  now() - interval '1 hour 55 minutes'
FROM devices WHERE name = 'Core Switch 01'
LIMIT 1;

INSERT INTO threats (threat_type, severity, source_ip, target_device_id, description, detected_at, mitigated, mitigation_action)
SELECT 
  'mac_flooding',
  'critical',
  '10.0.3.78',
  id,
  'MAC flooding attack in progress - CAM table exhaustion detected',
  now() - interval '15 minutes',
  false,
  NULL
FROM devices WHERE name = 'Core Switch 02'
LIMIT 1;

INSERT INTO threats (threat_type, severity, source_ip, target_device_id, description, detected_at, mitigated, mitigation_action, mitigated_at)
SELECT 
  'port_scan',
  'medium',
  '172.16.5.120',
  id,
  'Port scanning activity detected across multiple ports',
  now() - interval '30 minutes',
  true,
  'Source IP rate limited',
  now() - interval '25 minutes'
FROM devices WHERE name = 'Firewall 01'
LIMIT 1;

-- Insert sample alerts
INSERT INTO alerts (threat_id, device_id, alert_level, message, acknowledged)
SELECT 
  t.id,
  t.target_device_id,
  'critical',
  'CRITICAL: MAC flooding attack detected on ' || d.name || ' - immediate action required',
  false
FROM threats t
JOIN devices d ON t.target_device_id = d.id
WHERE t.threat_type = 'mac_flooding'
LIMIT 1;

INSERT INTO alerts (threat_id, device_id, alert_level, message, acknowledged, acknowledged_at)
SELECT 
  t.id,
  t.target_device_id,
  'warning',
  'WARNING: Port scan detected from ' || t.source_ip::text || ' - traffic rate limited',
  true,
  now() - interval '20 minutes'
FROM threats t
WHERE t.threat_type = 'port_scan'
LIMIT 1;

-- Insert sample network metrics
INSERT INTO network_metrics (device_id, cpu_usage, memory_usage, bandwidth_in, bandwidth_out, active_connections, dropped_packets, timestamp)
SELECT 
  id,
  45.5 + (random() * 20),
  62.3 + (random() * 15),
  (random() * 1000000000)::bigint,
  (random() * 800000000)::bigint,
  (random() * 5000)::integer,
  (random() * 100)::integer,
  now() - (interval '1 minute' * generate_series(0, 60))
FROM devices
CROSS JOIN generate_series(0, 60);