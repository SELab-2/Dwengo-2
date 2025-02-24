# Backend set-up
FROM node:22-alpine AS backend
WORKDIR /workspace/backend
COPY ./backend/ ./

RUN npm install
RUN npm install -g nodemon ts-node typescript tsconfig-paths


EXPOSE 3000
CMD ["npm", "run", "dev"]

# Frontend setup
FROM node:18-alpine AS frontend 
# Use stable LTS Node version
WORKDIR /workspace/frontend
# Copy application files
COPY ./frontend/ ./

RUN npm install
RUN npm install -g @angular/cli

EXPOSE 4200
CMD ["npm", "start"]

# Database set-up
FROM postgres:alpine AS database
WORKDIR /workspace/database
COPY ./backend/src/infrastructure/database/ ./

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=dwengo-database

EXPOSE 5432
CMD ["postgres"]
