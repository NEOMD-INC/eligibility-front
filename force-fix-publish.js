#!/usr/bin/env node
/**
 * FORCE FIX: Aggressively remove publish directory setting
 * This script tries multiple methods to ensure the publish directory is cleared
 */

const https = require('https');

const SITE_ID = 'd2e82ec9-d713-4b2f-ad00-d78ecff168f4';
const accessToken = process.argv[2];

if (!accessToken) {
  console.error('❌ Missing access token');
  console.log('\nUsage: node force-fix-publish.js <access-token>');
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

async function forceFix() {
  try {
    console.log('📡 Fetching current site settings...\n');
    
    const site = await makeRequest('GET', '');
    
    console.log('Current settings:');
    console.log(`  Build command: ${site.build_settings?.cmd || 'not set'}`);
    console.log(`  Publish directory: ${site.build_settings?.dir || '(empty)'}`);
    console.log(`  Base directory: ${site.build_settings?.base_dir || '(empty)'}\n`);

    // Try multiple update methods
    console.log('🔧 Attempting to clear publish directory (trying multiple methods)...\n');

    // Method 1: Set to null
    try {
      await makeRequest('PATCH', '', {
        build_settings: {
          ...site.build_settings,
          dir: null
        }
      });
      console.log('✓ Method 1: Set to null');
    } catch (e) {
      console.log('✗ Method 1 failed:', e.message);
    }

    // Method 2: Set to empty string
    try {
      await makeRequest('PATCH', '', {
        build_settings: {
          ...site.build_settings,
          dir: ""
        }
      });
      console.log('✓ Method 2: Set to empty string');
    } catch (e) {
      console.log('✗ Method 2 failed:', e.message);
    }

    // Method 3: Omit the field entirely
    try {
      const settingsWithoutDir = { ...site.build_settings };
      delete settingsWithoutDir.dir;
      await makeRequest('PATCH', '', {
        build_settings: settingsWithoutDir
      });
      console.log('✓ Method 3: Omitted field');
    } catch (e) {
      console.log('✗ Method 3 failed:', e.message);
    }

    // Verify the change
    console.log('\n📡 Verifying changes...\n');
    const updated = await makeRequest('GET', '');
    
    console.log('Updated settings:');
    console.log(`  Build command: ${updated.build_settings?.cmd || 'not set'}`);
    console.log(`  Publish directory: ${updated.build_settings?.dir || '(empty)'}\n`);

    if (!updated.build_settings?.dir || updated.build_settings.dir === '') {
      console.log('✅ Publish directory successfully cleared!\n');
      console.log('⚠️  NOTE: If the error persists, it may be cached.');
      console.log('   Try: netlify deploy --prod --clear-cache\n');
    } else {
      console.log('⚠️  Publish directory still set. This might be a UI-only setting.');
      console.log('   You must manually remove it from the Netlify UI:\n');
      console.log('   1. Go to: https://app.netlify.com/sites/neo-eligibility/configuration/deploys');
      console.log('   2. Find "Publish directory" in Build settings');
      console.log('   3. Clear it completely');
      console.log('   4. Click Save\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

forceFix();

