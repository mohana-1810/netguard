from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from .database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    host = Column(String, unique=True, nullable=False)

    device_type = Column(String, nullable=False)

    location = Column(String, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )