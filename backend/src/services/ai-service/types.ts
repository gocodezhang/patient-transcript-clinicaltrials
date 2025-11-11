import { Tool, Response } from "openai/resources/responses/responses";

export type AIConfig = {
  model: string;
  temperature?: number;
  store?: boolean;
};

export type AITool = Tool;

export type ModelResponse = Response;
