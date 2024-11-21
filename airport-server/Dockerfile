FROM node:22.11.0 AS base

WORKDIR /opt/project
USER node


FROM base AS dev

CMD node_modules/.bin/nodemon src/server.js