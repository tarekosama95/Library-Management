FROM node:latest

WORKDIR /code
COPY package.json .
RUN npm install
COPY . .
RUN chmod +x start.sh
CMD ["./start.sh"]