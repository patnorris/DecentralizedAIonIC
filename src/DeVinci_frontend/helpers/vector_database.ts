import { DynamicTool } from "langchain/tools";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Needed Import @tensorflow/tfjs-core
import * as tf from '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";

import {
  store,
  vectorStore,
  userKnowledgebaseCanisterAddress,
  userBackendCanisterAddress,
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

//const vectorDbByTopic = {};
let pathToUploadedPdf;

// https://js.langchain.com/docs/modules/agents/tools/how_to/dynamic
// https://github.com/langchain-ai/langchainjs/issues/1115
export const getSearchVectorDbTool = async (pathToUploadedPdfInput) => {
  /* if (vectorDbByTopic[selectedTopic]) { // several in-browser vector dbs easily overwhelm the device's memory
    // the vector database for this topic has been initialized already
    return vectorDbByTopic[selectedTopic];
  }; */
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
  if (!pathToUploadedPdf) {
    return;
  };
  try {
    const start = performance.now() / 1000;
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
    console.log(`Debug: generateEmbeddings took ${(end - start).toFixed(2)}s`);
  } catch (error) {
    console.error("Error in generateEmbeddings: ", error);
  };
};

const searchEmbeddings = async (text: string) => {
  try {
    if (!vectorStoreState) {
      await generateEmbeddings();
    };

    const searchResult = await vectorStoreState.similaritySearch(text, 1); // returns 1 entry

    const searchResultIds = searchResult.map((r) => r.metadata.id);
    let results = providedDataEntries.filter((dataEntry) => searchResultIds.includes(dataEntry.id));
    return results;
  } catch (error) {
    console.error("Error in searchEmbeddings: ", error);
  };
};

const getDataEntries = async (pathToUploadedPdf) => {
  const dataEntries = [];
  // @ts-ignore
  const knowledgePages: [] = await getResourceAsArray(pathToUploadedPdf);
  for (let index = 0; index < knowledgePages.length; index++) {
    const dataEntry = {
      id: index,
      content: knowledgePages[index]
    };
    dataEntries.push(dataEntry);
  };
  return dataEntries;
};

export const storeEmbeddings = async () => {
  if (!vectorStoreState) {
    return;
  };
  try {
    const memVecs = vectorStoreState.memoryVectors;
    try {
      const storeMemoryVectorsResponse = await storeState.backendActor.store_user_chats_memory_vectors(memVecs);
      if (!storeMemoryVectorsResponse.Ok) {
        return false;
      };
    } catch (error) {
      console.error("Error storing memory vectors: ", error);
    };
    return true;
  } catch (error) {
    console.error("Error in storeEmbeddings: ", error)
  };
};

const retrieveEmbeddings = async () => {
  try {
    let retrievedMemVecs = [];
    try {
      const getMemoryVectorsResponse = await storeState.backendActor.get_caller_memory_vectors();
      if (getMemoryVectorsResponse.Ok) {
        retrievedMemVecs = getMemoryVectorsResponse.Ok;
      };
    } catch (error) {
      console.error("Error retrieving memory vectors: ", error);
    };
    return retrievedMemVecs;
  } catch (error) {
    console.error("Error in retrieveEmbeddings: ", error)
  };
};

export const loadExistingVectorStore = async () => {
  try {
    let retrievedMemVecs = await retrieveEmbeddings();
    try {
      const start = performance.now() / 1000;

      const textsToEmbed = ["valueToInitialize"];

      const metadata = [{ id: 0 }];

      const embeddings = new TensorFlowEmbeddings();

      vectorStoreState = await MemoryVectorStore.fromTexts(
        textsToEmbed,
        metadata,
        embeddings,
      );
      
      vectorStoreState.memoryVectors = retrievedMemVecs;

      vectorStore.set(vectorStoreState);

      const end = performance.now() / 1000;
      console.log(`Debug: loadExistingVectorStore took ${(end - start).toFixed(2)}s`);
    } catch (error) {
      console.error("Error loading retrieved vectors: ", error);
    };
    return retrievedMemVecs;
  } catch (error) {
    console.error("Error in loadExistingVectorStore: ", error)
  };
};

export const checkUserHasKnowledgeBase = async () => {
  try {
    const checkResponse = await storeState.backendActor.check_caller_has_memory_vectors_entry();
    if (checkResponse.Ok) {
      return checkResponse.Ok;
    } else {
      return false;
    };
  } catch (error) {
    console.error("Error in checkUserHasKnowledgeBase: ", error)
  };
};

export const createUserKnowledgebaseCanister = async () => {
  console.log("in createUserKnowledgebaseCanister");
  try {
    let createCanisterResponse = await storeState.backendActor.createNewCanister({ 'canisterType' : { 'Knowledgebase' : null } });
    console.log("in createUserKnowledgebaseCanister createCanisterResponse ", createCanisterResponse);
    if (createCanisterResponse.Ok) {
      /* CanisterCreationRecord = {
        creationResult : Text;
        newCanisterId : Text;
      }; */
      userKnowledgebaseCanisterAddress.set(createCanisterResponse.Ok?.newCanisterId);
      return createCanisterResponse.Ok;
    } else {
      return false;
    };
  } catch (error) {
    console.error("Error in createUserKnowledgebaseCanister: ", error);
    return false;    
  };
};

export const createUserBackendCanister = async () => {
  console.log("in createUserBackendCanister");
  try {
    let createCanisterResponse = await storeState.backendActor.createNewCanister({ 'canisterType' : { 'Backend' : null } });
    console.log("in createUserBackendCanister createCanisterResponse ", createCanisterResponse);
    if (createCanisterResponse.Ok) {
      /* CanisterCreationRecord = {
        creationResult : Text;
        newCanisterId : Text;
      }; */
      const newCanisterId = createCanisterResponse.Ok?.newCanisterId;
      userBackendCanisterAddress.set(newCanisterId);
      await store.updateBackendCanisterActor(newCanisterId)
      return createCanisterResponse.Ok;
    } else {
      return false;
    };
  } catch (error) {
    console.error("Error in createUserBackendCanister: ", error);
    return false;    
  };
};

let embeddingsModel = new TensorFlowEmbeddings();
let userKnowledgebaseCanister;

export const searchUserKnowledgebase = async (searchText) => {
  if (!embeddingsModel) {
    embeddingsModel = new TensorFlowEmbeddings();
  };
  
  const embeddingResult = await embeddingsModel.embedQuery(searchText);
  try {
    if (!userKnowledgebaseCanister) {
      userKnowledgebaseCanister = await store.getActorForUserKnowledgebaseCanister();
    };
    let searchResponse = await userKnowledgebaseCanister.search({ 'Embeddings': embeddingResult }, 1);
    // 'search' : ActorMethod<[VecQuery, bigint], [] | [Array<PlainDoc>]>,
      // VecQuery = { 'Embeddings' : Array<number> };
    if (searchResponse.length > 0) {
      if (searchResponse[0] && searchResponse[0].length > 0) {
        return searchResponse[0][0].content; 
      };
    };
    return false;
  } catch (error) {
    console.error("Error in searchUserKnowledgebase: ", error);
  };
};

export const addToUserKnowledgebase = async (newKnowledge) => {
  if (!embeddingsModel) {
    embeddingsModel = new TensorFlowEmbeddings();
  };

  const embeddingResult = await embeddingsModel.embedQuery(newKnowledge);
  try {
    if (!userKnowledgebaseCanister) {
      userKnowledgebaseCanister = await store.getActorForUserKnowledgebaseCanister();
    };
    let addResponse = await userKnowledgebaseCanister.add({ content: newKnowledge, embeddings: embeddingResult });
    // add: (VecDoc) -> async Text
      // type VecDoc = { content : Text; embeddings : Types.Embeddings };
    if (addResponse) {
      return addResponse;
    } else {
      return false;
    };
  } catch (error) {
    console.error("Error in addToUserKnowledgebase: ", error);
    return false;
  };
};

export const addPdfToUserKnowledgebase = async (pathToPdf) => {
  if (!pathToPdf) {
    return;
  };
  if (!embeddingsModel) {
    embeddingsModel = new TensorFlowEmbeddings();
  };
  if (!userKnowledgebaseCanister) {
    userKnowledgebaseCanister = await store.getActorForUserKnowledgebaseCanister();
  };

  const start = performance.now() / 1000;

  try {
    const existingDataEntries = await getDataEntries(pathToPdf);
    const textsToEmbed = existingDataEntries.map(
      (dataEntry) => JSON.stringify(dataEntry)
    );
    let promises = [];
    for (const text of textsToEmbed) {
      // Generate embeddings and then push each backend actor call to the promises array
      promises.push(embedAndAddChunk(text, embeddingsModel));
    };

    const results = await Promise.allSettled(promises);
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.info("in addPdfToUserKnowledgebase result ", result.value);
      } else {
        console.error("Failed to process: ", result.reason);
      };
    });
  } catch (error) {
    console.error("Error in addPdfToUserKnowledgebase: ", error);
    return false;
  };

  const end = performance.now() / 1000;
  console.log(`Debug: generateEmbeddings took ${(end - start).toFixed(2)}s`);
  return true;
};

