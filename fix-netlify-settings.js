#!/usr/bin/env node
/**
 * FINAL SOLUTION: Remove publish directory from Netlify site settings
 * This fixes the "@netlify/plugin-nextjs" error
 * 
 * Your Site ID: d2e82ec9-d713-4b2f-ad00-d78ecff168f4
 * 
 * Usage: 
 *   1. Get access token from: https://app.netlify.com/user/applications
 *   2. Run: node fix-netlify-settings.js <your-access-token>
 */

const https = require('https');

const SITE_ID = 'd2e82ec9-d713-4b2f-ad00-d78ecff168f4';
const accessToken = process.argv[2];

if (!accessToken) {
  console.error('❌ Missing access token');
  console.log('\nUsage: node fix-netlify-settings.js <access-token>');
  console.log('\nTo get your access token:');
  console.log('  1. Go to: https://app.netlify.com/user/applications');
  console.log('  2. Click "New access token"');
  console.log('  3. Create token with "Full access"');
  console.log('  4. Copy and paste it here\n');
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

async function fixPublishDirectory() {
  try {
    console.log('📡 Fetching current site settings...\n');
    
    // Get current settings
    const site = await makeRequest('GET', '');
    
    console.log('Current build settings:');
    console.log(`  Build command: ${site.build_settings?.cmd || 'not set'}`);
    console.log(`  Publish directory: ${site.build_settings?.dir || '(empty)'}\n`);

    if (!site.build_settings?.dir) {
      console.log('✅ Publish directory is already empty!');
      console.log('You can deploy with: netlify deploy --prod');
      return;
    }

    console.log('🔧 Removing publish directory setting...\n');

    // Update to remove publish directory - try multiple approaches
    const updateData = {
      build_settings: {
        cmd: site.build_settings?.cmd || 'npm run build -- --webpack',
        dir: ""  // Empty string to clear publish directory
      }
    };
    
    console.log('Sending update:', JSON.stringify(updateData, null, 2));
    const updated = await makeRequest('PATCH', '', updateData);

    console.log('✅ Successfully removed publish directory!\n');
    console.log('New build settings:');
    console.log(`  Build command: ${updated.build_settings?.cmd || 'not set'}`);
    console.log(`  Publish directory: (empty)\n`);
    console.log('🚀 You can now deploy with: netlify deploy --prod\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Manual fix instructions:');
    console.log('  1. Go to: https://app.netlify.com/sites/neo-eligibility/configuration/deploys');
    console.log('  2. Scroll to "Build settings"');
    console.log('  3. Find "Publish directory"');
    console.log('  4. Clear the field (make it empty)');
    console.log('  5. Click "Save"');
    console.log('  6. Run: netlify deploy --prod\n');
    process.exit(1);
  }
}

fixPublishDirectory();

