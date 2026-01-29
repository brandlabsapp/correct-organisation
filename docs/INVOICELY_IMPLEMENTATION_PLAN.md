# Invoicely Implementation Plan

## Overview

This document outlines the detailed plan for implementing an Invoicely-like financial management module within the Correct App. The implementation will be modular, independent, and non-disruptive to existing functionality.

## Implementation Status

**Phase 1 - Foundation (COMPLETED)**
- [x] All entities created with `Finance` prefix
- [x] Projects module created (cross-cutting concern)
- [x] Finance module structure set up
- [x] Clients module (CRUD complete)
- [x] Invoices module (CRUD + payments + activities complete)
- [x] FY-based invoice numbering (INV-FY2526-0001, EXP-FY2526-0001)
- [x] Sequence service for FY-based numbering
- [x] Database providers configured
- [x] Backend build successful

**Phase 2 - Core Features (COMPLETED)**
- [x] Bills service (full CRUD + payments)
- [x] Estimates service (full CRUD + convert to invoice)
- [x] Dashboard/Reports service (metrics, revenue charts, activity)
- [x] Settings service (tax rates, saved items)
- [x] Settings controller and DTOs

**Phase 3 - Frontend (COMPLETED)**
- [x] Finance layout with sidebar navigation
- [x] Dashboard page with metrics and activity
- [x] Invoices list with filters and actions
- [x] Invoice form for creating invoices
- [x] Invoice detail/preview page with payment recording
- [x] Bills list page
- [x] Bill form for creating/editing bills
- [x] Estimates list with convert to invoice
- [x] Estimate form for creating/editing estimates
- [x] Clients list with CRUD dialog
- [x] Settings page (general, tax rates, saved items, bank details)
- [x] Reports page with revenue charts and accounts views
- [x] Shared EmptyState component with type-specific illustrations
- [x] Loading skeletons for all pages

**Phase 4 - Advanced Features (COMPLETED)**
- [x] Invoice edit page with data loading
- [x] Bill detail page with payment recording
- [x] Bill edit page
- [x] Estimate detail page with convert to invoice
- [x] Estimate edit page
- [x] PDF generation (print-to-PDF approach)
- [x] CSV export for invoices, bills, estimates, clients, reports
- [x] Recurring invoice profiles (create, pause, resume, delete)
- [x] Recurring invoices list page

**Remaining Tasks (Future Enhancement):**
- [ ] Email integration (send invoice, reminders)
- [ ] Advanced filtering (date range pickers)
- [ ] Server-side PDF generation
- [ ] Mobile app optimizations

---

## Table of Contents

