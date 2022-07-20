#
# Docker file for backend "user"
#
# <https://blog.nrwl.io/nx-and-node-microservices-b6df3cd1bad6>
#
FROM node:16-alpine

WORKDIR /app

COPY ./packages/backend/app/user .

#
# Create the directory /app/etc/config
# - Place for the confiration yaml file
#
RUN mkdir -p etc/config

#
# Install dependencies
#
RUN npm install --omit=dev

#
# Required: The path (and filename) to the configuration
#
ENV CONFIG_PATH=/app/etc/config/user-config.yml

VOLUME ["/app/etc/config"]

CMD node ./main.js
