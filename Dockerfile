FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose API port
EXPOSE 3000

# Start the API server
CMD ["npm", "run", "api"]