1. [Feature Analysis](#1-feature-analysis)
2. [Module Architecture](#2-module-architecture)
3. [Database Schema Design](#3-database-schema-design)
4. [API Design](#4-api-design)
5. [Frontend Components](#5-frontend-components)
6. [Implementation Phases](#6-implementation-phases)
7. [Technical Considerations](#7-technical-considerations)

---

## 1. Feature Analysis

Based on the Invoicely screenshots, we need to implement the following modules:

### 1.1 Core Modules

| Module | Description | Priority |
|--------|-------------|----------|
| **Dashboard** | Financial overview with metrics, charts, activity log | P1 |
| **Invoices** | Create, send, track invoices | P0 |
| **Bills** | Track expenses and vendor bills | P1 |
| **Estimates** | Quotes and proposals | P2 |
| **Clients** | Customer/vendor management | P0 |
| **Reports** | Financial reporting | P2 |
| **Business Settings** | Configure business info, taxes, templates | P1 |

### 1.2 Invoice Features (from screenshots)

- **Invoice Creation**
  - Custom invoice numbering (e.g., EXP-22, INV-9)
  - Multi-currency support (INR, USD)
  - Line items with description, quantity, rate, amount
  - Tax calculations (GST 18%)
  - SAC/HSN codes
  - Custom notes and footers
  - Logo upload
  - Due date management

- **Invoice Actions**
  - Mark as Paid/Sent/Draft
  - Send Reminder
  - Send Invoice (email)
  - Download as PDF
  - View Activity
  - Post Comments
  - Manage Payments (partial payments)
  - Duplicate Invoice
  - Duplicate as Recurring
  - Cancel/Archive/Delete

- **Invoice List**
  - Tabs: Invoices, Recurring Profiles
  - Filters: Archived, All, Draft, Paid, Unpaid, Overdue
  - Search functionality
  - Bulk actions

### 1.3 Dashboard Metrics (from screenshots)

- Total Outstanding
- Total Overdue
- Total Collected this Year
- Number of Clients
- Invoiced/Received Chart (bar chart by month)
- Invoice Summary (donut chart: Invoiced, Received, Outstanding)
- Invoiced vs Expenses (line chart)
- Accounts Receivable breakdown
- Accounts Payable breakdown
- Recent Activity Log

---

## 2. Module Architecture

### 2.1 Directory Structure

```
correct-backend/src/
└── finance/                          # New independent module
    ├── finance.module.ts
    ├── finance.controller.ts
    │
    ├── clients/                      # Client/Vendor management
    │   ├── clients.module.ts
    │   ├── clients.controller.ts
    │   ├── clients.service.ts
    │   ├── clients.provider.ts
    │   ├── dto/
    │   │   ├── create-client.dto.ts
    │   │   └── update-client.dto.ts
    │   └── entities/
    │       └── client.entity.ts
    │
    ├── invoices/                     # Invoice management
    │   ├── invoices.module.ts
    │   ├── invoices.controller.ts
    │   ├── invoices.service.ts
    │   ├── invoices.provider.ts
    │   ├── dto/
    │   │   ├── create-invoice.dto.ts
    │   │   ├── update-invoice.dto.ts
    │   │   └── invoice-filters.dto.ts
    │   └── entities/
    │       ├── invoice.entity.ts
    │       ├── invoice-item.entity.ts
    │       ├── invoice-payment.entity.ts
    │       └── recurring-profile.entity.ts
    │
    ├── bills/                        # Bills/Expenses management
    │   ├── bills.module.ts
    │   ├── bills.controller.ts
    │   ├── bills.service.ts
    │   ├── bills.provider.ts
    │   ├── dto/
    │   └── entities/
    │       ├── bill.entity.ts
    │       └── bill-item.entity.ts
    │
    ├── estimates/                    # Estimates/Quotes
    │   ├── estimates.module.ts
    │   ├── estimates.controller.ts
    │   ├── estimates.service.ts
    │   ├── estimates.provider.ts
    │   ├── dto/
    │   └── entities/
    │       └── estimate.entity.ts
    │
    ├── settings/                     # Finance settings
    │   ├── settings.module.ts
    │   ├── settings.controller.ts
    │   ├── settings.service.ts
    │   ├── dto/
    │   └── entities/
    │       ├── finance-settings.entity.ts
    │       ├── tax-rate.entity.ts
    │       ├── payment-term.entity.ts
    │       └── saved-item.entity.ts
    │
    ├── reports/                      # Financial reports
    │   ├── reports.module.ts
    │   ├── reports.controller.ts
    │   └── reports.service.ts
    │
    └── shared/                       # Shared utilities
        ├── pdf-generator.service.ts
        ├── email-templates/
        └── constants/
            ├── currencies.ts
            └── tax-codes.ts
```

### 2.2 Frontend Structure

```
correct-app/
├── app/
│   └── (company)/
│       └── finance/                  # Finance routes
│           ├── page.tsx              # Dashboard
│           ├── layout.tsx            # Finance layout with sidebar
│           ├── invoices/
│           │   ├── page.tsx          # Invoice list
│           │   ├── new/
│           │   │   └── page.tsx      # Create invoice
│           │   └── [id]/
│           │       └── page.tsx      # Invoice detail
│           ├── bills/
│           │   ├── page.tsx
│           │   ├── new/
│           │   │   └── page.tsx
│           │   └── [id]/
│           │       └── page.tsx
│           ├── estimates/
│           │   ├── page.tsx
│           │   ├── new/
│           │   │   └── page.tsx
│           │   └── [id]/
│           │       └── page.tsx
│           ├── clients/
│           │   ├── page.tsx
│           │   └── [id]/
│           │       └── page.tsx
│           ├── reports/
│           │   └── page.tsx
│           └── settings/
│               └── page.tsx
│
└── components/
    └── finance/                      # Finance components
        ├── dashboard/
        │   ├── FinanceDashboard.tsx
        │   ├── MetricsCard.tsx
        │   ├── ActivityLog.tsx
        │   ├── InvoiceSummaryChart.tsx
        │   └── RevenueChart.tsx
        ├── invoices/
        │   ├── InvoiceList.tsx
        │   ├── InvoiceForm.tsx
        │   ├── InvoiceDetail.tsx
        │   ├── InvoicePreview.tsx
        │   ├── InvoiceActions.tsx
        │   ├── LineItemsTable.tsx
        │   └── RecurringProfiles.tsx
        ├── bills/
        │   ├── BillList.tsx
        │   ├── BillForm.tsx
        │   └── BillDetail.tsx
        ├── estimates/
        │   ├── EstimateList.tsx
        │   ├── EstimateForm.tsx
        │   └── EstimateDetail.tsx
        ├── clients/
        │   ├── ClientList.tsx
        │   ├── ClientForm.tsx
        │   └── ClientDetail.tsx
        ├── shared/
        │   ├── FinanceSidebar.tsx
        │   ├── CurrencySelect.tsx
        │   ├── TaxCalculator.tsx
        │   └── DocumentNumberGenerator.tsx
        └── settings/
            ├── BusinessInfoForm.tsx
            ├── TaxSettings.tsx
            └── PaymentIntegrations.tsx
```

---

## 3. Database Schema Design

### 3.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ CompanyDetails  │       │  FinanceClient  │       │ FinanceInvoice  │
│ (existing)      │◄──────│                 │◄──────│                 │
│                 │       │ - companyId     │       │ - clientId      │
│                 │       │ - name          │       │ - companyId     │
│                 │       │ - email         │       │ - invoiceNo     │
│                 │       │ - phone         │       │ - status        │
│                 │       │ - taxId         │       │ - totalAmount   │
│                 │       │ - panNumber     │       │ - dueDate       │
└─────────────────┘       │ - address       │       │ - currency      │
                          └─────────────────┘       └────────┬────────┘
                                   │                         │
                                   │                         │
                          ┌────────▼────────┐       ┌────────▼────────┐
                          │  FinanceBill    │       │ InvoiceLineItem │
                          │                 │       │                 │
                          │ - vendorId      │       │ - invoiceId     │
                          │ - companyId     │       │ - description   │
                          │ - billNo        │       │ - quantity      │
                          │ - status        │       │ - rate          │
                          │ - totalAmount   │       │ - amount        │
                          └─────────────────┘       │ - taxRate       │
                                                    │ - sacCode       │
                                                    └─────────────────┘
```

### 3.2 Detailed Entity Schemas

#### 3.2.1 FinanceClient Entity

```typescript
// finance/clients/entities/client.entity.ts
@Table({ tableName: 'FinanceClients', paranoid: true })
export class FinanceClient extends Model<FinanceClient> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  // Client Type
  @Column({ type: DataType.ENUM('customer', 'vendor', 'both'), defaultValue: 'customer' })
  clientType: 'customer' | 'vendor' | 'both';

  // Basic Info
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING })
  contactPerson: string;

  // Address
  @Column({ type: DataType.TEXT })
  billingAddress: string;

  @Column({ type: DataType.STRING })
  city: string;

  @Column({ type: DataType.STRING })
  state: string;

  @Column({ type: DataType.STRING })
  country: string;

  @Column({ type: DataType.STRING })
  postalCode: string;

  // Tax Information
  @Column({ type: DataType.STRING })
  gstNumber: string;

  @Column({ type: DataType.STRING })
  panNumber: string;

  @Column({ type: DataType.STRING })
  taxId: string;

  // Preferences
  @Column({ type: DataType.STRING, defaultValue: 'INR' })
  defaultCurrency: string;

  @Column({ type: DataType.INTEGER, defaultValue: 30 })
  defaultPaymentTerms: number; // days

  @Column({ type: DataType.TEXT })
  notes: string;

  // Status
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isArchived: boolean;

  // Relationships
  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @HasMany(() => FinanceInvoice)
  invoices: FinanceInvoice[];

  @HasMany(() => FinanceBill)
  bills: FinanceBill[];
}
```

#### 3.2.2 FinanceInvoice Entity

```typescript
// finance/invoices/entities/invoice.entity.ts
@Table({ tableName: 'FinanceInvoices', paranoid: true })
export class FinanceInvoice extends Model<FinanceInvoice> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  @ForeignKey(() => FinanceClient)
  @Column({ type: DataType.UUID })
  clientId: string;

  // Invoice Details
  @Column({ type: DataType.STRING, allowNull: false })
  invoiceNumber: string; // e.g., INV-001, EXP-22

  @Column({ type: DataType.STRING })
  title: string; // e.g., "Invoice", "Tax Invoice"

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.STRING })
  purchaseOrderNumber: string;

  // Dates
  @Column({ type: DataType.DATEONLY, allowNull: false })
  invoiceDate: Date;

  @Column({ type: DataType.DATEONLY })
  dueDate: Date;

  @Column({ type: DataType.STRING })
  paymentTerms: string; // 'due_on_receipt', 'net_15', 'net_30', etc.

  // Status
  @Column({ 
    type: DataType.ENUM('draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled'),
    defaultValue: 'draft'
  })
  status: string;

  // Currency & Amounts
  @Column({ type: DataType.STRING, defaultValue: 'INR' })
  currency: string;

  @Column({ type: DataType.STRING, defaultValue: 'en-IN' })
  language: string;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  subtotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  taxTotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  discountTotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  shippingTotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  totalAmount: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  paidAmount: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  balanceDue: number;

  // Notes
  @Column({ type: DataType.TEXT })
  notes: string;

  @Column({ type: DataType.TEXT })
  footerNotes: string;

  @Column({ type: DataType.TEXT })
  internalNotes: string;

  // Recurring
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRecurring: boolean;

  @ForeignKey(() => RecurringProfile)
  @Column({ type: DataType.UUID })
  recurringProfileId: string;

  // PDF & Links
  @Column({ type: DataType.STRING })
  pdfUrl: string;

  @Column({ type: DataType.STRING })
  publicLink: string;

  // Tracking
  @Column({ type: DataType.DATE })
  sentAt: Date;

  @Column({ type: DataType.DATE })
  viewedAt: Date;

  @Column({ type: DataType.DATE })
  paidAt: Date;

  // Relationships
  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @BelongsTo(() => FinanceClient)
  client: FinanceClient;

  @HasMany(() => InvoiceLineItem)
  lineItems: InvoiceLineItem[];

  @HasMany(() => InvoicePayment)
  payments: InvoicePayment[];

  @HasMany(() => InvoiceActivity)
  activities: InvoiceActivity[];
}
```

#### 3.2.3 FinanceInvoiceLineItem Entity

```typescript
// finance/invoices/entities/finance-invoice-item.entity.ts
@Table({ tableName: 'FinanceInvoiceLineItems', paranoid: true })
export class FinanceInvoiceLineItem extends Model<FinanceInvoiceLineItem> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => FinanceInvoice)
  @Column({ type: DataType.UUID, allowNull: false })
  invoiceId: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sortOrder: number;

  // Item Details
  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.DECIMAL(15, 4), defaultValue: 1 })
  quantity: number;

  @Column({ type: DataType.STRING, defaultValue: 'unit' })
  unit: string; // unit, hour, day, etc.

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  rate: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  amount: number;

  // Tax
  @Column({ type: DataType.STRING })
  sacCode: string; // SAC code for services

  @Column({ type: DataType.STRING })
  hsnCode: string; // HSN code for goods

  @Column({ type: DataType.STRING })
  taxName: string; // e.g., "GST"

  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 0 })
  taxRate: number; // e.g., 18.00

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  taxAmount: number;

  // Discount
  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 0 })
  discountPercent: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  discountAmount: number;

  // Final
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  totalAmount: number;

  // Saved Item Reference
  @ForeignKey(() => SavedItem)
  @Column({ type: DataType.UUID })
  savedItemId: string;

  // Relationships
  @BelongsTo(() => FinanceInvoice)
  invoice: FinanceInvoice;
}
```

#### 3.2.4 FinanceInvoicePayment Entity

```typescript
// finance/invoices/entities/finance-invoice-payment.entity.ts
@Table({ tableName: 'FinanceInvoicePayments', paranoid: true })
export class FinanceInvoicePayment extends Model<FinanceInvoicePayment> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => FinanceInvoice)
  @Column({ type: DataType.UUID, allowNull: false })
  invoiceId: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  amount: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  paymentDate: Date;

  @Column({ 
    type: DataType.ENUM('cash', 'bank_transfer', 'upi', 'cheque', 'card', 'other'),
    defaultValue: 'bank_transfer'
  })
  paymentMethod: string;

  @Column({ type: DataType.STRING })
  referenceNumber: string;

  @Column({ type: DataType.TEXT })
  notes: string;

  // Relationships
  @BelongsTo(() => FinanceInvoice)
  invoice: FinanceInvoice;
}
```

#### 3.2.5 FinanceRecurringProfile Entity

```typescript
// finance/invoices/entities/finance-recurring-profile.entity.ts
@Table({ tableName: 'FinanceRecurringProfiles', paranoid: true })
export class FinanceRecurringProfile extends Model<FinanceRecurringProfile> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  @ForeignKey(() => FinanceClient)
  @Column({ type: DataType.UUID, allowNull: false })
  clientId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  profileName: string;

  // Schedule
  @Column({ 
    type: DataType.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly'),
    defaultValue: 'monthly'
  })
  frequency: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  interval: number; // Every X days/weeks/months

  @Column({ type: DataType.DATEONLY, allowNull: false })
  startDate: Date;

  @Column({ type: DataType.DATEONLY })
  endDate: Date;

  @Column({ type: DataType.DATE })
  nextInvoiceDate: Date;

  // Template
  @Column({ type: DataType.JSONB })
  invoiceTemplate: object; // Stores the invoice structure

  // Status
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  invoicesGenerated: number;

  // Auto Actions
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  autoSend: boolean;

  @Column({ type: DataType.INTEGER })
  sendDaysBeforeDue: number;
}
```

#### 3.2.6 FinanceBill Entity

```typescript
// finance/bills/entities/bill.entity.ts
@Table({ tableName: 'FinanceBills', paranoid: true })
export class FinanceBill extends Model<FinanceBill> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  @ForeignKey(() => FinanceClient)
  @Column({ type: DataType.UUID })
  vendorId: string; // Client acting as vendor

  // Bill Details
  @Column({ type: DataType.STRING, allowNull: false })
  billNumber: string;

  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.STRING })
  vendorInvoiceNumber: string; // Original invoice number from vendor

  // Dates
  @Column({ type: DataType.DATEONLY, allowNull: false })
  billDate: Date;

  @Column({ type: DataType.DATEONLY })
  dueDate: Date;

  // Status
  @Column({ 
    type: DataType.ENUM('draft', 'unpaid', 'paid', 'partially_paid', 'overdue', 'cancelled'),
    defaultValue: 'draft'
  })
  status: string;

  // Currency & Amounts (similar to Invoice)
  @Column({ type: DataType.STRING, defaultValue: 'INR' })
  currency: string;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  subtotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  taxTotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  totalAmount: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  paidAmount: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  balanceDue: number;

  @Column({ type: DataType.TEXT })
  notes: string;

  // Attachment
  @Column({ type: DataType.STRING })
  attachmentUrl: string;

  // Relationships
  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @BelongsTo(() => FinanceClient, 'vendorId')
  vendor: FinanceClient;

  @HasMany(() => BillLineItem)
  lineItems: BillLineItem[];

  @HasMany(() => BillPayment)
  payments: BillPayment[];
}
```

#### 3.2.7 FinanceEstimate Entity

```typescript
// finance/estimates/entities/estimate.entity.ts
@Table({ tableName: 'FinanceEstimates', paranoid: true })
export class FinanceEstimate extends Model<FinanceEstimate> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  @ForeignKey(() => FinanceClient)
  @Column({ type: DataType.UUID })
  clientId: string;

  // Estimate Details
  @Column({ type: DataType.STRING, allowNull: false })
  estimateNumber: string;

  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.TEXT })
  description: string;

  // Dates
  @Column({ type: DataType.DATEONLY, allowNull: false })
  estimateDate: Date;

  @Column({ type: DataType.DATEONLY })
  expiryDate: Date;

  // Status
  @Column({ 
    type: DataType.ENUM('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'),
    defaultValue: 'draft'
  })
  status: string;

  // Currency & Amounts
  @Column({ type: DataType.STRING, defaultValue: 'INR' })
  currency: string;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  subtotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  taxTotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  totalAmount: number;

  @Column({ type: DataType.TEXT })
  notes: string;

  @Column({ type: DataType.TEXT })
  termsAndConditions: string;

  // Conversion
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  convertedToInvoice: boolean;

  @ForeignKey(() => FinanceInvoice)
  @Column({ type: DataType.UUID })
  invoiceId: string;

  // Relationships
  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @BelongsTo(() => FinanceClient)
  client: FinanceClient;

  @HasMany(() => EstimateLineItem)
  lineItems: EstimateLineItem[];
}
```

#### 3.2.8 FinanceSettings Entity

```typescript
// finance/settings/entities/finance-settings.entity.ts
@Table({ tableName: 'FinanceSettings', paranoid: true })
export class FinanceSettings extends Model<FinanceSettings> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  companyId: number;

  // Number Formats
  @Column({ type: DataType.STRING, defaultValue: 'INV-' })
  invoicePrefix: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  invoiceNextNumber: number;

  @Column({ type: DataType.STRING, defaultValue: 'BIL-' })
  billPrefix: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  billNextNumber: number;

  @Column({ type: DataType.STRING, defaultValue: 'EST-' })
  estimatePrefix: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  estimateNextNumber: number;

  // Defaults
  @Column({ type: DataType.STRING, defaultValue: 'INR' })
  defaultCurrency: string;

  @Column({ type: DataType.STRING, defaultValue: 'en-IN' })
  defaultLanguage: string;

  @Column({ type: DataType.INTEGER, defaultValue: 30 })
  defaultPaymentTerms: number;

  // Tax Settings
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  enableGst: boolean;

  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 18 })
  defaultGstRate: number;

  // Branding
  @Column({ type: DataType.STRING })
  logoUrl: string;

  @Column({ type: DataType.STRING })
  primaryColor: string;

  @Column({ type: DataType.STRING })
  accentColor: string;

  // Default Notes
  @Column({ type: DataType.TEXT })
  defaultInvoiceNotes: string;

  @Column({ type: DataType.TEXT })
  defaultInvoiceFooter: string;

  @Column({ type: DataType.TEXT })
  defaultEstimateTerms: string;

  // Email Settings
  @Column({ type: DataType.STRING })
  invoiceEmailSubject: string;

  @Column({ type: DataType.TEXT })
  invoiceEmailBody: string;

  // Relationships
  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;
}
```

#### 3.2.9 FinanceTaxRate Entity

```typescript
// finance/settings/entities/finance-tax-rate.entity.ts
@Table({ tableName: 'FinanceTaxRates', paranoid: true })
export class FinanceTaxRate extends Model<FinanceTaxRate> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string; // e.g., "GST 18%", "GST 12%"

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  rate: number;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isDefault: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;
}
```

#### 3.2.10 FinanceSavedItem Entity

```typescript
// finance/settings/entities/finance-saved-item.entity.ts
@Table({ tableName: 'FinanceSavedItems', paranoid: true })
export class FinanceSavedItem extends Model<FinanceSavedItem> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  @Column({ type: DataType.ENUM('product', 'service'), defaultValue: 'service' })
  itemType: 'product' | 'service';

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  rate: number;

  @Column({ type: DataType.STRING, defaultValue: 'unit' })
  unit: string;

  @Column({ type: DataType.STRING })
  sacCode: string;

  @Column({ type: DataType.STRING })
  hsnCode: string;

  @ForeignKey(() => TaxRate)
  @Column({ type: DataType.UUID })
  defaultTaxRateId: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;
}
```

#### 3.2.11 Project Entity (Cross-Module)

```typescript
// projects/entities/project.entity.ts
// NOTE: Projects is a cross-cutting concern, not just finance
@Table({ tableName: 'Projects', paranoid: true })
export class Project extends Model<Project> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  @ForeignKey(() => FinanceClient)
  @Column({ type: DataType.UUID })
  clientId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING })
  code: string; // Short code like "PRJ-001"

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ 
    type: DataType.ENUM('active', 'completed', 'on_hold', 'cancelled'),
    defaultValue: 'active'
  })
  status: string;

  @Column({ type: DataType.DATEONLY })
  startDate: Date;

  @Column({ type: DataType.DATEONLY })
  endDate: Date;

  @Column({ type: DataType.DECIMAL(15, 2) })
  budget: number;

  @Column({ type: DataType.STRING, defaultValue: 'INR' })
  currency: string;

  @Column({ type: DataType.JSONB })
  metadata: object;

  // Relationships
  @BelongsTo(() => CompanyDetails)
  company: CompanyDetails;

  @BelongsTo(() => FinanceClient)
  client: FinanceClient;

  @HasMany(() => FinanceInvoice)
  invoices: FinanceInvoice[];

  @HasMany(() => FinanceBill)
  bills: FinanceBill[];
}
```

#### 3.2.12 FinanceInvoiceActivity Entity

```typescript
// finance/invoices/entities/finance-invoice-activity.entity.ts
@Table({ tableName: 'FinanceInvoiceActivities', paranoid: true })
export class FinanceInvoiceActivity extends Model<FinanceInvoiceActivity> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => FinanceInvoice)
  @Column({ type: DataType.UUID, allowNull: false })
  invoiceId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ 
    type: DataType.ENUM(
      'created', 'updated', 'sent', 'viewed', 'payment_received', 
      'reminder_sent', 'commented', 'status_changed', 'downloaded'
    ),
    allowNull: false
  })
  activityType: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.JSONB })
  metadata: object;

  // Relationships
  @BelongsTo(() => FinanceInvoice)
  invoice: FinanceInvoice;

  @BelongsTo(() => User)
  user: User;
}
```

---

## 4. API Design

### 4.1 API Endpoints

#### Clients API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/clients` | List all clients |
| GET | `/api/finance/clients/:id` | Get client details |
| POST | `/api/finance/clients` | Create new client |
| PUT | `/api/finance/clients/:id` | Update client |
| DELETE | `/api/finance/clients/:id` | Delete client |
| GET | `/api/finance/clients/:id/invoices` | Get client's invoices |
| GET | `/api/finance/clients/:id/bills` | Get client's bills |
| GET | `/api/finance/clients/:id/statement` | Get client statement |

