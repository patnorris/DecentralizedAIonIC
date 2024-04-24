import { DynamicTool } from "langchain/tools";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TextLoader } from "langchain/document_loaders/fs/text";

// Import @tensorflow/tfjs-core
import * as tf from '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";

import {
  store,
  vectorStore,
} from "../store";

import { getResourceAsArray } from "./setup_knowledgebase";

let storeState;
store.subscribe((value) => storeState = value);

let vectorStoreState;
vectorStore.subscribe((value) => vectorStoreState = value);

let providedDataEntries;

/**
 * Interface representing a vector in memory. It includes the content
 * (text), the corresponding embedding (vector), and any associated
 * metadata.
 */ 
// from https://github.com/langchain-ai/langchainjs/blob/ad2da871c50728712fb913f9c68d1fe77084911e/langchain/src/vectorstores/memory.ts#L11
interface MemoryVector {
  content: string;
  embedding: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
};

const vectorDbByTopic = {};
let pathToUploadedPdf;

// https://js.langchain.com/docs/modules/agents/tools/how_to/dynamic
// https://github.com/langchain-ai/langchainjs/issues/1115
export const getSearchVectorDbTool = async (pathToUploadedPdfInput) => {
  /* if (vectorDbByTopic[selectedTopic]) { // several in-browser vector dbs easily overwhelm the device's memory
    // the vector database for this topic has been initialized already
    return vectorDbByTopic[selectedTopic];
  }; */
  console.log("getSearchVectorDbTool pathToUploadedPdfInput ", pathToUploadedPdfInput);
  pathToUploadedPdf = pathToUploadedPdfInput;
  const vectorDbSearchToolName = "search-vector-database";
  const vectorDbSearchToolDescription = "Tool to find data in the local vector database. The input must be a text string representing the search query. Note that this local database is limited and that while the returned results are the closest matches to the search query in the local database they are not necessarily good enough to show to the user. Never make up any new entries.";

  const vectorDbSearchTool = new DynamicTool({
    name: vectorDbSearchToolName,
    description: vectorDbSearchToolDescription,
    func: async (toolInput: string) => {
      if (toolInput === undefined || typeof toolInput !== 'string') {
        return "There is an input error. You must input a text string as search query for the data in the local vector database.";
      };
      const response = await searchEmbeddings(toolInput);
      const toolResponse = {
        importantNoteOnResult: "These are the most relevant data points found which does not mean they are great matches as the local vector database is limited. You should check that they actually match what the user asked for. If so you may consider showing them to the user, otherwise consider going on without an data from this database, trying another input query or using other tools. Never make up any data.",
        existingChatsFoundInLocalDatabase: response,
      };
      return JSON.stringify(toolResponse);
    },
  });
  await generateEmbeddings();
  //vectorDbByTopic[selectedTopic] = vectorDbSearchTool; // add the initialized vector db for later retrieval
  return vectorDbSearchTool;
}; 

const generateEmbeddings = async () => {
  try {
    const start = performance.now() / 1000;
    console.log("generateEmbeddings pathToUploadedPdf ", pathToUploadedPdf);
    const existingDataEntries = await getDataEntries(pathToUploadedPdf);
    providedDataEntries = existingDataEntries;

    const textsToEmbed = existingDataEntries.map(
      (dataEntry) => JSON.stringify(dataEntry)
    );

    const metadata = existingDataEntries.map((dataEntry) => ({ id: dataEntry.id }));

    const embeddings = new TensorFlowEmbeddings();

    vectorStoreState = await MemoryVectorStore.fromTexts(
      textsToEmbed,
      metadata,
      embeddings,
    );
    vectorStore.set(vectorStoreState);

    const end = performance.now() / 1000;
    console.log(`Debug: generateEmbeddings took ${(end - start).toFixed(2)}s`)
  } catch (error) {
    console.error("Error in generateEmbeddings: ", error)
  };
};

const searchEmbeddings = async (text: string) => {
  try {
    if (!vectorStoreState) {
      return;
      //await generateEmbeddings();
    };

    const searchResult = await vectorStoreState.similaritySearch(text, 1); // returns 1 entry

    const searchResultIds = searchResult.map((r) => r.metadata.id);
    let results = providedDataEntries.filter((dataEntry) => searchResultIds.includes(dataEntry.id));
    console.log("searchEmbeddings results ", results);
    return results;
  } catch (error) {
    console.error("Error in searchEmbeddings: ", error);
  };
};

const getDataEntries = async (pathToUploadedPdf) => {
  const dataEntries = [];
  console.log("getDataEntries pathToUploadedPdf ", pathToUploadedPdf);
  const knowledgePages : [] = await getResourceAsArray(pathToUploadedPdf);
  for (let index = 0; index < knowledgePages.length; index++) {
    const dataEntry = {
      id: index,
      content: knowledgePages[index]
    };
    dataEntries.push(dataEntry);      
  };
  
  return dataEntries;
};