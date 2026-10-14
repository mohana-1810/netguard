/* =========================================================
   DOM REFERENCES
   ========================================================= */

const totalDevicesElement =
    document.getElementById("total-devices");

const onlineDevicesElement =
    document.getElementById("online-devices");

const offlineDevicesElement =
    document.getElementById("offline-devices");

const activeAlertsElement =
    document.getElementById("active-alerts");

const deviceSummaryElement =
    document.getElementById("device-summary");

const networkHealthElement =
    document.getElementById("network-health");

const networkHealthLabelElement =
    document.getElementById("network-health-label");

const networkHealthDescriptionElement =
    document.getElementById(
        "network-health-description"
    );

const healthRingElement =
    document.querySelector(".health-ring");

const deviceListElement =
    document.getElementById("device-list");

const networkActivityElement =
    document.getElementById(
        "network-activity"
    );

const alertsContainer =
    document.getElementById(
        "alerts-container"
    );

const alertCountBadge =
    document.getElementById(
        "alert-count-badge"
    );

const activityFeedElement =
    document.getElementById(
        "activity-feed"
    );

const lastUpdatedElement =
    document.getElementById(
        "last-updated"
    );

const connectionDot =
    document.getElementById(
        "connection-dot"
    );

const connectionText =
    document.getElementById(
        "connection-text"
    );

const refreshButton =
    document.getElementById(
        "refresh-button"
    );


/* =========================================================
   STATE
   ========================================================= */

let previousResults = [];

let lastMonitoringResults = [];


/* =========================================================
   CONNECTION STATUS
   ========================================================= */

function setConnectionStatus(
    connected
) {

    if (connected) {

        connectionDot.className =
            "status-dot connected";

        connectionText.textContent =
            "Backend connected";

    } else {

        connectionDot.className =
            "status-dot disconnected";

        connectionText.textContent =
            "Backend disconnected";
    }
}


/* =========================================================
   NETWORK HEALTH
   ========================================================= */

function calculateNetworkHealth(
    results
) {

    if (!results.length) {

        return {
            percentage: 0,
            label: "NO DATA",
            description:
                "No network devices are configured."
        };
    }


    const healthyCount =
        results.filter(
            device =>
                device.health === "HEALTHY"
        ).length;


    const warningCount =
        results.filter(
            device =>
                device.health === "WARNING"
        ).length;


    const criticalCount =
        results.filter(
            device =>
                device.health === "CRITICAL"
        ).length;


    const score =
        (
            healthyCount +
            (warningCount * 0.5)
        ) / results.length;


    const percentage =
        Math.round(score * 100);


    let label;
    let description;


    if (criticalCount > 0) {

        label = "CRITICAL";

        description =
            `${criticalCount} device${
                criticalCount > 1
                    ? "s"
                    : ""
            } require immediate attention.`;

    } else if (warningCount > 0) {

        label = "DEGRADED";

        description =
            `${warningCount} device${
                warningCount > 1
                    ? "s"
                    : ""
            } showing warning conditions.`;

    } else {

        label = "HEALTHY";

        description =
            "All monitored devices are operating normally.";
    }


    return {
        percentage,
        label,
        description
    };
}


function renderNetworkHealth(
    results
) {

    const health =
        calculateNetworkHealth(
            results
        );


    networkHealthElement.textContent =
        `${health.percentage}%`;

    networkHealthLabelElement.textContent =
        health.label;

    networkHealthDescriptionElement.textContent =
        health.description;


    let ringValue =
        health.percentage * 3.6;


    if (health.label === "CRITICAL") {

        healthRingElement.style.background =
            `conic-gradient(
                #23297a ${ringValue}deg,
                #dfe7e7 ${ringValue}deg
            )`;

    } else if (
        health.label === "DEGRADED"
    ) {

        healthRingElement.style.background =
            `conic-gradient(
                #9a5b00 ${ringValue}deg,
                #dfe7e7 ${ringValue}deg
            )`;

    } else {

        healthRingElement.style.background =
            `conic-gradient(
                #2f8f65 ${ringValue}deg,
                #dfe7e7 ${ringValue}deg
            )`;
    }
}


