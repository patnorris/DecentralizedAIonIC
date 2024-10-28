<script lang="ts"> 
  import { currentModelName, useKnowledgeBase } from "../store";
  
  function handleChange(event) {
    console.log("handleChange event ", event);
    // Toggle useKnowledgeBase based on the checkbox's checked state
    useKnowledgeBase.set(event.target.checked);
    console.log("Knowledge Base active:", $useKnowledgeBase);
  };
  </script>
  
  <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
    <div class="grid h-full max-w-lg grid-cols-1 mx-auto font-medium">
      <a href="#/settings" class="border inline-flex flex-col items-center justify-center px-1 hover:bg-gray-50 group">
        <span class="text-[10px] text-gray-500 group-hover:text-[#cb8bd0] text-left tracking-tight">
          CURRENT MODEL<br/>{$currentModelName}
        </span>
      </a>
      
      <button type="button" class="border inline-flex flex-col items-center justify-center px-1 hover:bg-gray-50 group">
        <label class="inline-flex items-center cursor-pointer">
          <span class="text-[10px] font-medium text-gray-500 text-left mr-2 uppercase tracking-tight">Knowledge<br /> Base</span>
          <input type="checkbox" bind:checked={$useKnowledgeBase} on:change={handleChange} class="sr-only peer">
          <div class="relative w-9 h-5 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </button>
    </div>
  </div>
  