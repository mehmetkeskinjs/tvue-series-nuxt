FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18

WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
