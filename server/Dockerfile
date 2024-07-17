# Use the official Node.js image as the base image
FROM node:16

# Accept build arguments
ARG DATABASE_URL
ARG PORT
ARG UPLOADS_DIR
ARG ACCESS_TOKEN_SECRET
ARG REFRESH_TOKEN_SECRET
ARG RESET_TOKEN_SECRET

# Set environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=${PORT}
ENV UPLOADS_DIR=${UPLOADS_DIR}
ENV ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
ENV REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
ENV RESET_TOKEN_SECRET=${RESET_TOKEN_SECRET}

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g prisma

# Copy the rest of the application code
COPY . .
# Generate Prisma client
RUN npx prisma generate
RUN npx prisma migrate status

# Run Prisma migrations
# Expose the port the app runs on
EXPOSE 8081

# Start the application
CMD ["npm", "run", "dev"]