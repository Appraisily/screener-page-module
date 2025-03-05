# Appraisily Art Screener Module

This repository contains the frontend module for Appraisily's Art Screener application. The module provides a comprehensive solution for artwork analysis, visual search, and AI-powered art classification.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#development)
  - [Component Guidelines](#component-guidelines)
  - [State Management](#state-management)
  - [Data Flow](#data-flow)
  - [API Architecture](#api-architecture)
- [Building](#building)
- [API Integration](#api-integration)
- [Contribution](#contribution)
- [License](#license)
- [Support](#support)

## Overview

The Appraisily Art Screener module is a React-based frontend application that allows users to upload images of artwork, perform visual similarity searches, get AI-powered analysis, and receive detailed visual analysis reports. The application connects to a backend service for processing and analysis.

## Features

- 🎨 Instant artwork analysis using AI vision
- 🔍 Visual similarity search
- 🤖 AI-powered artwork classification
- 📊 Detailed visual analysis reports
- 💻 Responsive, modern UI
- 🎯 Progressive feature unlocking

## Tech Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Routing**: React Router DOM 6.22
- **HTTP Client**: Axios
- **UI Utilities**: classnames, clsx, tailwind-merge
- **File Upload**: react-dropzone
- **Notifications**: react-hot-toast
- **ID Generation**: uuid

## Repository Structure

### Root Directory

- **`/dist`**: Contains the production build of the application
- **`/node_modules`**: Contains project dependencies
- **`/.git`**: Git repository data
- **`/backend`**: Contains server-side code
- **`/src`**: Contains the main application source code
- **`package.json`**: Project configuration and dependencies
- **`package-lock.json`**: Locked versions of dependencies
- **`index.html`**: Main HTML entry point
- **`vite.config.ts`**: Configuration for the Vite build tool
- **`tsconfig.json`**: TypeScript configuration
- **`tailwind.config.js`**: Tailwind CSS configuration
- **`.env`, `.env.development`, `.env.production`**: Environment variables for different environments
- **`.gitignore`**: Specifies files to be ignored by Git
- **`README.md`**: Project documentation (this file)
- **`api-documentation.md`**: Documentation for the API endpoints
- **`frontend-integration-guide.md`**: Guide for integrating the module into frontend applications
- **`ui-improvement-recommendations.md`**: Recommendations for UI improvements
- **`TODO.md`**: List of pending tasks and improvements
- **`netlify.toml`**: Configuration for Netlify deployment
- **`eslint.config.js`**: ESLint configuration for code linting
- **`postcss.config.js`**: PostCSS configuration (used by Tailwind)

### Source Directory (`/src`)

#### Components (`/src/components`)

- **`ArtScreener.tsx`**: Main component that orchestrates the art screening process. Handles image upload, visual search, and results display.
- **`ResultsDisplay.tsx`**: Component for displaying analysis results, including visual search results and AI analysis.
- **`ImageUploader.tsx`**: Component for handling image uploads with drag-and-drop functionality.
- **`VisualSearchResults.tsx`**: Component for displaying visual similarity search results.
- **`OpenAIAnalysis.tsx`**: Component for displaying AI-powered analysis of artwork.
- **`EmailCollector.tsx`**: Component for collecting user emails to send analysis results.
- **`ToolPanel.tsx`**: Component for displaying analysis tools and options.
- **`ToastProvider.tsx`**: Component for managing toast notifications.
- **`Panel.tsx`**: Reusable panel component for displaying content. 
- **`VisualSearchPanel.tsx`**: Panel for visual search results.
- **`Navbar.tsx`**: Navigation bar component.
- **`Services.tsx`**: Component for displaying available services.
- **`AnalysisTools.tsx`**: Component for displaying analysis tools.
- **`AppraiserProfile.tsx`**: Component for displaying appraiser profiles.
- **`OriginAnalysisPanel.tsx`**: Panel for displaying origin analysis results.

#### Pages (`/src/pages`)

- **`AnalyzePage.tsx`**: Page component for the analysis results screen, which displays comprehensive analysis of uploaded artwork.
- **`HomePage.tsx`**: Main landing page component with introduction and image upload functionality.

#### Hooks (`/src/hooks`)

- **`useImageAnalysis.ts`**: Core hook that manages the image analysis process, coordinating between upload, analysis, and results display.
- **`useTawkTo.ts`**: Hook for integrating the Tawk.to chat service.
- **`useErrorHandler.ts`**: Hook for standardized error handling.

#### API Architecture (`/src/lib/api`)

- **`index.ts`**: Centralized API client that handles all backend communication. All API endpoints are defined here, providing a single source of truth for API interactions.

This centralized approach to API calls offers several benefits:
1. **Consistency**: All API calls follow the same pattern for error handling and response processing
2. **Maintainability**: Endpoint changes only need to be updated in one place
3. **Debugging**: Easier to track API calls with consistent logging
4. **Type Safety**: Standardized typing for all API responses

#### Types (`/src/types`)

- **`index.ts`**: Contains TypeScript type definitions for the application, including interfaces for API responses, search results, and component props.

#### Lib (`/src/lib`)

- **`utils.ts`**: Utility functions for general use throughout the application.
- **`api/`**: API client and service configurations.

#### Core Files

- **`App.tsx`**: Main application component with routing configuration.
- **`main.tsx`**: Entry point for the React application.
- **`index.css`**: Global CSS styles.
- **`vite-env.d.ts`**: Vite environment type declarations.

### Backend Directory (`/backend`)

- **`index.js`**: Backend server code for local development and testing.

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

Create `.env`, `.env.development`, and `.env.production` files with the following variables:

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

The application uses React hooks for state management:
- `useImageAnalysis` is the core hook that manages the image analysis workflow
- Custom hooks in `src/hooks/api` manage specific API interactions
- `useErrorHandler` provides standardized error handling

### Data Flow

1. User uploads an image via `ImageUploader`
2. `useImageAnalysis` processes the upload and triggers visual search
3. Results are displayed in `ResultsDisplay` component
4. Optional AI analysis or origin analysis can be triggered
5. Users can submit email to receive full analysis

### API Architecture

The application follows a centralized API architecture:

1. **Centralized API Client**: All API calls are defined in `src/lib/api/index.ts`
2. **Consistent Error Handling**: Standard error parsing and reporting
3. **Type Safety**: TypeScript interfaces define all API request and response structures
4. **Logging**: Consistent logging of requests and responses for debugging

The API client handles these endpoints:
- `/upload-temp`: Image upload
- `/visual-search`: Visual similarity search
- `/openai-analysis`: AI-powered analysis
- `/origin-analysis`: Artwork origin analysis
- `/full-analysis`: Comprehensive artwork analysis
- `/find-value`: Value estimation
- `/email-submission`: Email submission for results

## Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## API Integration

The module integrates with a backend API for image processing and analysis. The API endpoints are documented in `api-documentation.md`. Key endpoints include:

- `/upload-temp`: For uploading images
- `/visual-search`: For performing visual similarity search
- `/openai-analysis`: For AI-powered analysis
- `/origin-analysis`: For artwork origin analysis
- `/email-submission`: For submitting user emails

All API responses follow a standardized format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
}
```

## Contribution

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@appraisily.com