from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.models.database import get_db
from backend.services.device_service import (
    add_device,
    delete_device,
    get_all_devices,
    get_device_by_id,
)


router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)


class DeviceCreate(BaseModel):
    name: str
    host: str
    device_type: str
    location: str | None = None


@router.post("/")
def create_device(
    device: DeviceCreate,
    db: Session = Depends(get_db)
):
    return add_device(
        db=db,
        name=device.name,
        host=device.host,
        device_type=device.device_type,
        location=device.location
    )


@router.get("/")
def list_devices(
    db: Session = Depends(get_db)
):
    return get_all_devices(db)


@router.get("/{device_id}")
def get_device(
    device_id: int,
    db: Session = Depends(get_db)
):
    device = get_device_by_id(db, device_id)

    if device is None:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    return device


@router.delete("/{device_id}")
def remove_device(
    device_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_device(db, device_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    return {
        "message": "Device deleted successfully"
    }