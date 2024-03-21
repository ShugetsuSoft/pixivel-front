<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <section class="modal-card-body">
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  name: "AnnoModel",
  props: {
    title: String,
  },
};
</script>

<style lang="scss">
.modal-card {
  width: auto !important;

  .modal-card-body {
    padding: 30px;
    box-sizing: border-box;
  }
}
</style>
