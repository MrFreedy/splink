FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN chmod +x ./node_modules/.bin/ng

EXPOSE 4200

CMD ["npm", "run", "start"]