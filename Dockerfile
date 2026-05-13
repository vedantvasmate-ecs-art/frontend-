# ============================================
# Stage 1: Build the Angular application
# ============================================
FROM node:22-alpine AS build

# Accept API URL as build argument (defaults to Railway backend)
ARG API_URL=https://companyethra-production.up.railway.app/api

WORKDIR /app

# Copy package files first (for Docker layer cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Replace the localhost API URL with the production URL before building
RUN sed -i "s|http://localhost:8080/api|${API_URL}|g" src/environments/environment.ts

# Build for production
RUN npx ng build --configuration production

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from build stage
COPY --from=build /app/dist/company-ethara-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
