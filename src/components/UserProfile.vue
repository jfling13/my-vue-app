<template>
  <div>
    <!-- 检查用户是否已登录（假设user对象存在即为已登录） -->
    <div v-if="profile && user">
      <!-- 显示用户信息 -->
      <img :src="profile.avatar" alt="用户头像" />
      <p>用户名：{{ profile.username }}</p>
      <p>邮箱：{{ profile.email }}</p>
      <!-- 更换头像的链接 -->
      <a @click="triggerAvatarChange">点击更换头像</a>
      <input type="file" ref="avatarInput" @change="updateAvatar" style="display: none" accept="image/*">
    
    
    </div>
    <!-- 如果用户未登录，显示提示信息 -->
    <div v-else @click="showLoginModal"> 
      <p>请登录</p>
    </div>
<!-- Tabs -->
<div class="tabs">
    <button @click="currentTab = 'tab1';fetchPosts('tab1')" :class="{ 'selected-tab': currentTab === 'tab1' }">我的帖子</button>
    <button @click="currentTab = 'tab2';fetchPosts('tab2')" :class="{ 'selected-tab': currentTab === 'tab2' }">我的收藏</button>
    <button @click="currentTab = 'tab3';fetchPosts('tab3')" :class="{ 'selected-tab': currentTab === 'tab3' }">我的点赞</button>
  </div>

  <!-- Tab Content -->
  <div class="tab-content ">
  <div v-if="currentTab === 'tab1'" class="post-list">
    <div v-for="post in posts" :key="post.id" class="post-item">
      <router-link :to="`/post/${post.id}`">
      <img v-lazy="post.mask_url" alt="Post Mask Image"  class="post-image"/>
      </router-link>
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-author">{{ post.author }}</p>
      <div class="post-interactions">
        <span><i class="fa fa-thumbs-up"></i> {{ post.like_count }} </span>
        <span><i class="fa fa-star"></i> {{ post.favorite_count }} </span>
        <span><i class="fa fa-comments"></i> {{ post.comment_count }} </span>
      </div>
    </div>
  </div>
  <div v-if="currentTab === 'tab2' && posts.length" class="post-list">
    <div v-for="post in posts" :key="post.id" class="post-item">
      <router-link :to="`/post/${post.id}`">
      <img v-lazy="post.mask_url" alt="Post Mask Image"  class="post-image"/>
      </router-link>
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-author">{{ post.author }}</p>
      <div class="post-interactions">
        <span><i class="fa fa-thumbs-up"></i> {{ post.like_count }} </span>
        <span><i class="fa fa-star"></i> {{ post.favorite_count }} </span>
        <span><i class="fa fa-comments"></i> {{ post.comment_count }} </span>
      </div>
    </div>
  </div>
  <div v-if="currentTab === 'tab3'" class="post-list">
    <div v-for="post in posts" :key="post.id" class="post-item">
      <router-link :to="`/post/${post.id}`">
      <img v-lazy="post.mask_url" alt="Post Mask Image"  class="post-image"/>
      </router-link>
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-author">{{ post.author }}</p>
      <div class="post-interactions">
        <span><i class="fa fa-thumbs-up"></i> {{ post.like_count }} </span>
        <span><i class="fa fa-star"></i> {{ post.favorite_count }} </span>
        <span><i class="fa fa-comments"></i> {{ post.comment_count }} </span>
      </div>
    </div>
  </div>
</div>
<div v-if="currentTab === 'tab2' && !posts.length" class="no-more-data">
    你还没有收藏~
 </div>
    <LoginRegisterModel 
      :show="showLoginModel" 
      @update:show="updateShowLoginModel" 
      @userLoggedIn="handleUserLoggedIn"
    ></LoginRegisterModel>
    
  </div>
</template>

