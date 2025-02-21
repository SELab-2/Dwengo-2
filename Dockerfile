# Backend set-up
FROM node:22-alpine AS backend
WORKDIR /workspace/backend
COPY ./backend/ ./

RUN npm install
RUN npm install -g nodemon ts-node typescript tsconfig-paths


EXPOSE 3000
CMD ["npm", "run", "dev"]

# Frontend set-up
FROM node:22-alpine AS frontend
WORKDIR /workspace/frontend
COPY ./frontend/ ./

RUN npm install
RUN npm install -g @angular/cli && ng add @angular/material

EXPOSE 4200
CMD ["npm", "start"]

# Database set-up
FROM postgres:alpine AS database
WORKDIR /workspace/database
COPY ./database/ ./

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=dwengo-database

EXPOSE 5432
CMD ["postgres"]
