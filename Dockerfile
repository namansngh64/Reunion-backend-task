FROM node:16.20
WORKDIR /usr/app

COPY . .

EXPOSE 9900

RUN npm install

CMD npm test;node index.js