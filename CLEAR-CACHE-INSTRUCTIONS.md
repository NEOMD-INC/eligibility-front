# Clear Cache via Netlify Dashboard

## The Issue
The API shows the publish directory is NOT set, but deployments still use it. This means it's **cached** in Netlify's build system.

## Solution: Clear Cache via Dashboard

Since you can't find the setting in the UI, the issue is likely **cached build settings**. Here's how to clear it:

### Step 1: Go to Deploys Page
1. Visit: **https://app.netlify.com/sites/neo-eligibility/deploys**
2. You should see a list of your deployments

### Step 2: Clear Cache and Redeploy
1. Look for a button that says **"Trigger deploy"** or **"Deploy site"** (usually in the top right)
2. Click the dropdown arrow next to it
3. Select **"Clear cache and deploy site"** or **"Clear cache and retry deploy"**
4. This will:
   - Clear all cached build settings
   - Clear cached dependencies
   - Trigger a fresh deployment with current settings

### Step 3: Wait for Deployment
- The deployment will start automatically
- Watch the build logs
- It should now work without the publish directory error

## Alternative: If You Don't See "Clear Cache" Option

1. Go to: **https://app.netlify.com/sites/neo-eligibility/deploys**
2. Find your **latest failed deployment**
3. Click on it to open the deploy details
4. Look for a **"Retry deploy"** or **"Clear cache and retry"** button
5. Click it

## Why This Works

The publish directory setting is cached in Netlify's build system. Even though:
- The API shows it's not set
- You can't find it in the UI
- It's not in environment variables

The build system still has it cached. Clearing the cache forces Netlify to:
- Re-read all settings from the API
- Use fresh configuration
- Ignore cached values

## After Clearing Cache

Once the cache is cleared and deployment succeeds, future deployments should work fine because the cached setting will be gone.

