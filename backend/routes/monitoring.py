from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.models.database import get_db
from backend.services.monitoring_service import monitor_all_devices


router = APIRouter(
    prefix="/monitoring",
    tags=["Monitoring"]
)


@router.get("/")
def monitor_network(db: Session = Depends(get_db)):
    return {
        "message": "Network monitoring completed",
        "results": monitor_all_devices(db)
    }