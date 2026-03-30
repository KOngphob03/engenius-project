# Use the official Bun runtime as a base image
FROM oven/bun:latest AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Build the application
RUN bun run build

# Production stage
FROM base AS production

# Copy built application and source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]