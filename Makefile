#stop npm installing for every locally run command but still being a dependency before they can be run first
INSTALL_STAMP = .npm_installed

test: install
	npx playwright test

debug: install
	npx playwright test --debug

install: $(INSTALL_STAMP)

$(INSTALL_STAMP): package.json package-lock.json
	npm install
	npx playwright install
	npm install --save-dev prettier husky lint-staged
	npx husky install
	touch $(INSTALL_STAMP)

linter-fix:
	npx eslint --fix

format: install
	npm run format

image-build:
	docker build -t playwright-poc .

image-run: image-build
	docker run playwright-poc

clean:
	rm -rf node_modules $(INSTALL_STAMP)
