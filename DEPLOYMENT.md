# Vercel Deployment Guide

This guide will help you deploy the Bus2Ride application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A Supabase project with the database schema set up
- GitHub repository access

## Quick Deploy

1. **Connect Repository to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository: `Lazermagma/bus2ride`
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   
   Add these environment variables in Vercel Dashboard → Settings → Environment Variables:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
   
   You can find these values in your Supabase project settings under API.

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

## Environment Variables

### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API → anon public key |

### Optional Variables

- `OPENWEATHER_API_KEY` - For weather features (if implemented)
- `LIVECHAT_LICENSE` - LiveChat license number (if using LiveChat)

## Build Settings

Vercel will automatically detect:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install`

## Custom Domain

1. Go to your project settings in Vercel
2. Go to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that all environment variables are set correctly
- Verify Supabase connection strings
- Check build logs in Vercel dashboard

### Runtime Errors

- Ensure all required environment variables are set
- Check Supabase project is active and accessible
- Verify database schema matches the codebase

## Continuous Deployment

Vercel automatically deploys:
- Every push to `main` branch → Production deployment
- Pull requests → Preview deployments

## Performance

The application is optimized for Vercel with:
- Edge runtime support for embed routes
- Image optimization via Next.js Image component
- Caching headers configured in `next.config.ts`
- Static page generation where applicable

