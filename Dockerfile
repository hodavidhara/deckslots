FROM node:latest
ADD . /code
WORKDIR /code

RUN npm install
RUN npm install -g nodemon

CMD ["npm", "run-script", "startd"]