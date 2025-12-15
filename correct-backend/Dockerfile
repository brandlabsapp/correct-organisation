FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production --silent && npm cache clean --force
COPY . .
EXPOSE 8000
CMD ["npm", "start"]