FROM node

RUN npm install -g nodemon

COPY / /src

WORKDIR /src