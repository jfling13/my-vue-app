<template>
  <div v-if="showLoginModel" class="login-modal" @click="closeModel">
    <div class="login-content" @click.stop>
      <div v-if="activeTab === 'login'">
        <h3>登录</h3>
        <div v-if="errorMessages && errorMessages.length" class="error-message"> * {{ errorMessages }}</div>
        <input v-model="loginData.username" @input="clearErrors" placeholder="用户名">
        <input type="password" v-model="loginData.password" @input="clearErrors" placeholder="密码">
        <div class="g-recaptcha" ></div>
        <input v-model="loginData.captcha" @input="clearErrors" placeholder="验证码">
        <!-- 在登录部分 -->
        <div class="button-group">
        <button @click="handleLogin">登录</button>
        <button @click="switchTab('register')">注册</button>
        </div>
      </div>
      
      <div v-if="activeTab === 'register'">
        <h3>注册</h3>
        <input v-model="registerData.email" placeholder="邮箱">
        <input type="password" v-model="registerData.password" placeholder="密码">
        <input type="password" v-model="registerData.confirmPassword" placeholder="确认密码">
        <div class="g-recaptcha" ></div>
        <input v-model="registerData.captcha" placeholder="验证码">
        <!-- 在注册部分 -->
        <div class="button-group">
        <button @click="handleRegister">注册</button>
        <button @click="switchTab('login')">登录</button>
        </div>
      </div>

      <!-- <button @click="closeModel">关闭</button> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: ['show'],
  data() {
    return {
      sitekey:"6LdbwiooAAAAACVs0W8USDZtTdDBOqDcFqThtxZZ",
      activeTab: 'login',
      loginData: {
        username: '',
        password: '',
        captcha: ''
      },
      registerData: {
        email: '',
        password: '',
        confirmPassword: '',
        captcha: ''
      },
      errorMessages: '',
    };
    
  },
  computed: {
    showLoginModel() {
      return this.show;
    }
  },
  methods: {
    onVerify(isHuman) {
      if (isHuman) {
        // 用户通过了验证码验证
      } else {
        // 验证失败，可以选择重新加载验证码或提示用户
      }
    },
    switchTab(tabName) {
      this.activeTab = tabName;
    },
    closeModel() {
      this.$emit('update:show', false);
    },
    handleLogin() {
      this.clearErrors();
      if(!this.loginData.username){
        this.errorMessages = '必须填写用户名';return
      }

      if(!this.loginData.password || this.loginData.password.length < 8) {
        this.errorMessages = '密码不应小于8位数';return
      }

      if(!this.loginData.captcha || this.loginData.captcha.length < 5){
        this.errorMessages = '验证码不应小于5位数';return
      }

      axios.post('http://127.0.0.1:8000/api/login/', this.loginData)
        .then(response => {
          if (response.data.success) {
            // 登录成功，你可以关闭模态框并更新用户的状态
            this.closeModel();
            this.$emit('userLoggedIn', response.data.user);

          } else {
            // 显示错误消息
            this.errorMessages = response.data.error;
                
          }
        });
    },
    handleRegister() {
      axios.post('http://127.0.0.1:8000/api/register', this.registerData)
        .then(response => {
          if (response.data.success) {
            // 显示一个消息提示用户检查他们的邮箱
            alert('请检查您的邮箱进行验证！');
          } else {
            // 显示错误消息
            alert(response.data.message);
          }
        });
    },
    clearErrors(){
       this.errorMessages = '';
   },
  
  }
}
</script>

<style scoped>
.login-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
}

.login-content {
    max-width: 450px;
    padding: 20px;
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.login-content h3 {
    text-align: center;
    color: #2B2B2B;  /* 设置为雅黑色 */
    margin-bottom: 20px;
    font-weight: 500;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.login-content input {
    width: 95%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
    color: #2B2B2B;  /* 设置为雅黑色 */
    font-size: 14px;
}

.login-content button {
    padding: 10px 20px;
    background-color: #2B2B2B;  /* 设置为浅黑色 */
    border: none;
    border-radius: 4px;
    color: #fff;  
    cursor: pointer;
    font-size: 15px;
    transition: background-color 0.3s ease;
    flex: 1;
}

.login-content button:hover {
    background-color: #1a1a1a;
}

/* 为按钮组容器提供样式 */
.login-content .button-group {
    display: flex;
    justify-content: space-between;  
    gap: 10px;  
}
.error-message{
  color: red;
  font-weight: bold;
}
</style>
