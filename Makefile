# stop npm installing for every locally run command but still being a dependency before they can be run first
INSTALL_STAMP = .npm_installed
# docker build as dependency but only build it the first itme
IMAGE_STAMP = .image_built

# headless run
test: install
	npx playwright test

# run with browser open
debug: install
	npx playwright test --debug

install: $(INSTALL_STAMP)

$(INSTALL_STAMP): package.json package-lock.json
	npm install
	npx playwright install
	npm install --save-dev prettier husky lint-staged
	npx husky install
	touch $(INSTALL_STAMP)

lint:
	npx eslint --fix

format: install
	npm run format

image-build: $(IMAGE_STAMP)


$(IMAGE_STAMP): Dockerfile
	docker build -t playwright-poc .
	touch $(IMAGE_STAMP)

image-run: image-build
	docker run playwright-poc

clean:
	rm -rf node_modules $(INSTALL_STAMP) $(IMAGE_STAMP)
