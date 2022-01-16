<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Client from "./utils/client-cross.js";

export default {
  name: "app",
  created() {
    // const crossClient = new Client("http://localhost:3001/");
    // crossClient.getItem("login_token", (res) => {
    //   console.log("info-getMessage", res);
    // });
  },
};
</script>

<style></style>
