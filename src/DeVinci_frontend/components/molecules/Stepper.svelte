<script lang="ts">
    export let steps: { title: string; description: string }[];
  </script>
  
  <ol class="relative text-gray-500 border-s border-gray-200 ml-4">
    {#each steps as step, index}
      <li class="mb-10 ms-6">            
        <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-white">
          {index + 1}
        </span>
        <h3 class="font-medium leading-tight">{step.title}</h3>
        <p class="text-sm">{step.description}</p>
      </li>
    {/each}
  </ol>
  
  <style>
    ol {
      margin-left: 1rem !important;
    }
  </style>