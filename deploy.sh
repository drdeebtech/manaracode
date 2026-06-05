#!/usr/bin/env bash
# deploy.sh — runs LOCALLY to trigger a deployment on the remote AWS server via SSH.
#
# Required environment variables:
#   REMOTE_HOST  — SSH target, e.g. ubuntu@1.2.3.4 or ubuntu@your-server.com
#
# Optional:
#   SSH_KEY         — path to private key (e.g. ~/.ssh/manaracode.pem); omit if using ssh-agent
#   REMOTE_SCRIPT   — path to deploy-remote.sh on the server (default: /opt/manaracode/deploy-remote.sh)
#
# First-time setup on the server:
#   1. Copy this file:  scp deploy-remote.sh ubuntu@<host>:/opt/manaracode/deploy-remote.sh
#   2. Copy compose:    scp docker-compose.yml ubuntu@<host>:/opt/manaracode/docker-compose.yml
#   3. Make executable: ssh ubuntu@<host> "chmod +x /opt/manaracode/deploy-remote.sh"
#   4. Set env vars on the server in /etc/environment or ~/.profile:
#        export GHCR_PAT="ghp_xxxxxxxxxxxx"
#        export GHCR_OWNER="drdeebtech"
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:?REMOTE_HOST is required — e.g. export REMOTE_HOST=ubuntu@1.2.3.4}"
REMOTE_SCRIPT="${REMOTE_SCRIPT:-/opt/manaracode/deploy-remote.sh}"

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o BatchMode=yes)
if [[ -n "${SSH_KEY:-}" ]]; then
  SSH_OPTS+=(-i "${SSH_KEY}")
fi

echo "Deploying to ${REMOTE_HOST}..."
ssh "${SSH_OPTS[@]}" "${REMOTE_HOST}" "bash ${REMOTE_SCRIPT}"
