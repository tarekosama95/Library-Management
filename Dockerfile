FROM node:latest

WORKDIR /code
COPY package.json .
RUN npm install
COPY . .
CMD npm run dev