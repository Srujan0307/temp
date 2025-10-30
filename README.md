# Monorepo

This is a monorepo for our project, managed with pnpm workspaces.

## Structure

- `/apps`: Contains the individual applications.
  - `/apps/backend`: The backend application.
  - `/apps/frontend`: The frontend application.
- `/packages`: Contains shared libraries and packages.
- `/infra`: Contains infrastructure-as-code (e.g., Terraform, Docker).
- `/docs`: Contains project documentation.

## Getting Started

1. **Install pnpm**: If you don't have pnpm, install it globally: `npm install -g pnpm`
2. **Install dependencies**: `pnpm install`

## Development Workflow

- To run a script for all packages, use `pnpm -r <script>`. For example, to build all packages, run `pnpm -r build`.
- Shared configurations for ESLint, Prettier, and TypeScript are located in the root of the repository.
- A pre-commit hook is set up with Husky and lint-staged to automatically lint and format your code before committing.

## Database Seeding

Development fixtures are available to help you iterate quickly against a populated tenancy-aware database.

1. Ensure PostgreSQL is running and the connection variables in `.env` point at your development database.
2. Apply the latest migrations: `pnpm --filter backend db:migrate`.
3. Seed sample data: `pnpm db:seed`.

The seeding command truncates application tables and reloads the fixtures, so re-running it is a quick way to reset the development database. The root `Makefile` exposes `make db-seed` and `make db-seed-reset` shortcuts for the same workflow.

### Sample Accounts

| Tenant | Role | Email | Password |
| --- | --- | --- | --- |
| Acme Logistics | Admin | alice.admin@acme.test | Password123! |
| Acme Logistics | Manager | mark.manager@acme.test | Password123! |
| Acme Logistics | Specialist | sophie.specialist@acme.test | Password123! |
| Beta Transport | Admin | brian.boss@beta.test | Password123! |
| Beta Transport | Manager | kelly.coordinator@beta.test | Password123! |
| Beta Transport | Specialist | oscar.operator@beta.test | Password123! |
| Beta Transport | Auditor | abby.auditor@beta.test | Password123! |

## Contributing

1. Create a new branch for your feature or bug fix.
2. Make your changes.
3. Commit your changes, which will trigger the pre-commit hook.
4. Push your branch and open a pull request.

## Tenancy

The backend application uses a tenancy model to isolate data between different tenants. The tenant is resolved from the subdomain of the incoming request. For example, a request to `tenant1.example.com` will be associated with the `tenant1` tenant.

The tenancy resolution logic is implemented in the `TenancyGuard`, which is a global guard that runs for every request. The `TenancyGuard` uses the `TenancyService` to resolve the tenant from the request and set the tenant context for the current request.

The tenant context is then used in the `databaseProvider` to automatically apply a tenant filter to all database queries. This is done by setting a `app.tenant` session variable in the database for each query.

### Custom Domains

To support custom domains, you will need to update the `TenancyService` to resolve the tenant from a different source, such as a header or a token claim. You will also need to update the `tenants` table in the database to include a mapping between the custom domain and the tenant.
