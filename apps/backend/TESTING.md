# Backend Testing

This document outlines the testing strategy for the backend application.

## Running Tests

There are three main test suites:

- **Unit Tests:** These tests cover individual units of code, such as services and controllers.
- **End-to-End (E2E) Tests:** These tests cover the entire application, from the API endpoints to the database.
- **Integration Tests:** These tests cover the interaction between different parts of the application.

To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## Adding New Tests

### Unit Tests

Unit tests are located in the `src` directory, next to the file they are testing. For example, the tests for `app.controller.ts` are in `app.controller.spec.ts`.

To add a new unit test, create a new `*.spec.ts` file and use the `@nestjs/testing` package to create a testing module.

### E2E Tests

E2E tests are located in the `test` directory. These tests use `supertest` to make requests to the application and assert on the responses.

To add a new E2E test, create a new `*.e2e-spec.ts` file and use the `createTestApp` function from `test/test-utils.ts` to create a new instance of the application.

### Test Utilities

The `test/test-utils.ts` file contains a number of useful functions for writing tests, such as:

- `createTestApp()`: Creates a new instance of the application for testing.
- `clearDatabase()`: Clears the database between tests.
- `getKnex()`: Returns an instance of Knex for interacting with the database.
- `createTenant()`: Creates a new tenant.
- `createUser()`: Creates a new user.

## Code Coverage

The test suite is configured to enforce a code coverage threshold of 80%. To run the tests with coverage, use the following command:

```bash
npm run test:cov
```
