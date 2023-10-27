import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import LoginRegisterModel from '../components/LoginRegisterModel.vue';
import PostDetail from '../components/PostDetail.vue';
import SearchPage from '../components/SearchPage.vue';
import AddPost from '../components/AddPost.vue';
import NotificationsList from '../components/NotificationsList.vue';
import UserProfile from '../components/UserProfile.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginRegisterModel },
  { path: '/post/:postId', component: PostDetail },
  { path: '/add/', component: AddPost },
  { path: '/search', component: SearchPage },
  { path: '/notifications', component: NotificationsList },
  { path: '/profile', component: UserProfile }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
