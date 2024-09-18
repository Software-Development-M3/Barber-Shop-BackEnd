FROM node:20

COPY package*.json ./
  
RUN npm install

COPY .env ./

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
