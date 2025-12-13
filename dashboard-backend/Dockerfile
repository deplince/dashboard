FROM node:22-alpine
WORKDIR /app
COPY package.json yarn.lock ./

RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --prefer-offline

COPY . .
RUN yarn build
EXPOSE 8080
CMD ["node", "dist/main"]
