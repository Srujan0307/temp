.PHONY: dev stop build logs

dev:
	docker compose up --build

stop:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f
