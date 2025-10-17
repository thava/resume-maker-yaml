import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Deploy configuration
const DEPLOY_CONFIG = {
  remoteHost: process.env.DEPLOY_HOST || 'user@example.com',
  remotePath: process.env.DEPLOY_PATH || '/var/www/html/resume',
  buildDir: path.join(__dirname, 'build'),
};

function deploy() {
  console.log('🚀 Starting deployment...\n');

  // Check if build directory exists
  if (!fs.existsSync(DEPLOY_CONFIG.buildDir)) {
    console.error('❌ Build directory not found. Run "pnpm build" first.');
    process.exit(1);
  }

  console.log(`📦 Source: ${DEPLOY_CONFIG.buildDir}`);
  console.log(`🎯 Target: ${DEPLOY_CONFIG.remoteHost}:${DEPLOY_CONFIG.remotePath}\n`);

  try {
    // Placeholder SCP command
    // To customize, set environment variables:
    //   DEPLOY_HOST: SSH connection string (e.g., user@example.com)
    //   DEPLOY_PATH: Remote directory path
    const scpCommand = `scp -r ${DEPLOY_CONFIG.buildDir}/* ${DEPLOY_CONFIG.remoteHost}:${DEPLOY_CONFIG.remotePath}`;

    console.log('📤 Deploy command:');
    console.log(`   ${scpCommand}\n`);

    console.log('💡 To deploy, uncomment the execSync line below and configure your host settings.\n');

    // Uncomment the following line to enable actual deployment:
    // execSync(scpCommand, { stdio: 'inherit' });

    console.log('✅ Deployment configuration ready!');
    console.log('\n📝 To configure deployment:');
    console.log('   1. Set DEPLOY_HOST environment variable (e.g., export DEPLOY_HOST=user@yourserver.com)');
    console.log('   2. Set DEPLOY_PATH environment variable (e.g., export DEPLOY_PATH=/var/www/html/resume)');
    console.log('   3. Uncomment the execSync line in deploy.js');
    console.log('   4. Run: pnpm deploy');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
deploy();
