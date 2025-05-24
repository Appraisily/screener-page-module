# Appraisily Art Screener - Backend Documentation

This repository contains the Appraisily Art Screener application, an AI-powered tool for art analysis and appraisal. This documentation focuses on the backend API endpoints, data structures, and integrations.

## Backend API Endpoints

### Image Management
- **POST** `/upload-temp`
  - **Purpose**: Upload temporary images for analysis
  - **Input**: FormData with `image` file (max 5MB, image/* types only)
  - **Output**: 
    ```json
    {
      "success": boolean,
      "message": string,
      "sessionId": string,
      "imageUrl": string
    }
    ```

### Analysis Endpoints
- **POST** `/full-analysis`
  - **Purpose**: Start complete artwork analysis
  - **Input**: 
    ```json
    {
      "sessionId": string
    }
    ```
  - **Output**: 
    ```json
    {
      "success": boolean,
      "message": string,
      "results": SearchResults,
      "timestamp": number,
      "sessionId": string
    }
    ```

- **POST** `/find-value`
  - **Purpose**: Get value estimation for artwork
  - **Input**: 
    ```json
    {
      "sessionId": string
    }
    ```
  - **Output**: 
    ```json
    {
      "success": boolean,
      "message": string,
      "results": ValueEstimationResult
    }
    ```

- **POST** `/find-value/status`
  - **Purpose**: Check value estimation progress
  - **Input**: 
    ```json
    {
      "sessionId": string
    }
    ```
  - **Output**: 
    ```json
    {
      "status": "idle" | "queued" | "processing" | "completed" | "error",
      "percentComplete": number,
      "stage": string,
      "message": string,
      "estimatedTimeRemaining": number
    }
    ```

### Session Management
- **GET** `/session/{sessionId}/status`
  - **Purpose**: Get session analysis status
  - **Output**: 
    ```json
    {
      "success": boolean,
      "data": {
        "status": string,
        "results": SearchResults,
        "visual_progress": ProgressData,
        "details_progress": ProgressData,
        "origin_progress": ProgressData,
        "market_progress": ProgressData
      }
    }
    ```

- **GET** `/session/{sessionId}`
  - **Purpose**: Get complete session data
  - **Output**: 
    ```json
    {
      "success": boolean,
      "session": {
        "metadata": object,
        "analysis": object,
        "origin": object,
        "detailed": object
      }
    }
    ```

### Auction Data
- **POST** `/auction-results`
  - **Purpose**: Get auction results by session ID or keyword
  - **Input**: 
    ```json
    {
      "sessionId": string
    }
    ```
    OR
    ```json
    {
      "keyword": string,
      "minPrice": number,
      "limit": number
    }
    ```
  - **Output**: 
    ```json
    {
      "success": boolean,
      "results": {
        "keyword": string,
        "totalResults": number,
        "minPrice": number,
        "auctionResults": AuctionResult[]
      },
      "keywords": string[]
    }
    ```

### Communication
- **POST** `/submit-email`
  - **Purpose**: Submit user email for results delivery
  - **Input**: 
    ```json
    {
      "email": string,
      "sessionId": string
    }
    ```
  - **Output**: 
    ```json
    {
      "success": boolean,
      "message": string
    }
    ```

## Data Structures & Types

### Core Analysis Types
```typescript
interface DetailedAnalysis {
  concise_description?: string;
  maker_analysis: {
    creator_name: string;
    reasoning: string;
  };
  signature_check: {
    signature_text: string;
    interpretation: string;
  };
  origin_analysis: {
    likely_origin: string;
    reasoning: string;
  };
  marks_recognition: {
    marks_identified: string;
    interpretation: string;
  };
  age_analysis: {
    estimated_date_range: string;
    reasoning: string;
  };
  visual_search: {
    similar_artworks: string;
    notes: string;
  };
}

interface SearchResults {
  metadata: {
    originalName: string;
    timestamp: number;
    analyzed: boolean;
    mimeType: string;
    size: number;
    fileName: string;
    imageUrl: string;
    analysisTimestamp: number;
    analysisResults: {
      labels: string[];
      webEntities: number;
      matchCounts: {
        exact: number;
        partial: number;
        similar: number;
      };
      pagesWithMatches: number;
      webLabels: number;
      openaiAnalysis: {
        category: ItemType;
        description: string;
      };
    };
    originAnalyzed: boolean;
    originAnalysisTimestamp: number;
  };
  detailedAnalysis: DetailedAnalysis;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  percentComplete?: number;
}
```

### Value Estimation Types
```typescript
interface AuctionResult {
  title: string;
  price: {
    amount: number;
    currency: string;
    symbol: string;
  } | number; // Legacy format support
  currency?: string; // Legacy format support
  auctionHouse: string;
  house?: string; // Legacy format support
  date: string;
  lotNumber?: string;
  saleType?: string;
  description?: string;
}

interface ValueEstimationResult {
  timestamp: number;
  query: string;
  success: boolean;
  minValue: number;
  maxValue: number;
  mostLikelyValue: number;
  explanation: string;
  auctionResults: AuctionResult[];
  auctionResultsCount: number;
}

interface ValueEstimationProgress {
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'error';
  percentComplete: number;
  stage: string;
  message: string;
  estimatedTimeRemaining?: number;
}
```

### Generic API Response
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}
```

## Custom Hooks & Classes

### API Integration Hooks
- **useImageUpload**: Handles image upload to `/upload-temp` endpoint
  - Methods: `uploadImage(file: File)`
  - State: `isUploading`, `error`, `customerImage`, `sessionId`

- **useEmailSubmission**: Manages email submission to `/submit-email` endpoint
  - Methods: `submitEmail(email: string, sessionId: string)`
  - State: `isSubmitting`, `error`, `userEmail`

- **useFullAnalysis**: Controls complete analysis workflow via `/full-analysis` endpoint
  - Methods: `startFullAnalysis(sessionId: string)`
  - Callbacks: `onStart`, `onComplete`, `onError`

- **useValueEstimation**: Manages value estimation via `/find-value` endpoint
  - Methods: `getValueEstimation(sessionId: string)`, `checkValueEstimationStatus(sessionId: string)`
  - State: `isLoading`, `error`, `result`, `progress`

- **useAuctionData**: Handles auction data from `/auction-results` endpoint
  - Methods: `getAuctionResults(sessionId: string)`, `getKeywordResults(keyword: string, minPrice?: number, limit?: number)`
  - State: `isLoading`, `error`, `results`, `keywords`

### Analysis Management Hooks
- **useImageAnalysis**: Master hook coordinating all analysis workflows
  - Methods: `uploadImage`, `startFullAnalysis`, `submitEmail`, `analyzeOrigin`, `resetState`
  - State: Comprehensive analysis state including steps, progress, results

- **useProgressiveResults**: Manages real-time progress updates via `/session/{sessionId}/status`
  - Progressive loading of analysis results
  - Step-by-step progress tracking
  - Polling mechanism for live updates

- **useAnalysisState**: Centralized state management for analysis data
  - Methods: `setState`, `resetState`
  - State: Session management, results, progress tracking

- **useAnalysisProgress**: Tracks analysis step progression
  - Real-time step completion tracking
  - Progress percentage calculation

### Utility Services
- **useErrorRecovery**: Error handling and retry mechanisms
- **retryService**: Configurable retry logic for failed API calls
- **sessionRecovery**: Session restoration and data recovery
- **fallbackService**: Fallback mechanisms for API failures

## Project File Structure

```
screener-page-module/
├── backend/
│   └── index.js                    # CORS configuration (minimal backend)
├── src/
│   ├── components/                 # React UI components
│   ├── hooks/                      # Custom React hooks
│   │   ├── api/                    # API integration hooks
│   │   │   ├── useImageUpload.ts   # Image upload API
│   │   │   ├── useEmailSubmission.ts # Email submission API
│   │   │   ├── useOriginAnalysis.ts  # (Deprecated)
│   │   │   └── useVisualSearch.ts    # (Deprecated)
│   │   ├── utils/                  # Hook utilities
│   │   ├── useImageAnalysis.ts     # Master analysis controller
│   │   ├── useFullAnalysis.ts      # Full analysis workflow
│   │   ├── useValueEstimation.ts   # Value estimation system
│   │   ├── useAuctionData.ts       # Auction data management
│   │   ├── useProgressiveResults.ts # Progressive loading
│   │   ├── useAnalysisState.ts     # State management
│   │   ├── useAnalysisProgress.ts  # Progress tracking
│   │   ├── useErrorRecovery.ts     # Error handling
│   │   └── index.ts                # Hook exports
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── utils/                      # Utility functions
│   │   ├── retryService.ts         # API retry logic
│   │   ├── sessionRecovery.ts      # Session management
│   │   ├── fallbackService.ts      # Fallback mechanisms
│   │   └── validation.ts           # Input validation
│   ├── pages/                      # Page components
│   ├── templates/                  # HTML templates
│   ├── images/                     # Static images
│   ├── lib/                        # External libraries
│   ├── App.tsx                     # Main application
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles
│   └── index.ts                    # Main exports
├── public/                         # Static assets
├── frontend/                       # Standalone frontend module
├── dist/                           # Build output
├── node_modules/                   # Dependencies
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── netlify.toml                    # Netlify deployment config
└── README.md                       # This documentation
```

## Analysis Workflow

### 1. Image Upload Flow
1. User uploads image via `useImageUpload.uploadImage()`
2. Image sent to `/upload-temp` endpoint
3. Returns `sessionId` and `imageUrl`
4. Triggers automatic analysis via `useImageAnalysis.handleUpload()`

### 2. Analysis Process
1. `useFullAnalysis.startFullAnalysis()` called with `sessionId`
2. `/full-analysis` endpoint processes the image
3. `useProgressiveResults` polls `/session/{sessionId}/status` for progress
4. Four analysis steps tracked: Visual Search, Details Analysis, Origin Check, Market Research
5. Results stored in `SearchResults` format

### 3. Value Estimation
1. `useValueEstimation.getValueEstimation()` called after analysis
2. `/find-value` endpoint calculates value estimate
3. `/find-value/status` polled for progress updates
4. `useAuctionData` fetches comparable auction results via `/auction-results`
5. Final `ValueEstimationResult` includes price ranges and auction data

### 4. Email Submission
1. User provides email via `useEmailSubmission.submitEmail()`
2. `/submit-email` endpoint stores email with session
3. Results delivered to user's email address

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: development endpoints)

## Deployment

- **Frontend**: Deployed to Netlify with automatic builds
- **Backend**: External service (separate repository) on Google Cloud Run
- **Configuration**: `netlify.toml` and `netlify-build.js` handle build process

## CORS Configuration

The minimal backend (`backend/index.js`) handles CORS for:
- Local development (`localhost:5173`)
- Netlify deployments (`*.netlify.app`)
- Custom domain (`screener.appraisily.com`)
- Development environments (GitHub Codespaces, StackBlitz)

## Error Handling

- **useErrorRecovery**: Automatic retry mechanisms for failed requests
- **retryService**: Configurable retry policies with exponential backoff
- **fallbackService**: Graceful degradation when services are unavailable
- **sessionRecovery**: Restore interrupted analysis sessions

## Development Environment Notes

### Platform-Specific Build Dependencies

This project uses Vite, which relies on Rollup for bundling. Rollup has platform-specific optional dependencies to optimize performance.

-   **For Windows development:** The `@rollup/rollup-win32-x64-msvc` package is used. It is listed in `optionalDependencies` in `package.json`. If you encounter build issues on Windows related to Rollup, ensure this optional dependency is correctly installed. You might need to remove `node_modules` and `package-lock.json`, then run `npm install`.
-   **For Netlify (Linux) builds:** The Netlify build environment will automatically skip the Windows-specific optional dependency. No special configuration is needed for this.

This setup ensures that local development on Windows works smoothly while deployments on Linux-based environments like Netlify also function correctly without installation errors.

## Cloud Run Deployment

The screener frontend is now deployed on **Google Cloud Run** using the provided `Dockerfile`.

### Build & Deploy Steps (summary)
1. Cloud Build triggers on `main` branch push.
2. `Dockerfile` builds production image (multi-stage).
3. Image pushed to Artifact Registry.
4. Cloud Run service `screener-page-module` is updated with new revision.
5. Health probe hits `/health` to verify readiness.
6. Traffic is automatically routed to the new revision.

Service URL (production):
```
https://screener-page-module-<PROJECT_ID>.run.app
```

### Local Docker Run
```bash
# Build and run locally
docker build -t screener-frontend .
docker run -p 8080:8080 screener-frontend
```

### Environment variables
| Variable | Purpose | Default |
|----------|---------|---------|
| `PORT`   | HTTP port listened by `server.js` | `8080` |
| `NODE_ENV` | Runtime mode | `production` |
| `VITE_API_URL` | Backend API base URL | must be provided at build or run |

## Known Migration Errors & Fixes (Bill of Errors)
| Error | Cause | Fix |
|-------|-------|-----|
| `ReferenceError: Cannot access '_' before initialization` | Minified global accessed early in bundle | Added placeholder globals in `src/main.tsx` |
| `Cannot find module @rollup/rollup-win32-x64-msvc` on Windows | Optional Rollup binary not installed | Added to `optionalDependencies`; delete `node_modules` & reinstall |
| `npm ERR! EBADPLATFORM` on Cloud Run build | Windows-only Rollup binary attempted on Linux | Moved package to `optionalDependencies` so Linux skips it |
| `SyntaxError: missing ) after argument list` at `server.js:49` | Object literal method parsing failed on Node 18 | Replaced inline object with `staticOptions` constant |

These fixes are already incorporated in the repository; keep this table as a reference for future regressions.

This documentation covers all backend endpoints, data structures, and API integrations found in the screener-page-module codebase.