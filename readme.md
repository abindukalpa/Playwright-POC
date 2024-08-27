To pass environment variables

1. npm install dotenv
2. Create the .env file with the values

Different environment variables could be created such as
a. .env.nxt
b. .env.live

Since the default environment is dev per line 7 in playwright.config.ts, clicking on the play button via the extension will work in getting the dev parameters.
For executing live execute `npm run testlive`

# Makefile Commands

For running locally, npm is a required dependency.
For running the docker image, docker must be installed and the docker service running.
Any local dependencies can be cleaned with `make clean`.

## Local test and debug

In order to run locally, `npm` is a required dependency.

Running `make` or `make test` will pull in any npm dependencies for the first run, and run the browser tests headless.
`make debug` will run the tests with the browser window showing, and allows for breakpoints in the code.

## Docker image build and run

`make image-run` will run the `make image-build` step for the first run, building the `playwright-poc` docker image then run the image headless. The HTTP port will be forwarded to the host, so the web overview after the tests have been run can be viewed.

## Dev helper commands

`make format` will auto format all source files and `make lint` will run the linter, fixing common errors and displaying other errors or warnings for those it can't fix. The types of errors/warnings found can be changed by modifying the `eslint.config.mjs` file, likewise the code formatter behaviour can be changed in the `.prettierrc` file.
