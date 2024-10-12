FROM node:20.17.0-alpine3.20

WORKDIR /app

COPY package*.json  .

COPY . .

RUN rm -rf node_modules && npm install

EXPOSE 8080

CMD [ "node", "app.js" ]

