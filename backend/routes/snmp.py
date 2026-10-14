from fastapi import APIRouter

from backend.monitoring.snmp_monitor import check_snmp_device


router = APIRouter(
    prefix="/snmp",
    tags=["SNMP"]
)


@router.get("/{host}")
def monitor_snmp_device(host: str):
    return check_snmp_device(host)