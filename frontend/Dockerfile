# ── build ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Install deps before copying source for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Cloudflare Turnstile sitekey is PUBLIC (it ships in the HTML) but must match a
# widget whose allowed-domains list includes the production host, or the widget
# fails to render (error 110200). Vite inlines VITE_* env at build time, so the
# key has to be present here — pass it via --build-arg in CI. Falls back to the
# in-code default when unset (local/dev builds).
ARG VITE_TURNSTILE_SITEKEY=""
ENV VITE_TURNSTILE_SITEKEY=$VITE_TURNSTILE_SITEKEY

RUN npm run build

# ── serve ─────────────────────────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
