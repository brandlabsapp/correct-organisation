# Correct Organisation Project

This repository contains the complete source code for the Correct Organisation project, including the backend (NestJS), frontend (Next.js), mobile app (React Native), and AI agent (Mastra).

## Repository Structure

-   `correct-backend`: NestJS Backend API
-   `correct-app`: Next.js Frontend Web Application
-   `correct-rn`: React Native Mobile Application
-   `correct-agent-mastra`: Mastra AI Agent Service
-   `docker-compose.yml`: Local development services (Redis, Qdrant)

## Prerequisites

-   Node.js (v18 or higher recommended)
-   Docker & Docker Compose
-   Supabase Account (for Database)
-   OpenAI API Key (for AI features)

## Getting Started

### 1. Infrastructure Setup (Redis & Qdrant)

We use Docker Compose to run local dependencies like Redis (for queues) and Qdrant (for vector search).

```bash
docker-compose up -d
```

### 2. Backend Setup (`correct-backend`)

The backend is built with NestJS.

**Navigate to the directory:**
```bash
cd correct-backend
```

**Install dependencies:**
```bash
npm install
```

**Environment Configuration:**
Copy `.env.example` to `.env` and fill in the required values.
```bash
cp .env.example .env
```
Key variables to check:
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME_DEVELOPMENT` (Supabase Postgres)
- `OPENAI_API_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET` (if using S3)

**Run the server:**
```bash
# Development mode
npm run dev

# Debug mode
npm run start:debug
```
The server usually runs on port 8000 (check `main.ts` or logs).

### 3. Frontend Setup (`correct-app`)

The frontend is built with Next.js.

**Navigate to the directory:**
```bash
cd correct-app
```

**Install dependencies:**
```bash
npm install
```

**Environment Configuration:**
Copy `.env.example` to `.env` and fill in the required values.
```bash
cp .env.example .env
```
Key variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SERVER_URL` (default: `http://localhost:8000/api/v1`)

**Run the development server:**
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

### 4. Mobile App Setup (`correct-rn`)

The mobile app is built with React Native.

**Navigate to the directory:**
```bash
cd correct-rn
```

**Install dependencies:**
```bash
npm install
# Install iOS pods (macOS only)
cd ios && pod install && cd ..
```

**Run the app:**
```bash
# iOS
npm run ios

# Android
npm run android
```

### 5. AI Agent Setup (`correct-agent-mastra`)

**Navigate to the directory:**
```bash
cd correct-agent-mastra
```

**Install dependencies:**
```bash
npm install
```

**Environment Configuration:**
Copy `.env.example` (if available) or create `.env` with necessary API keys (OpenAI etc).

**Run the agent:**
```bash
npm run dev
```

## Useful Commands

-   **Backend Migrations:** `npm run db:migrate` (in `correct-backend`)
-   **Frontend Lint:** `npm run lint` (in `correct-app`)

## Notes

-   Ensure your Supabase database is reachable and migrations are applied.
-   If you encounter issues with `bullmq`, ensure Redis is running via Docker.
-   Qdrant is available at `localhost:6333` for vector search operations.
