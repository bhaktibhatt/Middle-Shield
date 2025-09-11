from scapy.all import sniff, Ether, IP, IPv6, TCP, UDP, ARP, DNS, DNSQR, ICMP
import time
from collections import defaultdict
from datetime import datetime

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
    # Add other trusted IP-MAC pairs here
}

mac_addresses = defaultdict(float)
FLOOD_TIME_WINDOW = 10  # seconds
FLOOD_THRESHOLD = 50  # number of unique MACs to flag flooding

def detect_arp_spoof(pkt):
    arp = pkt[ARP]
    real_mac = trusted_arp_table.get(arp.psrc)
    if real_mac is not None and real_mac.lower() != arp.hwsrc.lower():
        print("ALERT: Possible ARP Spoofing Detected!")
        print(f"IP {arp.psrc} is claiming MAC {arp.hwsrc}, but trusted MAC is {real_mac}\n")

def detect_mac_flooding(src_mac):
    current_time = time.time()
    for mac in list(mac_addresses):
        if current_time - mac_addresses[mac] > FLOOD_TIME_WINDOW:
            del mac_addresses[mac]
    mac_addresses[src_mac] = current_time

    if len(mac_addresses) > FLOOD_THRESHOLD:
        print("ALERT: Possible MAC Flooding Detected!")
        print(f"Unique MACs seen in last {FLOOD_TIME_WINDOW}s: {len(mac_addresses)}\n")

def get_protocol_name(pkt):
    if pkt.haslayer(TCP):
        tcp = pkt[TCP]
        if tcp.dport == 80 or tcp.sport == 80:
            return "HTTP"
        elif tcp.dport == 443 or tcp.sport == 443:
            return "HTTPS (TLS handshake possible)"
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

def packet_callback(pkt):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    print("=" * 50)
    print(f"Timestamp: {timestamp}")

    if pkt.haslayer(Ether):
        eth = pkt[Ether]
        print(f"Ethernet Frame: Src MAC: {eth.src}, Dst MAC: {eth.dst}, Type: {eth.type}")
        detect_mac_flooding(eth.src)

    # IPv4 detection
    if pkt.haslayer(IP):
        ip = pkt[IP]
        proto_name = get_protocol_name(pkt)
        print(f"IPv4 Packet: Src IP: {ip.src}, Dst IP: {ip.dst}, TTL: {ip.ttl}, Protocol: {ip.proto} ({proto_name})")

    # IPv6 detection
    elif pkt.haslayer(IPv6):
        ipv6 = pkt[IPv6]
        print(f"IPv6 Packet: Src IP: {ipv6.src}, Dst IP: {ipv6.dst}, Hop Limit: {ipv6.hlim}, Next Header: {ipv6.nh}")

    if pkt.haslayer(TCP):
        tcp = pkt[TCP]
        print(f"TCP Segment: Src Port: {tcp.sport}, Dst Port: {tcp.dport}, Flags: {tcp.flags}")

    elif pkt.haslayer(UDP):
        udp = pkt[UDP]
        print(f"UDP Datagram: Src Port: {udp.sport}, Dst Port: {udp.dport}, Length: {udp.len}")

    if pkt.haslayer(ARP):
        arp = pkt[ARP]
        print(f"ARP Packet: HWsrc: {arp.hwsrc}, Psrc: {arp.psrc}, Hwdst: {arp.hwdst}, Pdst: {arp.pdst}, Op: {arp.op}")
        detect_arp_spoof(pkt)

    if pkt.haslayer(DNS):
        dns = pkt[DNS]
        qname = dns[DNSQR].qname.decode() if dns.qr == 0 else "Response"
        print(f"DNS Packet: ID: {dns.id}, QR: {dns.qr}, Opcode: {dns.opcode}, Query Name: {qname}")

    if pkt.haslayer(ICMP):
        icmp = pkt[ICMP]
        print(f"ICMP Packet: Type: {icmp.type}, Code: {icmp.code}")

    if pkt.haslayer('Raw'):
        payload = pkt['Raw'].load
        print(f"Payload (first 50 bytes): {payload[:50]}")

    print()

if __name__ == "__main__":
    interface = "Wi-Fi"  # Change to your interface name
    print(f"Starting packet sniffing on interface {interface}. Press Ctrl+C to stop.")
    sniff(iface=interface, prn=packet_callback, store=False)
