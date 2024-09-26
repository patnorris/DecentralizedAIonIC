<footer class="footer fixed bottom-0 py-4 bg-gray-900 border-t-4 border-gray-600 left-0 md:left-36 w-full md:ml-36 md:w-[calc(100%-18rem)] overflow-hidden">
  <div class="scrolling-text-container w-full mx-auto">
    <p class="scrolling-text text-lg bold text-gray-50">
      The LLM model is currently being downloaded to your browser cache. We appreciate your patience, as this may take a little time depending on your connection. Once the download is complete, the model will initialize, allowing you to enjoy a fully private chat. This brief wait ensures the highest level of privacy for your experience. 
    </p>
  </div>
</footer>

<style>
  .scrolling-text-container {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }

  .scrolling-text {
    display: inline-block;
    padding-left: 100%;
    animation: scroll-left 50s linear infinite;
  }

  @keyframes scroll-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>
