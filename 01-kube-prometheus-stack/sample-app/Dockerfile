# Multi-stage build: smaller final image, no build tooling shipped to prod.
#
# IMPORTANT: on Apple Silicon you MUST build with --platform linux/amd64 if your
# EKS nodes are amd64 (t3.medium are). Without it you get an arm64 image, the
# push and deploy both succeed, and the pods then CrashLoopBackOff with
# "exec format error" — a message that says nothing about architecture.
#
#   docker build --platform linux/amd64 -t monitoring-demo .
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
WORKDIR /app
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]
