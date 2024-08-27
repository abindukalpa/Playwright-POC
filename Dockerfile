FROM mcr.microsoft.com/playwright:v1.45.1-jammy

COPY . .

RUN npm install

EXPOSE 9329

ENTRYPOINT [ "npm", "start" ]