# 0002. API Separation with ElysiaJS

We use ElysiaJS for our API backend, explicitly separating it from the Next.js frontend web application.

While Next.js Server Actions and Route Handlers offer built-in API solutions, they closely couple the API layer to the React application's lifecycle and infrastructure. We chose ElysiaJS because it provides excellent Developer Experience (DX) via end-to-end type safety, and it enforces a strict boundary between the frontend and backend.

This strict separation of concerns future-proofs the application. Should we need to expose an API for independent clients, external tooling, or a Model Context Protocol (MCP) server, the ElysiaJS backend can operate and scale entirely independently of the Next.js web application.
