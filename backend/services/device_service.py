from sqlalchemy.orm import Session

from backend.models.device import Device


def add_device(
    db: Session,
    name: str,
    host: str,
    device_type: str,
    location: str | None = None
):
    device = Device(
        name=name,
        host=host,
        device_type=device_type,
        location=location
    )

    db.add(device)
    db.commit()
    db.refresh(device)

    return device


def get_all_devices(db: Session):
    return db.query(Device).all()


def get_device_by_id(db: Session, device_id: int):
    return db.query(Device).filter(Device.id == device_id).first()


def delete_device(db: Session, device_id: int):
    device = get_device_by_id(db, device_id)

    if device is None:
        return False

    db.delete(device)
    db.commit()

    return True