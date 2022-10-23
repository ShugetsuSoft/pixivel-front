<template>
  <div>
    <b-button type="is-info" inverted outlined @click="share" icon-left="uil uil-share" v-if="type==0">分享</b-button>
    <b-button size="is-small" @click.native="share" v-else-if="type==1" type="is-info" inverted outlined icon-left="uil uil-share">分享</b-button>
    <b-modal
      v-model="isActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false" l>
      <template #default="props">
        <SharePop @close="props.close" :type="type" :id="id" :info="info"/>
      </template>
    </b-modal>
  </div>
</template>

<script>
import SharePop from "@/components/share_pop";
export default {
  name: "ShareButton",
  components: { SharePop },
  props: {
    type: Number,
    id: Number,
    info: String,
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    share() {
      this.isActive = true
    }
  }
};
</script>

<style scoped>

</style>