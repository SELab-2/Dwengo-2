# This Dockerfile was generated using ChatGPT
FROM node:alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci
RUN npm install express
RUN npm install -D typescript ts-node-dev @types/express @types/cors

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:alpine AS runtime

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "dist/index.js"]
