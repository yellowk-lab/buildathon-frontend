# `app` Module Structure

The app directory houses individual feature modules of the application. Each module within app follows a consistent directory structure to ensure clarity and ease of navigation.

## Directory Structure

### `components/`

This directory contains React components specific to the module. These components are not intended to be shared across multiple modules.

### `pages/`

Page components specific to the module reside here. These might correspond to routes if using frameworks like Next.js. Filenames typically follow the .page.tsx convention.

### `gql/`

The directory dedicated to GraphQL operations. Files within are named based on the context (e.g., "auth") and the type of operation:

```graphql
gql
|
├── auth.queries.ts     # Contains GraphQL queries for authentication
└── auth.mutations.ts   # Contains GraphQL mutations for authentication
```

### `hooks/`

Custom hooks for the module are placed in this directory. These hooks encapsulate logic or side effects specific to the module's domain.

### `locales/`

i18n translation files for the module are stored here. Typically, you'd find language-specific JSON files, like en.json or fr.json.

### `types/`

TypeScript types, interfaces, and type definitions specific to the module reside here.

### `utils/`

Utility functions, helpers, and general-purpose functions specific to the module are located here. High-Order Components (HOCs) used mainly in conjunction with getServerSideProps or similar server-side functions are also housed here.

### `tests/`

Unit or integration tests related to the module are stored here. Test files typically follow the .test.tsx or .test.ts convention.
