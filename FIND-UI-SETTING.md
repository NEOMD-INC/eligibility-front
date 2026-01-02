# How to Find Publish Directory in Netlify UI

## Step-by-Step with Screenshots Locations

### Method 1: Via Site Configuration (Most Common)

1. **Go to your site:**
   - Visit: https://app.netlify.com/sites/neo-eligibility
   - OR: https://app.netlify.com → Click on "neo-eligibility"

2. **Click on "Site configuration"** (gear icon in left sidebar)

3. **Click "Build & deploy"** in the left sidebar

4. **Click the "Build settings" tab** at the top

5. **Look for these fields:**
   - "Base directory" 
   - "Publish directory"
   - "Build command"
   - "Build output directory"

6. **Clear "Publish directory"** if it has any value

### Method 2: Via Continuous Deployment

1. Go to: https://app.netlify.com/sites/neo-eligibility/configuration/deploys

2. Scroll down to find:
   - "Build settings" section
   - OR "Build configuration" section

3. Look for "Publish directory" field

### Method 3: Check Environment Variables

The setting might be set via environment variable:

1. Go to: https://app.netlify.com/sites/neo-eligibility/configuration/environment-variables

2. Look for variables like:
   - `PUBLISH_DIR`
   - `NETLIFY_PUBLISH_DIR`
   - Any variable with "publish" or "dir" in the name

3. Delete any that set the publish directory

### Method 4: Check Team Settings

If you're in a team, the setting might be at team level:

1. Go to: https://app.netlify.com/teams
2. Select your team (NeoPMS)
3. Go to team settings
4. Check for build defaults that might set publish directory

