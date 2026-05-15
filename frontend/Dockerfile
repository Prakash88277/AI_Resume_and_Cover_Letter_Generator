# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Start the Vite development server bound to all network interfaces
CMD ["npm", "run", "dev"]
