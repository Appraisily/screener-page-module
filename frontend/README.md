# Appraisily Art Screener Frontend Module

This directory contains the standalone frontend module for the Appraisily Art Screener application. This module can be used independently or as part of the main screener application.

## Features

- Self-contained React application for artwork analysis
- Simplified version of the main screener application
- Includes core functionality for image upload and analysis
- Responsive design using Tailwind CSS

## Getting Started

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Structure

```
frontend/
├── src/
│   ├── components/      # UI components
│   ├── hooks/           # Custom React hooks
│   ├── images/          # Static images
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── package.json         # Dependencies and scripts
└── vite.config.ts       # Vite configuration
```

## Usage

This module can be integrated into other applications or used as a starting point for custom implementations of the Art Screener interface.