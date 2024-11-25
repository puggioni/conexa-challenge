# Build stage
FROM node:18-alpine as development

WORKDIR /app

COPY tsconfig*.json ./
COPY package*.json ./
COPY nest-cli*.json ./

RUN npm ci

COPY src/ src/

RUN npm run build

# Production stage
FROM node:18-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]