# CoFounder Ecosystem Documentation

## 1. System Overview
The **CoFounder Ecosystem** is a monorepo architecture designed to support multiple e-commerce brands under a unified technical infrastructure. It leverages a "One Platform, Many Brands" strategy, allowing for shared UI, business logic, and centralized management while maintaining distinct brand identities.

### Core Architecture
- **Monorepo Manager**: TurboRepo + PNPM Workspaces
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL (Neon) + Prisma 7 ORM
- **Authentication**: NextAuth.js v5 (Moving to centralized Auth)

### Directory Structure
```
/apps
  /bengolsale      # Single-product landing page flow
  /stylehunt       # Single-product landing page flow
  /fruits-zone     # Premium multi-product landing page
  /tuhinscollections      # Full e-commerce store (Flagship - formerly zest-wear)
  /control         # Centralized Admin Dashboard (New)

/packages
  /ui              # Shared UI components (Navbar, Footer, Branding)
  /utils           # Shared logic (Orders, Pricing, WhatsApp)
  /database        # Shared Prisma schema & client (Multi-tenant)
  /auth            # Centralized Authentication logic (In progress)
  /types           # Shared TypeScript definitions
  /config          # Shared configuration (ESLint, TSConfig)
```

---

## 2. Project Status & Features

### 🟢 Active & Stable

#### **tuhinscollections** (Flagship E-commerce - formerly Zest Wear)
- **Type**: Full E-commerce Application
- **Status**: **Stable (Production Ready)**
- **Features Implemented**:
  - Full Product Catalog & Filtering
  - User Authentication (Credentials)
  - Shopping Cart & Wishlist
  - Order Management & Tracking
  - **Cleanup**: Local admin routes removed; managed via Control app.
  - **Infrastructure**: Integrated into Master Database via `brandId: tuhinscollections`.

#### **Fruits Zone** (Premium Landing)
- **Type**: Multi-Product Landing Page
- **Status**: **Stable**
- **Features Implemented**:
  - Premium UI/UX Design (Animations, Glassmorphism)
  - Sticky Checkout Form
  - Ramadan Special Optimizations
  - Dynamic Bill Summary
  - **Infrastructure**: Uses shared `@cofounder/utils` for logic.

#### **BengolSale & StyleHunt** (Single Product)
- **Type**: High-conversion Landing Pages
- **Status**: **Stable**
- **Features Implemented**:
  - Direct WhatsApp Order Flow
  - Simplified Checkout
  - Lightweight UI
  - **Infrastructure**: Standardized on Prisma 7.

### 🟡 In Development

#### **CoFounder Control** (Admin Hub)
- **Type**: Central Management Platform
- **Status**: **Initial Setup Phase**
- **Goal**: A single dashboard to manage products, orders, and users across ALL brands.
- **Current State**:
  - Project initialized (`apps/control`).
  - Multi-tenant Database Schema designed.
  - Basic UI Shell implementation.
  - **Blocker**: Waiting for Master Database Initialization.

---

## 3. Implemented Technical Achievements

### ✅ Standardization
- **Prisma 7 Migration**: All apps and packages upgraded to Prisma v7.3.0.
- **Shared UI**: `@cofounder/ui` serves both Landing Pages (minimal footer) and E-commerce sites (full footer) dynamically.
- **Shared Logic**: `@cofounder/utils` handles currency formatting (`৳`), delivery charge logic (Inside/Outside Dhaka), and WhatsApp message generation for all apps.

### ✅ Authentication & Security
- **Type Safety**: strict TypeScript configuration across the workspace.
- **Input Validation**: `zod` schemas for auth and forms.
- **Phone Validation**: Custom validator for Bangladeshi phone numbers.

---

## 4. Planned Tasks & Roadmap

### Short Term: "Control" Platform Activation
1.  **Master Database Initialization**:
    -   Finalize the `neondb` master instance.
    -   Push the multi-tenant schema (User, Brand, BrandAccess).
    -   Seed initial brand data.
2.  **Data Migration**:
    -   Migrate `Zest Wear` data to the master DB (logically partitioned by `brandId`).
    -   Ensure zero downtime or seamless failover.
3.  **Control Dashboard**:
    -   Connect `Control` to the Master DB.
    -   Implement "Switch Brand" functionality to filter Order/Product views.

### Mid Term: Centralization
1.  **Unified Auth**:
    -   Move `Zest Wear` auth to `packages/auth`.
    -   Enable Single Sign-On (SSO) for admins across brands.
2.  **Unified API**:
    -   Create standard API routes for Inventory Sync.
    -   Centralize File/Image hosting (Cloudinary).

### Long Term: Scaling
1.  **Analytics**: Cross-brand performance reporting.
2.  **Automation**: Automated order confirmation SMS/Email via shared services.

---

## 5. Next Immediate Steps (Action Plan)

1.  **Initialize Master DB**: Resolve the configuration issues preventing the `packages/database` schema push.
2.  **Verify Control App**: Ensure `apps/control` can connect to the new DB.
3.  **Data Sync Strategy**: Plan how to move Zest Wear order data to the new DB without breaking the live site.
