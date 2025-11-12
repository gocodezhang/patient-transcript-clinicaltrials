# Patient Transcript Clinical Trials

A full-stack application for managing patient transcripts in clinical trials.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Express + Node.js + TypeScript

## Approach to Finding Relevant Clinical Trials

I started by understanding what information can be used to refine the search query on the Clinical Trials API and worked backward from there.

1. Given a transcript and the available query parameters in the Clinical Trials API, I identified four areas of information that can be used to refine the clinical trials search: Patient demographics, Patient condition, Medications, Measures, and Care plan.
2. Referring to FHIR, I created five FHIR-like entities to categorize the information available in transcripts (see schemas in [code](./backend/src/schemas/index.ts)).
3. Created and refined an [LLM prompt](./backend/src/services/ai-service/system-prompt.ts) with the objective to extract information based on the above five entities (with schema validation enforced).
4. Search clinical trials using patient age & gender, multiple conditions (`query.cond`), measures (`query.outc`), and medications (`query.intr`) with `Essie expression syntax`.
   - There is also a relatively simple retry/backoff strategy to relax the search query when no trials match (see [here](./backend/src/services/transcript-process-service.ts)).

## Working Demo

There are a few pre-loaded raw transcripts from Kaggle (dataset platform). When you click "FIND CLINICAL TRIALS", you can test finding relevant clinical trials live!

**Live Demo**: https://patient-transcript-clinicaltrials.vercel.app/

## Development Setup

### Backend Setup

See [backend/README.md](./backend/README.md).

### Frontend Setup

See [frontend/README.md](./frontend/README.md).

## Key Assumptions

- Transcript processing and matching clinical trials is a synchronous action for demo purposes. In production, some or all processing can happen asynchronously and be saved in a database.
- We assume that Search Areas with pre-defined weights on the Clinical Trials API provide effective results (e.g., `query.cond`). However, we could further understand `Essie expression syntax` and enhance the search query.
