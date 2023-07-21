<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";

  import Message from './Message.svelte';
    import { now } from "svelte/internal";

  export let modelCallbackFunction;
  export let chatDisplayed;

  let newMessageText = '';
  let messages = [];

  let replyText = 'Thinking...';

  let messageGenerationInProgress = false;

  const generateProgressCallback = (_step: number, message: string) => {
    replyText = message;
    messages = [...messages.slice(0, -1), { sender: 'DeVinci', content: replyText }];
  };

  async function sendMessage() {
    messageGenerationInProgress = true;
    if(newMessageText.trim() !== '') {
      console.log("Sending message: ", newMessageText.trim());
      messages = [...messages, { sender: 'You', content: newMessageText.trim() }];
      const newPrompt = newMessageText.trim();
      newMessageText = '';
      try {
        messages = [...messages, { sender: 'DeVinci', content: replyText }];
        console.log("Sending prompt to model: ", newPrompt);
        const reply = await modelCallbackFunction(newPrompt, generateProgressCallback);
        messages = [...messages.slice(0, -1), { sender: 'DeVinci', content: reply }];
        console.log("Got response from model: ", reply);   
      } catch (error) {
        console.error("Error getting response from model: ", error);
        messages = [...messages, { sender: 'DeVinci', content: "There was an error unfortunately. Please try again." }];
      }
      replyText = 'Thinking...';
    }
    messageGenerationInProgress = false;
    // Store chat
    console.log("Debug Chat to be stored: ", chatDisplayed);
    if(chatDisplayed) {
      // Update chat
      try {
        const chatUpdatedResponse = await $store.backendActor.update_chat_messages(chatDisplayed.id, messages);  
        console.log("Debug Chat updated: ", chatUpdatedResponse);    
      } catch (error) {
        console.error("Error storing chat: ", error);        
      };
    } else {
      // New chat
      try {
        const chatCreatedResponse = await $store.backendActor.create_chat(messages);
        console.log("Debug Chat created: ", chatCreatedResponse); 
        // @ts-ignore
        if (chatCreatedResponse.Err) {
          // @ts-ignore
          console.error("Error message creating new chat: ", chatCreatedResponse.Err);
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
        };
      } catch (error) {
        console.error("Error creating new chat: ", error);       
      };
    };
  };

// Retrieve the chat's history if an existing chat is to be displayed
  let chatRetrievalInProgress = false;

  const loadChat = async () => {
    if(chatDisplayed) {
      chatRetrievalInProgress = true;
      const chatHistoryResponse = await $store.backendActor.get_chat(chatDisplayed.id);
      // @ts-ignore
      const chatHistory = chatHistoryResponse.Ok;
      messages = chatHistory.messages;
    };
    // Fresh chat
  };

  onMount(loadChat);
</script>

<div class="chatbox">
  <div class="messages">
    {#each messages as message (message.content)}
      <Message {message} />
    {/each}
  </div>

  <div class="message-input">
    <input bind:value={newMessageText} placeholder="Type your message here..." />
    {#if messageGenerationInProgress}
      <button disabled on:click={sendMessage}>Send</button>
    {:else}
      <button on:click={sendMessage}>Send</button>
    {/if}
  </div>
</div>

<style>
  .chatbox {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
  }

  .messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .message-input {
    height: 60px;
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
  }

  .message-input input {
    height: 40px;
    flex-grow: 1;
    margin-right: 10px;
  }
</style>
