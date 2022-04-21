FROM node:lts

WORKDIR /app
CMD ["npm","start"]

COPY . /app

RUN cd /app && npm install
