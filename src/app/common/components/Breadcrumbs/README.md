# Breadcrumb Package Documentation

Manage breadcrumbs efficiently in your Next.js application with this comprehensive package. It facilitates breadcrumb setup using React context and hooks, allowing for direct label setting or deriving labels from GraphQL queries.

## Table of Contents

- [Introduction](#introduction)
- [How Breadcrumbs Work](#how-breadcrumbs-work)
- [Installation](#installation)
- [Usage](#usage)
  - [BreadcrumbProvider](#breadcrumbprovider)
  - [useBreadcrumb and useBreadcrumbWithQuery Hooks](#usebreadcrumb-and-usebreadcrumbwithquery-hooks)
- [Common Pitfalls & Tips](#common-pitfalls--tips)

## Introduction

Breadcrumbs provide a navigation aid in user interfaces, allowing users to understand their location within the application's hierarchy. They also offer an easy way to navigate back to parent pages.

## How Breadcrumbs Work

The breadcrumb system in this package is built on two main parts:

1. **BreadcrumbProvider**: A React context provider that maintains the state of breadcrumbs for the wrapped components. All components that need breadcrumb functionality should be descendants of this provider.

2. **useBreadcrumb and useBreadcrumbWithQuery** Hooks: Custom hooks that provide functionalities to set breadcrumb labels. They can set labels directly or use GraphQL queries to fetch data and then derive the label.

The breadcrumbs are dynamic and change based on the application's route. When you navigate to a new page, the breadcrumbs update to reflect the current page hierarchy.

# Installation

Currently the package lives in the `@common/components/Breadcrumbs` module and don't need to be installed. Simply import what you need from this package.

## Usage

### BreadcrumbProvider

Wrap your application or the specific part of your application where you need breadcrumb functionality using `BreadcrumbProvider`.

```ts
import { BreadcrumbProvider } from "@common/components/Breadcrumbs";

function App({ children }) {
  return <BreadcrumbProvider>{children}</BreadcrumbProvider>;
}
```

### useBreadcrumb and useBreadcrumbWithQuery Hooks

These hooks provide functionalities to handle breadcrumbs.

#### API:

- `setCurrentBreadcrumbLabel`: Directly set the breadcrumb label.
- `useBreadcrumbWithQuery`: A hook to set breadcrumb label using a GraphQL query.

#### Usage:

```jsx
import { useBreadcrumb } from "@common/components/Breadcrumbs";

const { setCurrentBreadcrumbLabel } = useBreadcrumb();
```

Example:

Directly setting the breadcrumb:

```jsx
setCurrentBreadcrumbLabel("Profile");
```

Using GraphQL to set the breadcrumb:

```ts
import { useBreadcrumbWithQuery } from "@common/components/Breadcrumbs";

const { setWithQuery } = useBreadcrumbWithQuery();

type FranchiseData = {
  franchise: { name: string };
};

setBreadcrumbWithQuery({
  query: GET_FRANCHISE,
  variables: { id: "some-id" },
  resolver: (data: FranchiseData) => data.franchise.name,
});
```

## Common Pitfalls & Tips

1. **Provider Requirement**: Always wrap your component tree with `BreadcrumbProvider` where breadcrumbs are needed. If missed, using `useBreadcrumb` will result in an error.

2. **Resolver Function**: The resolver function in `setBreadcrumbWithQuery` is crucial. Ensure it returns a non-empty string to represent the breadcrumb label.

3. **GraphQL Errors**: Although `setBreadcrumbWithQuery` simplifies setting breadcrumbs with GraphQL, always handle potential GraphQL errors in your application's logic.
