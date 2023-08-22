<script lang="ts">
    import { store, encryptionServiceGlobal } from "../store";

    import type { ChatPreview } from "../../declarations/DeVinci_backend/DeVinci_backend.did";
    import type { CryptoService } from '../helpers/encryption_service';

    import { isEncryptionServiceInit } from "../helpers/utils";

    import Topnav from "../components/Topnav.svelte";
    import Footer from "../components/Footer.svelte";
    import LoginMenu from "../components/LoginMenu.svelte";

    let chats = [];
    let hasLoadedChats = false;
    let chatsRetrievalInProgress = false;

    let cryptoService: CryptoService;
    encryptionServiceGlobal.subscribe((value) => cryptoService = value);

    const editTitle = async (id) => {
        const newTitle = prompt('Enter new title');
        const chatIndex = chats.findIndex(chat => chat.id === id);
        chats[chatIndex].chatTitle = newTitle;
        // Persist to backend
        const updatedChatObject = {
            id: id,
            chatTitle: newTitle,
        };
        const chatUpdatedResponse = await $store.backendActor.update_chat_metadata(updatedChatObject);
    };

    const deleteChat = async (id) => {
        chats = chats.filter(chat => chat.id !== id);
        // Persist to backend
        const chatDeletedResponse = await $store.backendActor.delete_chat(id);
    };

    const loadUserChats = async () => {
        chatsRetrievalInProgress = true;
        const retrievedChatsResponse = await $store.backendActor.get_caller_chat_history();
        chatsRetrievalInProgress = false;
        // @ts-ignore
        const retrievedChats : ChatPreview[] = retrievedChatsResponse.Ok;
        for (let i = 0; i < retrievedChats.length; i++) {
            let firstMessagePreviewString;
            if (retrievedChats[i].firstMessagePreview.encrypted) {
                // Decrypt
                // Ensure encryption service is initialized before usage
                const encryptionServiceIsInit = await isEncryptionServiceInit();
                if (!encryptionServiceIsInit) {
                    console.error("Error: Encryption service not initialized.");
                    return;
                };
                firstMessagePreviewString = await cryptoService.decrypt(retrievedChats[i].firstMessagePreview.firstMessagePreview);
            } else {
                // Don't decrypt
                firstMessagePreviewString = retrievedChats[i].firstMessagePreview.firstMessagePreview;
            };
            chats.push({
                id: retrievedChats[i].id,
                creationTime: retrievedChats[i].creationTime,
                firstMessagePreview: firstMessagePreviewString,
                chatTitle: retrievedChats[i].chatTitle,
            });
        };
        hasLoadedChats = true;
    };
</script>

<Topnav />

<LoginMenu />

<section id="userchats" class="py-7 space-y-6 items-center text-center bg-slate-100">
    <h3 class="font-bold">My Chats</h3>
    {#if !$store.isAuthed}
      <p id='chatsSubtext'>Please login to view Your Chats.</p>
    {:else}
      {#if !hasLoadedChats}
        <p hidden>{loadUserChats()}</p>
        {#if chatsRetrievalInProgress}
            <p id='chatsSubtext'>Retrieving Your Chats...</p>
        {:else}
            <p id='chatsSubtext'>Decrypting Your Chats...</p>
        {/if}
      {:else}
        <div>
            {#each chats as chat (chat.id)}
                <div class="chat-item">
                    <div class="chat-info">
                        <div>{chat.chatTitle ? chat.chatTitle : "Untitled"}</div>
                        <div>{new Date(Number(chat.creationTime) / 1000000).toLocaleDateString()}</div>
                        <div>{chat.firstMessagePreview.substring(0, 100)}</div>
                    </div>
                    <div>
                        <button on:click={() => editTitle(chat.id)} class="bg-slate-300 text-slate-900 hover:bg-slate-500 hover:text-slate-900 p-1 m-px">Edit Title</button>
                        <button on:click={() => deleteChat(chat.id)} class="bg-slate-300 text-slate-900 hover:bg-slate-500 hover:text-slate-900 p-1 m-px">Delete</button>
                    </div>
                </div>
            {/each}
        </div>
      {/if}
    {/if}
</section>

<Footer />

<style>
    .chat-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .chat-info {
        display: flex;
        gap: 10px;
    }
    button {
        margin-left: 5px;
    }
</style>
