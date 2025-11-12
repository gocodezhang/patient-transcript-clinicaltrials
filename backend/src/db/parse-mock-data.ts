import * as fs from "fs";
import * as path from "path";
import { faker } from "@faker-js/faker";
import { Message, Role, Transcript } from "./index";

function extractTranscriptId(): string {
  return faker.string.uuid();
}

/**
 * Parses a transcript text file and converts it to an array of Message objects
 * @param filePath Path to the transcript text file
 * @param transcriptId The transcript ID to use for all messages in this file
 * @returns Array of Message objects
 */
function parseTranscriptFile(
  filePath: string,
  transcriptId: string
): Message[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");

  const messages: Message[] = [];
  let messageId = 1;
  let currentRole: Role | null = null;
  let currentBody: string[] = [];

  // Generate a base timestamp for this transcript (messages will be spaced out)
  const baseTimestamp = faker.date.recent({ days: 30 });
  let messageTimestamp = new Date(baseTimestamp);

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      // If we have accumulated content, save the previous message
      if (currentRole && currentBody.length > 0) {
        messages.push({
          id: messageId++,
          transcriptId,
          role: currentRole,
          body: currentBody.join(" ").trim(),
          timestamp: messageTimestamp.toISOString(),
        });

        // Increment timestamp for next message (spaced by 30 seconds to 2 minutes)
        messageTimestamp = new Date(
          messageTimestamp.getTime() +
            faker.number.int({ min: 30000, max: 120000 })
        );

        currentBody = [];
      }
      continue;
    }

    // Check if line starts with "D:" or "D;" (doctor) or "P:" (patient)
    // Handle both ":" and ";" as separators (some files have typos)
    const isDoctorLine = trimmedLine.match(/^D[:\;]\s*/);
    const isPatientLine = trimmedLine.match(/^P[:\;]\s*/);

    if (isDoctorLine) {
      // Save previous message if exists
      if (currentRole && currentBody.length > 0) {
        messages.push({
          id: messageId++,
          transcriptId,
          role: currentRole,
          body: currentBody.join(" ").trim(),
          timestamp: messageTimestamp.toISOString(),
        });

        messageTimestamp = new Date(
          messageTimestamp.getTime() +
            faker.number.int({ min: 30000, max: 120000 })
        );
        currentBody = [];
      }

      currentRole = "doctor";
      // Remove "D:" or "D;" prefix (match[0] contains the matched prefix)
      const messageText = trimmedLine.substring(isDoctorLine[0].length).trim();
      if (messageText) {
        currentBody.push(messageText);
      }
    } else if (isPatientLine) {
      // Save previous message if exists
      if (currentRole && currentBody.length > 0) {
        messages.push({
          id: messageId++,
          transcriptId,
          role: currentRole,
          body: currentBody.join(" ").trim(),
          timestamp: messageTimestamp.toISOString(),
        });

        messageTimestamp = new Date(
          messageTimestamp.getTime() +
            faker.number.int({ min: 30000, max: 120000 })
        );
        currentBody = [];
      }

      currentRole = "patient";
      // Remove "P:" or "P;" prefix
      const messageText = trimmedLine.substring(isPatientLine[0].length).trim();
      if (messageText) {
        currentBody.push(messageText);
      }
    } else if (currentRole) {
      // Continuation of current message (multi-line message)
      currentBody.push(trimmedLine);
    }
  }

  // Don't forget the last message
  if (currentRole && currentBody.length > 0) {
    messages.push({
      id: messageId++,
      transcriptId,
      role: currentRole,
      body: currentBody.join(" ").trim(),
      timestamp: messageTimestamp.toISOString(),
    });
  }

  return messages;
}

/**
 * Creates a Transcript object from messages
 * @param transcriptId The transcript ID
 * @param messages Array of messages for this transcript
 * @param filename Optional filename to generate a title from
 * @returns A Transcript object
 */
function createTranscript(
  transcriptId: string,
  messages: Message[],
  filename?: string
): Transcript {
  if (messages.length === 0) {
    throw new Error(
      `Cannot create transcript ${transcriptId} with no messages`
    );
  }

  // Use the first message's timestamp as createdAt (or slightly before)
  const firstMessageTime = new Date(messages[0].timestamp || new Date());
  const createdAt = new Date(
    firstMessageTime.getTime() - faker.number.int({ min: 1000, max: 5000 })
  );

  // Use the last message's timestamp as updatedAt (or slightly after)
  const lastMessageTime = new Date(
    messages[messages.length - 1].timestamp || new Date()
  );
  const updatedAt = new Date(
    lastMessageTime.getTime() + faker.number.int({ min: 1000, max: 10000 })
  );

  // Generate a title based on filename or create a generic one
  let title: string | undefined;
  if (filename) {
    // Extract a meaningful title from filename (e.g., CAR0001 -> "Consultation CAR0001")
    const baseName = filename.replace(/\.txt$/, "").toUpperCase();
    title = `Patient Consultation ${baseName}`;
  } else {
    title = faker.helpers.arrayElement([
      "Initial Consultation",
      "Follow-up Appointment",
      "Emergency Visit",
      "Routine Checkup",
      "Specialist Consultation",
    ]);
  }

  // Generate patient and doctor IDs using faker
  const patientId = `PAT-${faker.string.alphanumeric(8).toUpperCase()}`;
  const doctorId = `DOC-${faker.string.alphanumeric(8).toUpperCase()}`;

  return {
    id: transcriptId,
    title,
    patientId,
    doctorId,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

/**
 * Parses all transcript files in the mockData directory
 * @param mockDataDir Directory containing transcript text files
 * @returns Object with messages and transcripts
 */
export function parseAllTranscripts(mockDataDir: string): {
  messages: Record<string, Message[]>;
  transcripts: Transcript[];
} {
  const files = fs.readdirSync(mockDataDir);
  const txtFiles = files.filter((file) => file.endsWith(".txt"));

  const messages: Record<string, Message[]> = {};
  const transcripts: Transcript[] = [];

  for (const file of txtFiles) {
    const filePath = path.join(mockDataDir, file);

    // Extract transcriptId from filename (e.g., CAR0001.txt -> 1)
    const transcriptId = extractTranscriptId();

    const parsedMessages = parseTranscriptFile(filePath, transcriptId);
    messages[transcriptId] = parsedMessages;

    // Create transcript object
    const transcript = createTranscript(transcriptId, parsedMessages, file);
    transcripts.push(transcript);

    console.log(
      `Parsed ${file}: ${parsedMessages.length} messages, transcriptId: ${transcriptId}`
    );
  }

  return { messages, transcripts };
}

/**
 * Main function to run the parser
 */
if (require.main === module) {
  const mockDataDir = path.join(__dirname, "mockData");
  const { messages, transcripts } = parseAllTranscripts(mockDataDir);

  // Save messages to JSON file
  const messagesOutputPath = path.join(__dirname, "parsed-messages.json");
  fs.writeFileSync(messagesOutputPath, JSON.stringify(messages, null, 2));
  console.log(`\nMessages saved to: ${messagesOutputPath}`);

  // Save transcripts to JSON file
  const transcriptsOutputPath = path.join(__dirname, "parsed-transcripts.json");
  fs.writeFileSync(transcriptsOutputPath, JSON.stringify(transcripts, null, 2));
  console.log(`Transcripts saved to: ${transcriptsOutputPath}`);

  // Output summary
  console.log("\n=== Summary ===");
  console.log(`Total transcripts: ${transcripts.length}`);
}
