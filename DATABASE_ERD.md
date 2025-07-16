# Mubinyx Database ERD (Entity Relationship Diagram)

## Overview
Database ini menggunakan SQLite dengan Prisma ORM untuk platform investasi Mubinyx.

## ERD Diagram (Mermaid)

```mermaid
erDiagram
    %% Core User Management
    User {
        string id PK
        string email UK
        string password
        string name
        string phone
        string role
        string status
        string referralCode UK
        string referredBy FK
        boolean emailVerified
        boolean twoFactorEnabled
        string twoFactorSecret
        datetime createdAt
        datetime updatedAt
    }

    UserVerification {
        string id PK
        string userId UK,FK
        string documentType
        string documentNumber
        string documentUrl
        string selfieUrl
        string status
        string rejectionReason
        string verifiedBy
        datetime verifiedAt
        datetime createdAt
        datetime updatedAt
    }

    %% Project Management
    ProjectCategory {
        string id PK
        string name
        string slug UK
        string description
        string icon
        datetime createdAt
        datetime updatedAt
    }

    Project {
        string id PK
        string categoryId FK
        string name
        string slug UK
        string description
        string imageUrl
        decimal minInvestment
        decimal maxInvestment
        decimal targetAmount
        decimal collectedAmount
        decimal roiPercentage
        int durationMonths
        datetime startDate
        datetime endDate
        string status
        string riskLevel
        json riskAnalysis
        json financialData
        string documents
        datetime createdAt
        datetime updatedAt
    }

    ProjectUpdate {
        string id PK
        string projectId FK
        string title
        string content
        string attachments
        datetime createdAt
        datetime updatedAt
    }

    ProjectReport {
        string id PK
        string projectId FK
        string title
        string periodType
        datetime periodStart
        datetime periodEnd
        json performanceData
        string summary
        string attachments
        datetime createdAt
    }

    %% Investment System
    Investment {
        string id PK
        string userId FK
        string projectId FK
        decimal amount
        decimal expectedReturn
        datetime startDate
        datetime maturityDate
        string status
        datetime createdAt
        datetime updatedAt
    }

    InvestmentTransaction {
        string id PK
        string investmentId FK
        string type
        decimal amount
        string description
        datetime createdAt
    }

    %% Wallet System
    Wallet {
        string id PK
        string userId UK,FK
        decimal balance
        decimal lockedBalance
        datetime createdAt
        datetime updatedAt
    }

    WalletTransaction {
        string id PK
        string userId FK
        string walletId FK
        string type
        decimal amount
        decimal balanceBefore
        decimal balanceAfter
        string status
        string referenceType
        string referenceId
        string description
        string metadata
        datetime createdAt
        datetime updatedAt
    }

    %% Crypto System
    CryptoNetwork {
        string id PK
        string name
        string symbol
        int chainId
        string rpcUrl
        int confirmations
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    CryptoWallet {
        string id PK
        string networkId FK
        string address
        string type
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    Transaction {
        string id PK
        string userId FK
        string code UK
        string type
        decimal amount
        string status
        datetime createdAt
        datetime updatedAt
    }

    CryptoTransaction {
        string id PK
        string transactionId UK,FK
        string walletId FK
        string networkId FK
        string fromAddress
        string toAddress
        string txHash UK
        decimal amountCrypto
        decimal amountUsd
        decimal exchangeRate
        int confirmations
        datetime createdAt
        datetime updatedAt
    }

    %% Notification System
    Notification {
        string id PK
        string userId FK
        string title
        string message
        string type
        json data
        boolean isRead
        datetime readAt
        datetime createdAt
    }

    %% CMS System
    CmsSettings {
        string id PK
        string key UK
        string value
        string type
        string group
        datetime createdAt
        datetime updatedAt
    }

    CmsContent {
        string id PK
        string section UK
        string title
        string content
        json data
        int order
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    Article {
        string id PK
        string title
        string slug UK
        string content
        string excerpt
        string featuredImage
        string authorId
        string status
        int viewCount
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    %% Relationships
    User ||--o{ User : "referrals"
    User ||--o| UserVerification : "has"
    User ||--o| Wallet : "owns"
    User ||--o{ Investment : "makes"
    User ||--o{ Transaction : "has"
    User ||--o{ WalletTransaction : "performs"
    User ||--o{ Notification : "receives"

    ProjectCategory ||--o{ Project : "contains"
    Project ||--o{ Investment : "receives"
    Project ||--o{ ProjectUpdate : "has"
    Project ||--o{ ProjectReport : "generates"

    Investment ||--o{ InvestmentTransaction : "has"

    Wallet ||--o{ WalletTransaction : "records"

    CryptoNetwork ||--o{ CryptoWallet : "supports"
    CryptoNetwork ||--o{ CryptoTransaction : "processes"
    
    CryptoWallet ||--o{ CryptoTransaction : "handles"
    
    Transaction ||--o| CryptoTransaction : "crypto_details"
```

## Table Descriptions

### 🧑‍💼 **User Management**
- **User**: Core user table with authentication, roles, and referral system
- **UserVerification**: KYC verification documents and status

### 🏗️ **Project Management**
- **ProjectCategory**: Investment project categories (Real Estate, Tech, etc.)
- **Project**: Investment projects with financial details and risk analysis
- **ProjectUpdate**: Regular updates about project progress
- **ProjectReport**: Performance reports for projects

### 💰 **Investment System**
- **Investment**: User investments in projects
- **InvestmentTransaction**: Transaction history for investments

### 👛 **Wallet System**
- **Wallet**: User wallet with balance tracking
- **WalletTransaction**: All wallet transactions (deposits, withdrawals, etc.)

### 🪙 **Crypto System**
- **CryptoNetwork**: Supported blockchain networks
- **CryptoWallet**: Crypto wallet addresses
- **Transaction**: General transaction records
- **CryptoTransaction**: Detailed crypto transaction data

### 🔔 **Communication**
- **Notification**: User notifications system

### 📝 **Content Management**
- **CmsSettings**: Application configuration settings
- **CmsContent**: Dynamic content management
- **Article**: Blog/news articles

## Key Features

### 🔐 **Security Features**
- Two-factor authentication support
- Email verification system
- Role-based access control (USER, ADMIN, SUPER_ADMIN)

### 💳 **Financial Features**
- Multi-decimal precision for amounts
- Balance tracking with before/after states
- Comprehensive transaction logging
- ROI calculation and tracking

### 🌐 **Crypto Integration**
- Multi-network support
- Transaction confirmation tracking
- Exchange rate recording
- Hash verification

### 📊 **Analytics**
- Performance tracking
- Risk analysis storage
- Financial data JSON fields
- View count tracking

## Database Statistics
- **Total Tables**: 16
- **Core Entities**: 16
- **Relationships**: 25+
- **Database Type**: SQLite
- **ORM**: Prisma

---
*Generated on: July 16, 2025*
*Version: 1.0*