#### Invoices API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/invoices` | List invoices (with filters) |
| GET | `/api/finance/invoices/:id` | Get invoice details |
| POST | `/api/finance/invoices` | Create invoice |
| PUT | `/api/finance/invoices/:id` | Update invoice |
| DELETE | `/api/finance/invoices/:id` | Delete invoice |
| POST | `/api/finance/invoices/:id/send` | Send invoice via email |
| POST | `/api/finance/invoices/:id/mark-sent` | Mark as sent |
| POST | `/api/finance/invoices/:id/mark-paid` | Mark as paid |
| POST | `/api/finance/invoices/:id/payments` | Record payment |
| GET | `/api/finance/invoices/:id/pdf` | Generate/Get PDF |
| POST | `/api/finance/invoices/:id/duplicate` | Duplicate invoice |
| POST | `/api/finance/invoices/:id/reminder` | Send reminder |
| GET | `/api/finance/invoices/:id/activities` | Get activity log |
| POST | `/api/finance/invoices/:id/comments` | Add comment |

#### Recurring Profiles API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/recurring-profiles` | List profiles |
| POST | `/api/finance/recurring-profiles` | Create profile |
| PUT | `/api/finance/recurring-profiles/:id` | Update profile |
| DELETE | `/api/finance/recurring-profiles/:id` | Delete profile |
| POST | `/api/finance/recurring-profiles/:id/pause` | Pause profile |
| POST | `/api/finance/recurring-profiles/:id/resume` | Resume profile |

