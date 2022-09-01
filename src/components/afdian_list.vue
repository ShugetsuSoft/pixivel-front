<template>
  <div class="columns set-list">
    <div class="column is-half-desktop is-half-tablet hover-up" @click="jump('https://afdian.net/u/' + item.user.user_id)" v-for="(item, index) in list" :key="index">
      <b-notification :closable="false" class="is-clickable">
        <div class="is-flex is-flex-wrap-nowrap is-align-items-center">
          <figure class="image is-64x64 media-left">
            <img class="is-rounded is-64x64 ava" :src="item.user.avatar">
          </figure>
          <div class="content">
            <strong>{{ item.user.name }}</strong>
            <p>电量: {{ item.all_sum_amount }}</p>
          </div>
        </div>
      </b-notification>
    </div>
  </div>
</template>

<script>
import CONFIG from '@/config.json'

export default {
  name: "AfdianList",
  data() {
    return {
      loading: true,
      list: []
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.axios.get(CONFIG.AFDIAN_API).then(res => {
        console.log(res.data)
        this.list = res.data
      })
    },
    jump(url){
      window.open(url, "_blank")
    }
  }
};
</script>

<style lang="scss">
.set-list {
  flex-wrap: wrap;
}

.ava {
  height: 100% !important;
  object-fit: cover !important;
}
</style>