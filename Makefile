
.PHONY: migrate rollback

migrate:
	npx pnpm --filter backend db:migrate:latest

rollback:
	npx pnpm --filter backend db:migrate:rollback
