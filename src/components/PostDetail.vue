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
      <div>
    <div  v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-header">
            <img :src="comment.author_avatar" alt="User Avatar" class="commenter-avatar">
            <strong class="commenter-name">{{ comment.author_name }}</strong>
            <span class="comment-date">{{comment.created_at}}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <div class="comment-actions">
            <button class="comment-button" @click="startReply(comment.id)">回复</button>
            <button class="comment-button">点赞</button>
        </div>
    </div>
    <button v-if="hasMore" @click="loadMore">加载更多</button>
    </div>
    </template>
    <!-- 显示提示信息当没有评论时 -->
    <div v-else class="no-comments">
        写点什么吧~
    </div>
 </div>
 
      <!-- 添加评论表单 (示例) -->
      <form @submit.prevent="submitComment">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <textarea v-model="newCommentText" name="commentText" :placeholder="replyingTo ? '回复 ' + replyingTo.post.author_name : '添加评论'" ref="commentInput"></textarea>
        <button type="submit">提交评论</button>
      </form>

      <LoginRegisterModel 
      :show="showLoginModel" 
      @update:show="showLoginModel = $event" 
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
        hasMore: true,
        currentPage: 1,
        parentCommentId: null,
        newCommentText: '',
        errorMessage:'',
        user: null, // 假设null表示未登录
        showLoginModel: false,
        replyingTo: null,  // 保存我们正在回复的评论的数据
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
          this.comments = response.data.comments;

        });
    },
    methods: {
      submitComment() {
        if(!this.newCommentText){
          this.errorMessage = "还没有填写任何评论哦~";
          return;
        }
        if(!this.user){
            this.showLoginModel=true; // 显示登录/注册模态框
            return;
        }
        this.addComment();
      },
      startReply(comment) {
        this.parentCommentId = comment.id;
        this.replyingTo = comment;
        // 将输入框的焦点设置到评论文本上，使用户可以立即开始输入（这需要一个ref属性在文本框上）
        this.$refs.commentInput.focus();
      },

      addComment() {
        const postId = this.$route.params.postId;
        axios.post(`http://127.0.0.1:8000/api/add_comment/${postId}`, {
          text: this.newCommentText,
          user: this.user.id,
          parent: this.parentCommentId, //如果是空是对正文评论，如果非空则是对评论的评论
        })
        .then(response => {
          if (response.data.success) {
            const newComment = {
              author:response.data.response_data.author,
              author_avatar: response.data.response_data.author_avatar,
              author_name: response.data.response_data.author_name,
              content: response.data.response_data.content,
              created_at: response.data.response_data.created_at,
              id: response.data.response_data.id,
              parent: response.data.response_data.parent,
              post : response.data.response_data.post,
            };
            // this.comments = [...this.comments, newComment];
            this.comments.unshift(newComment);

            this.newCommentText = ''; // 清空评论文本
            this.parentCommentId = null;
            this.replyingTo = null;  // 重置回复状态
          } else {
            // 显示错误消息
            this.errorMessage = response.data.error;
          }
        });
      },
      loadMore() {
          this.loadMoreComments();
        },
      loadMoreComments() {
          const postId = this.$route.params.postId;
          axios.get(`http://127.0.0.1:8000/api/comment/${postId}?page=${this.currentPage + 1}`)
          .then(response => {
            if (response.data.comments.length) {
              this.comments.push(...response.data.comments);
              this.currentPage += 1;
            }
            if (!response.data.has_more) {
              this.hasMore = false;
            }
          })
          .catch(error => {
            // 你可以在这里处理错误，例如显示一个错误消息
            console.error('Error loading more comments:', error);
          });
        },     

      handleUserLoggedIn(user){
      this.user = user;
      this.showLoginModel = false;
      if(this.newCommentText) {
        this.addComment();
      }
    }
       
      },
      
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
.error-message {
  color: red;
  font-size: 13px;
}

</style>
