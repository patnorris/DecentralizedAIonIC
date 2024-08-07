<script>
  import { webGpuSupportedBrowsers } from "../store";
  import devincilogo from "/devinci-logo.svg";
</script>

<div class="flex flex-col justify-center w-full max-w-xl h-lvh items-center mx-auto px-4">
  <img src={devincilogo} class="rotating-image w-16 h-16 p-0 m-8 rounded-full" alt="devinci logo" />
  <div class="p-4 mb-4 text-[#151b1e] border-2 border-dotted border-[#151b1e] rounded-2xl bg-gray-100" role="alert">
    <p class="mb-3 text-sm text-[#151b1e]">
      Unfortunately, your browser doesn't support the features needed for DeVinci yet. Please use one of the following browsers instead: <b>{webGpuSupportedBrowsers}</b>
    </p>
  </div>
</div>
