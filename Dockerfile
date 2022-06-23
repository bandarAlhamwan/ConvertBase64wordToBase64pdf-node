#FROM node:12.16.3-buster-slim
#FROM libreoffice/online
FROM node


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
#RUN apt-get update && apt-get -y -q install libreoffice 
#RUN apt-get update && apt-get install -y libreoffice-base default-jre

COPY . .

#EXPOSE 8010

CMD [ "node", "index.js" ]
