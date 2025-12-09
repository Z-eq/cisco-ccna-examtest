import json
import os

# ====================================================================
# 1. KATEGORIMAPPNING (KOMPLETT VERSION)
#    Denna dictionary definierar hur gamla kategorinamn ska ersättas
#    med de nya, standardiserade namnen (13 totalt).
# ====================================================================

CATEGORY_MAP = {
    # --- Access Control Lists (ACL) ---
    'ACLs': 'Access Control Lists (ACL)',
    'ACLs/Security': 'Access Control Lists (ACL)',
    'Access Control Lists (ACLs)': 'Access Control Lists (ACL)',
    'Cisco ACL Configuration': 'Access Control Lists (ACL)',
    'Cisco ACLs (Standard)': 'Access Control Lists (ACL)',
    'Security/Port Security': 'Access Control Lists (ACL)',
    
    # --- Security & AAA ---
    'Security': 'Security & AAA',
    'Cisco Security': 'Security & AAA',
    'Security / DHCP Attacks': 'Security & AAA',
    'Security / Network Architecture': 'Security & AAA',
    'Security Management/Best Practices': 'Security & AAA',
    'Security and Routing': 'Security & AAA',
    'Security/802.1X': 'Security & AAA',
    'Security/DLP': 'Security & AAA',
    'Security/Data Loss Prevention': 'Security & AAA',
    'Security/IPsec': 'Security & AAA',
    'Security/NGFW': 'Security & AAA',
    'Security/Physical': 'Security & AAA',
    'Security/VPN': 'Security & AAA',
    'AAA Protocols': 'Security & AAA',
    
    # --- Wireless ---
    'WLAN': 'Wireless',
    'WLAN/Controller': 'Wireless',
    'Wireless': 'Wireless',
    'Wireless / VLAN Assignment': 'Wireless',
    'Wireless Networking': 'Wireless',
    'Wireless Security': 'Wireless',
    'Wireless Security Protocols': 'Wireless',
    'Wireless Security/AAA': 'Wireless',
    'Wireless/Hardware': 'Wireless',
    'Wireless/Security': 'Wireless',
    'Wireless/WLAN': 'Wireless',
    'Cisco Wireless': 'Wireless',
    'Wireless/WLC': 'Wireless',
    
    # --- AI & Machine Learning ---
    'AI': 'AI & Machine Learning',
    'AI/LLMs': 'AI & Machine Learning',
    'AI/ML': 'AI & Machine Learning',

    # --- Automation & DevOps ---
    'Automation': 'Automation & DevOps',
    'Automation/IaC': 'Automation & DevOps',
    'Automation/Meraki': 'Automation & DevOps',
    'Automation/Protocols': 'Automation & DevOps',
    'Automation/Tools': 'Automation & DevOps',
    'Network Automation': 'Automation & DevOps',
    'Data Formats': 'Automation & DevOps',
    'API Security': 'Automation & DevOps',

    # --- IP Addressing IPv4/Ipv6 ---
    'IP Addressing': 'IP Addressing IPv4/Ipv6',
    'Subnetting': 'IP Addressing IPv4/Ipv6',
    'Subnetting/Switching': 'IP Addressing IPv4/Ipv6',
    'IPv6': 'IP Addressing IPv4/Ipv6',
    'IPv6 Addressing': 'IP Addressing IPv4/Ipv6',
    'Ipv6': 'IP Addressing IPv4/Ipv6',
    
    # --- Core Protocols (TCP/IP/DNS) ---
    'ARP': 'Core Protocols (TCP/IP/DNS)',
    'DNS': 'Core Protocols (TCP/IP/DNS)',
    'ICMP/IP': 'Core Protocols (TCP/IP/DNS)',
    'IP': 'Core Protocols (TCP/IP/DNS)',
    'IP Connectivity': 'Core Protocols (TCP/IP/DNS)',
    'IPv6 Protocols': 'Core Protocols (TCP/IP/DNS)',
    'Protocols': 'Core Protocols (TCP/IP/DNS)',
    'Protocols & Management': 'Core Protocols (TCP/IP/DNS)',
    'Protocols & management': 'Core Protocols (TCP/IP/DNS)',
    'TCP/IP': 'Core Protocols (TCP/IP/DNS)',
    'TCP/IP Protocols': 'Core Protocols (TCP/IP/DNS)',
    'TCP/UDP': 'Core Protocols (TCP/IP/DNS)',
    'Transport Layer / TCP': 'Core Protocols (TCP/IP/DNS)',
    'IP Services': 'Core Protocols (TCP/IP/DNS)',

    # --- Switching & VLAN ---
    'EtherChannel': 'Switching & VLAN',
    'EtherChannel/Routing': 'Switching & VLAN',
    'Ethernet': 'Switching & VLAN',
    'Ethernet/OSI': 'Switching & VLAN',
    'STP': 'Switching & VLAN',
    'STP/EtherChannel': 'Switching & VLAN',
    'STP/Security': 'Switching & VLAN',
    'Spanning Tree': 'Switching & VLAN',
    'Switching': 'Switching & VLAN',
    'Switching Concepts': 'Switching & VLAN',
    'Switching Fundamentals': 'Switching & VLAN',
    'Switching/Hardware': 'Switching & VLAN',
    'Switching/STP': 'Switching & VLAN',
    'Trunking': 'Switching & VLAN',
    'VLAN': 'Switching & VLAN',
    'VLAN Security': 'Switching & VLAN',
    'VLAN/Switching': 'Switching & VLAN',
    'VLANs': 'Switching & VLAN',
    'VLANs/Routing': 'Switching & VLAN',
    'Cisco Switching': 'Switching & VLAN',
    'Cisco Switching/RSTP': 'Switching & VLAN',
    'Cisco Switching/STP': 'Switching & VLAN',
    'Cisco Switching/VLANs': 'Switching & VLAN',
    'PoE': 'Switching & VLAN',
    'Switching/VLANs': 'Switching & VLAN',
    
    # --- Routing Protocols (OSPF/EIGRP) ---
    'Routing': 'Routing Protocols (OSPF/EIGRP)',
    'Routing / Administrative Distance': 'Routing Protocols (OSPF/EIGRP)',
    'Routing / Network Fundamentals': 'Routing Protocols (OSPF/EIGRP)',
    'Routing / Redundancy Protocols': 'Routing Protocols (OSPF/EIGRP)',
    'Routing Algorithms': 'Routing Protocols (OSPF/EIGRP)',
    'Routing Fundamentals': 'Routing Protocols (OSPF/EIGRP)',
    'Routing Metrics': 'Routing Protocols (OSPF/EIGRP)',
    'Routing Protocols (OSPF)': 'Routing Protocols (OSPF/EIGRP)',
    'Routing/AD': 'Routing Protocols (OSPF/EIGRP)',
    'Routing/IP Addressing': 'Routing Protocols (OSPF/EIGRP)',
    'Routing/Redundancy': 'Routing Protocols (OSPF/EIGRP)',
    'Cisco Routing': 'Routing Protocols (OSPF/EIGRP)',
    'Cisco Routing Concepts': 'Routing Protocols (OSPF/EIGRP)',
    'Cisco Routing/OSPF': 'Routing Protocols (OSPF/EIGRP)',
    'Cisco Routing/OSPF & EIGRP': 'Routing Protocols (OSPF/EIGRP)',
    'OSPF': 'Routing Protocols (OSPF/EIGRP)',
    'Routing/OSPF': 'Routing Protocols (OSPF/EIGRP)',
    'IPv6/Routing': 'Routing Protocols (OSPF/EIGRP)',

    # --- Routing & Protocols ---
    'FHRP/Redundancy': 'Routing & Protocols',
    'First Hop Redundancy': 'Routing & Protocols',
    'HSRP': 'Routing & Protocols',
    'HSRP / VLAN / Default Gateway': 'Routing & Protocols',
    'HSRP/MAC': 'Routing & Protocols',
    'High Availability': 'Routing & Protocols',
    'Routing/FHRP': 'Routing & Protocols',

    # --- Network Fundamentals & Tools ---
    'CLI': 'Network Fundamentals & Tools',
    'CLI/Security': 'Network Fundamentals & Tools',
    'CLI/Troubleshooting': 'Network Fundamentals & Tools',
    'Cabling': 'Network Fundamentals & Tools',
    'Cisco CLI': 'Network Fundamentals & Tools',
    'Cisco CLI/Discovery': 'Network Fundamentals & Tools',
    'Cisco CLI/IPv6': 'Network Fundamentals & Tools',
    'Cisco Discovery Protocol': 'Network Fundamentals & Tools',
    'Cisco Hardware': 'Network Fundamentals & Tools',
    'Cisco IOS': 'Network Fundamentals & Tools',
    'Cisco IOS Commands': 'Network Fundamentals & Tools',
    'Cisco IOS Management': 'Network Fundamentals & Tools',
    'Cisco IOS/Hardware': 'Network Fundamentals & Tools',
    'Cisco IOS/Memory': 'Network Fundamentals & Tools',
    'Cisco IOS/Protocols': 'Network Fundamentals & Tools',
    'Cisco IOS/Security': 'Network Fundamentals & Tools',
    'Cisco IOS/Syslog': 'Network Fundamentals & Tools',
    'Cisco IOS/Troubleshooting': 'Network Fundamentals & Tools',
    'Cisco Meraki': 'Network Fundamentals & Tools',
    'Cisco Modeling Labs (CML)': 'Network Fundamentals & Tools',
    'Cisco Troubleshooting/Ethernet': 'Network Fundamentals & Tools',
    'Data Center Networking': 'Network Fundamentals & Tools',
    'Data Center/Spine-Leaf': 'Network Fundamentals & Tools',
    'LAN/WAN': 'Network Fundamentals & Tools',
    'Linux': 'Network Fundamentals & Tools',
    'Management': 'Network Fundamentals & Tools',
    'Media': 'Network Fundamentals & Tools',
    'Network': 'Network Fundamentals & Tools',
    'Network Access': 'Network Fundamentals & Tools',
    'Network Architecture': 'Network Fundamentals & Tools',
    'Network Architecture/Security': 'Network Fundamentals & Tools',
    'Network Characteristics': 'Network Fundamentals & Tools',
    'Network Design': 'Network Fundamentals & Tools',
    'Network Design & Security': 'Network Fundamentals & Tools',
    'Network Devices': 'Network Fundamentals & Tools',
    'Network Fundamentals': 'Network Fundamentals & Tools',
    'Network Management': 'Network Fundamentals & Tools',
    'Network Performance': 'Network Fundamentals & Tools',
    'Network Topology': 'Network Fundamentals & Tools',
    'Networking': 'Network Fundamentals & Tools',
    'Networking Fundamentals': 'Network Fundamentals & Tools',
    'Networking/Applications': 'Network Fundamentals & Tools',
    'QoS': 'Network Fundamentals & Tools',
    'Quality of Service (QoS)': 'Network Fundamentals & Tools',
    'SNMP': 'Network Fundamentals & Tools',
    'Server Fundamentals': 'Network Fundamentals & Tools',
    'Switch Commands': 'Network Fundamentals & Tools',
    'Switch Configuration': 'Network Fundamentals & Tools',
    'Switching/Routing': 'Network Fundamentals & Tools',
    'Syslog': 'Network Fundamentals & Tools',
    'Syslog/NTP': 'Network Fundamentals & Tools',
    'Troubleshooting': 'Network Fundamentals & Tools',
    'Troubleshooting/Media': 'Network Fundamentals & Tools',
    'Virtualization': 'Network Fundamentals & Tools',
    'NTP': 'Network Fundamentals & Tools',
    'Application Types': 'Network Fundamentals & Tools',
    'Routing/CLI': 'Network Fundamentals & Tools',
    'Routing/Cisco IOS': 'Network Fundamentals & Tools',
    
    # --- WAN & SDN/Virtualization ---
    'Cisco SD-WAN': 'WAN & SDN/Virtualization',
    'MPLS VPN': 'WAN & SDN/Virtualization',
    'NAT': 'WAN & SDN/Virtualization',
    'NAT and Cisco IOS': 'WAN & SDN/Virtualization',
    'NAT/Cisco IOS': 'WAN & SDN/Virtualization',
    'SD-Access': 'WAN & SDN/Virtualization',
    'SD-WAN': 'WAN & SDN/Virtualization',
    'SDN': 'WAN & SDN/Virtualization',
    'Software-Defined Networking (SDN)': 'WAN & SDN/Virtualization',
    'VPN': 'WAN & SDN/Virtualization',
    'VPN Technologies': 'WAN & SDN/Virtualization',
    'VPN and WAN Technologies': 'WAN & SDN/Virtualization',
    'WAN Components': 'WAN & SDN/Virtualization',
    'WAN Connectivity': 'WAN & SDN/Virtualization',
    'Cloud Computing': 'WAN & SDN/Virtualization',
    
    # --- OSI Model ---
    'OSI': 'OSI Model',
    'OSI Model': 'OSI Model',
    'OSI Model/Protocols': 'OSI Model',
    'OSI/TCP-IP': 'OSI Model',
    'OSI/TCP-IP Model': 'OSI Model',
    
}

