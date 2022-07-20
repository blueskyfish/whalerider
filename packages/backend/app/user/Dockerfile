#
# Docker file for backend "user"
#
# <https://blog.nrwl.io/nx-and-node-microservices-b6df3cd1bad6>
#
# IMPORTANT: Context Path is "./dist"
#
FROM node:16-alpine

USER node

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
ENV NODE_ENV=production

#
# File is overrideable
#
VOLUME ["/app/etc/config"]

EXPOSE 52050

CMD node ./main.js
