# Expected Finance Tables in Database

Based on the backend code, the following tables should exist:

## Finance Core Tables
1. **FinanceClients** - Customer and vendor information
2. **FinanceInvoices** - Invoice records
3. **FinanceInvoiceLineItems** - Line items for invoices
4. **FinanceInvoicePayments** - Payment records for invoices
5. **FinanceInvoiceActivities** - Activity log for invoices
6. **FinanceRecurringProfiles** - Recurring invoice profiles

## Finance Bills Tables
7. **FinanceBills** - Bill records
8. **FinanceBillLineItems** - Line items for bills
9. **FinanceBillPayments** - Payment records for bills

## Finance Estimates Tables
10. **FinanceEstimates** - Estimate records
11. **FinanceEstimateLineItems** - Line items for estimates

## Finance Settings Tables
12. **FinanceSettings** - Company finance settings
13. **FinanceSequences** - Document numbering sequences
14. **FinanceTaxRates** - Tax rate configurations
15. **FinanceSavedItems** - Saved products/services

## Cross-Cutting Tables
16. **Projects** - Project management (used by finance and other modules)

## Total: 16 New Tables

**Note:** The old `Invoices` table (without Finance prefix) is from a previous implementation and is separate from the new finance module.
