<script lang="ts">
  import Newsletter from "../components/Newsletter.svelte";
  import devincilogo from "/devinci.svg";
</script>

<div class="flex justify-between px-4 mx-auto max-w-screen-xl ">
  <article class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue">
    <header class="mb-4 lg:mb-6 not-format">
     
      <address class="flex items-center mb-6 not-italic">
        <div class="inline-flex items-center mr-3 text-sm text-gray-900">
          <img class="mr-4 w-16 h-16 rounded-full" src={devincilogo} alt="deVinci logo">
          <div>
            <a href="#" rel="author" class="text-xl font-bold text-gray-900">DeVinci</a>
            <p class="text-base text-gray-500"> Powered by <a href='https://www.onicai.com/' target='_blank' rel="noreferrer" class='underline'>onicai</a> and hosted on <a href='https://internetcomputer.org/' target='_blank' rel="noreferrer" class='underline'>Internet Computer</a>
            </p>
          </div>
        </div>
      </address>
      <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl">Howdy from DeVinci</h1>
    </header>
    <p class="lead">Hi there! I'm DeVinci, your truly personal AI assistant. I can help you with whatever you need, and I'm always here to answer your questions. Whether you're looking for advice, support, or just a friendly chat, I'm here to help.</p>
    <h3 class="my-4 text-2xl font-bold">About DeVinci<br /> Decentralized, Trusted, Open-source, Truly Yours</h3>
    <p>DeVinci is your personalized AI assistant that redefines the paradigm of digital privacy and trust. It's not just an assistant; it's a mission to revolutionize how AI and data privacy intersect.</p>
    <p class="my-4">DeVinci is powered by an open-source AI model that operates directly within your browser. When you engage with DeVinci, the AI model is loaded and processed on your device. This means your interactions stay completely within the confines of your device. Your data never leaves your hands, ensuring unprecedented control over your data and a level of privacy that is a rarity in today's world of AI assistants.</p>
    <p class="my-4">Unlike traditional AI assistants backed by corporations, DeVinci is fully independent. There is no big company behind it, influencing or manipulating the responses to favor their interests. DeVinci's sole purpose is to serve you and provide you with the most honest, unbiased assistance.</p>
    <p class="my-4">For logged in users, DeVinci offers additional features such as persistent chats. By harnessing the power of the decentralized cloud, the Internet Computer, your chats are stored securely and privately. They can be retrieved and continued at any time, from any device.</p>
    <p class="my-4">In an era where data privacy and trustworthiness are highly valued, DeVinci stands at the forefront. It provides a personalized AI assistant experience that not only safeguards user privacy but also ensures unbiased, honest interactions. With DeVinci, you can have meaningful conversations, ask questions, seek help, and feel confident that your AI assistant truly has your best interests at heart.</p>
    <p class="my-4">We hope you enjoy your interactions with DeVinci and that it'll be highly useful to you as your favorite AI assistant. For any feedback or questions, please get in touch with us. Thank you for using our app and DeVinci!</p>
    <h3 class="font-bold">Credits</h3>
    <p>Vector graphics sponsored by <a href="https://www.freepik.com/">Freepik.</a> Running DeVinci in your browser is enabled by the great open-source project <a href='https://webllm.mlc.ai/' target='_blank' rel="noreferrer" class='underline'>Web LLM.</a> Serving this app and hosting your data securely and in a decentralized way is made possible by the <a href='https://internetcomputer.org/' target='_blank' rel="noreferrer" class='underline'>Internet Computer</a></p>
  </article>
</div>

<Newsletter />