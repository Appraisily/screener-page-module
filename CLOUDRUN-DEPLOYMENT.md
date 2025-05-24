# Cloud Run Deployment Guide

This document describes how to deploy the Screener Frontend to Google Cloud Run.

## Prerequisites

1. Google Cloud SDK installed and configured
2. Docker installed
3. Project with Cloud Run API enabled
4. Appropriate IAM permissions for Cloud Run deployment

## Environment Variables

The following environment variables are required:

- `PROJECT_ID`: Your Google Cloud Project ID
- `REGION`: Cloud Run region (default: us-central1)
- `VITE_API_URL`: Backend API URL (default: https://appraisals-web-services-backend-856401495068.us-central1.run.app)

## Deployment Options

### Option 1: Using the Deployment Script

1. Set your project ID:
```bash
export PROJECT_ID="your-project-id"
export REGION="us-central1"  # Optional, defaults to us-central1
```

2. Make the deploy script executable:
```bash
chmod +x deploy.sh
```

3. Run the deployment:
```bash
./deploy.sh
```

### Option 2: Manual Deployment

1. Build the Docker image:
```bash
docker build -t gcr.io/$PROJECT_ID/screener-frontend:latest .
```

2. Push to Google Container Registry:
```bash
docker push gcr.io/$PROJECT_ID/screener-frontend:latest
```

3. Deploy to Cloud Run:
```bash
gcloud run deploy screener-frontend \
  --image=gcr.io/$PROJECT_ID/screener-frontend:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars="NODE_ENV=production,VITE_API_URL=https://appraisals-web-services-backend-856401495068.us-central1.run.app"
```

### Option 3: Using Cloud Run Service YAML

```bash
# Update PROJECT_ID in cloud-run-service.yaml first
gcloud run services replace cloud-run-service.yaml --region=us-central1
```

## Architecture Changes

### From Netlify to Cloud Run

The migration includes the following changes:

1. **Server**: Added Express.js server (`server.js`) to serve static files
2. **Build Process**: Updated build scripts for Cloud Run (`cloudrun-build.js`)
3. **Containerization**: Added Dockerfile for containerized deployment
4. **Health Checks**: Added `/health` endpoint for Cloud Run health monitoring
5. **Environment Variables**: Configured for Cloud Run runtime variables

### File Structure

```
screener-page-module/
├── Dockerfile                 # Container configuration
├── server.js                  # Express server for serving static files
├── cloudrun-build.js          # Cloud Run specific build script
├── cloud-run-service.yaml     # Cloud Run service configuration
├── deploy.sh                  # Deployment script
├── .dockerignore             # Docker ignore patterns
├── package.json              # Updated with Cloud Run dependencies
└── CLOUDRUN-DEPLOYMENT.md    # This file
```

## Environment Variables in Cloud Run

Environment variables can be set during deployment or updated later:

```bash
# Update environment variables
gcloud run services update screener-frontend \
  --region=us-central1 \
  --set-env-vars="VITE_API_URL=https://your-new-backend-url.com"
```

## Monitoring and Debugging

1. **Logs**: View logs using Cloud Console or:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=screener-frontend" --limit=50
```

2. **Health Check**: Visit `https://your-service-url/health`

3. **Metrics**: Monitor in Cloud Console under Cloud Run > screener-frontend > Metrics

## Cost Optimization

- **Minimum instances**: Set to 0 for cost savings during low traffic
- **Maximum instances**: Limited to 10 to control costs
- **CPU allocation**: Uses 1 CPU per instance
- **Memory**: Configured for 512Mi per instance

## Security

- Container runs as non-root user
- Health checks configured for proper lifecycle management
- Security headers configured in Express server
- CORS properly configured for frontend-backend communication

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are properly installed
2. **Health Check Failures**: Ensure the `/health` endpoint is accessible
3. **CORS Issues**: Verify `VITE_API_URL` environment variable is correct
4. **Static File Serving**: Check that `dist/` directory is properly built

### Debugging Steps

1. Check build logs during deployment
2. Verify environment variables are set correctly
3. Test health endpoint manually
4. Check Cloud Run logs for runtime errors 