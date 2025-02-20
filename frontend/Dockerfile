FROM node:alpine
WORKDIR /workspace/frontend
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Angular uses
EXPOSE 4200

# Default command to start the frontend
CMD ["npm", "start"]
