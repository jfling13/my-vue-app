<template>
  <div class="post-list" >
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
    <!-- 当没有更多数据时显示的提示 -->
    <div v-if="!hasMore" class="no-more-data">
      后面没有了~
    </div>
  </div>
</template>

<style scoped>
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
.no-more-data {
  display: block;
  text-align: center;
  padding: 20px 0;
  color: #888;
  font-size: 14px;
  margin-top: 14px; /* 如果需要在前面的元素和这个元素之间有间距 */
  width: 100%;
}
/* Responsive Design */
@media (max-width: 768px) {
  .post-item {
      flex: 0 0 calc(50% - 20px); /* Two items in a row for tablets */
  }
}

@media (max-width: 480px) {
  .post-item {
      flex: 0 0 100%; /* One item per row for mobile */
  }
  .no-more-data {
      margin-bottom: 90px;
  }
}
</style>

  
  
  <script>
  import axios from 'axios';
  
  export default {
    mounted() {
        window.addEventListener('scroll', this.checkScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.checkScroll);
    },

    data() {
      return {
        posts: [],
        page: 1, // 添加一个page变量来跟踪当前的页数
        loading: false, // 防止在加载数据时多次触发
        hasMore: true,
      }
    },
    created() {
    this.loadMore(); // 初始加载数据
  },
  methods: {
    loadMore() {
      if (this.loading || !this.hasMore) return; // 加入!this.hasMore判断

      this.loading = true;

      axios.get(`http://127.0.0.1:8000/api/index/?page=${this.page}`)
        .then(response => {
          this.posts = [...this.posts, ...response.data.results]; // 假设数据在results里
          this.page += 1; 
          this.loading = false;

          if (!response.data.has_more) { // 如果后端返回has_more标志
            this.hasMore = false; // 设置为false表示没有更多数据加载
          }
        })
        .catch(error => {
          console.error("There was an error fetching the posts:", error);
          this.loading = false;
        });
    },
    
    checkScroll() {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (nearBottom) {
        this.loadMore(); // 如果接近底部，加载更多数据
      }
    }

}
}
</script>
  



<!-- <template>
  <div class="posts-grid">
    <div v-for="item in posts" :key="item.id" class="post-container">
      <img :src="item.mask_url" alt="Post image" class="post-image" />
      <div class="post-content">
        <h3 class="post-title">{{ item.title }}</h3>
        <p class="post-author">By: {{ item.author }}</p>
        <div class="actions">
          <span><i class="fa fa-heart"></i> {{ item.like_count }} likes</span>
          <span><i class="fa fa-comment"></i> {{ item.comment_count }} comments</span>
          <span><i class="fa fa-star"></i> {{ item.favorite_count }} favorites</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* ... 这部分内容不变 ... */
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const posts = ref([])

    onMounted(async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/index/')
        posts.value = response.data.results
      } catch (error) {
        console.error('Axios error:', error.message)
      }
    })

    return {
      posts
    }
  }
}
</script>
<style>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.post-container {
  border: 1px solid #e6e6e6;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  transition: transform 0.3s;
  height: 400px; /* 你可以按需调整这个高度 */
}

.post-container:hover {
  transform: scale(1.02);
}

.post-image {
  width: 100%;
  max-height: 200px; /* 根据需要调整 */
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.post-content {
  /* display: flex; */
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.post-title {
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 5px;
}

.post-author {
  color: #888;
  font-size: 0.9em;
}

.actions {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #888;
}

.actions span {
  display: flex;
  align-items: center;
}

.actions i {
  margin-right: 5px;
}
</style>
 -->
