<template>
  <div id="app">
    <div class="header">
      <div class="top">
        <router-link to="/" exact><!-- LOGO HERE --></router-link>
        <router-link to="/投稿">投稿</router-link>
        <router-link to="/投诉">投诉</router-link>
        <router-link to="/最新">看看最新</router-link>
        <router-link to="/装逼">关于我们</router-link>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view class="swagness"></router-view>
    </transition>
  </div>
</template>

<style lang="scss">
body {
  font-family: Roboto, Helvatica, sans-serif;
  font-size: 15px;
  background-color: lighten(#eceef1, 33%);
  margin: 0;
  padding-top: 55px;
  color: #34495e;
}

.header {
  background: #FFF;
  position: fixed;
  box-shadow:
    0 1px 0 0 rgba(0, 0, 0, .05),
    0 2px 4px 0 rgba(0, 0, 0, .06);
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;

  .inner {
    max-width: 800px;
    box-sizing: border-box;
    margin: 0px auto;
    padding: 15px 5px;
  }
}

</style>
