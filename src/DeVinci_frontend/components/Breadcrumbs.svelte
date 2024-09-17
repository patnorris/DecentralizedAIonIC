<script lang="ts">
  import { location } from 'svelte-spa-router';
  import { derived } from 'svelte/store';

  // Create a derived store for the current page name
  const currentPage = derived(location, $location => {
    if ($location === '/') return 'Home';
    const path = $location.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  });

  // Create a derived store to determine if we should show breadcrumbs
  const showBreadcrumbs = derived(location, $location => $location !== '/');
</script>

{#if $showBreadcrumbs}
  <nav class="justify-between mb-8 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50" aria-label="Breadcrumb">
    <ol class="inline-flex items-center mb-3 space-x-1 md:space-x-2 rtl:space-x-reverse sm:mb-0">
      <li>
        <div class="flex items-center">
          <a href="/" class="ms-1 text-sm font-medium text-gray-700 hover:text-gray-400 md:ms-2">Chat</a>
        </div>
      </li>
      <li aria-current="page">
        <div class="flex items-center">
          <svg class="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
          </svg>
          <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2">{$currentPage}</span>
        </div>
      </li>
    </ol>
  </nav>
{/if}