# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Applying the infra hardening (#4 SSH, #10 backup, #16 boot) — runbook

These changes are **infrastructure-as-code only until you run `cdk deploy`** (the
GitHub Actions deploy pipeline only runs `docker compose`, never CDK). Two of them
change UserData, which **replaces the EC2 instance** — and the SQLite contacts DB
lives in a Docker volume on the instance's root EBS, so apply in this order:

1. **Rotate credentials first** (issue #6) — don't `cdk deploy` with the exposed key.
2. **Back up current data before any replacement:**
   ```bash
   ssh ubuntu@<host> \
     'docker run --rm -v manaracode_contacts-data:/data alpine:3 \
        sh -c "apk add -q sqlite && sqlite3 /data/contacts.db .dump" | gzip' \
     > contacts-backup-$(date +%F).sql.gz
   ```
3. **Review + deploy:**
   ```bash
   npm ci && npm run build && npm test
   npx cdk diff        # confirm: S3 bucket, IAM role/profile, UserData change
   npx cdk deploy --context sshCidr=<your.ip>/32   # omit sshCidr to keep 22 open
   ```
   `cdk deploy` will replace the instance → **its public IP changes**; update the
   `REMOTE_HOST` GitHub secret and Cloudflare DNS to the new IP afterward.
4. **Restore data onto the new instance.** The first deploy `docker compose up`
   recreates an empty volume; load the dump from step 2 (or the latest nightly S3
   backup), then verify the site:
   ```bash
   # Option A — from the local dump made in step 2:
   gunzip -c contacts-backup-YYYY-MM-DD.sql.gz | \
     ssh ubuntu@<new-host> \
       'docker run --rm -i -v manaracode_contacts-data:/data alpine:3 \
          sh -c "apk add -q sqlite && sqlite3 /data/contacts.db"'

   # Option B — from the latest nightly S3 backup (a .backup snapshot):
   ssh ubuntu@<new-host> '
     aws s3 cp "$(aws s3 ls s3://<bucket>/ | sort | tail -1 | awk "{print \$4}" | sed "s#^#s3://<bucket>/#")" /tmp/restore.db &&
     docker run --rm -v manaracode_contacts-data:/data -v /tmp:/in alpine:3 \
       cp /in/restore.db /data/contacts.db'

   docker compose -f /opt/manaracode/docker-compose.yml restart backend
   ```

What each change does once deployed:
- **#4** — SSH ingress CIDR is `--context sshCidr=...` (default `0.0.0.0/0`). The
  instance role now grants `AmazonSSMManagedInstanceCore`, so you can also reach
  the box via SSM Session Manager and fully close port 22 once the deploy no
  longer needs SSH.
- **#10** — nightly `sqlite .backup` to a retained, versioned S3 bucket
  (`/usr/local/bin/backup-contacts.sh`, cron 03:17). Restore = `aws s3 cp` the
  latest object back into the volume.
- **#16** — a `manaracode.service` systemd unit runs `docker compose up -d` on
  boot, so a reboot/replacement brings the stack back up automatically.

To apply #10/#16 to the **current** instance without replacement, copy the backup
script, cron file, and systemd unit from `lib/infrastructure-stack.ts` onto the
box over SSH and `systemctl enable manaracode.service`.
