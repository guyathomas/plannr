# Dockerfile
FROM node:9

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
CMD [ "npm", "run", "build" ]

# Bundle app source
COPY . /usr/src/app

EXPOSE 4000

# defined in package.json
CMD [ "npm", "run", "start" ]