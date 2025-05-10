# Backend set-up
FROM node:22-alpine AS backend
WORKDIR /workspace/backend
COPY ./backend/ ./

RUN npm install
RUN npm install -g nodemon ts-node typescript tsconfig-paths pg


EXPOSE 3001
CMD ["npm", "run", "dev"]

# Frontend setup
FROM node:22-alpine AS frontend 
# Use stable LTS Node version
WORKDIR /workspace/frontend
# Copy application files
COPY ./frontend/ ./

RUN npm install
RUN npm install -g @angular/cli

# Install chromium for headless browser testing
RUN apk add --no-cache chromium chromium-chromedriver harfbuzz ttf-freefont

# Install firefox for browser testing
RUN apk add --no-cache firefox

# Set the chromium binary path
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_BIN=/usr/bin/chromedriver

# Set the firefox binary path
ENV FIREFOX_BIN=/usr/bin/firefox

EXPOSE 4201
CMD ["npm", "start"]
