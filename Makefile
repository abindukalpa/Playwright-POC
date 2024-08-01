test: install
	npx playwright test

debug: install
	npx playwright test --debug	
	
install:
	npm install
	npx playwright install

image-run: image-build
	docker run playwright-poc

image-build:
	docker build -t playwright-poc .

format: format-install
	npx prettier . --write

format-install:
	npm install --save-dev --save-exact prettier