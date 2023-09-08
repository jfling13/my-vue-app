<template>
  <div>
    <!-- Left Sidebar Navigation -->
    <nav class="left-nav">
      <router-link to="/" class="nav-item"><i class="fa fa-home"></i>Home</router-link>
      <router-link to="/search" class="nav-item"><i class="fa fa-search"></i>Search</router-link>
      <router-link to="/notifications" class="nav-item"><i class="fa fa-bell"></i>Notifications</router-link>
      <router-link to="/profile" class="nav-item"><i class="fa fa-user"></i>Profile</router-link>
    </nav>
    
    <!-- Bottom Mobile Navigation -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item"><i class="fa fa-home"></i>Home</router-link>
      <router-link to="/search" class="nav-item"><i class="fa fa-search"></i>Search</router-link>
      <router-link to="/notifications" class="nav-item"><i class="fa fa-bell"></i>Notifications</router-link>
      <router-link to="/profile" class="nav-item"><i class="fa fa-user"></i>Profile</router-link>
    </nav>
    
    <!-- Router View -->
    <div class="main-container">
    <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
nav {
  padding: 15px;
  background-color: #f7f7f7;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item i {
  margin-right: 10px;
}

.nav-item:hover {
  color: #007BFF;
}

.left-nav {
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  padding: 20px 0;
  height: fit-content;
}

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
  margin-left: 120px;
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
