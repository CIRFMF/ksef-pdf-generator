# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage — only jsdom is needed (pdfmake + xml-js are bundled in dist)
FROM node:22-alpine
WORKDIR /app
RUN addgroup -g 1001 -S app && adduser -S app -u 1001
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
USER app
EXPOSE 3001
HEALTHCHECK CMD wget -qO- http://localhost:3001/health || exit 1
CMD ["node", "server/index.js"]
