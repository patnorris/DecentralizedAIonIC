<script lang="ts">
  import * as webllm from "@mlc-ai/web-llm";
  import { push } from "svelte-spa-router";
  import { store } from "../store";
  import Login from "./Login.svelte";
  import Button from "./Button.svelte";
  import ChatBox from "./ChatBox.svelte";

  let chatModel;
  const workerPath = './worker.ts';

  let chatModelDownloadInProgress = false;
  let chatModelDownloaded = false;

  function setLabel(id: string, text: string) {
    const label = document.getElementById(id);
    if (label == null) {
      throw Error("Cannot find label " + id);
    }
    label.innerText = text;
  }

  async function loadChatModel() {
    //console.log("Loading chat model...");
    chatModelDownloadInProgress = true;
    if (process.env.NODE_ENV !== "development") {
      //console.log("Using web worker");
      try {
        /* TODO: fix
        chatModel = new webllm.ChatWorkerClient(new Worker(
          new URL(workerPath, import.meta.url),
          {type: 'module'}
        )); */
        chatModel = new webllm.ChatModule();
      } catch (error) {
        console.error("Error loading web worker: ", error);
        chatModel = new webllm.ChatModule();
      }      
    } else {
      //console.log("Using webllm");
      chatModel = new webllm.ChatModule();
    }

    chatModel.setInitProgressCallback((report: webllm.InitProgressReport) => {
      setLabel("init-label", report.text);
    });

    await chatModel.reload("RedPajama-INCITE-Chat-3B-v1-q4f32_0");
    chatModelDownloaded = true;
    chatModelDownloadInProgress = false;
  };

  const generateProgressCallback = (_step: number, message: string) => {
    setLabel("generate-label", message);
  };

  async function getChatModelResponse(prompt, progressCallback = generateProgressCallback) {
    const reply = await chatModel.generate(prompt, progressCallback);
    return reply;
  };
</script>

<section id="chat-model-section" class="py-7 space-y-6 items-center text-center bg-slate-100">
  {#if chatModelDownloaded}
    <h3 id='chatModelStatusSubtext'>Success! You can chat with your AI Assistant now.</h3>
    <p id="generate-label"> </p>
    <ChatBox modelCallbackFunction={getChatModelResponse} />
  {:else}
    {#if chatModelDownloadInProgress}
      <h3 id='chatModelStatusSubtext'>Downloading AI Assistant. This may take a moment...</h3>
      <p id="init-label"> </p>
    {:else}
      <h3 id='chatModelStatusSubtext'>Let's first download the AI Assistant for you. Please click on the button:</h3>
      <Button
        id="downloadChatModelButton"
        class="bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900"
        on:click={loadChatModel}>Initialize</Button>
    {/if}
  {/if}
</section>
