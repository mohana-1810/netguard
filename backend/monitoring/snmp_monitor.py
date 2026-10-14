from typing import Any


def check_snmp_device(
    host: str,
    community: str = "public",
    port: int = 161
) -> dict[str, Any]:
    """
    Collect basic SNMP information from a network device.

    SNMP implementation will be connected to real devices
    once the core monitoring pipeline has been verified.
    """

    return {
        "host": host,
        "protocol": "SNMP",
        "port": port,
        "community": community,
        "status": "NOT_CONFIGURED",
        "cpu_usage": None,
        "memory_usage": None,
        "uptime": None,
        "interfaces": []
    }