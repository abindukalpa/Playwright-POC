FROM mcr.microsoft.com/playwright:v1.45.1-jammy

COPY . .

RUN npm install
RUN npx playwright install

EXPOSE 9329

ENTRYPOINT [ "npx", "playwright", "test" ]