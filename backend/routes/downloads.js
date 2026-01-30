import express from 'express';
import { getDB, generateId, timestamp } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import archiver from 'archiver';
import { Buffer } from 'buffer';

const router = express.Router();

// Get all user purchases (completed transactions)
router.get('/purchases', authenticateToken, async (req, res) => {
  try {
    const db = await getDB();
    const user = db.data.users.find(u => u.id === req.user.id);
    
    let transactions = db.data.transactions.filter(
      t => t.userId === req.user.id && t.type === 'purchase' && t.status === 'completed'
    );

    // EMERGENCY BYPASS FOR DEV TESTING (If database wiped on Render)
    const devEmails = ['davidolagbenro69@gmail.com', 'stxminus@gmail.com', 'davidolagbenro35@gmail.com'];
    if (transactions.length === 0 && user && devEmails.includes(user.email)) {
      console.log('DEV_DEBUG: Triggering Emergency Bypass for', user.email);
      // Create a virtual transaction so they can see the docs
      transactions = [{
        id: 'dev_bypass_' + Date.now(),
        planName: 'Enterprise (Dev Bypass)',
        amount: 0,
        createdAt: new Date().toISOString(),
        downloaded: false
      }];
    }

    // Add download info to each purchase
    const purchases = transactions.map(tx => ({
      id: tx.id,
      planName: tx.planName,
      amount: Math.abs(tx.amount),
      purchasedAt: tx.createdAt,
      downloadToken: Buffer.from(`${tx.id}:${req.user.id}`).toString('base64'),
      downloaded: tx.downloaded || false
    }));

    res.json({ purchases });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Generate and download asset bundle
router.get('/download/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const db = await getDB();
    
    // Find the transaction
    const transaction = db.data.transactions.find(
      t => t.id === transactionId && t.userId === req.user.id && t.type === 'purchase'
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Get user info
    const user = db.data.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate unique API key and tokens
    const apiKey = `oak_${generateId().replace(/-/g, '')}_${Date.now().toString(36)}`;
    const secretToken = `ost_${generateId().replace(/-/g, '')}${generateId().replace(/-/g, '')}`;
    const deploymentId = `dep_${generateId().slice(0, 8)}`;

    // Mark as downloaded
    transaction.downloaded = true;
    transaction.downloadedAt = timestamp();
    transaction.apiKey = apiKey; // Store for reference
    await db.write();

    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="oracle_${transaction.planName.toLowerCase().replace(/\s+/g, '_')}_bundle.zip"`);

    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    // 1. API Configuration File
    const apiConfig = `# Oracle Endpoint API Configuration
# Generated: ${new Date().toISOString()}
# Plan: ${transaction.planName}
# Owner: ${user.email}

API_KEY=${apiKey}
SECRET_TOKEN=${secretToken}
DEPLOYMENT_ID=${deploymentId}
ENVIRONMENT=production
BASE_URL=https://api.oracle-endpoint.com/v1

# Rate Limits
RATE_LIMIT_PER_MINUTE=${transaction.planName === 'Enterprise' ? 10000 : transaction.planName === 'Pro' ? 5000 : transaction.planName === 'Starter' ? 1000 : 100}
RATE_LIMIT_PER_DAY=${transaction.planName === 'Enterprise' ? 1000000 : transaction.planName === 'Pro' ? 500000 : transaction.planName === 'Starter' ? 100000 : 1000}

# Security
SSL_VERIFY=true
TIMEOUT_MS=30000
`;
    archive.append(apiConfig, { name: 'config/.env.production' });

    // 2. Certificate of Ownership
    const certificate = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    ORACLE ENDPOINT - CERTIFICATE OF OWNERSHIP                ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  This certifies that:                                                        ║
║                                                                              ║
║      ${user.name.padEnd(60)}      ║
║      ${user.email.padEnd(60)}      ║
║                                                                              ║
║  Has acquired a lifetime license for:                                        ║
║                                                                              ║
║      Plan: ${transaction.planName.padEnd(56)}      ║
║      Deployment ID: ${deploymentId.padEnd(47)}      ║
║                                                                              ║
║  Purchase Date: ${new Date(transaction.createdAt).toLocaleDateString().padEnd(51)}      ║
║  Transaction ID: ${transaction.id.padEnd(49)}      ║
║                                                                              ║
║  This license grants perpetual access to all features included in the       ║
║  ${transaction.planName} tier as specified at the time of purchase.                      ║
║                                                                              ║
║  Certificate Hash: ${Buffer.from(transaction.id + apiKey).toString('base64').slice(0, 44)}      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;
    archive.append(certificate, { name: 'CERTIFICATE.txt' });

    // 3. Quick Start Guide
    const quickStart = `# Oracle Endpoint Quick Start Guide

## Welcome to ${transaction.planName}!

Thank you for your purchase. This guide will help you get started quickly.

### 1. Installation

\`\`\`bash
npm install @oracle-endpoint/sdk
# or
yarn add @oracle-endpoint/sdk
\`\`\`

### 2. Configuration

Copy the \`.env.production\` file from the \`config/\` folder to your project root and rename it to \`.env\`.

### 3. Initialize the SDK

\`\`\`javascript
import { OracleEndpoint } from '@oracle-endpoint/sdk';

const oracle = new OracleEndpoint({
  apiKey: process.env.API_KEY,
  secretToken: process.env.SECRET_TOKEN,
  deploymentId: process.env.DEPLOYMENT_ID
});

// Test connection
const status = await oracle.ping();
console.log('Connection status:', status);
\`\`\`

### 4. Make Your First API Call

\`\`\`javascript
// Example: Create a new endpoint
const endpoint = await oracle.endpoints.create({
  name: 'my-api',
  type: 'rest',
  config: {
    path: '/api/v1',
    methods: ['GET', 'POST']
  }
});

console.log('Endpoint created:', endpoint.id);
\`\`\`

### 5. Dashboard Access

Access your dashboard at: https://dashboard.oracle-endpoint.com
Login with your registered email: ${user.email}

### Support

- Documentation: https://docs.oracle-endpoint.com
- Support Email: support@oracle-endpoint.com
- Status Page: https://status.oracle-endpoint.com

---
Generated on ${new Date().toISOString()}
Transaction ID: ${transaction.id}
`;
    archive.append(quickStart, { name: 'docs/QUICKSTART.md' });

    // 4. API Reference
    const apiReference = `# Oracle Endpoint API Reference

## Base URL
\`https://api.oracle-endpoint.com/v1\`

## Authentication
All requests must include the API key in the header:
\`\`\`
Authorization: Bearer ${apiKey}
X-Secret-Token: ${secretToken}
\`\`\`

## Endpoints

### Health Check
\`\`\`
GET /health
\`\`\`
Returns the status of your deployment.

### List Endpoints
\`\`\`
GET /endpoints
\`\`\`
Returns all configured endpoints.

### Create Endpoint
\`\`\`
POST /endpoints
Content-Type: application/json

{
  "name": "string",
  "type": "rest|graphql|websocket",
  "config": {}
}
\`\`\`

### Get Endpoint
\`\`\`
GET /endpoints/:id
\`\`\`

### Update Endpoint
\`\`\`
PUT /endpoints/:id
\`\`\`

### Delete Endpoint
\`\`\`
DELETE /endpoints/:id
\`\`\`

### Get Analytics
\`\`\`
GET /analytics
Query params:
  - from: ISO date string
  - to: ISO date string
  - granularity: hour|day|week|month
\`\`\`

### Get Logs
\`\`\`
GET /logs
Query params:
  - endpoint_id: string (optional)
  - level: info|warn|error (optional)
  - limit: number (default: 100)
\`\`\`

## Rate Limits
- ${transaction.planName}: ${transaction.planName === 'Enterprise' ? '10,000' : transaction.planName === 'Pro' ? '5,000' : transaction.planName === 'Starter' ? '1,000' : '100'} requests/minute

## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Rate Limited
- 500: Internal Server Error

---
API Version: v1.0.0
Generated: ${new Date().toISOString()}
`;
    archive.append(apiReference, { name: 'docs/API_REFERENCE.md' });

    // 5. SDK Example Files
    const sdkExample = `// Oracle Endpoint SDK Example
// Plan: ${transaction.planName}
// Generated: ${new Date().toISOString()}

import { OracleEndpoint } from '@oracle-endpoint/sdk';

// Initialize with your credentials
const oracle = new OracleEndpoint({
  apiKey: '${apiKey}',
  secretToken: '${secretToken}',
  deploymentId: '${deploymentId}'
});

// Example 1: Create a REST endpoint
async function createRestEndpoint() {
  const endpoint = await oracle.endpoints.create({
    name: 'user-api',
    type: 'rest',
    config: {
      basePath: '/api/users',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      authentication: 'jwt',
      rateLimit: {
        requests: 100,
        window: '1m'
      }
    }
  });
  
  console.log('REST Endpoint created:', endpoint);
  return endpoint;
}

// Example 2: Set up webhooks
async function setupWebhooks() {
  const webhook = await oracle.webhooks.create({
    url: 'https://your-app.com/webhook',
    events: ['endpoint.created', 'endpoint.updated', 'endpoint.deleted'],
    secret: 'your-webhook-secret'
  });
  
  console.log('Webhook configured:', webhook);
  return webhook;
}

// Example 3: Get analytics
async function getAnalytics() {
  const analytics = await oracle.analytics.get({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    to: new Date(),
    granularity: 'day'
  });
  
  console.log('Analytics:', analytics);
  return analytics;
}

// Run examples
(async () => {
  try {
    await createRestEndpoint();
    await setupWebhooks();
    await getAnalytics();
  } catch (error) {
    console.error('Error:', error);
  }
})();
`;
    archive.append(sdkExample, { name: 'examples/sdk-example.js' });

    // 6. Package.json template
    const packageJson = JSON.stringify({
      name: `oracle-${transaction.planName.toLowerCase().replace(/\s+/g, '-')}-project`,
      version: '1.0.0',
      description: `Oracle Endpoint ${transaction.planName} Project`,
      main: 'index.js',
      type: 'module',
      scripts: {
        start: 'node index.js',
        dev: 'nodemon index.js',
        test: 'jest'
      },
      dependencies: {
        '@oracle-endpoint/sdk': '^1.0.0',
        'dotenv': '^16.0.0'
      },
      devDependencies: {
        'nodemon': '^3.0.0',
        'jest': '^29.0.0'
      },
      author: user.name,
      license: 'MIT'
    }, null, 2);
    archive.append(packageJson, { name: 'examples/package.json' });

    // 7. README with invoice details
    const readme = `# Oracle Endpoint - ${transaction.planName}

## Purchase Details

| Field | Value |
|-------|-------|
| Plan | ${transaction.planName} |
| Amount Paid | ₦${Math.abs(transaction.amount).toLocaleString()} |
| Purchase Date | ${new Date(transaction.createdAt).toLocaleString()} |
| Transaction ID | ${transaction.id} |
| License Type | Lifetime |
| Owner | ${user.name} (${user.email}) |

## Contents

- \`config/\` - Environment configuration files
- \`docs/\` - Documentation and API reference
- \`examples/\` - SDK examples and starter code
- \`CERTIFICATE.txt\` - Your ownership certificate

## Getting Started

1. Read the Quick Start guide in \`docs/QUICKSTART.md\`
2. Copy \`config/.env.production\` to your project
3. Install the SDK: \`npm install @oracle-endpoint/sdk\`
4. Check the examples in \`examples/\`

## Support

For any issues, contact support@oracle-endpoint.com

---

Thank you for choosing Oracle Endpoint!

© ${new Date().getFullYear()} Oracle Endpoint. All rights reserved.
`;
    archive.append(readme, { name: 'README.md' });

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate download' });
    }
  }
});

// Get single purchase details
router.get('/purchase/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const db = await getDB();
    
    const transaction = db.data.transactions.find(
      t => t.id === transactionId && t.userId === req.user.id && t.type === 'purchase'
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const user = db.data.users.find(u => u.id === req.user.id);

    res.json({
      purchase: {
        id: transaction.id,
        planName: transaction.planName,
        amount: Math.abs(transaction.amount),
        purchasedAt: transaction.createdAt,
        downloaded: transaction.downloaded || false,
        downloadedAt: transaction.downloadedAt,
        apiKey: transaction.apiKey ? `${transaction.apiKey.slice(0, 10)}...` : null
      },
      user: {
        name: user?.name,
        email: user?.email
      }
    });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ error: 'Failed to fetch purchase details' });
  }
});

export default router;
