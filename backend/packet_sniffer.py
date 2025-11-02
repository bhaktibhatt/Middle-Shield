from scapy.all import sniff, Ether, IP, IPv6, TCP, UDP, ARP, DNS, DNSQR, ICMP
from datetime import datetime
from collections import defaultdict
import time
import json
import requests

BACKEND_URL = "http://localhost:5000/packet"
INTERFACE = "enp0s3"

FLOOD_TIME_WINDOW = 10
FLOOD_THRESHOLD = 50
mac_addresses = defaultdict(float)

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

def detect_arp_spoof(pkt):
    arp = pkt[ARP]
    real_mac = trusted_arp_table.get(arp.psrc)
    if real_mac and real_mac.lower() != arp.hwsrc.lower():
        print(f"[ALERT] Possible ARP Spoofing: {arp.psrc} -> {arp.hwsrc} (trusted {real_mac})")

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
    elif pkt.haslayer(ARP):
        return "ARP"
    elif pkt.haslayer(IPv6):
        return "IPv6"
    else:
        return "Unknown"

def packet_callback(pkt):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    src_mac = dst_mac = src_ip = dst_ip = None

    if pkt.haslayer(Ether):
        eth = pkt[Ether]
        src_mac, dst_mac = eth.src, eth.dst
        detect_mac_flooding(eth.src)

    if pkt.haslayer(IP):
        ip = pkt[IP]
        src_ip, dst_ip = ip.src, ip.dst
    elif pkt.haslayer(IPv6):
        ipv6 = pkt[IPv6]
        src_ip, dst_ip = ipv6.src, ipv6.dst

    proto = get_protocol_name(pkt)

    if pkt.haslayer(ARP):
        detect_arp_spoof(pkt)

    packet_data = {
        "timestamp": timestamp,
        "src_mac": src_mac,
        "dst_mac": dst_mac,
        "src_ip": src_ip,
        "dst_ip": dst_ip,
        "protocol": proto,
    }

    print(json.dumps(packet_data))
    try:
        requests.post(BACKEND_URL, json=packet_data, timeout=0.5)
    except Exception as e:
        print(f"[ERROR] Failed to send packet data: {e}")

if __name__ == "__main__":
    print(f"🌐 Starting packet sniffing on {INTERFACE}...")
    sniff(iface=INTERFACE, prn=packet_callback, store=False)

