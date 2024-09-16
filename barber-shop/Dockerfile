FROM postgres

COPY package*.json ./
  
RUN npm install

COPY .env ./

COPY *.sql /docker-entrypoint-initdb.d/