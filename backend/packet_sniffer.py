from scapy.all import sniff, Ether, IP, IPv6, TCP, UDP, ARP, DNS, DNSQR, ICMP
import time
from collections import defaultdict
from datetime import datetime
import requests
import json
import socket

# ----------------- Config -----------------
BACKEND_URL = "http://localhost:5000/packet"  # Node backend endpoint
FLOOD_TIME_WINDOW = 10  # seconds
FLOOD_THRESHOLD = 50    # unique MACs in window

# ----------------- Trusted ARP Table -----------------
trusted_arp_table = {
    '192.168.0.1': '30:b5:c2:25:8c:e6',
    '192.168.0.100': 'b2:95:75:a0:86:46',
    '192.168.0.255': 'ff:ff:ff:ff:ff:ff',
    '224.0.0.2': '01:00:5e:00:00:02',
    '224.0.0.22': '01:00:5e:00:00:16',
    '224.0.0.251': '01:00:5e:00:00:fb',
    '224.0.0.252': '01:00:5e:00:00:fc',
    '239.255.255.250': '01:00:5e:7f:ff:fa',
    '255.255.255.255': 'ff:ff:ff:ff:ff:ff',
}

mac_addresses = defaultdict(float)

# ----------------- Detection Functions -----------------
def detect_arp_spoof(pkt):
    arp = pkt[ARP]
    real_mac = trusted_arp_table.get(arp.psrc)
    if real_mac and real_mac.lower() != arp.hwsrc.lower():
        print(f"[ALERT] Possible ARP Spoofing Detected: {arp.psrc} -> {arp.hwsrc} (trusted {real_mac})")

def detect_mac_flooding(src_mac):
    current_time = time.time()
    for mac in list(mac_addresses):
        if current_time - mac_addresses[mac] > FLOOD_TIME_WINDOW:
            del mac_addresses[mac]
    mac_addresses[src_mac] = current_time

    if len(mac_addresses) > FLOOD_THRESHOLD:
        print(f"[ALERT] MAC Flooding Detected! {len(mac_addresses)} MACs in {FLOOD_TIME_WINDOW}s")

def get_protocol_name(pkt):
    if pkt.haslayer(TCP):
        tcp = pkt[TCP]
        if tcp.dport == 80 or tcp.sport == 80:
            return "HTTP"
        elif tcp.dport == 443 or tcp.sport == 443:
            return "HTTPS"
        elif tcp.dport == 22 or tcp.sport == 22:
            return "SSH"
        else:
            return "TCP"
    elif pkt.haslayer(UDP):
        udp = pkt[UDP]
        if udp.dport == 53 or udp.sport == 53:
            return "DNS"
        else:
            return "UDP"
    elif pkt.haslayer(ICMP):
        return "ICMP"
    else:
        return "Other"

# ----------------- Callback -----------------
def packet_callback(pkt):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    print("=" * 60)
    print(f"Timestamp: {timestamp}")

    src_mac = dst_mac = src_ip = dst_ip = proto = None

    if pkt.haslayer(Ether):
        eth = pkt[Ether]
        src_mac, dst_mac = eth.src, eth.dst
        detect_mac_flooding(eth.src)

    if pkt.haslayer(IP):
        ip = pkt[IP]
        src_ip, dst_ip = ip.src, ip.dst
        proto = get_protocol_name(pkt)

    elif pkt.haslayer(IPv6):
        ipv6 = pkt[IPv6]
        src_ip, dst_ip = ipv6.src, ipv6.dst
        proto = "IPv6"

    if pkt.haslayer(ARP):
        detect_arp_spoof(pkt)

    # Build JSON object
    packet_data = {
        "timestamp": timestamp,
        "src_mac": src_mac,
        "dst_mac": dst_mac,
        "src_ip": src_ip,
        "dst_ip": dst_ip,
        "protocol": proto,
    }

    # Display in terminal
    print(json.dumps(packet_data, indent=2))

    # Send to backend
    try:
        response = requests.post(BACKEND_URL, json=packet_data, timeout=0.5)
        if response.status_code != 200:
            print(f"[ERROR] Backend response: {response.status_code}")
    except Exception as e:
        print(f"[ERROR] Failed to send packet data: {e}")

# ----------------- Run Sniffer -----------------
if __name__ == "__main__":
    try:
        local_ip = socket.gethostbyname(socket.gethostname())
        print(f"[INFO] Detected local IP: {local_ip}")
    except:
        local_ip = "Unknown"

    # Use enp0s3 interface instead of eth0
    interface = "enp0s3"
    print(f"Starting packet sniffing on interface {interface}. Press Ctrl+C to stop.")
    sniff(iface=interface, prn=packet_callback, store=False)

