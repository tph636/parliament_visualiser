# Base stage
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
ARG VITE_BACKEND_API_URL
ENV VITE_BACKEND_API_URL=${VITE_BACKEND_API_URL}
ENV NODE_ENV=production
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
