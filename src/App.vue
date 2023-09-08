
<template>
  <div>
    <!-- Left Sidebar Navigation -->
    <nav class="left-nav">
      <router-link to="/"><i class="fa fa-home"></i>Home</router-link>
      <router-link to="/search"><i class="fa fa-search"></i>Search</router-link>
      <router-link to="/notifications"><i class="fa fa-bell"></i>Notifications</router-link>
      <router-link to="/profile"><i class="fa fa-user"></i>Profile</router-link>
    </nav>
    
    <!-- Bottom Mobile Navigation -->
    <nav class="bottom-nav">
      <router-link to="/"><i class="fa fa-home"></i>Home</router-link>
      <router-link to="/search"><i class="fa fa-search"></i>Search</router-link>
      <router-link to="/notifications"><i class="fa fa-bell"></i>Notifications</router-link>
      <router-link to="/profile"><i class="fa fa-user"></i>Profile</router-link>
    </nav>
    
    <!-- Router View wrapped in .main-container -->
    <div class="main-container">
      <router-view></router-view>
    </div>
      
  </div>
</template>
<style scoped>
/* 基础样式 */
nav {
  display: flex;
  padding: 15px;
  background-color: #f7f7f7;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

nav a {
  margin: 15px 15px;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
  font-size: 15px;
  font-weight: 600;
}

nav a:hover {
  color: #007BFF;  /* 你可以选择你喜欢的颜色 */
}

/* 左侧导航样式 */
.left-nav {
  flex-direction: column;
  height: 100vh;
  width: 200px;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  padding: 20px 0;
}

/* 底部导航样式 */
.bottom-nav {
  flex-direction: row;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
}

@media screen and (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
  .main-container{
  margin-left: 250px;
}
  
}

@media screen and (max-width: 768px) {
  .left-nav {
    display: none;
  }
  .main-container{
  margin-left: 0px;
}
}

</style>

