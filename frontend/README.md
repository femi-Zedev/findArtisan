# FindArtisan Frontend

Frontend application for FindArtisan - A platform to discover local artisans in Benin Republic.

## Tech Stack

- **Next.js 16.0.1** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Mantine UI 8.3.6** - UI component library
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Zod** - Schema validation

## Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
findartisan-frontend/
├── app/                    # Next.js app directory
│   ├── _shared/           # Shared resources across features
│   │   └── forms/         # Reusable form components
│   ├── _components/       # Feature-specific components
│   ├── _columns/          # Table column definitions
│   └── lib/              # Utilities and services
│       ├── services/     # API services
│       ├── auth/         # Authentication logic
│       └── routes.ts     # Application routes
├── stores/               # Zustand stores
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

## Development Guidelines

See `.cursor/rules/frontend-specs.mdc` for detailed coding style and patterns.