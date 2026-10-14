const API_BASE = "http://127.0.0.1:8000";


async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );


    if (!response.ok) {

        let message =
            `Request failed with status ${response.status}`;

        try {
            const errorData =
                await response.json();

            if (errorData.detail) {
                message = errorData.detail;
            }

        } catch {
            // Use the default message.
        }

        throw new Error(message);
    }


    return response.json();
}


/* ---------- Backend ---------- */

async function getBackendHealth() {
    return apiRequest("/health");
}


/* ---------- Devices ---------- */

async function getDevices() {
    return apiRequest("/devices/");
}


async function getDevice(deviceId) {
    return apiRequest(
        `/devices/${deviceId}`
    );
}


async function createDevice(device) {
    return apiRequest(
        "/devices/",
        {
            method: "POST",
            body: JSON.stringify(device)
        }
    );
}


async function deleteDevice(deviceId) {
    return apiRequest(
        `/devices/${deviceId}`,
        {
            method: "DELETE"
        }
    );
}


/* ---------- Monitoring ---------- */

async function runMonitoring() {
    return apiRequest("/monitoring/");
}


/* ---------- Metrics ---------- */

async function getMetrics() {
    return apiRequest("/metrics/");
}


async function getDeviceMetrics(deviceId) {
    return apiRequest(
        `/metrics/device/${deviceId}`
    );
}


/* ---------- Alerts ---------- */

async function getAlerts() {
    return apiRequest("/alerts/");
}


async function getActiveAlerts() {
    return apiRequest("/alerts/active");
}


async function getAlert(alertId) {
    return apiRequest(
        `/alerts/${alertId}`
    );
}


async function resolveAlert(alertId) {
    return apiRequest(
        `/alerts/${alertId}/resolve`,
        {
            method: "PATCH"
        }
    );
}

async function acknowledgeAlert(alertId) {
    return apiRequest(
        `/alerts/${alertId}/acknowledge`,
        {
            method: "PATCH"
        }
    );
}