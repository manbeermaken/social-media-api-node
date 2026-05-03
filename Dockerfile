# builder
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json .

RUN npm ci
COPY . .

RUN npm run build

# runner
FROM node:24-alpine AS runner

WORKDIR /app
COPY package*.json ./

RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

USER node

EXPOSE 8000

CMD ["npm", "start"]