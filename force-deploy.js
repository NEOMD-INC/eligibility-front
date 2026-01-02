#!/usr/bin/env node
/**
 * Force deploy via Netlify API with cache clearing
 */

const https = require('https');

const SITE_ID = 'd2e82ec9-d713-4b2f-ad00-d78ecff168f4';
const accessToken = process.argv[2];

if (!accessToken) {
  console.error('❌ Missing access token');
  console.log('\nUsage: node force-deploy.js <access-token>');
  process.exit(1);
}

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.netlify.com',
      path: `/api/v1/sites/${SITE_ID}${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData || '{}'));
          } catch (e) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function forceDeploy() {
  try {
    console.log('🚀 Triggering deploy with build settings override...\n');
    
    // First, ensure publish directory is cleared
    await makeRequest('PATCH', '', {
      build_settings: {
        dir: null
      }
    });
    
    console.log('✅ Cleared publish directory setting');
    console.log('⚠️  Note: You may need to wait 1-2 minutes for changes to propagate');
    console.log('   Then run: netlify deploy --prod\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Alternative: Deploy via Git push which uses different settings');
    console.log('   Or contact Netlify support to clear the cached setting\n');
    process.exit(1);
  }
}

forceDeploy();

