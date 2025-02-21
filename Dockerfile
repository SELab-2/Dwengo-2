# Backend set-up
FROM node:alpine AS backend
WORKDIR /workspace/backend
COPY ./backend/ ./

RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]

# Frontend set-up
FROM node:alpine AS frontend
WORKDIR /workspace/frontend
COPY ./frontend/ ./

RUN npm install

EXPOSE 4200
CMD ["npm", "start"]

# Database set-up
FROM postgres:alpine AS database
WORKDIR /workspace/database

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=dwengo-database

EXPOSE 5432
COPY ./database/ ./
CMD ["postgres"]
