#!/usr/bin/env node

/**
 * Script to verify Cloudflare R2 environment variables
 * Usage: node scripts/verify-r2-env.js
 * 
 * Note: This script reads from process.env which should be loaded
 * by your environment or .env file loader
 */

// Try to load dotenv if available, otherwise use process.env directly
try {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
} catch (e) {
  // dotenv not available, use process.env directly
  // Variables should be loaded by your environment
}

const requiredVars = {
  CF_ACCESS_KEY_ID: process.env.CF_ACCESS_KEY_ID,
  CF_ACCESS_SECRET: process.env.CF_ACCESS_SECRET,
  CF_ENDPOINT: process.env.CF_ENDPOINT,
  CF_BUCKET: process.env.CF_BUCKET,
};

const optionalVars = {
  CF_REGION: process.env.CF_REGION || 'us-east-1 (default)',
  CF_PUBLIC_ACCESS_URL: process.env.CF_PUBLIC_ACCESS_URL || '(not set)',
  CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID || '(not set)',
};

console.log('\n🔍 Cloudflare R2 Environment Variables Verification\n');
console.log('═'.repeat(60));

// Check required variables
const missingVars = Object.entries(requiredVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.log('\n❌ Missing Required Variables:');
  missingVars.forEach((varName) => {
    console.log(`   ✗ ${varName}`);
  });
  console.log('\n⚠️  Please set these variables in your .env file.');
} else {
  console.log('\n✅ All Required Variables Set:');
  Object.keys(requiredVars).forEach((varName) => {
    const value = requiredVars[varName];
    if (varName === 'CF_ACCESS_SECRET') {
      console.log(`   ✓ ${varName}: ${value ? `${'*'.repeat(Math.min(value.length, 20))}... (${value.length} chars)` : 'Missing'}`);
    } else if (varName === 'CF_ACCESS_KEY_ID') {
      console.log(`   ✓ ${varName}: ${value ? `${value.substring(0, 8)}... (${value.length} chars)` : 'Missing'}`);
    } else {
      console.log(`   ✓ ${varName}: ${value || 'Missing'}`);
    }
  });
}

// Validate endpoint format
if (requiredVars.CF_ENDPOINT) {
  const endpointPattern = /^https:\/\/[a-f0-9]{32}\.r2\.cloudflarestorage\.com$/;
  if (!endpointPattern.test(requiredVars.CF_ENDPOINT)) {
    console.log('\n⚠️  Endpoint Format Warning:');
    console.log(`   Current: ${requiredVars.CF_ENDPOINT}`);
    console.log('   Expected: https://<ACCOUNT_ID>.r2.cloudflarestorage.com');
    console.log('   (32-character hexadecimal Account ID)');
  } else {
    console.log('\n✅ Endpoint Format: Valid');
  }
}

// Validate bucket name
if (requiredVars.CF_BUCKET) {
  const issues = [];
  if (requiredVars.CF_BUCKET !== requiredVars.CF_BUCKET.toLowerCase()) {
    issues.push('contains uppercase letters');
  }
  if (requiredVars.CF_BUCKET.includes(' ')) {
    issues.push('contains spaces');
  }
  if (issues.length > 0) {
    console.log('\n⚠️  Bucket Name Warning:');
    console.log(`   Current: ${requiredVars.CF_BUCKET}`);
    console.log(`   Issues: ${issues.join(', ')}`);
    console.log('   Recommendation: Use lowercase, no spaces');
  } else {
    console.log('\n✅ Bucket Name: Valid');
  }
}

// Check for spaces or quotes in secret
if (requiredVars.CF_ACCESS_SECRET) {
  const issues = [];
  if (requiredVars.CF_ACCESS_SECRET.includes(' ')) {
    issues.push('contains spaces');
  }
  if (requiredVars.CF_ACCESS_SECRET.startsWith('"') || requiredVars.CF_ACCESS_SECRET.endsWith('"')) {
    issues.push('contains quotes');
  }
  if (issues.length > 0) {
    console.log('\n⚠️  Secret Access Key Warning:');
    console.log(`   Issues: ${issues.join(', ')}`);
    console.log('   Recommendation: Remove spaces and quotes from .env file');
  }
}

// Show optional variables
console.log('\n📋 Optional Variables:');
Object.entries(optionalVars).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

console.log('\n' + '═'.repeat(60));
console.log('');

if (missingVars.length > 0) {
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!\n');
  process.exit(0);
}
