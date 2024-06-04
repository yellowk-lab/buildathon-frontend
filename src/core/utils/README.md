# Core Utilities

## Overview

The `core/utils` directory houses utilities that are foundational or integral to the operation of the application. The utilities in this directory are essential and are used consistently across the entire application.

## Guidelines

1. **Essential Nature**: Only add utilities here that are central to the app's operation. If a utility is used sporadically or can be considered as an enhancement rather than a necessity, consider placing it in `common/utils`.

2. **Consistency**: Ensure that utilities have a consistent API and naming convention. This makes it easier to understand and use them.

3. **Documentation**: Each utility should be well-documented. Any developer should be able to understand its purpose and how to use it just by reading the documentation.

## Examples

- Core configuration utilities.
- Essential data transformation utilities that the app relies on.
- Key application-wide constants or enums.
