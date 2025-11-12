// API Response Types

export type Role = "doctor" | "patient";

export type Message = {
  id: number;
  transcriptId: string;
  role: Role;
  body: string;
  timestamp?: string;
};

export type Transcript = {
  id: string;
  title?: string;
  patientId?: string;
  doctorId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
};

export interface ClinicalTrial {
  nctId: string;
  briefTitle?: string;
  officialTitle?: string;
  status?: string;
  conditions?: string[];
  interventions?: Array<{
    name?: string;
    type?: string;
    description?: string;
  }>;
  locations?: Array<{
    facility?: string;
    city?: string;
    state?: string;
    country?: string;
  }>;
  eligibility?: {
    criteria?: string;
    gender?: string;
    minimumAge?: string;
    maximumAge?: string;
  };
  phase?: string[];
  studyType?: string;
  enrollment?: number;
  startDate?: string;
  completionDate?: string;
  sponsor?: string;
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface ClinicalTrialSearchResponse {
  studies: ClinicalTrial[];
  nextPageToken?: string;
  totalCount?: number;
}
