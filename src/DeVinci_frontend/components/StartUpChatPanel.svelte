<script lang="ts">
  import devincilogo from "/devinci-logo.svg";

  export let sendMessageCallbackFunction;

  function sendMessage(message) {
    sendMessageCallbackFunction(message);
  };

  // Sample prompts
  const samplePrompt1 = 'Recommend a good book';
  const samplePrompt2 = 'What is decentralized AI?';
  const samplePrompt3 = 'Tell a funny joke';
  const samplePrompt4 = 'Who is Satoshi Nakamoto?';
</script>

<div>
  <div class="flex flex-col justify-center w-full items-center">
    <img src={devincilogo} class="rotating-image w-16 h-16 p-0 m-8 rounded-full" alt="devinci logo" />
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-4 w-full">
      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f9c490] rounded-lg cursor-pointer"
           on:click={() => sendMessage(samplePrompt1)}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{samplePrompt1}</p>
        </div>
      </div>
      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#a1c490] rounded-lg cursor-pointer"
           on:click={() => sendMessage(samplePrompt2)}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{samplePrompt2}</p>
        </div>
      </div>
      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#f0e68c] rounded-lg cursor-pointer"
           on:click={() => sendMessage(samplePrompt3)}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{samplePrompt3}</p>
        </div>
      </div>
      <div class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#cb8bd0] rounded-lg cursor-pointer"
           on:click={() => sendMessage(samplePrompt4)}>
        <div class="inline-flex items-center justify-between w-full p-3">
          <p class="w-full text-[#151b1e] text-sm font-normal">{samplePrompt4}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .cursor-pointer {
    cursor: pointer;
  }
</style>
