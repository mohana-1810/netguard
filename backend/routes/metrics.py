from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.models.database import get_db
from backend.models.metric import Metric


router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"]
)


@router.get("/")
def list_metrics(
    db: Session = Depends(get_db)
):
    metrics = (
        db.query(Metric)
        .order_by(Metric.timestamp.desc())
        .all()
    )

    return metrics


@router.get("/device/{device_id}")
def get_device_metrics(
    device_id: int,
    db: Session = Depends(get_db)
):
    metrics = (
        db.query(Metric)
        .filter(Metric.device_id == device_id)
        .order_by(Metric.timestamp.desc())
        .all()
    )

    if not metrics:
        raise HTTPException(
            status_code=404,
            detail="No metrics found for this device"
        )

    return metrics