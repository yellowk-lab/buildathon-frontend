# Adopting the app and pages Folders in Next.js

Next.js version 13 introduced the app directory, a powerful yet nascent feature. While it's promising, it might lack extensive community support at present.

To future-proof our app, we're combining the pages and app directories, as per the [Next.js guidelines]().

## Our Approach:

### `Pages` Directory

- **Mainly for Routing:** The pages directory will serve as the primary router, directing incoming requests to the appropriate pages.
- **Kept Lightweight:** By relocating most app logic, this directory remains streamlined.

### Transition from `modules` to `app`

All application logic which was previously housed in the `modules` directory will now reside in the `app` directory. This shift not only aligns with Next.js's new direction but also promotes a more modular and organized structure.

### Module Structuring within `app`

Each functional module of the application will have its own dedicated folder within the `app` directory. This folder will encapsulate all related components and pages for that module, ensuring a clear and logical separation of concerns.

> For a deeper understanding of how modules should be structured, please refer to the documentation on the [app module structure.](../app/README.md)

For example:

```bash
/app
  /posts
    /components
    /pages
  /users
    /components
    /pages
```

### Decentralized Page Rendering

Instead of a central location for page rendering logic inside the `pages` directory, each module will handle its own rendering. This decentralized approach paves the way for the eventual transition to the `app` directory's architecture, particularly the use of `page.tsx` and `layout.tsx` inside each modules.

## Benefits

1. **Scalability:** Easier management and expansion as the app grows.
2. **Readiness for future migration:** Structured to smoothly adopt the app directory's conventions later on.
