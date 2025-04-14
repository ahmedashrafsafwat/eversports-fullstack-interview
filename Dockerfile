FROM node:23.11.0-alpine AS development
EXPOSE 3000/tcp
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci

FROM development AS production
RUN npm prune --production

FROM development AS build
COPY . .
RUN npm run build

FROM alpine:3.21 AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -g 9999 app \
    && adduser -u 9999 -G app -h /app -s /bin/false -D app

COPY --from=development /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
COPY --from=development /usr/local /usr/local
COPY --from=production /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY config /app/config
RUN ls -al

USER app
EXPOSE 3000/tcp
CMD ["node","./src/app.js"]