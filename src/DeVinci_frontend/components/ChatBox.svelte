<script lang="ts">
  import { onMount } from "svelte";
  import { store, chatModelIdInitiatedGlobal, chatModelGlobal } from "../store";
  import { now } from "svelte/internal";

  import Message from './Message.svelte';
  import StartUpChatPanel from "./StartUpChatPanel.svelte";

  import spinner from "../assets/loading.gif";

  import {
    getLocalFlag,
    getLocallyStoredChat,
    removeLocalChangeToBeSynced,
    storeChatLocally,
    storeLocalChangeToBeSynced,
    syncLocalChanges,
  } from "../helpers/localStorage";

  export let modelCallbackFunction;
  export let chatDisplayed;
  export let callbackSearchVectorDbTool;

  let newMessageText = '';
  let messages = [];

  let replyText = 'Thinking...';

  let messageGenerationInProgress = false;

  const scrollToBottom = node => {
		const scroll = () => node.scroll({
			top: node.scrollHeight,
			behavior: 'smooth',
		});
		scroll();

		return { update: scroll }
	};

// Whether user wants their messages to be stored
  let saveChats = getLocalFlag("saveChatsUserSelection"); // default is save

  function formatMessagesForBackend(messagesToFormat) {
    // Map each message to a new format
    return messagesToFormat.map(message => ({
        content: message.content,
        sender: message.name
    }));
  };

  function formatMessagesForUi(messages) {
    // Map each message to the UI format
    return messages.map(message => ({
        content: message.content,
        name: message.sender,
        role: message.sender === 'DeVinci' ? 'assistant' : 'user'
    }));
  };

  const generateProgressCallback = (_step: number, message: string) => {
    replyText = message;
    messages = [...messages.slice(0, -1), { role: 'assistant', content: replyText, name: 'DeVinci' }];
  };

  function handleInputKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    };
  };

  async function sendMessage(messageTextInput=null) {
    messageGenerationInProgress = true;
    if(messageTextInput){
      newMessageText = messageTextInput;
    };
    if(newMessageText.trim() !== '') {
      const newPrompt = newMessageText.trim();
      const newMessageEntry = { role: 'user', content: newPrompt, name: 'You' };
      const messageHistoryWithPrompt = [...messages, newMessageEntry];
      messages = messageHistoryWithPrompt;
      newMessageText = '';
      try {
        messages = [...messages, { role: 'assistant', content: replyText, name: 'DeVinci' }];
        const reply = await modelCallbackFunction(messageHistoryWithPrompt.slice(-5), generateProgressCallback); // passing in much of the message history easily overwhelms the available device memory
        messages = [...messages.slice(0, -1), { role: 'assistant', content: reply, name: 'DeVinci' }];
      } catch (error) {
        console.error("Error getting response from model: ", error);
        messages = [...messages, { role: 'system', content: "There was an error unfortunately. Please try again.", name: 'DeVinci' }];
      }
      replyText = 'Thinking...';
    };
    messageGenerationInProgress = false;
    // Store chat
    if (saveChats && $store.isAuthed) {
      // Get messages into format for backend
      const messagesFormattedForBackend = formatMessagesForBackend(messages);
      if(chatDisplayed) {
        // Update chat
        try {
          const chatUpdatedResponse = await $store.backendActor.update_chat_messages(chatDisplayed.id, messagesFormattedForBackend);
          // @ts-ignore
          if (chatUpdatedResponse.Err) {
            // @ts-ignore
            console.error("Error message updating chat messages: ", chatUpdatedResponse.Err);
            throw new Error("Err updating chat messages");
          } else {
            // Remove this chat from chats to sync to avoid duplicates
            const syncObject = {
              chatId: chatDisplayed.id,
            };
            removeLocalChangeToBeSynced("localChatMessagesToSync", syncObject);
            syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
          };
        } catch (error) {
          console.error("Error storing chat: ", error);
          // Store locally and sync when back online
          const syncObject = {
            chatId: chatDisplayed.id,
            chatMessages: messagesFormattedForBackend,
          };
          storeLocalChangeToBeSynced("localChatMessagesToSync", syncObject);
        };
      } else {
        // New chat
        try {
          const chatCreatedResponse = await $store.backendActor.create_chat(messagesFormattedForBackend);
          // @ts-ignore
          if (chatCreatedResponse.Err) {
            // @ts-ignore
            console.error("Error message creating new chat: ", chatCreatedResponse.Err);
            throw new Error("Err creating new chat");
          } else {
            // @ts-ignore
            let newChatId = chatCreatedResponse.Ok;
            let newChatPreview = {
              id: newChatId,
              creationTime: now(),
              firstMessagePreview: messages[0].content,
              chatTitle: "",
            };
            chatDisplayed = newChatPreview;
            // Remove the just created chat by its first message from new chats to sync to avoid duplicates
            const syncObject = {
              chatMessages: messagesFormattedForBackend,
            };
            removeLocalChangeToBeSynced("newLocalChatToSync", syncObject);
            syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
          };
        } catch (error) {
          console.error("Error creating new chat: ", error);
          const syncObject = {
            chatMessages: messagesFormattedForBackend,
          };
          storeLocalChangeToBeSynced("newLocalChatToSync", syncObject);
        };
      };
    };
  };

