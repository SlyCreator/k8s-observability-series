# Kubernetes Observability Foundations

Companion code for the four-part **Kubernetes Observability Foundations** series.
Clone this once — every article uses it.

```bash
git clone https://github.com/SlyCreator/k8s-observability-series.git
cd k8s-observability-series
```

## The series

| # | Article | Directory |
|---|---|---|
| 1 | Kubernetes Monitoring from Zero — Installing kube-prometheus-stack on EKS | [`01-kube-prometheus-stack/`](01-kube-prometheus-stack/) |
| 2 | Building Kubernetes Grafana Dashboards from Scratch — PromQL, Panels, Variables | [`02-grafana-dashboards/`](02-grafana-dashboards/) |
| 3 | Kubernetes Alerting That Actually Works — Prometheus Rules, Alertmanager, PagerDuty | [`03-alerting/`](03-alerting/) |
| 4 | Centralized Logging for Kubernetes — Promtail, Loki, and Correlating Logs with Metrics | [`04-logging/`](04-logging/) |

Each directory is self-contained. Start at whichever article you like — the
per-directory README lists what must already exist in your cluster.

## Prerequisites

Article 1 builds the cluster and the monitoring stack that Articles 2-4 assume.
If you are starting at Article 2, 3 or 4, run Article 1 first.

Tested against:

| Tool | Version |
|---|---|
| EKS | 1.36 |
| kubectl | v1.34.1 |
| Helm | 4.1.0 |
| eksctl | 0.230.0 |
| kube-prometheus-stack chart | 89.2.3 (Prometheus Operator v0.93.1) |

## Cost warning

The lab runs on a real EKS cluster: roughly **$0.13/hour**, or about **$136/month**
if you leave it running. A four-hour lab is under $1. Every article ends with a
teardown section — use it.