/* =========================================================
   SUMMARY
   ========================================================= */

function renderSummary(
    results,
    alerts
) {

    const total =
        results.length;


    const online =
        results.filter(
            device =>
                device.status === "ONLINE"
        ).length;


    const offline =
        results.filter(
            device =>
                device.status === "OFFLINE"
        ).length;


    totalDevicesElement.textContent =
        total;

    onlineDevicesElement.textContent =
        online;

    offlineDevicesElement.textContent =
        offline;

    activeAlertsElement.textContent =
        alerts.length;

    alertCountBadge.textContent =
        alerts.length;


    if (total === 0) {

        deviceSummaryElement.textContent =
            "No devices";

    } else {

        deviceSummaryElement.textContent =
            `${online} of ${total} online`;
    }
}


/* =========================================================
   NETWORK ACTIVITY
   ========================================================= */

function renderNetworkActivity(
    results
) {

    if (!results.length) {

        networkActivityElement.innerHTML = `
            <div class="empty-state">
                No network devices configured.
            </div>
        `;

        return;
    }


    networkActivityElement.innerHTML =
        results.map(
            device => {

                const isOffline =
                    device.status === "OFFLINE";


                return `
                    <div
                        class="
                            activity-device
                            ${
                                isOffline
                                    ? "offline"
                                    : ""
                            }
                        "
                    >

                        <div class="activity-node">
                            ${
                                isOffline
                                    ? "!"
                                    : "✓"
                            }
                        </div>

                        <div
                            class="
                                activity-device-info
                            "
                        >

                            <strong>
                                ${escapeHTML(
                                    device.name
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    device.host
                                )}
                                ·
                                ${escapeHTML(
                                    device.status
                                )}
                            </span>

                        </div>

                    </div>
                `;
            }
        ).join("");
}


/* =========================================================
   DEVICE LIST
   ========================================================= */

function renderDevices(
    results
) {

    if (!results.length) {

        deviceListElement.innerHTML = `
            <div class="empty-state">
                No devices configured.
            </div>
        `;

        return;
    }


    deviceListElement.innerHTML =
        results.map(
            device => {

                const isOffline =
                    device.status === "OFFLINE";


                return `
                    <div class="device-card">

                        <div
                            class="
                                device-identity
                            "
                        >

                            <span
                                class="
                                    device-indicator
                                    ${
                                        isOffline
                                            ? "offline"
                                            : ""
                                    }
                                "
                            ></span>

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        device.name
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        device.host
                                    )}
                                    ·
                                    ${escapeHTML(
                                        device.device_type
                                    )}
                                </span>

                            </div>

                        </div>


                        <div class="device-metric">

                            <span>
                                Latency
                            </span>

                            <strong>
                                ${
                                    device.latency_ms !== null
                                        ? `${device.latency_ms} ms`
                                        : "—"
                                }
                            </strong>

                        </div>


                        <div class="device-metric">

                            <span>
                                Packet Loss
                            </span>

                            <strong>
                                ${
                                    device.packet_loss !== null
                                        ? `${device.packet_loss}%`
                                        : "—"
                                }
                            </strong>

                        </div>


                        <div class="device-metric">

                            <span>
                                Health
                            </span>

                            <strong
                                class="${getHealthClass(device.health)}"
                            >
                                ${escapeHTML(device.health)}
                            </strong>

                        </div>


                            <div class="device-card-actions">

                                <button
                                    class="device-delete-button"
                                    onclick="deleteDeviceFromDashboard(${device.device_id})"
                                    title="Delete device"
                                >
                                    ×
                                </button>

                            </div>
                    </div>
                `;
            }
        ).join("");
}


/* =========================================================
   ALERTS
   ========================================================= */