export const addTextFileToUserKnowledgebase = async (textFile) => {
  if (!textFile) {
    return;
  };
  if (!embeddingsModel) {
    embeddingsModel = new TensorFlowEmbeddings();
  };
  if (!userKnowledgebaseCanister) {
    userKnowledgebaseCanister = await store.getActorForUserKnowledgebaseCanister();
  };

  try {
    const blob = textFile;
    const chunkSize = 1000;
    let promises = [];
    for (let start = 0; start < blob.size; start += chunkSize) {
      const chunk = blob.slice(start, start + chunkSize);
      const chunkText = await chunk.text();
      promises.push(embedAndAddChunk(chunkText, embeddingsModel));
    };  
    const results = await Promise.allSettled(promises);
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.info('Embedding success:', result.value);
      } else {
        console.error('Failed to process chunk:', result.reason);
      };
    });
  } catch (error) {
    console.error('Error processing chunks:', error);
  };
};

const embedAndAddChunk = async (text, embeddingsModel) => {
  if (!userKnowledgebaseCanister) {
    userKnowledgebaseCanister = await store.getActorForUserKnowledgebaseCanister();
  };
  // Generate embeddings for a chunk of text
  return embeddingsModel.embedQuery(text).then(embeddingResult => {
    // and add the chunk to the vector database
    return userKnowledgebaseCanister.add({ content: text, embeddings: embeddingResult });
    // add: (VecDoc) -> async Text
      // type VecDoc = { content : Text; embeddings : Types.Embeddings };
  });
};



