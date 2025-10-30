.PHONY: db-migrate db-rollback db-seed db-seed-reset

db-migrate:
	pnpm --filter backend db:migrate

db-rollback:
	pnpm --filter backend db:rollback

db-seed:
	pnpm db:seed

db-seed-reset: db-seed
