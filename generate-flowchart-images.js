#!/usr/bin/env node

/**
 * Mubinyx Flowchart Image Generator
 * Converts Mermaid flowcharts to images
 */

const fs = require('fs');
const path = require('path');

// Instructions for generating images
const instructions = `
# 📊 Mubinyx Flowchart Image Generator

## 🚀 Quick Methods to Generate Images:

### Method 1: Mermaid Live Editor (Online - Easiest)
1. Go to: https://mermaid.live
2. Copy paste flowchart code from SYSTEM_FLOWCHART.md
3. Click "Download SVG" or "Download PNG"

### Method 2: VS Code Extension
1. Install "Markdown Preview Mermaid Support" extension
2. Open SYSTEM_FLOWCHART.md in VS Code
3. Use preview to see rendered flowcharts
4. Right-click and save images

### Method 3: CLI Tool (Local)
\`\`\`bash
# Install mermaid CLI
npm install -g @mermaid-js/mermaid-cli

# Generate images
mmdc -i SYSTEM_FLOWCHART.md -o flowchart-images/ -t dark
\`\`\`

### Method 4: Online Converters
- Mermaid Live: https://mermaid.live
- Kroki: https://kroki.io
- Draw.io: https://app.diagrams.net (import mermaid)

## 📂 Flowcharts Available:
1. Main System Flow
2. User Registration & Authentication Flow  
3. KYC Verification Flow
4. Investment Flow
5. Wallet & Transaction Flow
6. Admin Transaction Approval Flow
7. Crypto Payment Flow
8. Notification System Flow
9. System Architecture Overview

## 🎨 Export Options:
- PNG (recommended for documents)
- SVG (scalable vector)
- PDF (for presentations)
- JPEG (compressed)

## 💡 Tips:
- Use dark theme for better visibility
- Export in high resolution (300 DPI)
- Consider splitting complex diagrams
- Use SVG for web display
`;

console.log(instructions);

// Generate individual flowchart files for easier image generation
const flowcharts = {
  'main-system-flow': `
flowchart TD
    A[👤 User Access] --> B{Registered?}
    B -->|No| C[📝 Registration]
    B -->|Yes| D[🔐 Login]
    
    C --> E[📧 Email Verification]
    E --> F[✅ Account Activated]
    F --> D
    
    D --> G{Login Success?}
    G -->|No| H[❌ Error Message]
    H --> D
    G -->|Yes| I[🏠 Dashboard]
    
    I --> J{User Role?}
    J -->|USER| K[👤 User Dashboard]
    J -->|ADMIN| L[👨‍💼 Admin Dashboard]
    J -->|SUPER_ADMIN| M[🔧 Super Admin Dashboard]
    
    %% User Flow
    K --> N[Available Features]
    N --> O[📋 KYC Verification]
    N --> P[💰 Wallet Management]
    N --> Q[🏗️ Browse Projects]
    N --> R[📊 My Investments]
    N --> S[🔔 Notifications]
    
    %% Admin Flow
    L --> T[Admin Features]
    T --> U[👥 User Management]
    T --> V[💸 Transaction Approval]
    T --> W[🏗️ Project Management]
    T --> X[📊 Analytics]
    
    %% Super Admin Flow
    M --> Y[Super Admin Features]
    Y --> Z[⚙️ System Settings]
    Y --> AA[🌐 CMS Management]
    Y --> BB[🪙 Crypto Networks]
    Y --> CC[📝 Content Management]
  `,
  
  'registration-flow': `
flowchart TD
    A[👤 New User] --> B[📝 Fill Registration Form]
    B --> C{Valid Data?}
    C -->|No| D[❌ Show Validation Errors]
    D --> B
    C -->|Yes| E[💾 Create User Account]
    E --> F[📧 Send Verification Email]
    F --> G[📱 User Checks Email]
    G --> H[🔗 Click Verification Link]
    H --> I[✅ Email Verified]
    I --> J[🔐 User Can Login]
    
    J --> K[📝 Enter Credentials]
    K --> L{Valid Login?}
    L -->|No| M[❌ Invalid Credentials]
    M --> K
    L -->|Yes| N{2FA Enabled?}
    N -->|No| O[✅ Login Success]
    N -->|Yes| P[📱 Enter 2FA Code]
    P --> Q{Valid 2FA?}
    Q -->|No| R[❌ Invalid 2FA]
    R --> P
    Q -->|Yes| O
    O --> S[🏠 Redirect to Dashboard]
  `,
  
  'kyc-flow': `
flowchart TD
    A[👤 User] --> B[📋 Start KYC Process]
    B --> C[📄 Upload ID Document]
    C --> D[🤳 Upload Selfie]
    D --> E[💾 Submit KYC Data]
    E --> F[⏳ Pending Review]
    F --> G[👨‍💼 Admin Reviews]
    G --> H{KYC Valid?}
    H -->|Yes| I[✅ KYC Approved]
    H -->|No| J[❌ KYC Rejected]
    J --> K[📝 Rejection Reason]
    K --> L[📧 Notify User]
    L --> M[🔄 User Can Resubmit]
    M --> B
    I --> N[📧 Approval Notification]
    N --> O[🎉 Full Platform Access]
  `,
  
  'investment-flow': `
flowchart TD
    A[👤 Verified User] --> B[🏗️ Browse Projects]
    B --> C[📊 View Project Details]
    C --> D{Interested?}
    D -->|No| B
    D -->|Yes| E[💰 Check Investment Limits]
    E --> F{Within Limits?}
    F -->|No| G[⚠️ Show Limit Warning]
    G --> C
    F -->|Yes| H[💳 Enter Investment Amount]
    H --> I{Sufficient Balance?}
    I -->|No| J[💰 Deposit Required]
    J --> K[Top Up Wallet]
    K --> H
    I -->|Yes| L[📝 Confirm Investment]
    L --> M[💾 Create Investment Record]
    M --> N[💸 Deduct from Wallet]
    N --> O[📧 Investment Confirmation]
    O --> P[📊 Track Investment Progress]
  `,
  
  'crypto-payment-flow': `
flowchart TD
    A[👤 User] --> B[🪙 Select Crypto Payment]
    B --> C[🌐 Choose Network]
    C --> D[💰 Enter Amount]
    D --> E[🔗 Generate Wallet Address]
    E --> F[📱 Display QR Code]
    F --> G[👤 User Sends Crypto]
    G --> H[🔄 Monitor Blockchain]
    H --> I{Transaction Found?}
    I -->|No| J[⏳ Keep Monitoring]
    J --> H
    I -->|Yes| K[📊 Check Confirmations]
    K --> L{Enough Confirmations?}
    L -->|No| M[⏳ Wait for More]
    M --> K
    L -->|Yes| N[💱 Calculate USD Value]
    N --> O[💰 Update User Balance]
    O --> P[📧 Payment Confirmation]
    P --> Q[📊 Record Transaction]
  `
};

// Create individual flowchart files
const outputDir = './flowchart-sources';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Object.entries(flowcharts).forEach(([name, content]) => {
  const filename = path.join(outputDir, `${name}.mmd`);
  fs.writeFileSync(filename, content.trim());
  console.log(`✅ Created: ${filename}`);
});

console.log(`\n🎉 Generated ${Object.keys(flowcharts).length} flowchart source files!`);
console.log(`📁 Check the '${outputDir}' folder for individual .mmd files`);
console.log(`\n🚀 Next steps:`);
console.log(`1. Use mermaid CLI: mmdc -i ${outputDir}/main-system-flow.mmd -o images/main-flow.png`);
console.log(`2. Or copy content to https://mermaid.live for online generation`);
