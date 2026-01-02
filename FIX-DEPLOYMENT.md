# Fix Netlify Deployment Error

## The Problem
The `@netlify/plugin-nextjs` plugin is failing because the **Publish directory** is set to `.next` in your Netlify UI settings. The plugin needs to manage this itself.

## Solution (Choose One)

### Option 1: Quick Manual Fix (Recommended - 30 seconds)

1. Go to: **https://app.netlify.com/sites/neo-eligibility/configuration/deploys**
2. Scroll down to **"Build settings"**
3. Find **"Publish directory"** field
4. **Clear it completely** (make it empty/blank)
5. Click **"Save"**
6. Run: `netlify deploy --prod`

### Option 2: Automated Fix (Using Script)

1. Get your access token:
   - Go to: https://app.netlify.com/user/applications
   - Click **"New access token"**
   - Name it (e.g., "Fix deployment")
   - Select **"Full access"**
   - Click **"Generate token"**
   - **Copy the token** (you won't see it again!)

2. Run the fix script:
   ```bash
   node fix-netlify-settings.js <paste-your-token-here>
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Why This Happens

The `@netlify/plugin-nextjs` plugin:
- Processes your Next.js build output
- Creates serverless functions for dynamic routes  
- Publishes static content from its processed location

When the publish directory is set in the UI, it conflicts with the plugin's internal publishing process, causing the "Failed publishing static content" error.

## Verification

After fixing, the resolved config should show:
```
publish: (empty or not set)
publishOrigin: (not ui)
```

Instead of:
```
publish: C:\webDev\eligibility-front\.next
publishOrigin: ui
```

