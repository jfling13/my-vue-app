<template>
  <div v-if="showLoginModel" class="login-modal" @click="closeModel">
    <div class="login-content" @click.stop>
      <div v-if="activeTab === 'login'">
        <h3>登录</h3>
        <div v-if="errorMessages && errorMessages.length" class="error-message"> * {{ errorMessages }}</div>
        <input v-model="loginData.username" @input="clearErrors" placeholder="用户名" name="username">
        <input type="password" v-model="loginData.password" @input="clearErrors" placeholder="密码" name="password">
        <div class="recaptcha-container">
         <span>请进行验证：</span>
         <div class="g-recaptcha" :data-sitekey='sitekey' ></div>
        </div>
        <!-- 在登录部分 -->
        <div class="button-group">
        <button @click="handleLogin">登录</button>
        <button @click="switchTab('register')">注册</button>
        </div>
      </div>
      
      <div v-if="activeTab === 'register'">
        <h3>注册</h3>
        <input v-model="registerData.username" placeholder="用户名" name="username">
        <input v-model="registerData.email" placeholder="邮箱" name="email">
        <input type="password" v-model="registerData.password" placeholder="密码" name="password">
        <input type="password" v-model="registerData.confirmPassword" placeholder="确认密码" name="repassword">
        <div class="recaptcha-container">
         <span>请进行验证：</span>
         <div class="g-recaptcha" :data-sitekey='sitekey' ></div>
        </div>
        <!-- 在注册部分 -->
        <div class="button-group">
        <button @click="switchTab('login')">登录</button>
        <button @click="handleRegister">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */

import axios from 'axios';
import { mapState,mapMutations } from 'vuex';

export default {
  mounted() {
    this.$nextTick(() => {
        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js";
        document.body.appendChild(script);
    });
},
  props: ['show'],
  data() {
    return {
      sitekey:"6LfDfTooAAAAAOeO7TKdF8Eb0Ucq_P5vReFpdwxP",
      activeTab: 'login',
      loginData: {
        username: '',
        password: '',
        captchaResponse: '',
        captchaValue:'',
      },
      registerData: {
        email: '',
        password: '',
        confirmPassword: '',
        captchaResponse: '',
        captchaValue:'',
      },
      errorMessages: '',
    };
    
  },
  watch: {
  showLoginModel(newValue) {
    if (newValue) {
      this.$nextTick(() => {
        if (window.grecaptcha && grecaptcha.render) {
          grecaptcha.render(document.querySelector('.g-recaptcha'), {
            sitekey: this.sitekey,
            size: "normal",
            theme: "light"
          });
        }
      });
    }
  }
},
  computed: {
    ...mapState(['user']),
    showLoginModel() {
      return this.show;
    }
  },
  methods: {
    ...mapMutations(['SET_USER']),
    switchTab(tabName) {
    this.activeTab = tabName;
    this.$nextTick(() => {
        if (window.grecaptcha && grecaptcha.render) {
            grecaptcha.render(document.querySelector('.g-recaptcha'), {
                sitekey: this.sitekey,
                size: "normal",
                theme: "light"
            });
        }
    });
},
    
    closeModel() {
      this.$emit('update:show', false);
    },
    async handleLogin() {
      this.clearErrors();

      this.captchaValue = document.querySelector('.g-recaptcha-response') ? document.querySelector('.g-recaptcha-response').value : null;


      if(!this.loginData.username){
        this.errorMessages = '必须填写用户名';return
      }

      if(!this.loginData.password || this.loginData.password.length < 8) {
        this.errorMessages = '密码不应小于8位数';return
      }

      if (!this.captchaValue) {
       this.errorMessages = "请完成验证码验证";
        return;
      }

      this.loginData.captchaResponse = this.captchaValue;
      
      axios.post('http://127.0.0.1:8000/api/login/',this.loginData)
        .then(response => {
          if (response.data.success) {
            const token = response.data.access_token; // 假设后端返回了一个叫做 'access' 的字段
            // const refreshToken = response.data.refresh_token;
            localStorage.setItem('user_token', token); // 保存 token
            // localStorage.setItem('refresh_token', refreshToken);
            // 登录成功，你可以关闭模态框并更新用户的状态
            this.SET_USER(response.data.user); // 使用vuex来设置用户信息
            this.closeModel();
            this.$emit('userLoggedIn', response.data.user);

          } else {
            // 显示错误消息
            this.errorMessages = response.data.error;
            console.log(this.errorMessages)
          }
        })
        .catch(error => {
          // 处理错误
          this.errorMessages = '登录请求失败，请稍后再试';
          console.error(error);
        });
    },
    handleRegister() {
      this.clearErrors();

      this.captchaValue = document.querySelector('.g-recaptcha-response') ? document.querySelector('.g-recaptcha-response').value : null;


      if(!this.registerData.username){
        this.errorMessages = '必须填写用户名';return
      }

      if(!this.registerData.password || this.registerData.password.length < 8) {
        this.errorMessages = '密码不应小于8位数';return
      }

      if (!this.captchaValue) {
       this.errorMessages = "请完成验证码验证";
        return;
      }

      this.registerData.captchaResponse = this.captchaValue;

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

/* .g-recaptcha {
        transform: scale(0.85);
        transform-origin: 0 0;
    }

.recaptcha-container {
    
} */

.recaptcha-container {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    display: flex;
    justify-content: space-between; /* 确保元素之间有空隙 */
    align-items: flex-start; /* 确保元素垂直居中 */
}

.g-recaptcha {
        transform: scale(0.85);
        transform-origin: 0 0;
}


</style>
