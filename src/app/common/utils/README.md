# Common Utilities

## Overview

The `common/utils` directory contains utility functions or components that are used across various modules but aren't foundational to the application. These utilities enhance the application but aren't integral to its basic operation.

## Guidelines

1. **Shared Nature**: Utilities here should be shared across multiple parts of the application. If a utility is specific to a module, consider placing it within that module.

2. **Avoid Duplication**: Before adding a new utility, ensure that a similar utility doesn't already exist. This helps prevent redundancy.

3. **Documentation**: Document how to use each utility, especially if its usage isn't immediately clear. Proper documentation ensures that other developers can understand and use the utility without delving deep into its implementation.

## Examples

- General-purpose data formatters.
- Helper functions to enhance UI components.
- Shared validation functions.
