<template>
  <div>
    <!-- 检查用户是否已登录（假设user对象存在即为已登录） -->
    <div v-if="profile && user">
      <!-- 显示用户信息 -->
      <img :src="profile.avatar" alt="用户头像" />
      <p>用户名：{{ profile.username }}</p>
      <p>邮箱：{{ profile.email }}</p>
      <!-- 更换头像的链接 -->
      <a @click="changeAvatar">点击更换头像</a>
    </div>

    <!-- 如果用户未登录，显示提示信息 -->
    <div v-else @click="showLoginModal"> 
      <p>请登录</p>
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
      profile: null,
      showLoginModel: false,
    };
  },
 
  methods: {
    changeAvatar() {
      // 添加更换头像的代码
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
        console.log(this.profile);
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
  display: flex;
  flex-direction: column;
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
</style>

