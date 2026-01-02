#!/usr/bin/env node
/**
 * Diagnostic script to find where publish directory is set
 */

const https = require('https');

const SITE_ID = 'd2e82ec9-d713-4b2f-ad00-d78ecff168f4';
const accessToken = process.argv[2];

if (!accessToken) {
  console.error('❌ Missing access token');
  console.log('\nUsage: node diagnose-publish-setting.js <access-token>');
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

async function diagnose() {
  try {
    console.log('🔍 Diagnosing publish directory setting...\n');
    
    // Get site details
    const site = await makeRequest('GET', '');
    
    console.log('=== Site Build Settings ===');
    console.log(JSON.stringify(site.build_settings, null, 2));
    console.log('\n=== Full Site Object (relevant fields) ===');
    console.log('Build command:', site.build_settings?.cmd || 'not set');
    console.log('Publish directory:', site.build_settings?.dir || '(empty)');
    console.log('Base directory:', site.build_settings?.base_dir || '(empty)');
    console.log('Build image:', site.build_settings?.build_image || '(default)');
    console.log('\n=== Site Info ===');
    console.log('Site ID:', site.id);
    console.log('Site name:', site.name);
    console.log('Account ID:', site.account_id);
    console.log('Team ID:', site.team_id || '(none)');
    
    // Check if there are environment variables
    console.log('\n=== Checking Environment Variables ===');
    try {
      const envVars = await makeRequest('GET', '/env');
      const publishRelated = Object.keys(envVars).filter(key => 
        key.toLowerCase().includes('publish') || 
        key.toLowerCase().includes('dir') ||
        key === 'NETLIFY_PUBLISH_DIR'
      );
      
      if (publishRelated.length > 0) {
        console.log('Found publish-related environment variables:');
        publishRelated.forEach(key => {
          console.log(`  ${key}: ${envVars[key]}`);
        });
      } else {
        console.log('No publish-related environment variables found');
      }
    } catch (e) {
      console.log('Could not fetch environment variables:', e.message);
    }
    
    console.log('\n=== Recommendation ===');
    if (site.build_settings?.dir) {
      console.log('⚠️  Publish directory IS set in build_settings.dir');
      console.log('   Value:', site.build_settings.dir);
      console.log('   This needs to be cleared via the Netlify UI');
    } else {
      console.log('✅ Publish directory is NOT set in build_settings');
      console.log('   But deployment still shows it - might be cached or at team level');
      console.log('   Try: Clear cache in Netlify dashboard');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

diagnose();

