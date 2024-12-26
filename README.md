# Appraisily Art Screener Frontend

This repository contains the frontend code for Appraisily's Art Screener application. The backend service is hosted separately at https://appraisals-web-services-backend-856401495068.us-central1.run.app.

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
│   └── EmailCollector/  # Email collection form
├── hooks/               # Custom React hooks
│   └── useImageAnalysis/# Image analysis logic
├── pages/              # Page components
│   ├── HomePage/       # Main landing page
│   └── AnalyzePage/    # Analysis results page
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
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://appraisals-web-services-backend-856401495068.us-central1.run.app
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

## Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@appraisily.com