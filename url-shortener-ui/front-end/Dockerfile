# ==========================================
# Stage 1: Build the Vue application
# ==========================================
FROM node:20-alpine AS build-stage
WORKDIR /app

# Copy package files first (this caches dependencies to make future builds faster)
COPY package*.json ./
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Build the production-ready static files
RUN npm run build

# ==========================================
# Stage 2: Serve the application with Nginx
# ==========================================
FROM nginx:stable-alpine AS production-stage

# Copy the compiled /dist folder from Stage 1 into Nginx's hosting directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]