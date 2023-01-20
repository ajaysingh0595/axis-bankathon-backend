FROM node:14
RUN mkdir -p /usr/src/bankathon/node_modules && chown -R node:node /usr/src/bankathon
WORKDIR /usr/src/bankathon
COPY package*.json ./

USER node
RUN npm install

COPY . .
EXPOSE 80
CMD [ "node", "server.js" ]
