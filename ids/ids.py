import socket
import threading
import time
from collections import defaultdict

# IDS Settings
HOST = "0.0.0.0"     # Listen on all interfaces
PORT = 2222         # Honeypot / monitored port
THRESHOLD = 5       # Alert if more than 5 connections in a minute
TIME_WINDOW = 60    # seconds

connection_count = defaultdict(int)

print("[*] IDS is running... Listening on port 2222")

# Reset counts every minute
def reset_counts():
    global connection_count
    while True:
        time.sleep(TIME_WINDOW)
        connection_count.clear()

# Start the reset thread
threading.Thread(target=reset_counts, daemon=True).start()

# Create a TCP server socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen(5)

while True:
    client_socket, addr = server.accept()
    src_ip = addr[0]
    connection_count[src_ip] += 1
    print(f"[+] Connection attempt from: {src_ip}")

    if connection_count[src_ip] > THRESHOLD:
        print(f"[🚨 ALERT] Possible brute force or port scan from: {src_ip}")

    # Close connection immediately (honeypot style)
    client_socket.close()