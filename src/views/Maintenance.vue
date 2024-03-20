<template>
  <div>
    <div class="container">
      <div class="logo-container">
        <img src="img/icons/icon-512x512.png" class="logo" alt="Logo" />
        <h1 class="site-name">Pixivel</h1>
      </div>
      <p class="message" v-html="message"></p>
    </div>
  </div>
</template>

<script>
import CONFIG from "@/config.json";

export default {
  name: "Maintenance",
  data: () => ({
    message: CONFIG.MAINTENANCE,
  }),
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  text-align: center;
  padding: 0 1.5rem;

  .message {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    background-color: var(--background);
    padding: 1rem;
  }

  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1.5rem;

    .logo {
      height: 3rem;
      padding: 0.5rem;
    }
    .site-name {
      font-size: 2rem;
    }
  }
}
</style>
