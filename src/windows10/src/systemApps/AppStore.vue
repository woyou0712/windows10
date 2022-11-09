<template>
  <div class="system-app-store">软件商店</div>
</template>

<script>
import axios from "axios"
export default {
  mounted() {
    axios.get("http://127.0.0.1:5500/MyPc.vue").then(res => {
      console.log(res)
    })
  }
}
</script>

<style>
</style>