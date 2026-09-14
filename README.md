# Playwright-Conduit

[![Playwright](https://github.com/Ascellad/Playwright-Conduit/actions/workflows/playwright.yml/badge.svg)](https://github.com/Ascellad/Playwright-Conduit/actions/workflows/playwright.yml)

Automation framework for testing the RealWorld Conduit application using Playwright and TypeScript.

## Overview

This project demonstrates a scalable approach to UI and API test automation with Playwright + TypeScript.

The framework focuses on:

- maintainable test architecture;
- API-driven test data preparation;
- test isolation;
- reusable UI abstractions;
- authenticated and unauthenticated test scenarios;
- automated CI checks and test artifacts.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Playwright
- **API:** REST
- **Test data:** API + test data factories
- **CI/CD:** GitHub Actions
- **Code quality:** ESLint, Prettier, TypeScript
- **Package manager:** npm

## Project Structure

```text
src/
├── api/           # API client and API-related logic
├── components/    # Reusable UI components
├── config/        # Environment and framework configuration
├── factories/     # Test data factories
├── fixtures/      # Playwright custom fixtures
├── models/        # Data models and types
├── pages/         # Page Object Models
└── utils/         # Shared utility functions

tests/
├── auth.setup.ts  # Authentication setup
├── guest/         # Tests that do not require authentication
├── authenticated/ # Tests that require authenticated state
└── smoke/         # Critical smoke tests

scripts/
├── setup-sut.ts   # Prepare local SUT
├── start-sut.ts   # Start frontend and backend
└── stop-sut.ts    # Stop SUT processes

.github/
└── workflows/     # GitHub Actions workflows
```

## Authentication

Authenticated tests use Playwright storageState.

Authentication state is prepared separately and reused by tests that require an authenticated browser session.

API tests use the API layer directly and can create their own authenticated context when required.

## Playwright Projects

The test suite is separated into Playwright projects by purpose:

- `chromium-smoke` - critical smoke scenarios
- `chromium-guest` - unauthenticated UI scenarios
- `chromium-authenticated` - authenticated UI scenarios
- `api` - API tests

Authenticated tests depend on a dedicated authentication setup.

## Running Locally

### Requirements

- Node.js version specified in `.nvmrc`
- Bun

### Install dependencies

```bash
npm ci
```

### Prepare the SUT

```bash
npm run setup:sut
```

### Run tests

```bash
npm test
```

### Other test commands

```bash
npm run test:headed
npm run test:ui
npm run test:debug
```

### Code quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
```

### Open the Playwright report

```bash
npm run report
```

## CI

The project uses GitHub Actions on pushes and pull requests.

The CI pipeline performs:

1. dependency installation with npm;
2. formatting validation;
3. ESLint;
4. TypeScript type checking;
5. Playwright Chromium installation;
6. SUT setup;
7. Playwright test execution;
8. test report and test result artifact upload.

Failed tests retain screenshots, videos and traces for investigation.

## What This Project Demonstrates

- Playwright + TypeScript
- UI and API test automation
- Page Object Model
- reusable Components
- custom Playwright Fixtures
- test data factories
- API-driven test setup
- authenticated browser sessions with `storageState`
- test isolation
- TypeScript type safety
- CI/CD integration with GitHub Actions
- failure investigation with screenshots, videos and traces

## SUT

As SUT (System Under Test) I am using locally deployed implementation of https://realworld.app.is/ (Medium.com like social blogging site)

### Backend

https://github.com/realworld-apps/nitro-prisma-zod-realworld-example-app

### Frontend

https://github.com/realworld-apps/angular-realworld-example-app

## Author

Basarab Alexey - [GitHub profile](https://github.com/Ascellad/)

## License

Project code: [MIT](LICENSE)
