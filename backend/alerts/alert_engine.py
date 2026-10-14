from datetime import datetime

from sqlalchemy.orm import Session

from backend.models.alert import Alert
from backend.models.device import Device


def get_active_alert(
    db: Session,
    device_id: int,
    alert_type: str
):
    return (
        db.query(Alert)
        .filter(
            Alert.device_id == device_id,
            Alert.alert_type == alert_type,
            Alert.resolved == False
        )
        .first()
    )


def create_alert(
    db: Session,
    device: Device,
    severity: str,
    alert_type: str,
    message: str
):
    existing_alert = get_active_alert(
        db=db,
        device_id=device.id,
        alert_type=alert_type
    )

    # Preserve existing active alerts and their acknowledgement state.
    if existing_alert is not None:
        existing_alert.severity = severity
        existing_alert.message = message
        db.commit()
        db.refresh(existing_alert)
        return existing_alert

    alert = Alert(
        device_id=device.id,
        severity=severity,
        alert_type=alert_type,
        message=message
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


def evaluate_device_health(
    db: Session,
    device: Device,
    monitoring_result: dict
):
    status = monitoring_result["status"]
    latency = monitoring_result["latency_ms"]
    packet_loss = monitoring_result["packet_loss"]

    alerts = []

    # Device is offline.
    if status == "OFFLINE":
        alert = create_alert(
            db=db,
            device=device,
            severity="CRITICAL",
            alert_type="DEVICE_DOWN",
            message=f"{device.name} is unreachable."
        )

        alerts.append(alert)
        return alerts

    # Device is online again: resolve the old outage alert.
    resolve_alert_type(
        db=db,
        device_id=device.id,
        alert_type="DEVICE_DOWN"
    )

    # Packet loss.
    if packet_loss > 20:
        alert = create_alert(
            db=db,
            device=device,
            severity="CRITICAL",
            alert_type="HIGH_PACKET_LOSS",
            message=(
                f"{device.name} has high packet loss "
                f"({packet_loss}%)."
            )
        )
        alerts.append(alert)

    elif packet_loss > 5:
        alert = create_alert(
            db=db,
            device=device,
            severity="WARNING",
            alert_type="PACKET_LOSS",
            message=(
                f"{device.name} has elevated packet loss "
                f"({packet_loss}%)."
            )
        )
        alerts.append(alert)

    else:
        resolve_alert_type(
            db=db,
            device_id=device.id,
            alert_type="HIGH_PACKET_LOSS"
        )
        resolve_alert_type(
            db=db,
            device_id=device.id,
            alert_type="PACKET_LOSS"
        )

    # Latency.
    if latency is not None and latency > 200:
        alert = create_alert(
            db=db,
            device=device,
            severity="CRITICAL",
            alert_type="HIGH_LATENCY",
            message=(
                f"{device.name} has critically high latency "
                f"({latency} ms)."
            )
        )
        alerts.append(alert)

    elif latency is not None and latency > 100:
        alert = create_alert(
            db=db,
            device=device,
            severity="WARNING",
            alert_type="HIGH_LATENCY",
            message=(
                f"{device.name} has high latency "
                f"({latency} ms)."
            )
        )
        alerts.append(alert)

    else:
        resolve_alert_type(
            db=db,
            device_id=device.id,
            alert_type="HIGH_LATENCY"
        )

    return alerts


def resolve_alert_type(
    db: Session,
    device_id: int,
    alert_type: str
):
    active_alerts = (
        db.query(Alert)
        .filter(
            Alert.device_id == device_id,
            Alert.alert_type == alert_type,
            Alert.resolved == False
        )
        .all()
    )

    now = datetime.utcnow()

    for alert in active_alerts:
        alert.resolved = True
        alert.resolved_at = now

    if active_alerts:
        db.commit()

    return active_alerts


def resolve_device_alerts(
    db: Session,
    device: Device
):
    active_alerts = (
        db.query(Alert)
        .filter(
            Alert.device_id == device.id,
            Alert.resolved == False
        )
        .all()
    )

    now = datetime.utcnow()

    for alert in active_alerts:
        alert.resolved = True
        alert.resolved_at = now

    if active_alerts:
        db.commit()

    return active_alerts