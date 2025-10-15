export interface Device {
  id: string;
  name: string;
  device_type: 'switch' | 'router' | 'firewall' | 'load_balancer';
  ip_address: string;
  mac_address: string;
  location: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  firmware_version: string;
  last_seen: string;
  created_at: string;
}

export interface Threat {
  id: string;
  threat_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_ip: string;
  target_device_id: string;
  description: string;
  detected_at: string;
  mitigated: boolean;
  mitigation_action: string | null;
  mitigated_at: string | null;
}

export interface Alert {
  id: string;
  threat_id: string | null;
  device_id: string;
  alert_level: 'info' | 'warning' | 'critical';
  message: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
  created_at: string;
}

export interface PreventionRule {
  id: string;
  rule_name: string;
  rule_type: 'signature' | 'behavior' | 'threshold';
  threat_type: string;
  enabled: boolean;
  action: 'block' | 'alert' | 'quarantine' | 'rate_limit';
  parameters: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NetworkMetric {
  id: string;
  device_id: string;
  cpu_usage: number;
  memory_usage: number;
  bandwidth_in: number;
  bandwidth_out: number;
  active_connections: number;
  dropped_packets: number;
  timestamp: string;
}

export interface TrafficLog {
  id: string;
  device_id: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  port: number;
  packet_size: number;
  is_anomaly: boolean;
  timestamp: string;
}
