from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from .database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    device_id = Column(
        Integer,
        ForeignKey("devices.id"),
        nullable=False
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    severity = Column(
        String,
        nullable=False
    )

    alert_type = Column(
        String,
        nullable=False
    )

    message = Column(
        String,
        nullable=False
    )

    resolved = Column(
        Boolean,
        default=False,
        nullable=False
    )

    resolved_at = Column(
        DateTime,
        nullable=True
    )

    acknowledged = Column(
        Boolean,
        default=False,
        nullable=False
    )

    acknowledged_at = Column(
        DateTime,
        nullable=True
    )