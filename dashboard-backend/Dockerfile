FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
EXPOSE 8080
CMD ["node", "dist/main"]
