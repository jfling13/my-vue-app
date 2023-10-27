import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// import { createRouter, createWebHistory } from 'vue-router';
import VueLazyload from 'vue-lazyload';
import 'font-awesome/css/font-awesome.min.css';
import store from './store';
const app = createApp(App);
app.use(VueLazyload, {
    preLoad: 1.3,
    error: '/images/path_to_error_image.png',
    loading: '/images/path_to_loading_image.gif',
    attempt: 1
});
export default router;
app.use(store);
app.use(router);
// app.use(Toast);
app.mount('#app');
