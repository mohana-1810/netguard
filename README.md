# NetGuard — Network Health Monitoring and Alert System

NetGuard is a network health monitoring and alert system developed using Python, FastAPI, and SQLite. It monitors device availability, tracks latency and packet loss, detects network issues, and presents monitoring information through a centralized web dashboard.

## Features

- **Device Management:** Add, view, and delete monitored network devices.
- **Connectivity Monitoring:** Check device reachability using ICMP ping.
- **Performance Tracking:** Measure latency and packet loss and visualize historical metrics.
- **Health Classification:** Categorize device health using configurable thresholds.
- **Alert Management:** Generate alerts for detected network issues, acknowledge alerts, and automatically resolve incidents when recovery is detected.
- **Dashboard:** View device status, network health, active alerts, performance charts, and recent activity.
- **Persistent Storage:** Store device information, metrics, and alerts using SQLite and SQLAlchemy.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Connectivity Monitoring | ICMP ping, `ping3` |
| Scheduling | APScheduler |
| API | REST-style HTTP endpoints |

## System Architecture

1. **Frontend:** Displays device information, monitoring results, alerts, and performance charts.
2. **Backend API:** FastAPI handles device management, metrics, monitoring, and alert operations.
3. **Monitoring Engine:** Checks device reachability and evaluates latency and packet loss.
4. **Alert Engine:** Generates and updates alerts based on device health.
5. **Database:** SQLite stores device records, monitoring metrics, and alert history.

## Getting Started

### Prerequisites

- Python installed
- Git
- A web browser
- Network access for testing connectivity to monitored devices

### 1. Clone the repository

```bash
git clone https://github.com/mohana-1810/netguard.git
cd netguard
```

### 2. Create and activate a virtual environment

On Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### 4. Start the backend

From the project root:

```powershell
python -m uvicorn backend.main:app --reload
```

The backend API will be available at:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs

### 5. Start the frontend

Open a second PowerShell terminal:

```powershell
cd frontend
python -m http.server 5500
```

Open the dashboard at:

http://127.0.0.1:5500

Keep both terminals running while using the application.

## Health Monitoring

NetGuard evaluates device health using connectivity, latency, and packet-loss thresholds.

- **Critical:** Device unreachable, packet loss above 20%, or latency above 200 ms.
- **Warning:** Packet loss above 5% or latency above 100 ms.
- **Healthy:** Device is reachable and the measured values are within the configured thresholds.

These are the project's current thresholds and may be adjusted in the implementation.

## Project Structure

```text
netguard/
├── backend/
│   ├── alerts/
│   ├── models/
│   ├── monitoring/
│   ├── routes/
│   ├── services/
│   └── main.py
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
├── .gitignore
└── requirements.txt
```

## Limitations

- Monitoring depends on ICMP reachability; firewalls may block ping requests.
- Successful ping responses do not guarantee that an application or service is functioning correctly.
- SNMP monitoring is not fully configured and should not be considered a production-ready feature.
- The application is currently designed as a local development project and has not been hardened for production deployment.

## Future Enhancements

- Fully configured SNMP monitoring
- Email or other notification integrations
- Authentication and role-based access control
- Advanced performance analytics and reporting
- Deployment and monitoring at larger network scales

## Security Notes

- Local environment files, virtual environments, database files, and generated artifacts should not be committed to the repository.
- Never commit API keys, passwords, access tokens, or other credentials.
- Use appropriate access controls and security configuration before deploying the application beyond a local development environment.

## Author

Developed as a Computer Networks project to demonstrate network health monitoring, performance tracking, and alert management.
