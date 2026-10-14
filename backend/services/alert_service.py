from sqlalchemy.orm import Session

from backend.alerts.alert_engine import evaluate_device_health
from backend.models.device import Device


def process_device_result(
    db: Session,
    device: Device,
    monitoring_result: dict
):
    return evaluate_device_health(
        db=db,
        device=device,
        monitoring_result=monitoring_result
    )


def process_all_device_results(
    db: Session,
    monitoring_results: list[dict]
):
    processed_alerts = []

    for result in monitoring_results:
        device = (
            db.query(Device)
            .filter(
                Device.id == result["device_id"]
            )
            .first()
        )

        if device is None:
            continue

        alerts = process_device_result(
            db=db,
            device=device,
            monitoring_result=result
        )

        processed_alerts.extend(alerts)

    return processed_alerts