#### Bills API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/bills` | List bills |
| GET | `/api/finance/bills/:id` | Get bill details |
| POST | `/api/finance/bills` | Create bill |
| PUT | `/api/finance/bills/:id` | Update bill |
| DELETE | `/api/finance/bills/:id` | Delete bill |
| POST | `/api/finance/bills/:id/payments` | Record payment |
| POST | `/api/finance/bills/:id/mark-paid` | Mark as paid |

#### Estimates API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/estimates` | List estimates |
| GET | `/api/finance/estimates/:id` | Get estimate details |
| POST | `/api/finance/estimates` | Create estimate |
| PUT | `/api/finance/estimates/:id` | Update estimate |
| DELETE | `/api/finance/estimates/:id` | Delete estimate |
| POST | `/api/finance/estimates/:id/send` | Send estimate |
| POST | `/api/finance/estimates/:id/convert` | Convert to invoice |
| POST | `/api/finance/estimates/:id/accept` | Mark as accepted |
| POST | `/api/finance/estimates/:id/reject` | Mark as rejected |

#### Reports API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/reports/summary` | Dashboard summary |
| GET | `/api/finance/reports/invoices` | Invoice report |
| GET | `/api/finance/reports/revenue` | Revenue report |
| GET | `/api/finance/reports/expenses` | Expense report |
| GET | `/api/finance/reports/aging` | Aging report |
| GET | `/api/finance/reports/client-statement` | Client statement |
| GET | `/api/finance/reports/tax-summary` | Tax summary |

