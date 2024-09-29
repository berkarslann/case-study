FROM node:18


WORKDIR /app


COPY package*.json ./


RUN npm rebuild bcrypt --build-from-source


COPY . .


CMD ["npm", "run", "start:dev"]
