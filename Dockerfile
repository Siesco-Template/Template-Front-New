# ---- deps ----
FROM node:20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- build app ----
FROM node:20 AS build_app
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- build storybook ----
FROM node:20 AS build_storybook
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build-storybook

# ---- runtime: app ----
FROM nginx:alpine AS runtime-app
COPY nginx.app.conf /etc/nginx/conf.d/default.conf
COPY --from=build_app /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ---- runtime: storybook ----
FROM nginx:alpine AS runtime-storybook
COPY nginx.storybook.conf /etc/nginx/conf.d/default.conf
COPY --from=build_storybook /app/storybook-static /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