#### Settings API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/settings` | Get settings |
| PUT | `/api/finance/settings` | Update settings |
| GET | `/api/finance/settings/tax-rates` | List tax rates |
| POST | `/api/finance/settings/tax-rates` | Create tax rate |
| PUT | `/api/finance/settings/tax-rates/:id` | Update tax rate |
| DELETE | `/api/finance/settings/tax-rates/:id` | Delete tax rate |
| GET | `/api/finance/settings/saved-items` | List saved items |
| POST | `/api/finance/settings/saved-items` | Create saved item |
| PUT | `/api/finance/settings/saved-items/:id` | Update saved item |
| DELETE | `/api/finance/settings/saved-items/:id` | Delete saved item |

#### Dashboard API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/finance/dashboard/metrics` | Get key metrics |
| GET | `/api/finance/dashboard/charts/revenue` | Revenue chart data |
| GET | `/api/finance/dashboard/charts/invoice-summary` | Invoice summary |
| GET | `/api/finance/dashboard/activity` | Recent activity |
| GET | `/api/finance/dashboard/receivables` | Accounts receivable |
| GET | `/api/finance/dashboard/payables` | Accounts payable |

---

## 5. Frontend Components

### 5.1 Key Components

#### Dashboard Components

```typescript
// FinanceDashboard.tsx - Main dashboard
// MetricsCards.tsx - Outstanding, Overdue, Collected, Clients
// RevenueChart.tsx - Bar chart (Invoiced/Received by month)
// InvoiceSummaryPie.tsx - Donut chart (Invoiced, Received, Outstanding)
// ExpenseComparisonChart.tsx - Line chart (Invoiced vs Expenses)
// AccountsReceivable.tsx - List of outstanding invoices
// AccountsPayable.tsx - List of unpaid bills
// ActivityLog.tsx - Recent activities
```

