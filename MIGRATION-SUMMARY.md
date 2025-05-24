# Netlify to Cloud Run Migration Summary

This document summarizes all the changes made to migrate the Screener Frontend from Netlify to Google Cloud Run.

## Files Added

### 1. `server.js`
- **Purpose**: Express.js server to serve static files and handle routing
- **Key Features**:
  - Serves static files from `/dist` directory
  - Implements SPA routing fallback
  - Handles legacy Netlify redirect paths
  - Adds security and CORS headers
  - Provides `/health` endpoint for Cloud Run health checks
  - Proper cache control for different file types

### 2. `Dockerfile`
- **Purpose**: Multi-stage Docker container configuration
- **Features**:
  - Uses Node.js 18 Alpine for smaller image size
  - Multi-stage build (builder + production)
  - Non-root user for security
  - Health check configuration
  - Optimized for Cloud Run requirements

### 3. `cloudrun-build.js`
- **Purpose**: Cloud Run specific build script
- **Features**:
  - Replaces Netlify-specific build process
  - Creates widget files for backward compatibility
  - Handles environment variables properly
  - Maintains compatibility with existing functionality

### 4. `.dockerignore`
- **Purpose**: Excludes unnecessary files from Docker build context
- **Includes**: Standard Node.js ignores + Netlify-specific files

### 5. `cloud-run-service.yaml`
- **Purpose**: Declarative Cloud Run service configuration
- **Features**:
  - Health check configuration
  - Resource limits and scaling settings
  - Environment variable configuration

### 6. `deploy.sh`
- **Purpose**: Automated deployment script
- **Features**:
  - Builds and pushes Docker image
  - Deploys to Cloud Run with proper configuration
  - Provides deployment feedback and service URL

### 7. `CLOUDRUN-DEPLOYMENT.md`
- **Purpose**: Comprehensive deployment documentation
- **Contains**:
  - Step-by-step deployment instructions
  - Multiple deployment options
  - Environment variable configuration
  - Monitoring and troubleshooting guides

## Files Modified

### 1. `package.json`
- **Added Dependencies**:
  - `express`: ^4.18.2 (for serving static files)
- **Added Dev Dependencies**:
  - `@types/express`: ^4.17.17 (TypeScript support)
- **Updated Scripts**:
  - `build`: Now uses `cloudrun-build.js`
  - `build:production`: Cloud Run production build
  - `start`: Runs the Express server
  - Kept `build:netlify` for backward compatibility

## Key Architecture Changes

### Before (Netlify)
- Static file hosting
- Netlify Functions for server-side logic
- Netlify-specific redirects and headers
- Build process optimized for Netlify

### After (Cloud Run)
- Containerized Express.js application
- Server-side rendering capability
- Docker-based deployment
- Cloud Run health checks and monitoring
- Environment variable management through Cloud Run

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Server port | `8080` |
| `VITE_API_URL` | Backend API URL | `https://appraisals-web-services-backend-856401495068.us-central1.run.app` |

## Compatibility Maintained

1. **Widget Files**: Legacy widget.js and widget.css files are still created
2. **Netlify Redirects**: Legacy Netlify URL patterns are handled
3. **Build Output**: Same structure as before in `/dist` directory
4. **CORS Configuration**: Maintains same CORS policy
5. **Cache Headers**: Implements same caching strategy as Netlify

## Benefits of Cloud Run Migration

1. **Consistency**: Both frontend and backend now on Google Cloud
2. **Scalability**: Auto-scaling based on traffic
3. **Cost Efficiency**: Pay-per-use model with scale-to-zero
4. **Security**: Container-based deployment with non-root user
5. **Monitoring**: Built-in logging and metrics
6. **Health Checks**: Automatic health monitoring
7. **Environment Management**: Centralized environment variable management

## Deployment Workflow

1. **Build**: `npm run build` (uses cloudrun-build.js)
2. **Containerize**: Docker builds multi-stage image
3. **Deploy**: Image pushed to GCR and deployed to Cloud Run
4. **Monitor**: Health checks and logging automatically configured

## Next Steps

1. Set up your Google Cloud Project ID in deployment scripts
2. Configure environment variables as needed
3. Run the deployment using one of the provided methods
4. Monitor the service through Google Cloud Console
5. Update DNS to point to the new Cloud Run service URL

## Rollback Plan

If needed, you can quickly rollback to Netlify by:
1. Re-enabling the Netlify site
2. Using the `build:netlify` script
3. The original `netlify.toml` and `netlify-build.js` files are preserved 