# ---- Base Node Image ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# ---- Build ----
FROM base AS build
COPY . .
RUN npm ci && npm run build

# ---- Production Image ----
FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Use a non-root user for security
RUN addgroup app && adduser -S -G app app
USER app

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main"]
