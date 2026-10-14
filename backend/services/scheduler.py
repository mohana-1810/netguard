from apscheduler.schedulers.background import BackgroundScheduler

from backend.models.database import SessionLocal
from backend.services.monitoring_service import monitor_all_devices
from backend.services.alert_service import process_all_device_results


scheduler = BackgroundScheduler()


def run_monitoring_cycle():
    db = SessionLocal()

    try:
        results = monitor_all_devices(db)

        process_all_device_results(
            db=db,
            monitoring_results=results
        )

    except Exception as error:
        print(
            f"Monitoring cycle failed: {error}"
        )

    finally:
        db.close()


def start_scheduler():
    if scheduler.running:
        return

    scheduler.add_job(
        run_monitoring_cycle,
        trigger="interval",
        seconds=10,
        id="network_monitor",
        replace_existing=True,
        max_instances=1,
        coalesce=True
    )

    scheduler.start()

    print(
        "NetGuard monitoring scheduler started."
    )


def stop_scheduler():
    if not scheduler.running:
        return

    scheduler.shutdown(
        wait=False
    )

    print(
        "NetGuard monitoring scheduler stopped."
    )