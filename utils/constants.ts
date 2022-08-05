export const VariableDescription = {
  "%CLIENTID%": "The CLIENTID. ALL CAPS",
  "%LOCATION%": "The branch name. ALL CAPS",
  "%BW%":
    "The bandwidth configuration for the interface.\n\nCircuit Speeds: 1536, 3072, 4608, 6144, 10000\n\nInternet Speeds: 1000, 3000, 4000, 5000, 6000, 7000, 10000",
  "%HOS-VLAN%": "The hosted vlan number.",
  "%LOOP-IDEN%":
    "The loop identifier.\nVLAN 1000-1255. Use 17\nVLAN 1256-1511. Use 18",
  "%LOOP2-IDEN%":
    "The loop identifier.\nVLAN 1000-1255. Use 24\nVLAN 1256-1511. Use 25",
  "%HOS-IDEN%":
    "The clients hosted identifier. The third octet of the BOIT assigned hosted network. 10.200.x.0\n\nVLAN 1000-1255. Use the vlan and subtract 1000.\n\nVLAN 1256-1511. Use the vlan and subtract 1256.",
  "%INT-ADDR%": "The internal address assigned to this device.",
  "%INT-MASK%": "The internal subnet mask.",
  "%INT-NET%": "The internal network address assigned to this location",
  "%INT-WILD%": "The internal wildcard mask.",
  "%LOC-IDEN%":
    "BankOnIT is always 1. Increment by 1 for each additional client location.",
  "%INTERFACE0%": "FastEthernet0/0, GigabitEthernet0/0/0",
  "%INTERFACE0-SPEED%": "100 FastEthernet Uplink, 1000 Gigabit Uplink",
  "%INTERFACE1%": "FastEthernet0/1, GigabitEthernet0/0/1",
  "%BMN-PEER%":
    "The next-hop address for the BMN Circuit.\n\nNote: only used if there is a current BMN circuit and this VPN connection is used as a backup. Otherwise it can be removed.",
  "%QOS-PLCY%":
    "The BankOnIT-XX policy matching the bandwidth of the of the location",
  "%BMN-BACK-RTR%":
    "The address allocated to the router on the 10.86.204-7.0 - BMN-VPN tab in the SBC spreadsheet",
  "%BMN-BACK-FW%":
    "The address allocated to the firewall on the 10.86.204-7.0 - BMN-VPN tab in the SBC spreadsheet.",
  "%BMN-BACK-AS%":
    "The bgp autonomous system allocated to this client on the AS-NUMBERS tab in the SBC spreadsheet.",
};

export type VariableDesKeys = keyof typeof VariableDescription;
export type VariblesValues = Partial<{ [key in VariableDesKeys]: string }>;

export const MaskCIDRMap = {
  "/28": "255.255.255.240",
  "/27": "255.255.255.224",
  "/26": "255.255.255.192",
  "/25": "255.255.255.128",
  "/24": "255.255.255.0",
  "/23": "255.255.254.0",
  "/22": "255.255.252.0",
  "/21": "255.255.248.0",
  "/20": "255.255.240.0",
  "/19": "255.255.224.0",
  "/18": "255.255.192.0",
  "/17": "255.255.128.0",
  "/16": "255.255.0.0",
  "/15": "255.254.0.0",
  "/14": "255.252.0.0",
  "/13": "255.248.0.0",
};
