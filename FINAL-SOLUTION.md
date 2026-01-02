# FINAL SOLUTION - Netlify Deployment Fix

## The Problem

The `@netlify/plugin-nextjs` plugin is failing because the **Publish directory** is set to `.next` in your Netlify UI, and this setting is **cached** or stored at a level that the API can't access.

## The Solution

Since the API shows the setting is cleared but deployments still use it, you have **2 options**:

### Option 1: Manual UI Fix (MOST RELIABLE)

The setting might be in a location you haven't checked yet:

1. **Go directly to this URL:**

   ```
   https://app.netlify.com/sites/neo-eligibility/configuration/deploys#build-settings
   ```

2. **Look for these fields:**
   - "Publish directory"
   - "Base directory"
   - "Output directory"
   - "Build output directory"

3. **Clear ALL of them** (make them empty)

4. **Also check Team/Organization settings:**
   - Go to: https://app.netlify.com/teams/neo-eligibility/sites (or your team name)
   - Check if there are organization-level build settings

5. **Save and wait 2-3 minutes** for changes to propagate

6. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Clear Cache via Netlify Dashboard

1. Go to: https://app.netlify.com/sites/neo-eligibility/deploys
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**
4. This will clear all cached settings and redeploy

### Option 3: Contact Netlify Support

If the setting persists after trying the above:

- The setting might be locked at an organization level
- Contact Netlify support with your site ID: `d2e82ec9-d713-4b2f-ad00-d78ecff168f4`
- Ask them to remove the publish directory setting

## Why This Happens

The `@netlify/plugin-nextjs` plugin:

- Processes your `.next` build output
- Creates serverless functions
- Publishes static files from its processed location

When the publish directory is set in the UI, it conflicts with the plugin's internal publishing process.

## Verification

After fixing, the deployment should show:

```
publish: (empty or not in resolved config)
publishOrigin: (not "ui")
```
