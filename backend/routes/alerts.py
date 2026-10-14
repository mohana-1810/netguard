from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.models.alert import Alert
from backend.models.database import get_db


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.get("/")
def list_alerts(
    db: Session = Depends(get_db)
):
    alerts = (
        db.query(Alert)
        .order_by(Alert.timestamp.desc())
        .all()
    )

    return alerts


@router.get("/active")
def list_active_alerts(
    db: Session = Depends(get_db)
):
    alerts = (
        db.query(Alert)
        .filter(Alert.resolved == False)
        .order_by(Alert.timestamp.desc())
        .all()
    )

    return alerts


@router.get("/{alert_id}")
def get_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    return alert


@router.patch("/{alert_id}/acknowledge")
def acknowledge_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    if alert.resolved:
        raise HTTPException(
            status_code=409,
            detail="Cannot acknowledge an already resolved alert"
        )

    if not alert.acknowledged:
        alert.acknowledged = True
        alert.acknowledged_at = datetime.utcnow()

        db.commit()
        db.refresh(alert)

    return alert


@router.patch("/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    if not alert.resolved:
        alert.resolved = True
        alert.resolved_at = datetime.utcnow()

        db.commit()
        db.refresh(alert)

    return alert