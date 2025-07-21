FROM node:slim

ENV NODE_VERSION 24.4.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]