function renderAlerts(alerts) {
    if (!alerts.length) {
        alertsContainer.innerHTML = `
            <div class="empty-state">
                ✓ No active alerts
            </div>
        `;
        return;
    }

    alertsContainer.innerHTML = alerts.map(alert => {
        const severityClass = getSeverityClass(alert.severity);

        const acknowledgementControl = alert.acknowledged
            ? `
                <button
                    class="resolve-button"
                    type="button"
                    disabled
                    title="This alert has been acknowledged"
                >
                    ✓ Acknowledged
                </button>
            `
            : `
                <button
                    class="resolve-button"
                    type="button"
                    onclick="handleAcknowledgeAlert(${alert.id})"
                >
                    Acknowledge
                </button>
            `;

        return `
            <div class="alert-item">
                <div class="alert-main">
                    <span class="alert-severity ${severityClass}"></span>

                    <div>
                        <div class="alert-message">
                            ${escapeHTML(alert.message)}
                        </div>

                        <div class="alert-time">
                            ${escapeHTML(alert.alert_type)}
                            ·
                            ${formatTimestamp(alert.timestamp)}
                        </div>
                    </div>
                </div>

                <div class="alert-actions">
                    <span class="${severityClass}">
                        ${escapeHTML(alert.severity)}
                    </span>

                    ${acknowledgementControl}
                </div>
            </div>
        `;
    }).join("");
}


/* =========================================================
   ACTIVITY FEED
   ========================================================= */

function renderActivityFeed(
    results
) {

    if (!results.length) {

        activityFeedElement.innerHTML = `
            <div class="empty-state">
                Waiting for monitoring events...
            </div>
        `;

        return;
    }


    const now =
        new Date().toLocaleTimeString();


    const events = [];


    results.forEach(
        device => {

            events.push({
                message:
                    `${device.name} checked`,
                detail:
                    `${device.status} · ${device.health}`,
                time: now,
                alert:
                    device.health === "CRITICAL"
            });

        }
    );


    activityFeedElement.innerHTML =
        events.slice(0, 6).map(
            event => {

                return `
                    <div
                        class="
                            activity-entry
                            ${
                                event.alert
                                    ? "alert-event"
                                    : ""
                            }
                        "
                    >

                        <span
                            class="
                                activity-marker
                            "
                        ></span>

                        <div
                            class="
                                activity-entry-content
                            "
                        >

                            <strong>
                                ${escapeHTML(
                                    event.message
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    event.detail
                                )}
                            </span>

                        </div>

                        <span
                            class="
                                activity-entry-time
                            "
                        >
                            ${event.time}
                        </span>

                    </div>
                `;
            }
        ).join("");
}


/* =========================================================
   ALERT RESOLUTION
   ========================================================= */

async function handleAcknowledgeAlert(alertId) {
    try {
        await acknowledgeAlert(alertId);
        await loadDashboard();
    } catch (error) {
        console.error(
            "Failed to acknowledge alert:",
            error
        );

        alert(`Failed to acknowledge alert: ${error.message}`);
    }
}

/* =========================================================
   ADD DEVICE MODAL
   ========================================================= */

function openAddDeviceModal() {

    const modal =
        document.getElementById(
            "add-device-modal"
        );

    if (!modal) {
        return;
    }

    modal.classList.add("visible");

    const nameInput =
        document.getElementById(
            "device-name"
        );

    if (nameInput) {
        nameInput.focus();
    }
}


