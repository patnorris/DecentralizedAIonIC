import App from "./App.svelte"
import "./app.css"
import { registerSW } from 'virtual:pwa-register'

const app = new App({
  target: document.getElementById("root"),
})

const updateSW = registerSW({
  onOfflineReady() {},
})

/* if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/devinci-service-worker.js')
    .then(registration => console.log('SW registered: ', registration))
    .catch(registrationError => console.log('SW registration failed: ', registrationError));
}; */

export default app
