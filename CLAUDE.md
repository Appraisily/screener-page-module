# SCREENER Project Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run build:netlify` - Build for Netlify (skips TypeScript errors)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Code Style Guidelines
- **TypeScript**: Strict mode with noUnusedLocals and noUnusedParameters enabled
- **React**: Functional components with hooks (useState, useEffect, useContext)
- **Formatting**: ESLint with TypeScript and React hooks plugins
- **Imports**: Group by: 1) external packages, 2) internal modules
- **CSS**: Tailwind CSS with clsx/classnames for conditional styling
- **Error Handling**: Use try/catch with descriptive error messages
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **API Calls**: Use axios with proper error handling
- **File Structure**: Group by feature (components, hooks, pages, types)

## Development Workflow
- Frontend deployed on Netlify, Backend on Google Cloud Run
- Frontend and Backend are separate projects
- Use Vite for development and build process