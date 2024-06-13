<div class="mt-auto w-full">
  <!--
  --- Show when user is logged and has saved chats
  -->
  <ul class="flex flex-col w-full">
    <li class="hover:bg-gray-400">
      <a href="#" class="bg-gray-200 flex flex-row items-center text-xs p-1 rounded-lg text-gray-700">
        Elephant trumpet call...
      </a>
    </li>
    <li class="hover:bg-gray-400">
      <a href="#" class="bg-gray-200 flex flex-row items-center text-xs p-1 rounded-lg text-gray-700">
        Victory throught time...
      </a>
    </li>
    <li class="hover:bg-gray-400">
      <a href="#" class="bg-gray-200 flex flex-row items-center text-xs p-1 rounded-lg text-gray-700">
        Help fixing...
      </a>
    </li>
    <li class="hover:bg-gray-400">
      <a href="#" class="bg-gray-200  flex flex-row items-center text-xs p-1 rounded-lg text-gray-700">
        How to setup a 3d printer...
      </a>
    </li>
  </ul>
  <!--
  --- Show if user is not logged
  -->
  <div id="dropdown-cta" class="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900" role="alert">
    <div class="flex items-center mb-3">
      <span class="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Chats</span>
      <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800" data-dismiss-target="#dropdown-cta" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
    <p class="mb-3 text-sm text-blue-800 dark:text-blue-400">
      DeVinci values your privacy. You can use it without logging in, and we won't save any of your chats. If you'd like us to privately save your chats for you, simply log in.
    </p>
  </div>
</div>
