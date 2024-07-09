FROM node:alpine

WORKDIR /usr/src/app

RUN sed -i 's/dl-cdn/dl-5/g' /etc/apk/repositories && sed -i 's/http:/https:/g' /etc/apk/repositories

COPY . .

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
