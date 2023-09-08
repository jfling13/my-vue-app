import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueLazyload from 'vue-lazyload';
import 'font-awesome/css/font-awesome.min.css';

const app = createApp(App);

app.use(VueLazyload, {
    preLoad: 1.3,
    error: '/images/path_to_error_image.png',
    loading: '/images/path_to_loading_image.gif',
    attempt: 1
});

app.use(router);
app.mount('#app');
