<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

</script>

<template>
  <Header></Header>
  <LoginDialog></LoginDialog>
  <RegisterDialog></RegisterDialog>
  <LogoutDialog></LogoutDialog>
  <WebGLCanvas/>
</template>

<script>
import Header from './components/Header.vue';
import WebGLCanvas from './components/WebGLCanvas.vue';
import LoginDialog from './components/LoginDialog.vue';
import LogoutDialog from './components/LogoutDialog.vue';
import RegisterDialog from './components/RegisterDialog.vue';
import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`
});

export default {
  components: {
    WebGLCanvas,
    LoginDialog,
  },
  async created() {
    await this.csrf();
  },

  methods: {
    async csrf() {
      API.get("/csrf").then((res) => {
        // cookie has been get
      }).catch((error) => {
        console.log(error);
      })
    }
  },
}
</script>
