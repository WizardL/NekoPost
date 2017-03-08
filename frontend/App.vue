<template>
  <div id="app">
    <nav class="navigation">
      <div><a router-link to="/" exact><img id="logo" src="logo.png" alt="logo"></a></div>
      <ul>
        <li><router-link to="/post_now">Post</router-link></li>
        <li><router-link to="/faq">FAQ</router-link></li>
        <li><router-link to="/about">About us</router-link></li>
      </ul>
    </nav>
    <main class="content" role="main">
      <transition name="fade" mode="out-in">
        <router-view class="swagness"></router-view>
      </transition>
    </main>
  </div>
</template>

<style lang="scss" src="./style/app.scss"></style>
<style lang="scss" scoped>

.swagness {
  margin: 0 auto;
  position: relative;
}

.fate-enter-active, .fade-leave-active {
  transition: all .2s ease;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

</style>

<script>

</script>