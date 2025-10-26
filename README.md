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

## Local Infrastructure

This project uses Docker Compose to manage local infrastructure services.

### Prerequisites

- Docker
- Docker Compose

### Services

- **Backend**: Node.js API
- **Frontend**: Web application
- **PostgreSQL**: Database
- **Redis**: In-memory data store
- **MinIO**: S3-compatible object storage

### Getting Started

1. **Build and start all services**:
   ```sh
   make dev
   ```

2. **Stop all services**:
   ```sh
   make stop
   ```

3. **View logs**:
   ```sh
   make logs
   ```

### Credentials (for local development)

- **PostgreSQL**:
  - User: `postgres`
  - Password: `postgres`
  - Database: `postgres`
- **MinIO**:
  - Access Key: `minio`
  - Secret Key: `minio`

## Contributing

1. Create a new branch for your feature or bug fix.
2. Make your changes.
3. Commit your changes, which will trigger the pre-commit hook.
4. Push your branch and open a pull request.
