# Backend set-up
FROM node:alpine AS backend
WORKDIR /workspace/backend
COPY ./backend/package.json ./backend/package-lock.json ./

RUN npm install
RUN apk update && apk add git

COPY .git/ /workspace/.git/

COPY ./backend/ ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Frontend set-up
FROM node:alpine AS frontend
WORKDIR /workspace/frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./

RUN npm install
RUN apk update && apk add git

COPY .git/ /workspace/.git/

COPY ./frontend/ ./
EXPOSE 4200
CMD ["npm", "start"]

# Database set-up
FROM postgres:alpine AS database
WORKDIR /workspace/database

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=dwengo-database

RUN apk update && apk add git

COPY .git/ /workspace/.git/

EXPOSE 5432
COPY ./database/ ./
CMD ["postgres"]
