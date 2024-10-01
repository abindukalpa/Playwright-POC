To pass environment variables

1. npm install dotenv
2. Create the .env file with the values

Different environment variables could be created such as
a. .env.nxt
b. .env.live

Running the test pack in parallel mode, the env vars needed:

1. Set WORKERS=(number of workers you want)
2. Set USERNAMES=(comma separated list with usernames) should equal the number of workers
3. Set PASSWORDS=(comma separated list with passwords) should equal the number of workers
4. Set ACCOUNT_IDS=(comma separated list with account ids) should equal the number of workers

NOTE: The index of each username/password/account_id is used to create a list of users, so user credentials will get linked up using the index. So as an example:
USERNAMES=asdf,zxcv
PASSWORDS=123,789
ACCOUNT_IDS=234,567

Those will create 2 users.
First user will have Username/Password/Account_ID: asdf/123/234
Second user will have Username/Password/Account_ID: zxcv/789/567

# Makefile Commands

For running locally, npm is a required dependency.
For running the docker image, docker must be installed and the docker service running.
Any local dependencies can be cleaned with `make clean`.

## Local test and debug

In order to run locally, `npm` is a required dependency.

Running `make` or `make test` will pull in any npm dependencies for the first run, and run the browser tests headless.
`make debug` will run the tests with the browser window showing, and allows for breakpoints in the code.

## Docker image build and run

`make image-run` will run the `make image-build` step for the first run, building the `playwright-poc` docker image then run the image headless. The HTTP port will be forwarded to the host, so the web overview after the tests have been run can be viewed. `make image-rebuild` will clean and re-create the image, in the case of updated npm dependencies.

## Dev helper commands

`make format` will auto format all source files and `make lint` will run the linter, fixing common errors and displaying other errors or warnings for those it can't fix. The types of errors/warnings found can be changed by modifying the `eslint.config.mjs` file, likewise the code formatter behaviour can be changed in the `.prettierrc` file.
