<script lang="ts">
  import ChatInput from "../components/new/ChatInput.svelte";
  import SelectModel from "../components/new/SelectModel.svelte";
  import MyChats from "../components/new/MyChats.svelte";
</script>


<div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">

  <MyChats />

  <main class="main flex flex-col flex-grow -ml-64  md:ml-0 transition-all duration-150 ease-in">
     <header class="header bg-white shadow py-4 px-4">
       <div class="header-content flex items-center flex-row">
          <div class="flex ml-auto">
            <a href class="flex flex-row items-center">
             settings
            </a>
          </div>
       </div>
     </header>

     <SelectModel />
     <ChatInput/>
  </main>
</div>






<style global>
/* NOTE: these styles are global and affect any element in the app. Thus, ensure that there aren't any conflicts with the class names chosen (i.e. avoid generic names as they might conflict with an A-Frame class, e.g. content which is used in the Inspector)  */
  .App-logo {
    height: 15vmin;
    pointer-events: none;
  }

  .App-header {
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
  }

  .App-link {
    color: rgb(26, 117, 255);
  }

  .demo-button {
    background: #a02480;
    padding: 0 1.3em;
    margin-top: 1em;
    border-radius: 60px;
    font-size: 0.7em;
    height: 35px;
    outline: 0;
    border: 0;
    cursor: pointer;
    color: white;
  }

  .demo-button:active {
    color: white;
    background: #979799;
  }

  .space-details-collapsible {
    padding: 7px;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .active-app-button:hover, .space-details-collapsible:hover {
    background-color: #555;
  }

  .space-details-content {
    display: none;
    overflow: hidden;
  }

  .devinci-topnav {
    background: #333;
  }

  footer {
    background: #333;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px 0;
  }

  footer p {
    margin-bottom: 20px;
  }

  footer a {
    margin: 0 10px;
    color: #ffffff;
  }

  footer img {
    display: block;
    width: 20%;
    max-width: 900px;
    height: auto;
    margin: auto;
  }
</style>
