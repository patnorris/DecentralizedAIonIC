<script>
    import { store } from "../store";

    import Topnav from "../components/Topnav.svelte";
    import Footer from "../components/Footer.svelte";
    import LoginMenu from "../components/LoginMenu.svelte";

    import {
        getLocallyStoredChatHistory,
        storeChatHistoryLocally,
        syncLocalChanges
    } from "../helpers/local_storage";

    let chats = [];
    let hasLoadedChats = false;
    let chatsRetrievalInProgress = false;

    const editTitle = async (id) => {
        const newTitle = prompt('Enter new title');
        const chatIndex = chats.findIndex(chat => chat.id === id);
        chats[chatIndex].chatTitle = newTitle;
        // Persist to backend
        const updatedChatObject = {
            id: id,
            chatTitle: newTitle,
        };
        try {
            const chatUpdatedResponse = await $store.backendActor.update_chat_metadata(updatedChatObject);
            syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
        } catch (error) {
            // only available if online
            console.error("Error updating chat metadata: ", error);
        };
    };

    const deleteChat = async (id) => {
        chats = chats.filter(chat => chat.id !== id);
        // Persist to backend
        try {
            const chatDeletedResponse = await $store.backendActor.delete_chat(id);
            syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
        } catch (error) {
            // only available if online
            console.error("Error deleting chat: ", error);
        };
    };

    const loadUserChats = async () => {
        chatsRetrievalInProgress = true;
        try {
            const retrievedChatsResponse = await $store.backendActor.get_caller_chat_history(); 
            // @ts-ignore
            if (retrievedChatsResponse.Ok) {
                // @ts-ignore
                chats = retrievedChatsResponse.Ok;
                // store chat history locally for offline usage
                // @ts-ignore
                storeChatHistoryLocally(retrievedChatsResponse.Ok);
                syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
            } else {
                // @ts-ignore
                console.error("Error retrieving chat history: ", retrievedChatsResponse.Err);
                // @ts-ignore
                throw new Error("Error retrieving chat history: ", retrievedChatsResponse.Err);
            };
        } catch (error) {
            // Likely in offline usage
            const storedChatHistory = getLocallyStoredChatHistory();
            if (storedChatHistory) {
                chats = storedChatHistory;
            };
        };
        chatsRetrievalInProgress = false;
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
        <p id='chatsSubtext'>Retrieving Your Chats...</p>
        <p hidden>{loadUserChats()}</p>
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
