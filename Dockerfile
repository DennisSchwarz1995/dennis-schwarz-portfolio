# ==============================================================================
# Stage 1: Angular Production Build (Node.js LTS on Alpine)
# ==============================================================================
FROM node:22-alpine AS build

WORKDIR /app

# 1. Copy dependency manifests separately for optimal Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# 2. Copy application source code (.dockerignore excludes portfolio-alt & node_modules)
COPY . .

# 3. Create production build with AOT, tree-shaking & output hashing
# Angular 20 (@angular/build:application) outputs static browser assets to dist/portfolio/browser
RUN npm run build -- --configuration=production

# ==============================================================================
# Stage 2: Lightweight Nginx web server for static asset delivery
# ==============================================================================
FROM nginx:1.27-alpine AS runtime

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy custom SPA & performance configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled Angular build artifacts from Stage 1
COPY --from=build /app/dist/portfolio/browser /usr/share/nginx/html

EXPOSE 80

# Internal container healthcheck for zero-downtime deployments behind Traefik
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
