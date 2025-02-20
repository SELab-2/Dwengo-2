FROM node:alpine
WORKDIR /workspace/backend
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port for the backend
EXPOSE 3000

# Default command to start the backend
CMD ["npm", "run", "dev"]
