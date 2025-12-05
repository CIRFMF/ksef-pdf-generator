# Stage 1: Builder
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npx tsc -p tsconfig.server.json --outDir dist
RUN echo '{"type": "commonjs"}' > dist/package.json


# Stage 2: Runner
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Use exec form to ensure proper signal handling
ENTRYPOINT ["./entrypoint.sh"]
CMD []
