from backend.models.database import SessionLocal
from backend.services.device_service import get_all_devices
from backend.monitoring.ping_monitor import check_device


def monitor_devices():
    db = SessionLocal()

    try:
        devices = get_all_devices(db)

        results = []

        for device in devices:
            result = check_device(device.host)

            result["id"] = device.id
            result["name"] = device.name
            result["type"] = device.device_type
            result["location"] = device.location

            results.append(result)

        return results

    finally:
        db.close()


if __name__ == "__main__":
    results = monitor_devices()

    print("\nNETWORK DEVICE STATUS")
    print("=" * 60)

    if not results:
        print("No devices found in the database.")
    else:
        for device in results:
            print(f"Device:   {device['name']}")
            print(f"Type:     {device['type']}")
            print(f"Host:     {device['host']}")
            print(f"Location: {device['location']}")
            print(f"Status:   {device['status']}")
            print(f"Latency:  {device['latency_ms']} ms")
            print(f"Health:   {device['health']}")
            print("-" * 60)