# ====================================================================
# 2. SKRIPT LOGIK (Behöver inte ändras)
# ====================================================================

def update_json_files(directory="."):
    """Hittar och uppdaterar kategorier i alla JSON-filer i den angivna mappen."""
    
    print("--- Startar Kategorirensning ---")
    print(f"Mappningstabell innehåller {len(CATEGORY_MAP)} poster.")
    
    file_count = 0
    updated_count = 0
    
    # Gå igenom alla filer i den aktuella mappen
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            
            # Hoppa över highscores.json och wrong_questions.json
            if filename in ["highscores.json", "wrong_questions.json"] or filename.startswith('.'):
                continue 

            print(f"\nBehandlar fil: {filename}...")
            file_count += 1
            file_updated = False

            try:
                # 1. Läs in filen
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # 2. Uppdatera kategorierna
                for question in data:
                    old_category = question.get('category')
                    if old_category and old_category in CATEGORY_MAP:
                        new_category = CATEGORY_MAP[old_category]
                        question['category'] = new_category
                        file_updated = True
                        
                # 3. Spara filen om ändringar gjordes
                if file_updated:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        # Använder indent=4 för snygg formatering och ensure_ascii=False för att behålla svenska tecken
                        json.dump(data, f, indent=4, ensure_ascii=False)
                    print(f"  [UPPDATERAD] Filen sparades med nya kategorier.")
                    updated_count += 1
                else:
                    print("  [OK] Inga kategorier behövde uppdateras i denna fil.")

            except json.JSONDecodeError:
                print(f"  [FEL] Kunde inte tolka {filename} som en giltig JSON-fil. Skippar.")
            except Exception as e:
                print(f"  [FEL] Ett oväntat fel uppstod med {filename}: {e}")

    print(f"\n--- Kategorirensning Slutförd ---")
    print(f"Totalt antal JSON-filer behandlade: {file_count}")
    print(f"Antal filer som uppdaterades: {updated_count}")

# Kör funktionen
if __name__ == "__main__":
    update_json_files()