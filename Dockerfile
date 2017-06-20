FROM node:8.1-alpine

RUN npm install wintersmith -g

VOLUME /www
WORKDIR /www

ENTRYPOINT ["wintersmith"]
