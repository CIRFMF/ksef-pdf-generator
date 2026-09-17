.PHONY: all build exe clean test

all: exe

build:
	npm run build

exe: build
	npm run build:exe

clean:
	rm -rf dist bin

test:
	mkdir -p dist/test
	bin/ksef-pdf-generator-linuxstatic-x64 invoice assets/invoice.xml dist/test/invoice.pdf
	bin/ksef-pdf-generator-linuxstatic-x64 upo assets/upo.xml dist/test/upo.pdf
	@echo "Generated PDFs in dist/test/"