<script>
import axios from 'axios';
import LoginRegisterModel from './LoginRegisterModel.vue';
import { mapState } from 'vuex';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
  components: {
    LoginRegisterModel
  },
  computed: {
      ...mapState(['user'])
  },
  data() {
    return {
      avatar:'',
      profile: {
        avatar:''
      },
      showLoginModel: false,
      currentTab:'tab1',
      posts:[],
    };
  },
  
  methods: {
    fetchPosts(tab) {
      let apiUrl = '';
      switch(tab) {
        case 'tab1':
          apiUrl = 'http://127.0.0.1:8000/api/my_posts/';
          break;
        case 'tab2':
          apiUrl = 'http://127.0.0.1:8000/api/my_favorites/';
          break;
        case 'tab3':
          apiUrl = 'http://127.0.0.1:8000/api/my_likes/';
          break;
      }

    axios.get(apiUrl,{
      params: {
          userId: this.user.id // 假设这是你想要传递的用户ID
          }
    })
      .then(response => {
        this.posts = response.data;
      })
      .catch(error => {
        console.error('There was an error fetching the posts:', error);
        toast.error('获取数据失败，请稍后重试', {
          position: 'top-center',
        });
      });
  },
    triggerAvatarChange() {
      this.$refs.avatarInput.click();
    },
    async updateAvatar() {
      const formData = new FormData();
      const avatarFile = this.$refs.avatarInput.files[0];
      formData.append('avatar', avatarFile);
      formData.append('userId', this.user.id);

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/change_avatar/', formData);
        if (response.data.success) {
          toast.success('成功',{
            position:'top-center',
          });
          this.profile.avatar = URL.createObjectURL(avatarFile);
          
        }
      } catch (error) {
        console.error("Error uploading the avatar:", error);
      }
    },
    showLoginModal() {
      this.showLoginModel = true;
    },
    updateShowLoginModel(value) {
      this.showLoginModel = value;
    },
    handleUserLoggedIn(user) {
      // 处理用户登录
      this.profile = user;
      this.showLoginModel = false;
    }
  },
  async created() {
    try {
      if (!this.user) {
        this.showLoginModel = true;
        return;
      } else {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/',{
          params: {
          userId: this.user.id // 假设这是你想要传递的用户ID
          }
        });
        this.profile = response.data.user;
        const post_response = await axios.get('http://127.0.0.1:8000/api/my_posts/',{
          params: {
          userId: this.user.id // 假设这是你想要传递的用户ID
          }
        });
        this.posts = post_response.data;
      }
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<style scoped>
/* 容器样式 */
div {
  align-items: center;
  margin: 20px;
}

/* 图像样式 */
img {
  border-radius: 50%; /* 让图片呈现为圆形 */
  width: 100px; /* 设置图片宽度 */
  height: 100px; /* 设置图片高度 */
  object-fit: cover; /* 保证图片完整显示 */
  border: 2px solid #ddd; /* 图片边框 */
  margin-bottom: 10px; /* 图片下方的空白区域 */
}

/* 段落样式 */
p {
  margin: 5px 0; /* 段落上下的空白区域 */
  font-size: 16px; /* 字体大小 */
}

/* 链接样式 */
a {
  text-decoration: none; /* 移除链接下划线 */
  color: #3498db; /* 链接文字颜色 */
  margin-top: 10px; /* 链接上方的空白区域 */
}

/* 如果用户未登录，显示提示信息的样式 */
div v-else {
  cursor: pointer; /* 更改鼠标指针样式为手形 */
  color: red; /* 未登录提示文字颜色 */
}
/* 改变成功弹窗的背景颜色 */
.Toastify__toast--success {
  background-color: #38434a;
}

/* 改变成功弹窗的文本颜色 */
.Toastify__toast--success .Toastify__toast-body {
  color: #38434a;
}
/* Tab buttons样式 */
.tabs {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  border-bottom: 1px solid #ddd;
}

.tabs button {
  flex: 1;
  padding: 10px;
  /* background-color: #f7f7f7; */
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.selected-tab {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #8f7d7d;
}
.tabs button:hover {
  /* background-color: #433d3d; */
}

.no-more-data {
  display: block;
  text-align: center;
  padding: 20px 0;
  color: #888;
  font-size: 14px;
  margin-top: 14px; /* 如果需要在前面的元素和这个元素之间有间距 */
  width: 100%;
}
.tab-content {
  display: grid;
  justify-content: space-between;
  gap: 20px;  /* 设置帖子之间的间距 */
}

.post-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.post-item {
  flex: 0 0 calc(33.33% - 20px); 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  max-width: 400px; /* Maximum width for mobile devices */
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.post-image {
  width: 100%;
  height: 200px; 
  border-radius: 10px 10px 0 0;
  object-fit: cover;
}

.post-title {
  margin-top: 10px;
  font-weight: bold;
}

.post-author {
  margin-top: 5px;
  color: grey;
}

.post-interactions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
/* 响应式布局 */
@media (max-width: 600px) {
  .tab-content {
    grid-template-columns: 1fr;  /* 在小屏幕上，帖子应该堆叠在一起 */
  }
}
</style>

