# Stage 1: Builder
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npx tsc -p tsconfig.json --outDir dist


# Stage 2: Runner
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ksef-fe-invoice-converter.js ./
COPY --from=builder /app/ksef-fe-invoice-converter.umd.cjs ./

EXPOSE 3000

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
