import App from "./App.svelte"
import "./app.css"
import {useRegisterSW} from 'virtual:pwa-register/svelte';

const {offlineReady, needRefresh, updateServiceWorker} = useRegisterSW({
    async onRegistered(swr) {
        console.log(`SW registered: `, swr);
        console.log(`SW installing: `, swr.installing);
        console.log(`SW navigationPreload: `, swr.navigationPreload);
        console.log(`SW navigationPreload getState: `, await swr.navigationPreload.getState());
    },
    onRegisterError(error) {
        console.log('SW registration error', error);
    },
    onOfflineReady() {
        console.log('SW ready for offline')
        //setTimeout(() => close(), 5000)
    }
});

const app = new App({
  target: document.getElementById("root"),
})

export default app
