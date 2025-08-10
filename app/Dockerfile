# ===== Development Stage =====
FROM node:24-alpine AS dev
WORKDIR /app
# Install global tools
RUN npm install -g nodemon
# Frontend setup
WORKDIR /app/frontend
COPY app/frontend/package.json app/frontend/package-lock.json ./
RUN npm install --include=dev
COPY app/frontend .
# Backend setup
WORKDIR /app/backend
COPY app/backend/package.json app/backend/package-lock.json ./
RUN npm install
COPY app/backend .
WORKDIR /app
CMD ["sh", "-c", "cd frontend && npm run dev & cd backend && npm run dev"]

# ===== Frontend Builder =====
FROM node:24 AS frontend-builder
WORKDIR /app/frontend
COPY app/frontend/package.json app/frontend/package-lock.json ./
RUN npm ci
# Install the missing rollup dependency explicitly
RUN npm install @rollup/rollup-linux-x64-gnu --save-optional
COPY app/frontend .
# Set permissions and run build
RUN chmod -R 755 node_modules/.bin && node node_modules/vite/bin/vite.js build

# ===== Backend Builder =====
FROM node:24-alpine AS backend-builder
WORKDIR /app/backend
COPY app/backend/package.json app/backend/package-lock.json ./
RUN npm install
COPY app/backend .

# ===== Production Image =====
FROM node:24-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./public
EXPOSE 5000
CMD ["node", "backend/index.js"]