<template>
  <div v-if="user" class="search-page">
    <div class="search-bar">
      <input type="text" placeholder="" v-model="searchQuery" />
      <button @click="search">搜索</button>
    </div>
    <div class="categories">
      <span>历史记录</span>
      <div class="history">
        
      </div>
    </div>
    <div class="categories">
      <span>相关内容</span>
    <div class="related">

    </div>
    </div>
    <div class="categories">
      <span>热搜发现</span>
      <div class="discover">

      </div>
    </div>
    <!-- 在这里添加搜索结果 -->
    <div class="results">
      <!-- 您可以使用 v-for 显示从 API 获取的结果 -->
    </div>
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
      searchQuery: "",
      results: [],  // 从API获取的结果存放于此
      history:[],
      related:[],
      discover:[],
    };
  },
  methods: {
      // TODO: 调用API搜索方法
      search() {
      const formData = new FormData();

      formData.append('userId', this.user.id);
      formData.append('query',this.searchQuery);
      try {
        const response =axios.post('http://127.0.0.1:8000/api/search/', formData);
        if (response.data.success) {
          alert(1111111111)
          
        }
      } catch (error) {
        console.error("Error with searching:", error);
      }
    },
},
};
</script>

<style scoped>
.search-page {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-color: #f7f7f7;
  width: 90%;
}
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 22px;
  padding: 10px;
  background-color: #fff;
}
.search-bar input {
  flex-grow: 1;
  border: none;
  outline: none;
  
}
.search-bar button {
  padding: 5px 15px;
  border: none;
  background-color: #ddd;
  border-radius: 15px;  /* 添加此属性使按钮圆角 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #ccc;
}
.categories {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.categories span {
  padding: 10px;
  font-size: small;
  background-color: #cac5c5;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.categories span:hover {
  background-color: #f0f0f0;
}
.results {
  margin-top: 20px;
}
</style>
