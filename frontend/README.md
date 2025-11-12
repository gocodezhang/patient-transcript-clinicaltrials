# Frontend - Patient Transcript Clinical Trials

React frontend application for viewing patient transcripts and matching clinical trials.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- Backend server running (see [backend/README.md](../backend/README.md))

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend directory (optional):

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port) with hot-reload enabled.

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deploying.

## Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
frontend/
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Node tools
├── package.json            # Dependencies and scripts
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── main.tsx            # React application entry point
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── index.css           # Global styles
│   ├── api/                # API client and hooks
│   │   └── transcriptApi.ts
│   ├── components/         # React components
│   │   ├── TranscriptSidebar.tsx    # Sidebar with transcript list
│   │   ├── MessagesList.tsx         # Messages view component
│   │   └── ClinicalTrialsList.tsx   # Clinical trials view component
│   ├── types/              # TypeScript type definitions
│   │   └── api.ts
│   └── assets/             # Static assets (images, etc.)
│       └── react.svg
└── README.md               # This file
```
