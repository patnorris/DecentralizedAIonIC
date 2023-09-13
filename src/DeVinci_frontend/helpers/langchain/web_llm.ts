import { LLM, BaseLLMParams, BaseLLMCallOptions } from "langchain/llms/base";

// @ts-ignore -- optional interface, will gracefully degrade to `any` if `@mlc-ai/web-llm` isn't installed
import type { ChatInterface } from "@mlc-ai/web-llm";

interface InitialProgressCallback {
  report: string;
}

interface WebLLMInput extends BaseLLMParams {
  model?: string;
  initCallback: (callback: InitialProgressCallback) => void;
}

interface WebLLMWorkerInput extends WebLLMInput {
  worker: Worker;
}

interface WebLLMCallOptions extends BaseLLMCallOptions {
  progressCallback: (step: any, msg: any) => void;
}

export class WebLLM extends LLM implements WebLLMInput {
  model = "vicuna-v1-7b-q4f32_0";
  initCallback: (callback: InitialProgressCallback) => void;
  worker: Worker | undefined;

  private chat: ChatInterface;

  declare CallOptions: WebLLMCallOptions;

  private constructor(fields: WebLLMInput) {
    super(fields);
    this.model = fields?.model ?? this.model;
  }

  public static async createInstance(fields: WebLLMInput) {
    const instance = new WebLLM(fields);
    const webllm = await WebLLM.imports();

    instance.chat = new webllm.ChatModule();
    instance.chat.setInitProgressCallback(fields.initCallback);

    try {
      await instance.chat.reload(instance.model);
    } catch (err: any) {
      console.log(err.stack);
      return;
    }

    return instance;
  }

  public static async createWorkerInstance(fields: WebLLMWorkerInput) {
    const instance = new WebLLM(fields);
    instance.worker = fields.worker;

    const webllm = await WebLLM.imports();
    instance.chat = new webllm.ChatWorkerClient(fields.worker);
    instance.chat.setInitProgressCallback(fields.initCallback);

    try {
      await instance.chat.reload(instance.model);
    } catch (err: any) {
      console.log(err.stack);
      return;
    }

    return instance;
  }

  /** Get the type of LLM. */
  _llmType(): string {
    return "web_llm";
  }

  async _call(
    prompt: string,
    options: this["ParsedCallOptions"]
  ): Promise<string> {
    let output: string;
    try {
      output = await this.chat.generate(prompt, options.progressCallback);
    } catch (err: any) {
      console.log(err.stack);
      throw err;
    }
    return output;
  }

  /** @ignore */
  static async imports(): Promise<typeof import("@mlc-ai/web-llm")> {
    try {
      const webllm = await import("@mlc-ai/web-llm");
      return webllm;
    } catch (e) {
      throw new Error(
        "Please install web-llm as a dependency with yarn, e.g. `yarn add @mlc-ai/web-llm`"
      );
    }
  }
}