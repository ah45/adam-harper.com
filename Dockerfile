FROM node:8.1-alpine

RUN npm install -g wintersmith
RUN npm install -g wintersmith-livereload

VOLUME /www
WORKDIR /www

EXPOSE 8080 32579

ENTRYPOINT ["wintersmith"]
