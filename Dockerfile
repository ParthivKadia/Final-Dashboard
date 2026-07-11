# ── Stage 1: Build ────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source (includes public/fonts — Vite copies public/ into dist/ automatically)
COPY . .

# Vite bakes VITE_* env vars in at build time, not runtime —
# pass them as build args so different environments (staging/prod) can differ.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2: Serve ─────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]