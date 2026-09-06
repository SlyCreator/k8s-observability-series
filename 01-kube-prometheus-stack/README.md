# Article 1 — Installing kube-prometheus-stack on EKS

## What is here

```
01-kube-prometheus-stack/
├── k8s/
│   ├── storageclass-gp3.yaml    gp3 StorageClass on the EBS CSI driver
│   └── monitoring-values.yaml   Helm values for kube-prometheus-stack
└── sample-app/                  NestJS app exposing custom Prometheus metrics
    ├── src/app.module.ts        registers the /metrics endpoint
    ├── src/app.controller.ts    the Counter and Histogram — read this one
    ├── Dockerfile               multi-stage, non-root
    ├── deployment.yaml          Deployment + Service
    └── servicemonitor.yaml      wires the app into Prometheus
```

## Prerequisites

An EKS cluster. If you do not have one, Article 1 §5 creates it:

```bash
eksctl create cluster \
  --profile YOUR_PROFILE \
  --name monitoring-lab \
  --region us-east-1 \
  --version 1.36 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 --nodes-min 1 --nodes-max 3 \
  --managed
```

## Quick reference

```bash
# Storage (Article 1 §6) — OIDC first, then the addon, then the StorageClass
eksctl utils associate-iam-oidc-provider \
  --cluster monitoring-lab --region us-east-1 --profile YOUR_PROFILE --approve
eksctl create addon --name aws-ebs-csi-driver \
  --cluster monitoring-lab --region us-east-1 --profile YOUR_PROFILE
kubectl apply -f k8s/storageclass-gp3.yaml

# Monitoring stack (Article 1 §7)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values k8s/monitoring-values.yaml \
  --version 89.2.3 \
  --wait=legacy \
  --timeout 10m
```

`--wait=legacy` is required on Helm 4. The default `watcher` strategy reports the
ten operator CRDs as `status: Unknown` on a fresh cluster and aborts, even though
the CRDs install fine and report `Established: True`.

## Sample app

See Article 1 §11. Build for your **nodes'** architecture, not your laptop's:

```bash
cd sample-app
docker build --platform linux/amd64 -t monitoring-demo .
```

## Teardown

```bash
helm uninstall kube-prometheus-stack -n monitoring
kubectl delete -f sample-app/deployment.yaml -f sample-app/servicemonitor.yaml
eksctl delete cluster --name monitoring-lab --region us-east-1 --profile YOUR_PROFILE
```
