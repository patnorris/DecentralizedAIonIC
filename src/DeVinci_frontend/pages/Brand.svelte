<script lang="ts">
  import devincilogo from "/devinci.svg";
  import devincilogosvgdownload from "/devinci.zip?url";
  import devincilogopngdownload from "/devinci.png.zip?url";
</script>


<div class="flex justify-between px-4 mb-12 mx-auto max-w-screen-2xl">
  <article class="mx-auto w-full max-w-4xl format format-sm sm:format-base lg:format-lg format-blue">
    <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl">Logo</h1>
    <div class="w-full mx-auto">
      <img class="h-1/3 w-1/3 rounded-full mx-auto" src={devincilogo} alt="deVinci logo">
      <div class="mt-12 flex justify-center">
        <a href="{devincilogosvgdownload}" download class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Download SVG</a>
        <a href="{devincilogopngdownload}" download  class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Download PNG</a>
      </div>
    </div>
    <h1 class="my-14 mt-32 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl">Color codification</h1>
    <h1 class="my-14 text-xl font-extrabold leading-tight text-gray-700 lg:mb-6 lg:text-3xl">Primary colors</h1>

    <div class="flex flex-row max-w-xl  items-center bg-white mb-2 border border-gray-200 rounded-lg shadow">
      <div class="bg-[#b0c4de] h-40 w-40"></div>
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-700">#b0c4de</h5>
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-700">rgb(176,196,222)</h5>
      </div>
    </div>

    <div class="flex flex-row max-w-xl items-center bg-white border border-gray-200 rounded-lg shadow">
      <div class="bg-[#151b1e] h-40 w-40"></div>
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-700">#151b1e</h5>
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-700">rgb(21,27,30)</h5>
      </div>
    </div>

    <h1 class="my-14 text-xl font-extrabold leading-tight text-gray-700 lg:mb-6 lg:text-3xl">Secondary colors</h1>

    <div class="flex flex-row max-w-xl items-center bg-white mb-2 border border-gray-200 rounded-lg shadow">
      <div class="bg-[#f9c490] h-28 w-28"></div>
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">#f9c490</h5>
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">rgb(249, 196, 144)</h5>
      </div>
    </div>
    <div class="flex flex-row max-w-xl items-center bg-white mb-2 border border-gray-200 rounded-lg shadow">
      <div class="bg-[#a1c490] h-28 w-28"></div>
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">#a1c490</h5>
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">rgb(161, 196, 144)</h5>
      </div>
    </div>
    <div class="flex flex-row max-w-xl items-center bg-white mb-2 border border-gray-200 rounded-lg shadow">
      <div class="bg-[#f0e68c] h-28 w-28"></div>
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">#f0e68c</h5>
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">rgb(240, 230, 140)</h5>
      </div>
    </div>
    <div class="flex flex-row max-w-xl  items-center bg-white mb-2 border border-gray-200 rounded-lg shadow w-full">
      <div class="bg-[#cb8bd0] h-28 w-28"></div>
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">#cb8bd0</h5>
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">rgb(203, 139, 208)</h5>
      </div>
    </div>

    <h1 class="my-14 text-xl font-extrabold leading-tight text-gray-700 lg:mb-6 lg:text-3xl">Typography</h1>

    <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-500">Sans-serif </h5>
    <div class="overflow-x-auto max-w-full">
    <pre class="bg-gray-800 text-white p-4 rounded-lg text-sm leading-normal">
<code class="font-mono break-words whitespace-pre-wrap word-break-all">font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";</code>
    </pre>
  </div>
    <h5 class="my-4 text-xl font-bold tracking-tight text-gray-500">Serif </h5>
    <div class="overflow-x-auto max-w-full">
    <pre class="bg-gray-800 text-white p-4 rounded-lg text-sm leading-normal">
<code class="font-mono break-words whitespace-pre-wrap word-break-all">font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;</code>
    </pre>
    </div>

    <h5 class="my-4 text-xl font-bold tracking-tight text-gray-500">Mono </h5>
    <div class="overflow-x-auto max-w-full">
    <pre class="bg-gray-800 text-white p-4 rounded-lg text-sm leading-normal">
<code class="font-mono break-words whitespace-pre-wrap word-break-all">font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;</code>
    </pre>
  </div>

</article>
</div>




<style>
  pre {
    max-width: 100%;
  }
  code {
    display: inline-block;
    max-width: 100%;
    white-space: pre-wrap;
    word-break: break-all;
    overflow-wrap: break-word;
  }
</style>

