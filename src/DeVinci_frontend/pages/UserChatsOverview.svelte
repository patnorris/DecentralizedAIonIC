<script>
    import { onMount } from "svelte";
    import { store } from "../store";

    import Topnav from "../components/Topnav.svelte";
    import Footer from "../components/Footer.svelte";
    import LoginMenu from "../components/LoginMenu.svelte";

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
        const chatUpdatedResponse = await $store.backendActor.update_chat_metadata(updatedChatObject);
    };

    const deleteChat = async (id) => {
        chats = chats.filter(chat => chat.id !== id);
        // Persist to backend
        const chatDeletedResponse = await $store.backendActor.delete_chat(id);
        console.log("Chat deleted: ", chatDeletedResponse);
    };

    const loadUserChats = async () => {
        chatsRetrievalInProgress = true;
        const retrievedChatsResponse = await $store.backendActor.get_caller_chat_history();
        console.log("Retrieved chats: ", retrievedChatsResponse);
        // @ts-ignore
        chats = retrievedChatsResponse.Ok;
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
                        <div>{chat.firstMessagePreview}</div>
                    </div>
                    <div>
                        <button on:click={() => editTitle(chat.id)}>Edit Title</button>
                        <button on:click={() => deleteChat(chat.id)}>Delete</button>
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
