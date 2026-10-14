from contextlib import asynccontextmanager

from sqlalchemy import inspect, text
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.models.database import Base, engine
from backend.models.device import Device
from backend.models.metric import Metric
from backend.models.alert import Alert

from backend.routes.devices import router as devices_router
from backend.routes.monitoring import router as monitoring_router
from backend.routes.alerts import router as alerts_router
from backend.routes.metrics import router as metrics_router
from backend.routes.snmp import router as snmp_router

from backend.services.scheduler import start_scheduler, stop_scheduler


def migrate_alert_acknowledgement_columns():
    inspector = inspect(engine)

    if "alerts" not in inspector.get_table_names():
        return

    existing_columns = {
        column["name"]
        for column in inspector.get_columns("alerts")
    }

    with engine.begin() as connection:
        if "acknowledged" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE alerts "
                    "ADD COLUMN acknowledged BOOLEAN "
                    "NOT NULL DEFAULT 0"
                )
            )

        if "acknowledged_at" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE alerts "
                    "ADD COLUMN acknowledged_at DATETIME"
                )
            )


# Create tables, then safely migrate existing alerts.
Base.metadata.create_all(bind=engine)
migrate_alert_acknowledgement_columns()


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()

    yield

    stop_scheduler()


app = FastAPI(
    title="NetGuard",
    description="Network Health Monitoring and Alert System",
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(devices_router)
app.include_router(monitoring_router)
app.include_router(alerts_router)
app.include_router(metrics_router)


@app.get("/")
def root():
    return {
        "message": "NetGuard is running",
        "status": "online"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }