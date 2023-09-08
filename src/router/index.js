import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import PostDetail from '../components/PostDetail.vue';
import SearchPage from '../components/SearchPage.vue';
import NotificationsList from '../components/NotificationsList.vue';
import UserProfile from '../components/UserProfile.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/post/:postId', component: PostDetail },
  { path: '/search', component: SearchPage },
  { path: '/notifications', component: NotificationsList },
  { path: '/profile', component: UserProfile }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
