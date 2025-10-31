.PHONY: db-migrate db-rollback db-seed db-seed-reset docker-build docker-tag docker-push db-migrate-deploy

db-migrate:
    pnpm --filter backend db:migrate

db-rollback:
    pnpm --filter backend db:rollback

db-seed:
    pnpm db:seed

db-seed-reset: db-seed

db-migrate-deploy:
    pnpm --filter backend db:migrate

docker-build:
    docker build -t my-app:latest .

docker-tag:
    docker tag my-app:latest my-app:$(shell git rev-parse --short HEAD)

docker-push:
    docker push my-app:$(shell git rev-parse --short HEAD)
