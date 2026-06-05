#!/usr/bin/env bash
# deploy-remote.sh — runs ON the AWS server to pull and restart the stack.
#
# Required environment variables (set in /etc/environment or ~/.profile on the server):
#   GHCR_PAT    — GitHub Personal Access Token with read:packages scope
#   GHCR_OWNER  — GitHub username/org that owns the packages (e.g. drdeebtech)
#
# Optional:
#   DEPLOY_DIR  — directory containing docker-compose.yml (default: /opt/manaracode)
set -euo pipefail

GHCR_PAT="${GHCR_PAT:?GHCR_PAT is required — set it as an environment variable on the server}"
GHCR_OWNER="${GHCR_OWNER:?GHCR_OWNER is required — set it as an environment variable on the server}"
DEPLOY_DIR="${DEPLOY_DIR:-/opt/manaracode}"

log() { echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] $*"; }

log "Logging in to GHCR as ${GHCR_OWNER}..."
echo "${GHCR_PAT}" | docker login ghcr.io --username "${GHCR_OWNER}" --password-stdin

log "Pulling latest images..."
docker pull "ghcr.io/${GHCR_OWNER}/manaracode-frontend:latest"
docker pull "ghcr.io/${GHCR_OWNER}/manaracode-backend:latest"

log "Deploying from ${DEPLOY_DIR}..."
cd "${DEPLOY_DIR}"
docker compose pull
docker compose up -d --remove-orphans

log "Pruning dangling images..."
docker image prune -f

log "Deploy complete. Running containers:"
docker compose ps
