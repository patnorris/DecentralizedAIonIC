import { pipeline, env } from "@xenova/transformers";
import { Embeddings, EmbeddingsParams } from "langchain/embeddings/base";

//env.allowLocalModels = false;

export interface XenovaTransformersEmbeddingsParams extends EmbeddingsParams {
  model?: string;
  modelInstance?;
}

export class XenovaTransformersEmbeddings
  extends Embeddings
  implements XenovaTransformersEmbeddingsParams
{
  model: string;

  modelInstance;

  client: any;

  constructor(fields?: XenovaTransformersEmbeddingsParams) {
    super(fields ?? {});
    this.model = fields?.model ?? "Xenova/all-MiniLM-L6-v2";
  }

  async _embed(texts: string[]): Promise<number[][]> {
    if (!this.client) {
      this.client = await pipeline("feature-extraction", 'Xenova/text-embedding-ada-002');
      //this.client = await pipeline("embeddings", 'Xenova/text-embedding-ada-002');
    }

    return this.caller.call(async () => {
      return await Promise.all(
        texts.map(async (t) => (await this.client(t, {
          pooling: "mean", normalize: true 
        })).data)
      );
    });
  }

  embedQuery(document: string): Promise<number[]> {
    return this._embed([document]).then((embeddings) => embeddings[0]);
  }

  embedDocuments(documents: string[]): Promise<number[][]> {
    return this._embed(documents);
  }
}