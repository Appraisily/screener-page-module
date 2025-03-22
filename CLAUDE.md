# SCREENER Project Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run build:netlify` - Build for Netlify (skips TypeScript errors)
- `npm run lint` - Run ESLint
- Preview: `npm run preview` - Preview production build locally

## Development Workflow
- Frontend and Backend are separate projects
- Frontend deployed on Netlify, Backend on Google Cloud Run

## Code Style Guidelines
- **TypeScript**: Strict mode enabled with noUnusedLocals and noUnusedParameters
- **Formatting**: ESLint with TypeScript and React Hooks plugins
- **Component pattern**: React functional components with TypeScript
- **State management**: React hooks (useState, useEffect, useContext)
- **CSS**: Tailwind CSS with clsx for conditional styling
- **Error handling**: Use try/catch with meaningful error messages
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **File structure**: Group by feature (components, hooks, pages, types)