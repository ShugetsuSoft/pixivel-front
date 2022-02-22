<template>
  <div class="adcontent">
    <ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="+2a+rx+1+2-3"
     data-ad-client="ca-pub-7564284646329791"
     data-ad-slot="4790399890"></ins>
  </div>
</template>

<script>
export default {
  name: "AdsCard",
  mounted() {
      try {
        (window.adsbygoogle || []).push({});
      } catch(e) {
        console.error(e)
      }
  },
}
</script>

<style lang="scss">
.masonry-item {
  overflow: hidden;
  animation: show 0.5s forwards;
  visibility: hidden;
  opacity: 0;
  transform: translateY(100px);

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.18);

  border: {
    radius: 12px;
  }

  .adcontent {
    height: 100%;
    background: #fff;
  }
}
</style>