// User can upload a pdf and a vector database is set up including the pdf's content
  let pathToUploadedPdf = '';
  let initiatedKnowledgeDatabase = false;
  let loadingKnowledgeDatabase = false;
  let useKnowledgeBase = false;
  //let persistingCurrentEmbeddings = false;
  //let userHasExistingKnowledgeBase = false;

  function handleUseKnowledgeBaseToggle() { //TODO
    useKnowledgeBase = !useKnowledgeBase;
  };

  async function uploadPdfToVectorDatabase() {
    const fileInput = document.getElementById('pdf_chat') as HTMLInputElement;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      pathToUploadedPdf = URL.createObjectURL(file);
      loadingKnowledgeDatabase = true;
      await callbackSearchVectorDbTool(pathToUploadedPdf);
      initiatedKnowledgeDatabase = true;
      loadingKnowledgeDatabase = false;
      useKnowledgeBase = true;
      alert("PDF processed and ready to use!");
    } else {
      alert("Please select a PDF file.");
    };
  };

// Retrieve the chat's history if an existing chat is to be displayed
  let chatRetrievalInProgress = false;

  const loadChat = async () => {
    if($chatModelGlobal) {
      try {
        await $chatModelGlobal.interruptGenerate(); // stop any previously triggered answer generations to not interfere in this chat        
      } catch (error) {
        console.error("Error stopping the answer generation on loading chat ", error);        
      };
    };
    chatRetrievalInProgress = true;
    if(chatDisplayed) {
      try {
        const chatHistoryResponse = await $store.backendActor.get_chat(chatDisplayed.id);
        // @ts-ignore
        if (chatHistoryResponse.Ok) {
          // @ts-ignore
          const chatHistory = chatHistoryResponse.Ok;
          const formattedMessages = formatMessagesForUi(chatHistory.messages);
          messages = formattedMessages;
          // store chat locally for offline usage
          storeChatLocally(chatDisplayed.id, chatHistory.messages);
          syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
        } else {
          // @ts-ignore
          console.error("Error loading chat: ", chatHistoryResponse.Err);
          // @ts-ignore
          throw new Error("Error loading chat: ", chatHistoryResponse.Err);
        };        
      } catch (error) {
        // Likely in offline usage
        const storedMessages = getLocallyStoredChat(chatDisplayed.id);
        if (storedMessages) {
          const formattedMessages = formatMessagesForUi(storedMessages);
          messages = formattedMessages;
        };
      };
    };
    chatRetrievalInProgress = false;
    // Fresh chat
  };

  onMount(loadChat);
</script>

<!-- TODO: {#if !$store.isAuthed}
  <div>
    <p>Please note that you may only store chats (and access additional features) if you log in.</p>
  </div>
{:else}
  <div>
    <p>Should your chat messages be stored?</p>
    <input type="checkbox" bind:checked={storeChatToggle} on:click={handleStoreChatToggle} />
    <span>{storeChatToggle ? 'YES' : 'NO'}</span>
  </div>
{/if} -->

<div class="messages h-[calc(100vh-164px)]" style="overflow:auto;" use:scrollToBottom={messages}>
  {#if $chatModelIdInitiatedGlobal && messages.length === 0}
    <StartUpChatPanel sendMessageCallbackFunction={sendMessage} />
  {/if}
  {#each messages as message (message.content)}
    <Message {message} />
  {/each}
</div>

<footer class="footer fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full md:ml-36 md:w-[calc(100%-18rem)]">
  <form class="w-full max-w-2xl mx-auto px-1 sm:px-0">
    <label for="chat" class="sr-only">Message DeVinci</label>
    <div class="flex items-center px-3 p-2 rounded-full bg-gray-200">
      <label for="pdf_chat">
        <button type="button" on:click={() => document.getElementById('pdf_chat').click()} class="inline-flex justify-center p-2 text-gray-500 rounded-full cursor-pointer hover:text-gray-900 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
        </button>
      </label>
      <input id="pdf_chat" type="file" accept=".pdf" on:change={uploadPdfToVectorDatabase} class="hidden text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 ml-2">
      {#if loadingKnowledgeDatabase}
        <p class="font-semibold text-gray-900 dark:text-gray-600">Loading your content into the local Knowledge Base for you...</p>
        <img class="h-12 mx-auto p-1 block" src={spinner} alt="loading animation" />
      {/if}
      {#if !$chatModelIdInitiatedGlobal || messageGenerationInProgress}
        <input disabled type="text" id="chat" autofocus class="block mx-4 p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:outline-none focus:ring-[#24292F]/50 " />
        <button disabled type="submit" class="opacity-55 cursor-not-allowed inline-flex justify-center p-2 text-gray-600 rounded-full">
          <svg class="w-5 h-5 rotate-0 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
          </svg>
          <span class="sr-only">Send message</span>
        </button>
      {:else}
        <input bind:value={newMessageText} on:keydown={handleInputKeyDown} type="text" id="chat" autofocus class="block mx-4 p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:outline-none focus:ring-[#24292F]/50 " placeholder="Message deVinci..." />
        <button class:has-text={newMessageText.length > 1}  type="submit" on:click={() => {sendMessage()}} class="inline-flex justify-center p-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
          <svg class="w-5 h-5 rotate-0 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
          </svg>
          <span class="sr-only">Send message</span>
        </button>
      {/if}
    </div>
  </form>
</footer>

<style>
	.has-text {
		background-color: rgb(243 244 246);
    cursor: pointer;
    opacity: 1;
	}
</style>
