FROM mcr.microsoft.com/playwright:v1.47.0-jammy

COPY . .

RUN npm install
RUN npx playwright install

EXPOSE 9329

ENTRYPOINT [ "npm", "start" ]