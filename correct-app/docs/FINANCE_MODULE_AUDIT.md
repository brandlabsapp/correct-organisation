# Finance Module – End-to-End Audit

**Date:** January 2026  
**Issue:** Creating a client returned **404 Not Found** because the Next.js app had **no API routes** under `/api/finance/`. The frontend calls these URLs, but they were never implemented; the backend (correct-backend) has the logic at `http://localhost:8000/api/v1/finance/*`.

---

## Root cause of the client creation error

1. **Missing API layer in Next.js**  
   There is no `app/api/finance/` directory. All finance requests go to `localhost:3000/api/finance/...` and hit nothing → **404**.

2. **`company=null` in the request**  
   The Network tab showed `POST .../api/finance/clients?company=null`. If the user opens Finance (e.g. Clients) without a company in the URL (e.g. `/finance/clients` instead of `/finance/clients?company=123`), `companyId` is null and the backend would reject the request anyway. **Fix:** Use Finance only with a company selected (e.g. company selector that appends `?company=<id>` to all finance links).

---

## What was fixed

- **Shared proxy**  
  - `lib/finance-proxy.ts` – `buildBackendPath`, `requireCompany`, `proxyToBackend` for consistent forwarding and company validation.

- **Clients API**  
  - `app/api/finance/clients/route.ts` – GET (list), POST (create)
  - `app/api/finance/clients/[id]/route.ts` – GET, PUT, DELETE  
  POST/PUT return **400** when `company` is missing or `"null"`.

- **Invoices API**  
  - List/create, get/update/delete, preview-number, mark-sent, mark-paid, payments, duplicate, activities – all proxied.

- **Bills API**  
  - List/create, get/update/delete, preview-number, mark-paid, payments – all proxied.

- **Estimates API**  
  - List/create, get/update/delete, preview-number, mark-sent, accept, reject, convert-to-invoice – all proxied.

- **Recurring API**  
  - List/create, get/update/delete, pause, resume – all proxied.

- **Dashboard/Reports API**  
  - metrics, activity, invoice-summary, revenue-chart, accounts-receivable, accounts-payable – all proxied.

- **Settings API**  
  - GET/PUT settings, tax-rates (list/create/update/delete), saved-items (list/create/update/delete) – all proxied.

---

## Finance modules and API status

| Module      | Frontend page(s)                         | API endpoints used by frontend                                                                 | Next.js proxy exists? | Backend (correct-backend) |
|------------|-------------------------------------------|-------------------------------------------------------------------------------------------------|------------------------|---------------------------|
| **Dashboard** | `/finance` (FinanceDashboard)            | `GET /api/finance/dashboard/metrics`, `GET /api/finance/dashboard/activity`                   | Yes                    | Yes (`finance/dashboard`) |
| **Invoices**  | list, new, [id], [id]/edit, detail       | list, get one, create, update, delete, preview-number, mark-paid, mark-sent, duplicate, payments | Yes                    | Yes (`finance/invoices`)  |
| **Recurring** | `/finance/recurring`                     | list, create, get one, update, delete, pause, resume; also uses `/api/finance/clients`          | Yes                    | Yes (`finance/recurring`) |
| **Bills**     | list, new, [id], [id]/edit, detail      | list, get one, create, update, delete, preview-number, mark-paid, payments                      | Yes                    | Yes (`finance/bills`)     |
| **Estimates** | list, new, [id], [id]/edit, detail      | list, get one, create, update, delete, preview-number, mark-sent, accept, reject, convert-to-invoice | Yes                    | Yes (`finance/estimates`) |
| **Clients**   | `/finance/clients`                      | list, create, get one, update, delete                                                           | Yes (just added)       | Yes (`finance/clients`)   |
| **Reports**   | `/finance/reports`                      | `GET /api/finance/dashboard/invoice-summary`, revenue-chart, accounts-receivable, accounts-payable | Yes                    | Yes (`finance/dashboard`) |
| **Settings**  | `/finance/settings`                     | GET/PUT settings, tax-rates (list, create, delete), saved-items (list, create, delete)         | Yes                    | Yes (`finance/settings`)  |

---

## API routes – all implemented

All Next.js proxy routes under `correct-app/app/api/finance/` are in place. They use `lib/finance-proxy.ts` and forward to the backend with `company` validation on write operations.

1. **Dashboard**  
   - `dashboard/metrics/route.ts` (GET)  
   - `dashboard/activity/route.ts` (GET)  
   - `dashboard/invoice-summary/route.ts` (GET)  
   - `dashboard/revenue-chart/route.ts` (GET)  
   - `dashboard/accounts-receivable/route.ts` (GET)  
   - `dashboard/accounts-payable/route.ts` (GET)

2. **Invoices**  
   - `invoices/route.ts` (GET, POST)  
   - `invoices/[id]/route.ts` (GET, PUT, DELETE)  
   - `invoices/preview-number/route.ts` (GET)  
   - `invoices/[id]/mark-paid/route.ts` (POST)  
   - `invoices/[id]/mark-sent/route.ts` (POST)  
   - `invoices/[id]/duplicate/route.ts` (POST)  
   - `invoices/[id]/payments/route.ts` (GET, POST)

3. **Recurring**  
   - `recurring/route.ts` (GET, POST)  
   - `recurring/[id]/route.ts` (GET, PUT, DELETE)  
   - `recurring/[id]/pause/route.ts` (POST)  
   - `recurring/[id]/resume/route.ts` (POST)

4. **Bills**  
   - `bills/route.ts` (GET, POST)  
   - `bills/preview-number/route.ts` (GET)  
   - `bills/[id]/route.ts` (GET, PUT, DELETE)  
   - `bills/[id]/mark-paid/route.ts` (POST)  
   - `bills/[id]/payments/route.ts` (GET, POST)

5. **Estimates**  
   - `estimates/route.ts` (GET, POST)  
   - `estimates/preview-number/route.ts` (GET)  
   - `estimates/[id]/route.ts` (GET, PUT, DELETE)  
   - `estimates/[id]/mark-sent/route.ts` (POST)  
   - `estimates/[id]/accept/route.ts` (POST)  
   - `estimates/[id]/reject/route.ts` (POST)  
   - `estimates/[id]/convert-to-invoice/route.ts` (POST)

6. **Settings**  
   - `settings/route.ts` (GET, PUT)  
   - `settings/tax-rates/route.ts` (GET, POST)  
   - `settings/tax-rates/[id]/route.ts` (DELETE or similar)  
   - `settings/saved-items/route.ts` (GET, POST)  
   - `settings/saved-items/[id]/route.ts` (DELETE or similar)

---

## Recommended follow-ups

1. **Ensure company is always set in Finance**  
   - When opening any finance page without `?company=`, redirect or resolve from context (e.g. user’s selected company) and append `?company=<id>` so no request uses `company=null`.

2. **Backend and env**  
   - Ensure correct-backend is running (e.g. port 8000) and that `SERVER_URL` in the Next.js app (used by `lib/axiosInstance.tsx`) points to `http://localhost:8000/api/v1` (or your backend base URL).

---

## Summary

- **All Finance modules:** Next.js proxy routes under `/api/finance/` are implemented for Clients, Invoices, Bills, Estimates, Recurring, Dashboard (reports), and Settings. Each forwards to correct-backend with query/body and validates `company` on write operations.
- **Client creation 404:** Fixed; ensure a company is selected (URL has `?company=<id>`) and the backend is running.
