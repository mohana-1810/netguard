function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        value ?? "";

    return element.innerHTML;
}


function formatLatency(latency) {

    if (latency === null || latency === undefined) {
        return "—";
    }

    return `${Number(latency).toFixed(2)} ms`;
}


function formatPacketLoss(packetLoss) {

    if (
        packetLoss === null ||
        packetLoss === undefined
    ) {
        return "—";
    }

    return `${Number(packetLoss).toFixed(2)}%`;
}


function formatTimestamp(timestamp) {

    if (!timestamp) {
        return "—";
    }

    return new Date(
        timestamp
    ).toLocaleString();
}


function getStatusClass(status) {

    switch (status) {

        case "ONLINE":
            return "badge-online";

        case "OFFLINE":
            return "badge-offline";

        default:
            return "";
    }
}


function getHealthClass(health) {

    switch (health) {

        case "HEALTHY":
            return "badge-healthy";

        case "WARNING":
            return "badge-warning";

        case "CRITICAL":
            return "badge-critical";

        default:
            return "";
    }
}


function getSeverityClass(severity) {

    switch (severity) {

        case "CRITICAL":
            return "severity-critical";

        case "WARNING":
            return "severity-warning";

        default:
            return "severity-info";
    }
}


function createBadge(
    text,
    className
) {

    return `
        <span class="badge ${className}">
            ${escapeHTML(text)}
        </span>
    `;
}