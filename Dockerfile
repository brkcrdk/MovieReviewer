FROM node:alpine

ENV PORT 3000

# RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app
RUN yarn

COPY . /app

RUN npm run build

EXPOSE 3000

CMD ["yarn", "start"]