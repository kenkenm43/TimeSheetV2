# Stage 1: Build the React app with Vite
FROM node:14-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application with production environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy environment variables file if needed
# COPY .env.production /usr/share/nginx/html/.env

# Expose port 80
EXPOSE 5173

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]