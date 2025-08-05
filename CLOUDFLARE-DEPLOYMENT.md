# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Ajjarah Admin dashboard to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Node.js 20.x installed (as specified in package.json)
3. pnpm installed

## Setup Instructions

### 1. Install Wrangler

First, install the Cloudflare Wrangler CLI as a dev dependency:

```bash
pnpm add -D wrangler
```

Or install it globally:

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

Log in to your Cloudflare account:

```bash
wrangler login
```

This will open a browser window for authentication.

### 3. Configuration Files

Two configuration files have been created:

- **wrangler.json** - JSON format configuration
- **wrangler.toml** - TOML format configuration (recommended)

You only need one of these files. The TOML format is preferred for newer versions of wrangler.

### 4. Build the Project

Build your project for production:

```bash
pnpm build
```

This will create a `dist` directory with your production-ready files.

### 5. Deploy to Cloudflare Pages

#### Option A: Direct Deployment

Deploy directly to production:

```bash
pnpm deploy
```

Or deploy to a preview branch:

```bash
pnpm deploy:preview
```

#### Option B: First-time Setup

For the first deployment, you might need to create the project:

```bash
wrangler pages project create ajjarah-admin
```

Then deploy:

```bash
wrangler pages deploy ./dist --project-name=ajjarah-admin
```

### 6. Available Scripts

The following npm scripts have been added to package.json:

- `pnpm deploy` - Deploy to production
- `pnpm deploy:preview` - Deploy to preview branch
- `pnpm cf:dev` - Run Cloudflare Pages dev server locally
- `pnpm cf:build-deploy` - Build and deploy in one command

## Environment Variables

If your app uses environment variables, you can set them in the Cloudflare Pages dashboard:

1. Go to your Cloudflare Pages project
2. Navigate to Settings → Environment variables
3. Add your variables

For local development with Cloudflare Pages:

1. Create a `.dev.vars` file (add to .gitignore)
2. Add your environment variables:
   ```
   VITE_API_URL=https://api.example.com
   ```

## Custom Routes for SPA

Since this is a single-page application, you might need to configure routing. The wrangler.toml file can be updated to handle SPA routing:

```toml
[[routes]]
pattern = "/*"
script = ""
```

## Troubleshooting

### Build Errors

If you encounter build errors during deployment:

1. Ensure all dependencies are properly installed
2. Check that TypeScript compilation succeeds locally
3. Verify that the build output is in the `dist` directory

### Asset Loading Issues

If assets aren't loading correctly:

1. Check the `base` path in vite.config.ts
2. Ensure the `VITE_APP_PUBLIC_PATH` environment variable is set correctly
3. Verify that all assets are included in the build output

### Deployment Failures

If deployment fails:

1. Check your Cloudflare account limits
2. Ensure wrangler is authenticated: `wrangler whoami`
3. Try deploying with verbose logging: `wrangler pages deploy ./dist --log-level debug`

## CI/CD Integration

For automated deployments, you can use GitHub Actions:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 10.8.0
          
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - run: pnpm install
      - run: pnpm build
      
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ajjarah-admin
          directory: dist
```

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Vite Static Deploy Guide](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)