# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for Tailwind)
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx website
RUN rm -rf ./*

# Copy built app from build stage
COPY --from=build /app/build .

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]