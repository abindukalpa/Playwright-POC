To pass environment variables

1. npm install dotenv
2. Create the .env file with the values

Different environment variables could be created such as
a. .env.nxt
b. .env.live

Since the default environment is dev per line 7 in playwright.config.ts, clicking on the play button via the extension will work in getting the dev parameters.
For executing any other environment execute the following from the terminal `NODE_ENV=live npx playwright test -g "test login works"`