#### Invoice Components

```typescript
// InvoiceList.tsx
// - Tabs: Invoices | Recurring Profiles
// - Filters: Archived, All, Draft, Paid, Unpaid, Overdue
// - Search, bulk actions
// - Pagination

// InvoiceForm.tsx
// - Title input (Draft -> Invoice/Tax Invoice)
// - Invoice number
// - Language & Currency selects
// - From (business info) - editable link
// - To (client select) - with "New Client" option
// - Date picker
// - Due date / Payment terms
// - PO Number
// - Line items table (add/remove/reorder)
// - Subtotal, Tax, Discount, Shipping, Total
// - Notes & Footer
// - Save Draft / Save buttons

// LineItemsTable.tsx
// - Description (textarea)
// - Quantity
// - Rate
// - Amount (auto-calculated)
// - Tax select (with SAC code display)
// - Delete row
// - Add new line / Add from saved items

// InvoiceDetail.tsx
// - Preview mode
// - Actions dropdown
// - Activity log
// - Comments section
// - Payment history

// InvoicePreview.tsx
// - Full invoice preview (PDF-like)
// - Print/Download options

// InvoiceActions.tsx
// - Public Preview
// - Mark as Paid/Sent/Draft
// - Send Reminder
// - Send Invoice
// - Download as PDF
// - Invoice Activity
// - Post Comment
// - Manage Payments
// - Duplicate Invoice
// - Duplicate as Recurring
// - Cancel/Archive/Delete
```

