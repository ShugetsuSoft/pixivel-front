<template>
  <div id="app">
    <div class="loading-overlay-custom">
      <div class="loading-icon-custom"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    window.location.replace("https://pixivel.art");
  }
};
</script>

<style lang="scss">
.loading-overlay-custom {
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  overflow: hidden;
  z-index: 999;
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100vh;

  .loading-icon-custom {
    position: relative;

    &::after {
      animation: spinAround 500ms infinite linear;
      border: 2px solid #dbdbdb;
      border-radius: 9999px;
      border-right-color: transparent;
      border-top-color: transparent;
      content: "";
      display: block;
      height: 1em;
      position: relative;
      width: 1em;
      position: absolute;
      top: calc(50% - 1.5em);
      left: calc(50% - 1.5em);
      width: 3em;
      height: 3em;
      border-width: 0.25em;
    }
  }
}

@keyframes spinAround {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
