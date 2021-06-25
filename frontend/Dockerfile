FROM node:12.19.0-alpine AS builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT 3000

EXPOSE 3000
ENV SERVER_URL http://backend

CMD ["npm", "run", "dev"]