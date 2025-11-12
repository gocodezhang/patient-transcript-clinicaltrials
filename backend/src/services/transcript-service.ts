import { dataSource } from "../db";

export class TranscriptService {
  getTranscript(id: string) {
    return dataSource.getAllTranscripts().find((t) => t.id === id);
  }
  getTranscripts() {
    return dataSource.getAllTranscripts();
  }
  getMessagesById(transcriptId: string) {
    return dataSource.getAllMessages()[transcriptId];
  }
}
