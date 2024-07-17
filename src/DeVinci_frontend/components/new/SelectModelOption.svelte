<script>
  export let id;
  export let name;
  export let value;
  export let title;
  export let parameters;
  export let performance;
  export let size;
  export let callbackLoadChatModel;

  document.addEventListener("DOMContentLoaded", function() {
    const spans = document.querySelectorAll(".performance-span");

    // Define a mapping of performance to background colors
    const backgroundColors = {
      "Good": "#f9c490",
      "Super Good": "#a1c490",
      "Alright": "#f0e68c",
      "Good for Chinese": "#76c7be",
      "Great for Math": "rgb(237, 98, 98)",
      "Insane": "rgb(203, 139, 208)",
    };

    // Function to set background color and save to localStorage
    function setBackgroundColor(span) {
      const performance = span.textContent.trim(); // Get the text content of the span and trim any whitespace
      if (backgroundColors[performance]) {
        const color = backgroundColors[performance];
        span.style.backgroundColor = color;
        // Save the color to localStorage
        localStorage.setItem(`span-${performance}`, color);
      }
    }

    // Function to load background color from localStorage
    function loadBackgroundColor(span) {
      const performance = span.textContent.trim();
      const savedColor = localStorage.getItem(`span-${performance}`);
      if (savedColor) {
        span.style.backgroundColor = savedColor;
      } else {
        // If no saved color, set it
        setBackgroundColor(span);
      }
    }

    // Apply background color change to each span element
    spans.forEach(span => loadBackgroundColor(span));

    // Observer to apply background colors on subsequent navigations
    const observer = new MutationObserver(function() {
      const spans = document.querySelectorAll(".performance-span");
      spans.forEach(span => {
        const performance = span.textContent.trim();
        const savedColor = localStorage.getItem(`span-${performance}`);
        if (savedColor) {
          span.style.backgroundColor = savedColor;
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });



</script>

<li class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#151b1e] rounded-lg">
  <div>
    <input type="radio" id={id} name="selectModel" value={value} class="hidden peer" on:click={() => callbackLoadChatModel(id)} />
    <label for={id} class="inline-flex items-center justify-between w-full p-3 cursor-pointer peer-checked:border-solid peer-checked:cursor-default peer-checked:bg-[lightsteelblue] peer-checked:border-[#151b1e] peer-checked:text-[#151b1e] hover:text-gray-600 hover:bg-gray-50">
      <div class="block">
        <div class="w-full text-[#151b1e] text-md font-semibold">{name}</div>
        <div class="w-full text-sm font-normal">{parameters}</div>
        <span class="performance-span text-[#151b1e] text-xs font-medium me-1.5 px-2.5 py-0.5 bg-gray-300 rounded border-2 border-[#151b1e]">{performance}</span>
        <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-gray-500">{size}</span>
      </div>
      <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </label>
  </div>
  <div class="p-3 pt-1 pb-2">
    <div class="w-full bg-gray-200 my-1 rounded-full">
      <div class="bg-[dimgrey] text-xs font-medium text-orange-50 text-center p-0.5 leading-none rounded-full" style="width: 45%"> 45%</div>
    </div>
    <span class="inline-flex items-center bg-[lightsteelblue] text-[#151b1e] text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
      Downloaded
      <svg class="ml-0.5 w-3 h-3 text-[#151b1e]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z"/>
      </svg>
    </span>
  </div>
</li>

<style>
	.peer:checked + label svg {
		color: rgb(176 196 222);
	}

  .performance-span {
	  transition: background-color 3.3s ease-in-out; /* Adjust the duration and easing as needed */
  }
</style>
