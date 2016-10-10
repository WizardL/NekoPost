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
</style>
