# Backend - Patient Transcript Clinical Trials

Express.js backend server for managing patient transcripts and clinical trial matching.

## Tech Stack

- **Runtime**: Node.js (v18 or higher)
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Service**: OpenAI API
- **Logging**: Winston

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- OpenAI API key (for AI-powered transcript processing)

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```bash
# Server Configuration
PORT=3001

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Load transcript data (from kaggle)

```bash
npm run parse-mock
```

Parse data files into JSON format

### 4. Start Development Server

```bash
npm run dev
```

The server will run on `http://localhost:3001` (or the port specified in your `.env` file) with hot-reload enabled using `tsx watch`.

### 5. Build for Production

```bash
npm run build
```

This compiles TypeScript to JavaScript and copies necessary JSON files to the `dist/` directory.

### 5. Start Production Server

```bash
npm start
```

Runs the compiled code from the `dist/` directory.

## Available Scripts

- `npm run dev` - Start development server with hot-reload (using tsx)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (runs compiled code from dist/)
- `npm run playground` - Run the playground script for testing
- `npm run parse-mock` - Parse mock data files into JSON format

## Project Structure

```
backend/
├── index.ts                    # Express server entry point
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── dist/                       # Compiled JavaScript (generated)
├── src/
│   ├── controllers/            # Request handlers
│   │   └── transcript.controller.ts
│   ├── db/                     # Data source and mock data
│   │   ├── index.ts            # Data source initialization
│   │   ├── parse-mock-data.ts  # Mock data parser
│   │   ├── mockData/           # Raw mock transcript files
│   │   ├── parsed-transcripts.json
│   │   └── parsed-messages.json
│   ├── schemas/                # FHIR and data schemas
│   │   ├── patient.schema.ts
│   │   ├── condition.schema.ts
│   │   ├── medication-request.schema.ts
│   │   ├── careplan.schema.ts
│   │   └── goal.schema.ts
│   ├── services/               # Business logic services
│   │   ├── ai-service/         # OpenAI integration
│   │   ├── clinical-trial-service/  # Clinical trial matching
│   │   ├── transcript-service.ts
│   │   └── transcript-process-service.ts
│   ├── utils/                  # Utility functions
│   │   └── logger.ts            # Winston logger configuration
│   └── playground.ts           # Development playground
└── README.md                   # This file
```

## API Endpoints

### Health Check

- `GET /api/health` - Server health check

### Transcripts

- `GET /api/transcripts` - Get all transcripts
- `GET /api/transcripts/:id/messages` - Get messages for a specific transcript
- `POST /api/transcripts/:id/process` - Process a transcript (extract patient data and match clinical trials)
