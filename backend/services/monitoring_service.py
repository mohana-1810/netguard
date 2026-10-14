from sqlalchemy.orm import Session

from backend.models.device import Device
from backend.models.metric import Metric
from backend.monitoring.ping_monitor import check_device


def monitor_device(
    db: Session,
    device: Device
):
    result = check_device(device.host)

    metric = Metric(
        device_id=device.id,
        latency_ms=result["latency_ms"],
        packet_loss=result["packet_loss"],
        status=result["status"],
        health=result["health"]
    )

    db.add(metric)
    db.commit()
    db.refresh(metric)

    return {
        "device_id": device.id,
        "name": device.name,
        "host": device.host,
        "device_type": device.device_type,
        "location": device.location,
        "status": result["status"],
        "latency_ms": result["latency_ms"],
        "packet_loss": result["packet_loss"],
        "health": result["health"]
    }


def monitor_all_devices(db: Session):
    devices = db.query(Device).all()

    results = []

    for device in devices:
        result = monitor_device(
            db=db,
            device=device
        )

        results.append(result)

    return results