#### Shared Components

```typescript
// FinanceSidebar.tsx
// - Dashboard
// - Reports
// - Invoices
// - Bills
// - Estimates
// - Track
// - Clients
// - Business Settings

// CurrencyInput.tsx - Currency-aware input
// TaxSelector.tsx - Tax rate dropdown with preview
// ClientSelector.tsx - Searchable client dropdown
// DateRangePicker.tsx - For reports
// DocumentStatusBadge.tsx - Status badges
// AmountDisplay.tsx - Formatted currency display
```

### 5.2 UI/UX Specifications

Based on Invoicely screenshots:

- **Color Scheme**: White background, dark sidebar, green/teal accents
- **Typography**: Clean, professional fonts
- **Status Colors**:
  - Paid: Green (#22C55E)
  - Overdue: Red (#EF4444)
  - Draft: Gray (#6B7280)
  - Unpaid: Orange (#F97316)
  - Sent: Blue (#3B82F6)
- **Charts**: Use consistent colors for visual clarity
- **Forms**: Card-based layout with clear sections

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1-2)
**Priority: P0**

1. **Database Setup**
   - Create all entity files
   - Set up migrations
   - Configure providers

2. **Core API Structure**
   - Finance module setup
   - Authentication/Authorization integration
   - Base CRUD operations

3. **Client Module**
   - Client entity & API
   - Client list & form components
   - Client-company relationship

4. **Basic Invoice Module**
   - Invoice entity & basic API
   - Invoice list page
   - Simple invoice form

### Phase 2: Invoice Core (Week 3-4)
**Priority: P0**

1. **Complete Invoice CRUD**
   - Line items management
   - Tax calculations
   - Amount calculations

2. **Invoice Form UI**
   - Full form with all fields
   - Line items table
   - Tax & discount handling

3. **Invoice Actions**
   - Status management
   - Mark as paid/sent
   - PDF generation (basic)

4. **Invoice Detail View**
   - Preview component
   - Activity log
   - Payment recording

### Phase 3: Extended Features (Week 5-6)
**Priority: P1**

1. **Bills Module**
   - Bill entity & API
   - Bill CRUD operations
   - Bill list & form

2. **Finance Settings**
   - Settings entity & API
   - Tax rates management
   - Saved items
   - Number sequences

3. **Dashboard**
   - Metrics API
   - Dashboard components
   - Charts integration

4. **Email Integration**
   - Send invoice email
   - Send reminders
   - Email templates

### Phase 4: Advanced Features (Week 7-8)
**Priority: P2**

1. **Estimates Module**
   - Estimate entity & API
   - Convert to invoice

2. **Recurring Invoices**
   - Recurring profile entity
   - Scheduler integration
   - Auto-generation

3. **Reports Module**
   - Report APIs
   - Report generation
   - Export functionality

4. **PDF Generation**
   - Professional PDF templates
   - Customizable branding
   - Download & preview

### Phase 5: Polish & Integration (Week 9-10)
**Priority: P2**

1. **Public Invoice Links**
   - Shareable invoice pages
   - Client payment portal

2. **Advanced Filtering**
   - Complex filters
   - Saved filter views
   - Bulk operations

3. **Mobile Optimization**
   - Responsive forms
   - Mobile-friendly lists

4. **Testing & Documentation**
   - Unit tests
   - Integration tests
   - API documentation

---

## 7. Technical Considerations

### 7.1 Independence from Core App

- All finance tables prefixed with `Finance` or in separate schema
- Finance module is self-contained
- Only dependency on `CompanyDetails` and `User` from core
- No modifications to existing tables

### 7.2 Number Generation Strategy

```typescript
// Document number generation with Financial Year support
// Format: PREFIX-FYXXXX-NNNN
// Examples: 
//   - INV-FY2526-0001 (Indian invoice, FY 2025-26)
//   - EXP-FY2526-0001 (Export invoice, FY 2025-26)
//   - BIL-FY2526-0001 (Bill)
//   - EST-FY2526-0001 (Estimate)

// Get current financial year code (April to March)
function getCurrentFinancialYear(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const year = now.getFullYear();
  
  // Financial year starts in April (month 3)
  // If current month is Jan-Mar, FY started previous year
  const fyStartYear = month < 3 ? year - 1 : year;
  const fyEndYear = fyStartYear + 1;
  
  // Return format: FY2526 (for 2025-26)
  return `FY${String(fyStartYear).slice(-2)}${String(fyEndYear).slice(-2)}`;
}

// Get invoice type prefix based on whether it's domestic or export
function getInvoicePrefix(isExport: boolean): string {
  return isExport ? 'EXP' : 'INV';
}

async function generateInvoiceNumber(
  companyId: number,
  isExport: boolean = false
): Promise<string> {
  const fyCode = getCurrentFinancialYear();
  const prefix = getInvoicePrefix(isExport);
  const sequenceKey = `${prefix.toLowerCase()}NextNumber_${fyCode}`;
  
  // Get or create sequence for this FY
  const sequence = await FinanceSequence.findOrCreate({
    where: { companyId, sequenceKey },
    defaults: { companyId, sequenceKey, nextNumber: 1 }
  });
  
  const nextNumber = sequence[0].nextNumber;
  const paddedNumber = String(nextNumber).padStart(4, '0');
  
  // Update next number
  await sequence[0].update({ nextNumber: nextNumber + 1 });
  
  // Format: INV-FY2526-0001 or EXP-FY2526-0001
  return `${prefix}-${fyCode}-${paddedNumber}`;
}

async function generateDocumentNumber(
  companyId: number,
  documentType: 'bill' | 'estimate'
): Promise<string> {
  const fyCode = getCurrentFinancialYear();
  const prefix = documentType === 'bill' ? 'BIL' : 'EST';
  const sequenceKey = `${prefix.toLowerCase()}NextNumber_${fyCode}`;
  
  const sequence = await FinanceSequence.findOrCreate({
    where: { companyId, sequenceKey },
    defaults: { companyId, sequenceKey, nextNumber: 1 }
  });
  
  const nextNumber = sequence[0].nextNumber;
  const paddedNumber = String(nextNumber).padStart(4, '0');
  
  await sequence[0].update({ nextNumber: nextNumber + 1 });
  
  return `${prefix}-${fyCode}-${paddedNumber}`;
}
```

#### FinanceSequence Entity (for FY-based numbering)

```typescript
@Table({ tableName: 'FinanceSequences', paranoid: true })
export class FinanceSequence extends Model<FinanceSequence> {
  @Column({ type: DataType.UUID, defaultValue: uuidv4, primaryKey: true })
  id: string;

  @ForeignKey(() => CompanyDetails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  companyId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  sequenceKey: string; // e.g., "invNextNumber_FY2526", "expNextNumber_FY2526"

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  nextNumber: number;

  // Unique constraint on companyId + sequenceKey
}
```

### 7.3 Tax Calculation Logic

```typescript
// GST calculation for Indian businesses
interface TaxBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

function calculateGST(
  amount: number,
  rate: number,
  isInterState: boolean
): TaxBreakdown {
  const taxAmount = (amount * rate) / 100;
  
  if (isInterState) {
    return {
      cgst: 0,
      sgst: 0,
      igst: taxAmount,
      total: taxAmount
    };
  }
  
  return {
    cgst: taxAmount / 2,
    sgst: taxAmount / 2,
    igst: 0,
    total: taxAmount
  };
}
```

### 7.4 Currency Support

```typescript
// Supported currencies
const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  // Add more as needed
];

function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return new Intl.NumberFormat(currency?.locale || 'en-IN', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}
```

### 7.5 PDF Generation Options

1. **React-PDF** - Generate PDFs from React components
2. **Puppeteer** - HTML to PDF conversion
3. **PDFKit** - Programmatic PDF generation
4. **External Service** - API-based generation

Recommended: **React-PDF** for consistency with frontend styling

### 7.6 Email Templates

- Invoice sent
- Payment reminder
- Payment received
- Estimate sent
- Estimate accepted/rejected

### 7.7 Security Considerations

- Row-level security by companyId
- Audit logging for all financial operations
- Secure public links with expiry
- PII protection in logs

### 7.8 Performance Optimization

- Index on frequently queried fields (companyId, status, dates)
- Pagination for lists
- Caching for dashboard metrics
- Lazy loading for charts

---

## Appendix A: Sample Invoice JSON Structure

```json
{
  "id": "uuid",
  "invoiceNumber": "INV-202601-0001",
  "companyId": 1,
  "client": {
    "id": "uuid",
    "name": "Yield Guild Games",
    "email": "billing@ygg.com",
    "address": "...",
    "gstNumber": "27AAHCV5244R1ZJ"
  },
  "invoiceDate": "2026-01-28",
  "dueDate": "2026-02-27",
  "status": "sent",
  "currency": "USD",
  "lineItems": [
    {
      "description": "Development Services - January 2026",
      "quantity": 1,
      "rate": 6067.00,
      "amount": 6067.00,
      "taxRate": 0,
      "taxAmount": 0,
      "totalAmount": 6067.00
    }
  ],
  "subtotal": 6067.00,
  "taxTotal": 0,
  "discountTotal": 0,
  "totalAmount": 6067.00,
  "paidAmount": 6067.00,
  "balanceDue": 0,
  "notes": "Bank Details: Kotak Mahindra Bank...",
  "pdfUrl": "https://...",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

## Appendix B: Invoicely Feature Mapping

| Invoicely Feature | Implementation | Notes |
|-------------------|----------------|-------|
| Dashboard | FinanceDashboard | Custom charts |
| Reports | Reports module | Generate & export |
| Invoices | Invoice module | Full CRUD |
| Recurring Profiles | RecurringProfile entity | Scheduler |
| Bills | Bill module | Full CRUD |
| Estimates | Estimate module | Convert to invoice |
| Track | Phase 2 | Time/expense tracking |
| Clients | Client module | Full CRUD |
| Business Settings | Settings module | Comprehensive |
| Payment Integrations | Phase 2 | Razorpay, etc. |

---

## Next Steps

1. Review and approve this plan
2. Create Jira/Linear tickets for each phase
3. Set up database migrations
4. Begin Phase 1 implementation

---

*Document Version: 1.0*
*Created: January 28, 2026*
*Author: AI Assistant*
