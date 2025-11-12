import * as fs from "fs";
import * as path from "path";

export type Role = "doctor" | "patient";

export type Message = {
  id: number;
  transcriptId: string;
  role: Role;
  body: string;
  timestamp?: string; // ISO 8601 format
  //   metadata?: Record<string, any>; // e.g. tone, emotion, NLP tags
};

export type Transcript = {
  id: string;
  title?: string;
  patientId?: string;
  doctorId?: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string;
  messages?: Message[];
  //   summary?: string;
  //   diagnosis?: string;
  //   metadata?: Record<string, any>; // optional structured data
};

/**
 * Paths to the parsed JSON files
 */
const MESSAGES_FILE_PATH = path.join(__dirname, "parsed-messages.json");
const TRANSCRIPTS_FILE_PATH = path.join(__dirname, "parsed-transcripts.json");

/**
 * Mock data source class that loads and provides access to parsed transcript data
 */
export class DataSource {
  private messages: Record<string, Message[]> = {};
  private transcripts: Transcript[] = [];
  private initialized: boolean = false;

  /**
   * Initializes the data source by loading data from JSON files
   * @throws Error if JSON files cannot be loaded
   */
  initialize(): void {
    try {
      this.loadTranscripts();
      this.loadMessages();
      this.initialized = true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to initialize DataSource: ${errorMessage}`);
    }
  }

  private loadTranscripts(): void {
    const fileContent = fs.readFileSync(TRANSCRIPTS_FILE_PATH, "utf-8");
    this.transcripts = JSON.parse(fileContent) as Transcript[];
  }
  private loadMessages(): void {
    const fileContent = fs.readFileSync(MESSAGES_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);

    this.messages = data as Record<string, Message[]>;
  }
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("DataSource not initialized. Call initialize() first.");
    }
  }

  /**
   * Gets all transcripts
   * @returns Array of all Transcript objects
   */
  getAllTranscripts(): Transcript[] {
    this.ensureInitialized();
    return this.transcripts;
  }

  /**
   * Gets all messages
   * @returns Record mapping transcript IDs to arrays of messages
   */
  getAllMessages(): Record<string, Message[]> {
    this.ensureInitialized();
    return this.messages;
  }
}

export const dataSource = new DataSource();
