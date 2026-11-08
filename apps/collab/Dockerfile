
FROM node:26.13.0-trixie-slim

WORKDIR /app

COPY package.json ./

COPY apps/collab/package.json ./apps/collab/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/emails/package.json ./packages/emails/package.json

RUN npm install

COPY packages/auth ./packages/auth
COPY packages/db ./packages/db
COPY packages/emails ./packages/emails
COPY apps/collab ./apps/collab

ENV NODE_ENV=production
ENV PORT=4400

WORKDIR /app/apps/collab

EXPOSE 4400
