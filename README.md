# Logging and Monitoring Setup (Elasticsearch) Documentation

This document provides an overview of the logging and monitoring system implemented for the project, detailed steps to set it up, key points for future improvements, and references.

## Overview

This project integrates Elastic APM and Elasticsearch with Pino logging to monitor application performance and capture logs. The monitoring stack is set up using Docker, enabling seamless tracking of application behavior and centralized log storage.

### Key Components:

1. **Application Code:**

    - Logging: Implemented using the Pino library.
    - Monitoring: Elastic APM integrated with application endpoints.

2. **Logging and Monitoring Tools:**

    - Elastic APM: Tracks application transactions, captures performance metrics, and records errors.
    - Elasticsearch: Centralized log and data storage.
    - Kibana (optional): A visualization tool for logs and metrics.

3. **Dockerized Infrastructure:**

    - Configured using `docker-compose` for easy setup and maintenance.

---

## Setup Instructions

### Prerequisites

1. Install Docker and Docker Compose.
2. Ensure the system meets the minimum requirements for running Elasticsearch (memory and storage).
3. Add the following to your `.env` file:

```plaintext
APM_SERVER_HOST=http://localhost:8200
ELASTICSEARCH_HOSTS=http://localhost:9200
APM_SECRET_TOKEN=5f2a17f3b09a19a6e11ec9e1c4a6d4f1
NODE_ENV=development
```

### Step-by-Step Guide

#### 1. Set Up Logging in the Application

-   Use the Pino logger with a multi-stream transport:
    -   Pretty log formatting for the console.
    -   Elasticsearch stream for storing logs.
-   Install required libraries:

```bash
npm install pino pino-elasticsearch pino-pretty dotenv
```

-   Use the `logger.js` configuration for consistent logging across the app.

#### 2. Integrate Elastic APM

-   Install the Elastic APM Node.js agent:

```bash
npm install elastic-apm-node
```

-   Configure the APM agent in the application as demonstrated in `app-server` logic.
-   Use APM transactions and spans to monitor key application flows.

#### 3. Dockerized Infrastructure

##### Monitoring Stack (`docker-compose-monitoring.yml`):

1. Elasticsearch:
    - Runs on port 9200 and acts as the central data store for logs and APM metrics.
2. APM Server:
    - Collects APM data from the app and sends it to Elasticsearch.
3. Kibana (Optional):
    - Provides dashboards for visualizing logs and metrics.

##### Application Service (`docker-compose.yml`):

1. `app-server` container:
    - Connects to the APM server and Elasticsearch via the `log_monitoring_network`.
    - Includes environment variables for easy configuration.

#### 4. Build and Run Containers

-   Launch the monitoring stack:

```bash
docker-compose -f docker-compose-monitoring.yml up -d
```

-   Launch the application:

```bash
docker-compose up -d
```

#### 5. Test the Setup

-   Access Kibana at `http://localhost:5601` (if enabled).
-   Interact with application endpoints:
    -   `/`: Test logging.
    -   `/users` and `/users-list`: Validate transaction and span monitoring.
    -   `/error`: Verify error capturing.

---

## Key Points for Future Reference

1. **Scaling Considerations:**

    - Separate indices for logs and APM metrics are used to improve search performance.
    - Optimize Elasticsearch for high-volume logs by adjusting `flushBytes` and retention settings.

2. **Enhanced Monitoring:**

    - Use `traceparent` headers to trace distributed transactions.
    - Integrate Prometheus for additional system metrics.

3. **Security:**

    - Enable Elasticsearch security (basic authentication and TLS) in production environments.
    - Rotate the APM secret token regularly.

4. **Logging Improvements:**

    - Include additional context in logs (e.g., request IDs).
    - Implement log filtering for sensitive data.

5. **Monitoring Dashboards:**

    - Preconfigure Kibana dashboards for key application metrics.
    - Monitor latency and error rates for critical endpoints.

---

## Future Improvements

-   **Container Orchestration:**

    -   Deploy the stack on Kubernetes for high availability and scaling.

-   **Distributed Tracing:**

    -   Integrate with other services in the ecosystem to enable end-to-end tracing.

-   **Alerting:**

    -   Use Kibana or another tool to set alerts for abnormal metrics (e.g., increased error rates or latencies).

---

By following this guide, you can effectively set up and maintain a robust logging and monitoring system for your application. Regularly review and improve the configuration to meet growing demands and ensure system observability.
