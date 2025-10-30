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
