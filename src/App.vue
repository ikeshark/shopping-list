<template>
  <div id="app" class="mx-auto">
    <div id="nav" class="flex bg-gray-200 justify-around text-xl p-2 mt-2 border-t-2 border-gray-700 border-r-2 border-l-2 rounded-t-lg w-10/12 mx-auto">
      <router-link class="underline" to="/" exact>Home</router-link> |
      <router-link class="underline" to="/list">List</router-link> |
      <router-link class="underline" to="/user">User</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
 #app {
   max-width: 666px;
 }
 .router-link-active {
   color: #aaa;
 }
 body {
   max-height: 100vh;
   overflow-y: hidden
 }
</style>
