<template>
    <div class="add-post-container" v-if="user">
      <!-- 添加图片 -->
      <div class="add-image" @click="triggerImageUpload">
        <input type="file" ref="imageInput" @change="handleImage" class="hidden-input"/>
        <img v-if="imageSrc" :src="imageSrc" alt="Preview" />
        <button v-if="!imageSrc" class="add-icon">+</button>
      </div>

  
      <!-- 标题 -->
      <input type="text" v-model="title" placeholder="请输入标题" />
  
      <!-- 正文 -->
      <textarea v-model="content" placeholder="请输入正文"></textarea>
  
      <!-- 是否公开 -->
      <div>
        <label>
          <input type="checkbox" v-model="isPublic" />
          是否公开
        </label>
      </div>
  
      <!-- 发布按钮 -->
      <button @click="submitPost">发布</button>
    </div>
     <!-- 如果用户未登录，显示提示信息 -->
     <div v-else @click="showLoginModal"> 
      <p>请登录</p>
    </div>

 

    <LoginRegisterModel 
      :show="showLoginModel" 
    ></LoginRegisterModel>


  </template>


<script>
import { ref, computed, toRefs } from 'vue';
import axios from 'axios';
import LoginRegisterModel from './LoginRegisterModel.vue';
import { useStore } from 'vuex';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useRouter } from 'vue-router';
export default {
  components: {
    LoginRegisterModel
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const  router = useRouter();
    const title = ref('');
    const content = ref('');
    const isPublic = ref(true);
    const imageSrc = ref(null);
    const showLoginModel = ref(false);
    const imageInput = ref(null);

    function handleImage(event) {
      const file = event.target.files[0];
      if (file) {
        imageSrc.value = URL.createObjectURL(file);
      }
    }

    function triggerImageUpload() {
      imageInput.value.click();
    }

    async function submitPost() {
      if (!title.value || !content.value) {
          // 使用toast或其他方式显示提醒
          toast.warn('请确保所有必填字段都已填写！');
          return;
      }

      if (imageInput.value.files.length === 0) {
          toast.warn('请选择一张图片！');
          return;
      }
      const formData = new FormData();
      formData.append('userId', user.value.id); 
      formData.append('title', title.value);
      formData.append('content', content.value);
      formData.append('isPublic', isPublic.value);
      formData.append('image', imageInput.value.files[0]);

      axios.post('http://127.0.0.1:8000/api/add_posts/', formData)
      .then(response => {
          if (response.data && response.data.success) {
            toast.success('成功',{
              position:'top-center',
              autoClose: 3000,
              onClose:()=>{
              router.push('/');
             }
            });
          } else {
              toast.error('保存失败！');
          }
      })
      .catch(error => {
         toast.error(error);
      });
    }

    return {
      ...toRefs({
        title,
        content,
        isPublic,
        imageSrc,
        showLoginModel,
      }),
      user,
      handleImage,
      triggerImageUpload,
      submitPost,
      imageInput
    };
  }
};
</script>


<style scoped>
.add-post-container {
    color: #604e4e; /* 文本颜色 */
    padding: 20px;
    width: 90%;
    /* max-width: 400px; */
    margin: auto;
    font-family: Arial, sans-serif; /* 使用Arial或者其他备用字体 */
}

.add-image {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #b9b2b2;
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
    position: relative;
}

.add-image img {
    max-width: 100%;
    max-height: 100%;
}

.add-image button {
    position: absolute;
    bottom: 10px;
    background: none;
    color: #3a2a2a;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

input[type="text"], textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    /* background: #333; */
    border: none;
    border-radius: 5px;
}

button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #392425; /* 红色背景 */
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
}

.hidden-input {
    display: none; /* 隐藏input框 */
}

.Vue-Toastification__toast-container.center-center {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
}

.add-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* 使+号居中 */
    font-size: 3em; /* 调整大小 */
    background: none;
    border: none;
    color: #e6e6e6; /* 根据你的设计调整颜色 */
    cursor: pointer;
}

  </style>
  