# Patient Transcript Clinical Trials

A full-stack application for managing patient transcripts in clinical trials.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Express + Node.js + TypeScript

## Development Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional, defaults to PORT=3001):
   ```bash
   PORT=3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3001` with hot-reload enabled

5. Build for production (optional):
   ```bash
   npm run build
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (default Vite port)

## Project Structure

```
patient-transcript-clinicaltrials/
├── backend/
│   ├── server.ts          # Express server entry point (TypeScript)
│   ├── tsconfig.json       # TypeScript configuration
│   ├── package.json        # Backend dependencies
│   ├── dist/              # Compiled JavaScript (generated)
│   └── .gitignore
├── frontend/
│   ├── src/               # React source files (TypeScript)
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   ├── tsconfig.node.json # TypeScript config for Node tools
│   └── vite.config.ts     # Vite configuration (TypeScript)
└── README.md
```

## Available Scripts

### Backend
- `npm run dev` - Start the development server with hot-reload (using tsx)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server (runs compiled code from dist/)

### Frontend
- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build