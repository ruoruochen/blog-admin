<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    window.addEventListener('message', function(e) {
      if (e.data?.startsWith('Bearer')) {
        window.sessionStorage.setItem('token', e.data)
      }
    })
  },
}
</script>

<style></style>