function closeAddDeviceModal() {

    const modal =
        document.getElementById(
            "add-device-modal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove("visible");
}


async function submitAddDevice(event) {

    event.preventDefault();

    const name =
        document.getElementById(
            "device-name"
        ).value.trim();

    const host =
        document.getElementById(
            "device-host"
        ).value.trim();

    const deviceType =
        document.getElementById(
            "device-type"
        ).value;

    const location =
        document.getElementById(
            "device-location"
        ).value.trim();


    if (!name || !host || !deviceType) {

        alert(
            "Please fill in all required fields."
        );

        return;
    }


    const saveButton =
        document.getElementById(
            "save-device-button"
        );

    saveButton.disabled = true;

    saveButton.textContent =
        "Adding...";


    try {

        await createDevice({
            name: name,
            host: host,
            device_type: deviceType,
            location: location || null
        });


        document.getElementById(
            "add-device-form"
        ).reset();

        closeAddDeviceModal();

        await loadDashboard();

    } catch (error) {

        console.error(
            "Failed to add device:",
            error
        );

        alert(
            `Failed to add device: ${error.message}`
        );

    } finally {

        saveButton.disabled = false;

        saveButton.textContent =
            "Add Device";
    }
}

/* =========================================================
   DEVICE DELETION
   ========================================================= */

async function deleteDeviceFromDashboard(
    deviceId
) {

    const device =
        lastMonitoringResults.find(
            item =>
                item.device_id === deviceId
        );

    if (!device) {
        return;
    }

    const confirmed =
        window.confirm(
            `Delete "${device.name}" from NetGuard?`
        );

    if (!confirmed) {
        return;
    }

    try {

        await deleteDevice(
            deviceId
        );

        await loadDashboard();

    } catch (error) {

        console.error(
            "Failed to delete device:",
            error
        );

        alert(
            `Failed to delete device: ${error.message}`
        );
    }
}


/* =========================================================
   MANUAL REFRESH
   ========================================================= */

async function manualRefresh() {

    refreshButton.disabled =
        true;

    refreshButton.textContent =
        "Checking...";


    await loadDashboard();


    refreshButton.disabled =
        false;

    refreshButton.textContent =
        "↻ Run Check";
}


/* =========================================================
   DASHBOARD LOAD
   ========================================================= */

async function loadDashboard() {

    try {

        const monitoring =
            await runMonitoring();

        const alerts =
            await getActiveAlerts();


        const results =
            monitoring.results || [];


        lastMonitoringResults =
            results;

        updatePerformanceDeviceSelector(results);

        renderNetworkHealth(
            results
        );

        renderSummary(
            results,
            alerts
        );

        renderNetworkActivity(
            results
        );

        renderDevices(
            results
        );

        renderAlerts(
            alerts
        );

        renderActivityFeed(
            results
        );


        lastUpdatedElement.textContent =
            `Last updated: ${
                new Date()
                    .toLocaleTimeString()
            }`;


        setConnectionStatus(
            true
        );


        previousResults =
            results;

    } catch (error) {

        console.error(
            "Dashboard update failed:",
            error
        );


        setConnectionStatus(
            false
        );


        lastUpdatedElement.textContent =
            "Last updated: connection failed";
    }
}



/* =========================================================
   PERFORMANCE HISTORY
   ========================================================= */

function updatePerformanceDeviceSelector(results) {
    const selector = document.getElementById("performance-device");
    if (!selector) return;

    const previousValue = selector.value;

    selector.replaceChildren();

    if (!results.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No devices available";
        selector.appendChild(option);

        clearPerformanceCharts("Add a device to begin.");
        return;
    }

    results.forEach(device => {
        const option = document.createElement("option");
        option.value = String(device.device_id);
        option.textContent = device.name;
        selector.appendChild(option);
    });

    const stillExists = results.some(
        device => String(device.device_id) === previousValue
    );

    selector.value = stillExists
        ? previousValue
        : String(results[0].device_id);

    loadPerformanceHistory(selector.value);
}


async function loadPerformanceHistory(deviceId) {
    const status = document.getElementById("performance-status");

    if (!deviceId) {
        clearPerformanceCharts("Select a device to view its history.");
        return;
    }

    if (status) status.textContent = "Loading historical metrics...";

    try {
        const metrics = await getDeviceMetrics(deviceId);

        if (!Array.isArray(metrics) || metrics.length === 0) {
            clearPerformanceCharts("No historical metrics recorded yet.");
            return;
        }

        // The API returns newest first; charts display oldest to newest.
        const history = [...metrics].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        const latencyData = history
            .filter(item => item.latency_ms !== null &&
                            item.latency_ms !== undefined)
            .map(item => ({
                timestamp: item.timestamp,
                value: Number(item.latency_ms)
            }));

        const packetLossData = history
            .filter(item => item.packet_loss !== null &&
                            item.packet_loss !== undefined)
            .map(item => ({
                timestamp: item.timestamp,
                value: Number(item.packet_loss)
            }));
        
        drawHistoryChart(
            "latency-chart",
            "latency-empty",
            latencyData,
            "ms",
            "#bf7500"
        );

        drawHistoryChart(
            "packet-loss-chart",
            "packet-loss-empty",
            packetLossData,
            "%",
            "#26734f"
        );

        if (status) {
            status.textContent =
                `Showing ${history.length} stored measurements.`;
        }
    } catch (error) {
        console.error("Failed to load performance history:", error);

        clearPerformanceCharts(
            "No history available for this device yet."
        );

        if (status) {
            status.textContent =
                error.message || "Could not load historical metrics.";
        }
    }
}


function drawHistoryChart(
    canvasId,
    emptyId,
    points,
    unit,
    lineColor
) {
    const canvas = document.getElementById(canvasId);
    const empty = document.getElementById(emptyId);

    if (!canvas || !empty) return;

    const ctx = canvas.getContext("2d");

    if (!points.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        empty.hidden = false;
        empty.textContent = "No recorded data for this metric yet.";
        return;
    }

    empty.hidden = true;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const margin = { top: 12, right: 14, bottom: 36, left: 48 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    if (plotWidth <= 0 || plotHeight <= 0) return;

    const maximum = Math.max(
        1,
        ...points.map(point => point.value)
    );

    const yMax = maximum * 1.15;
    const x = index =>
        margin.left +
        (points.length === 1
            ? plotWidth / 2
            : index * plotWidth / (points.length - 1));

    const y = value =>
        margin.top + plotHeight - (value / yMax) * plotHeight;

    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#718080";
    ctx.strokeStyle = "#e6eded";
    ctx.lineWidth = 1;

    // Horizontal grid lines and Y-axis labels.
    for (let tick = 0; tick <= 4; tick++) {
        const value = (yMax / 4) * tick;
        const py = y(value);

        ctx.beginPath();
        ctx.moveTo(margin.left, py);
        ctx.lineTo(width - margin.right, py);
        ctx.stroke();

        ctx.fillText(
            `${value.toFixed(value < 10 ? 1 : 0)}${unit}`,
            margin.left - 7,
            py
        );
    }

    // X-axis time labels.
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const labelCount = Math.min(4, points.length);

    for (let i = 0; i < labelCount; i++) {
        const index = labelCount === 1
            ? 0
            : Math.round(i * (points.length - 1) / (labelCount - 1));

        const date = new Date(points[index].timestamp);
        const label = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        ctx.fillText(label, x(index), height - margin.bottom + 10);
    }

    // Historical measurements.
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(x(index), y(point.value));
        } else {
            ctx.lineTo(x(index), y(point.value));
        }
    });

    ctx.stroke();

    // Measurement markers.
    points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(x(index), y(point.value), 3, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();
    });
}


function clearPerformanceCharts(message) {
    [
        ["latency-chart", "latency-empty"],
        ["packet-loss-chart", "packet-loss-empty"]
    ].forEach(([canvasId, emptyId]) => {
        const canvas = document.getElementById(canvasId);
        const empty = document.getElementById(emptyId);

        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (empty) {
            empty.hidden = false;
            empty.textContent = message;
        }
    });

    const status = document.getElementById("performance-status");
    if (status) status.textContent = "";
}


// Redraw charts when the browser window is resized.
window.addEventListener("resize", () => {
    const selector = document.getElementById("performance-device");

    if (selector && selector.value) {
        loadPerformanceHistory(selector.value);
    }
});


/* =========================================================
   START
   ========================================================= */

loadDashboard();


setInterval(
    loadDashboard,
    10000
);