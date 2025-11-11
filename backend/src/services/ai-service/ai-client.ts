import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { AITool, AIConfig, ModelResponse } from "./types";
import { merge } from "lodash";
import { ZodType } from "zod";

export interface IAIClient {
  setSystemPrompt(prompt: string): IAIClient;
  setTools(tools: AITool[]): IAIClient;
  setConfig(config: AIConfig): IAIClient;
  setOutPutFormat(schmea: ZodType): IAIClient;

  createModelResponse(input: string): Promise<ModelResponse>;
}
export class OpenAiClient implements IAIClient {
  private provider: OpenAI;

  private systemPrompt: string | undefined;
  private config: AIConfig | undefined;
  private tools: AITool[] | undefined;
  private outPutFormat: ZodType | undefined;

  static DefaultConfig: AIConfig = {
    model: "gpt-4o",
    temperature: 1,
    store: false,
  };

  constructor() {
    this.provider = new OpenAI();
  }

  private clear() {
    this.outPutFormat = undefined;
    this.tools = undefined;
    this.config = undefined;
    this.outPutFormat = undefined;
  }

  setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
    return this;
  }

  setTools(tools: AITool[]) {
    this.tools = tools;
    return this;
  }

  setConfig(config: AIConfig) {
    this.config = config;
    return this;
  }
  setOutPutFormat(schema: ZodType) {
    this.outPutFormat = schema;
    return this;
  }

  async createModelResponse(input: string, options?: { clearConfig: boolean }) {
    const configParams = merge(OpenAiClient.DefaultConfig, this.config);

    // Use the Responses API endpoint
    const response = await this.provider.responses.create({
      input,
      instructions: this.systemPrompt,
      tools: this.tools,
      text: this.outPutFormat
        ? { format: zodTextFormat(this.outPutFormat, "body") }
        : undefined,
      ...configParams,
    });

    if (options?.clearConfig) {
      this.clear();
    }

    return response;
  }
}
