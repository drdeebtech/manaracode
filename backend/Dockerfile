# ── build ────────────────────────────────────────────────────────────────────
FROM golang:latest AS build
WORKDIR /src

# Download deps first for layer-cache efficiency.
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/server .

# scratch has no mkdir — create the /data directory here.
RUN mkdir -p /out/data

# ── run ──────────────────────────────────────────────────────────────────────
FROM scratch
# CA certificates so the binary can verify TLS (e.g. SES SMTP STARTTLS used for
# contact-form notification emails). scratch ships no trust store, which
# otherwise fails with "x509: certificate signed by unknown authority".
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=build /out/server /server
# Copy the empty /data dir so the path exists before the volume mounts over it.
COPY --from=build /out/data /data

EXPOSE 8080
ENTRYPOINT ["/server"]
