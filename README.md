# Appraisily Art Screener

This repository contains the code for Appraisily's Art Screener application, an AI-powered tool for art analysis and appraisal. The platform combines computer vision and generative AI to provide instant artwork evaluation.

## Features

- 🎨 Instant artwork analysis using AI vision models
- 🔍 Visual similarity search across art databases
- 🤖 Advanced AI-powered artwork classification and attribution
- 📊 Detailed visual analysis reports with style/period identification
- 💰 Value estimation based on auction data and market trends
- 💻 Responsive, modern UI optimized for all devices
- 📱 Progressive feature unlocking based on analysis stage

## Tech Stack

- **Frontend**: React 18.3, TypeScript 5.5, Vite 5.4, Tailwind CSS 3.4
- **UI Components**: Lucide React (icons), React Router DOM 6.22
- **API**: Axios for HTTP requests with proper error handling
- **State Management**: React hooks (useState, useEffect, useContext)
- **Backend Services**: Node.js on Google Cloud Run (separate repository)

## Project Structure

```
/
├── frontend/           # Standalone frontend module
│   ├── src/            # Source code
│   └── ...             # Frontend-specific config
├── src/                # Main application source
│   ├── components/     # React components organized by feature
│   ├── hooks/          # Custom React hooks including API handlers
│   │   └── api/        # API communication hooks
│   ├── pages/          # Page components
│   ├── templates/      # HTML templates for reports
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── public/             # Static assets
└── ...                 # Configuration files
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build for Netlify (skips TypeScript errors)
npm run build:netlify

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://appraisals-web-services-backend-856401495068.us-central1.run.app
```

For local development, you can point to a local backend:

```env
VITE_API_URL=http://localhost:8080
```

## Development Guidelines

### Code Style

- Use TypeScript for all components with proper type definitions
- Follow React hooks best practices and rules of hooks
- Implement proper error handling with try/catch blocks
- Use Tailwind CSS for styling with clsx/classnames for conditionals
- Keep components focused and reusable

### API Response Format

All API responses follow this structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string; // Only present in error responses
  data?: T;       // Typed data payload
}
```

## Deployment

The frontend is automatically deployed to Netlify when changes are pushed to the main branch. The build process is configured in `netlify.toml` and `netlify-build.js`.

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guidelines for agentic coding assistants
- [Frontend Module](./frontend/) - Standalone frontend module implementation

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@appraisily.com