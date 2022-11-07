<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">感谢发电</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <section class="modal-card-body">
      <p>爱不会消失，只会传递</p>
      <p>Pixivel的成长离不开大家的帮助，服务器依靠大家的赞助而活。</p>
      <p>
        赞助请点击:
        <a href="https://afdian.net/a/rorical" target="_blank"
          >https://afdian.net/a/rorical</a
        >
      </p>
      <p>最近赞助会展示在下方哦！</p>
      <hr />
      <AfdianList />
      <p class="has-text-centered">更多的已隐藏...</p>
    </section>
  </div>
</template>

<script>
import AfdianList from "./afdian_list";

export default {
  name: "Sponsor",
  components: {
    AfdianList,
  },
};
</script>

<style lang="scss">
.animation-content {
  z-index: 9999999;
}
</style>
