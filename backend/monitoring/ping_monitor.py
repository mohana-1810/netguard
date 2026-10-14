
from ping3 import ping

from backend.services.health_service import calculate_health


def check_device(
    host: str,
    count: int = 3,
    timeout: float = 1
):
    if count <= 0:
        raise ValueError("count must be greater than zero")

    if timeout <= 0:
        raise ValueError("timeout must be greater than zero")

    successful_pings = []
    failed_pings = 0

    for _ in range(count):
        try:
            result = ping(
                host,
                timeout=timeout
            )
        except Exception:
            # Treat an individual probe error as a failed ping.
            result = None

        if result is None or result is False:
            failed_pings += 1
        else:
            successful_pings.append(result)

    packet_loss = (
        failed_pings / count
    ) * 100

    if not successful_pings:
        return {
            "host": host,
            "status": "OFFLINE",
            "latency_ms": None,
            "packet_loss": 100.0,
            "health": "CRITICAL"
        }

    average_latency_ms = round(
        (
            sum(successful_pings)
            / len(successful_pings)
        ) * 1000,
        2
    )

    status = "ONLINE"

    health = calculate_health(
        status=status,
        latency_ms=average_latency_ms,
        packet_loss=packet_loss
    )

    return {
        "host": host,
        "status": status,
        "latency_ms": average_latency_ms,
        "packet_loss": round(packet_loss, 2),
        "health": health
    }


if __name__ == "__main__":
    result = check_device("8.8.8.8")
    print(result)
