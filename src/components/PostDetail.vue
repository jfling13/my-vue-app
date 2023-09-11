<template>
    <div class="post-detail">
      <h1>{{ post.title }}</h1>
      <p class="post-author">{{ post.author_name }}</p>
      <img :src="post.mask_url" alt="Post Mask Image"  class="post-image"/>
      <div v-html="post.content"></div>
  
      <!-- 评论区标题 -->
      <h4 class="comments-title">看看大家都在说什么：</h4>

    <!-- 评论列表 -->
    <div class="comments-list">
    <template v-if="comments.length > 0">
    <div  v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-header">
            <img :src="comment.author_avatar" alt="User Avatar" class="commenter-avatar">
            <strong class="commenter-name">{{ comment.author_name }}</strong>
            <span class="comment-date">{{comment.created_at}}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <div class="comment-actions">
            <button class="comment-button">回复</button>
            <button class="comment-button">点赞</button>
        </div>
    </div>
    </template>
    <!-- 显示提示信息当没有评论时 -->
    <div v-else class="no-comments">
        写点什么吧~
    </div>
 </div>
 
      <!-- 添加评论表单 (示例) -->
      <form @submit.prevent="submitComment">
        <textarea v-model="newCommentText" name="commentText"></textarea>
        <button type="submit">提交评论</button>
      </form>

      <LoginRegisterModel 
      :show="showLoginRegisterbox" 
      @update:show="showLoginRegisterbox = $event" 
      @userLoggedIn="handleUserLoggedIn"
    ></LoginRegisterModel>

    </div>


  </template>
  
  <script>
  import axios from 'axios';
  import LoginRegisterModel from './LoginRegisterModel.vue';
  export default {
    components: {
        LoginRegisterModel
  },
    data() {
      return {
        post: {},
        comments: [],
        newCommentText: '',
        user: null, // 假设null表示未登录
        showLoginRegisterbox: false
      };
    },
    created() {
      const postId = this.$route.params.postId;
      axios.get(`http://127.0.0.1:8000/api/detail/${postId}`)
        .then(response => {
          this.post = response.data;
        });
      
      axios.get(`http://127.0.0.1:8000/api/comment/${postId}`)
        .then(response => {
          this.comments = response.data;

        });
    },
    methods: {
      submitComment() {
        if(!this.user){
            this.showLoginRegisterbox=true; // 显示登录/注册模态框
            return;
        }
        const postId = this.$route.params.postId;
        axios.post(`http://127.0.0.1:8000/api/add_comment/${postId}`, {
          text: this.newCommentText,
          user:this.user,
        //   parent:this.parent,
        })
        .then(response => {
          this.comments.push(response.data);
          this.newCommentText = ''; // 清空评论文本
        });
      },
      handleUserLoggedIn(user) {
      this.user = user;
      this.showLoginRegisterbox = false;
    }
    }
  }
  </script>
  
  <style scoped>
/* 根据需要添加样式 */
.post-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.post-detail h1 {
    margin-bottom: 5px;
}

.post-author {
    color: #888;
    margin-bottom: 20px;
}

.post-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
}

.comments-title {
    font-size: 1.5em;
    margin-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
}

.comments-list {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
}

.comment {
    border-bottom: 1px solid #eee;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.comment-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

.commenter-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.commenter-name {
    font-weight: bold;
    margin-right: 10px;
}

.comment-date {
    font-size: 0.8em;
    color: #888;
}

.comment-content {
    margin-top: 5px;
}

.comment-actions {
    display: flex;
    gap: 10px;
}

.comment-button {
    background-color: #f7f7f7;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.3s;
}

.comment-button:hover {
    background-color: #ddd;
}

form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
}

button[type="submit"] {
    align-self: flex-end;
    padding: 10px 20px;
    border: none;
    background-color: #008cba;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button[type="submit"]:hover {
    background-color: #005f5f;
}
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content {
  background: #fff;
  padding: 20px;
  width: 300px;
  border-radius: 10px;
}

</style>
