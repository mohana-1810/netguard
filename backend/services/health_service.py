def calculate_health(
    status: str,
    latency_ms: float | None,
    packet_loss: float
) -> str:

    if status == "OFFLINE":
        return "CRITICAL"

    if packet_loss > 20:
        return "CRITICAL"

    if latency_ms is not None and latency_ms > 200:
        return "CRITICAL"

    if packet_loss > 5:
        return "WARNING"

    if latency_ms is not None and latency_ms > 100:
        return "WARNING"

    return "HEALTHY"


def build_health_summary(
    status: str,
    latency_ms: float | None,
    packet_loss: float
) -> dict:

    health = calculate_health(
        status=status,
        latency_ms=latency_ms,
        packet_loss=packet_loss
    )

    return {
        "status": status,
        "latency_ms": latency_ms,
        "packet_loss": packet_loss,
        "health": health
    }