#!/usr/bin/env node
/**
 * Script to remove publish directory from Netlify site settings
 * This fixes the "@netlify/plugin-nextjs" error about publish directory
 * 
 * Usage: node fix-publish-dir.js [site-id] [access-token]
 * 
 * Get site ID: netlify status
 * Get access token: https://app.netlify.com/user/applications
 */

const https = require('https');

const siteId = process.argv[2];
const accessToken = process.argv[3];

if (!siteId || !accessToken) {
  console.error('❌ Missing required arguments');
  console.log('\nUsage: node fix-publish-dir.js <site-id> <access-token>');
  console.log('\nTo get your site ID, run: netlify status');
  console.log('To get your access token, visit: https://app.netlify.com/user/applications');
  process.exit(1);
}

const options = {
  hostname: 'api.netlify.com',
  path: `/api/v1/sites/${siteId}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
};

// First, get current site settings
const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`❌ Error fetching site: ${res.statusCode}`);
      console.error(data);
      process.exit(1);
    }

    const site = JSON.parse(data);
    console.log('Current build settings:');
    console.log(`  Build command: ${site.build_settings?.cmd || 'not set'}`);
    console.log(`  Publish directory: ${site.build_settings?.dir || '(empty)'}`);

    // Update to remove publish directory
    const updateOptions = {
      hostname: 'api.netlify.com',
      path: `/api/v1/sites/${siteId}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const updateData = JSON.stringify({
      build_settings: {
        cmd: site.build_settings?.cmd || 'npm run build',
        dir: null  // Remove publish directory
      }
    });

    const updateReq = https.request(updateOptions, (updateRes) => {
      let updateData = '';

      updateRes.on('data', (chunk) => {
        updateData += chunk;
      });

      updateRes.on('end', () => {
        if (updateRes.statusCode >= 200 && updateRes.statusCode < 300) {
          const updated = JSON.parse(updateData);
          console.log('\n✅ Successfully removed publish directory!');
          console.log('\nNew build settings:');
          console.log(`  Build command: ${updated.build_settings?.cmd || 'not set'}`);
          console.log(`  Publish directory: (empty)`);
          console.log('\nYou can now deploy with: netlify deploy --prod');
        } else {
          console.error(`\n❌ Error updating site: ${updateRes.statusCode}`);
          console.error(updateData);
          console.log('\nYou can also manually remove it from the Netlify UI:');
          console.log('  1. Go to Site settings → Build & deploy → Build settings');
          console.log('  2. Clear the "Publish directory" field');
          console.log('  3. Click Save');
          process.exit(1);
        }
      });
    });

    updateReq.on('error', (error) => {
      console.error(`❌ Request error: ${error.message}`);
      process.exit(1);
    });

    updateReq.write(updateData);
    updateReq.end();
  });
});

req.on('error', (error) => {
  console.error(`❌ Request error: ${error.message}`);
  process.exit(1);
});

req.end();

