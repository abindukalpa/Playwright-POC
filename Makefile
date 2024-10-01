# stop npm installing for every locally run command but still being a dependency before they can be run first
INSTALL_STAMP = .npm_installed
# docker build as dependency but only build it the first itme
IMAGE_STAMP = .image_built

# pull env from shell, if blank default to nxt
ENV = ${NODE_ENV}
ifeq ($(ENV),)
  ENV = nxt
endif

# headless run
test: install
	@echo running tests in $(ENV) env
	npm start

# run with browser open
debug: install
	@echo debugging tests in $(ENV) env
	npx playwright test --debug

install: $(INSTALL_STAMP)

$(INSTALL_STAMP): package.json package-lock.json
	npm install
	touch $(INSTALL_STAMP)

lint:
	npm run lint

format: install
	npm run format

image-build: $(IMAGE_STAMP)

$(IMAGE_STAMP): Dockerfile
	docker build -t playwright-poc .
	touch $(IMAGE_STAMP)

image-run: image-build
	docker run -e "NODE_ENV=$(ENV)" playwright-poc

image-rebuild: clean image-build

clean:
	rm -rf node_modules $(INSTALL_STAMP) $(IMAGE_STAMP)
