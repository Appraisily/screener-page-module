# Appraisily Art Screener Frontend

This repository contains the frontend code for Appraisily's Art Screener application, an AI-powered tool for art analysis and appraisal. The backend service is hosted separately at https://appraisals-web-services-backend-856401495068.us-central1.run.app.

## Features

- 🎨 Instant artwork analysis using AI vision
- 🔍 Visual similarity search
- 🤖 AI-powered artwork classification
- 📊 Detailed visual analysis reports
- 💻 Responsive, modern UI
- 🎯 Progressive feature unlocking

## Tech Stack

- React 18.3
- TypeScript 5.5
- Vite 5.4
- Tailwind CSS 3.4
- Lucide React (for icons)
- React Router DOM 6.22

## Project Structure

```
src/
├── components/           # React components
│   ├── ImageUploader/   # Image upload handling
│   ├── ResultsDisplay/  # Analysis results display
│   ├── AnalysisPanel/   # Analysis components
│   ├── VisualSearch/    # Visual search components
│   └── EmailCollector/  # Email collection form
├── hooks/               # Custom React hooks
│   ├── api/             # API communication hooks
│   ├── useImageAnalysis/# Image analysis logic
│   └── useAnalysisState/# Analysis state management
├── pages/              # Page components
│   ├── HomePage/       # Main landing page
│   └── AnalyzePage/    # Analysis results page
├── templates/          # HTML templates
└── types/              # TypeScript definitions
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

## Development

### Component Guidelines

- Use TypeScript for all components
- Follow React hooks best practices
- Implement proper error handling
- Use Tailwind CSS for styling
- Keep components focused and reusable

### State Management

- Use React hooks for local state
- Implement custom hooks for complex logic
- Follow proper state initialization patterns
- Handle loading and error states

### Error Handling

All API responses follow this structure:
```typescript
interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string; // Only in development
  data?: any;
}
```

## Building & Deployment

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Netlify build (skips TypeScript errors)
npm run build:netlify
```

The frontend is automatically deployed to Netlify when changes are pushed to the main branch. The build process is configured in `netlify.toml` and `netlify-build.js`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support & Documentation

For support, email support@appraisily.com

### Additional Resources

- [CLAUDE.md](./CLAUDE.md) - Development guidelines for agentic coding assistants
- [Frontend Documentation](./frontend/README.md) - Details on the standalone frontend module