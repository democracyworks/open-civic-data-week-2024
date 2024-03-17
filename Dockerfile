FROM mcr.microsoft.com/devcontainers/javascript-node:18 as base

WORKDIR /voter_portal_demo

FROM base as dev

COPY package*.json ./

ENV NODE_ENV development

RUN npm install

USER node

COPY --chown=node:node ./ .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
