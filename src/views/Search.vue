<template>
  <section class="default-full-screen-top">
    <section class="hero is-small">
      <div class="container search-form">
        <div class="columns">
          <div class="column is-1">
            <button class="button">
              <b-icon
                icon="home"
                size="is-medium">
              </b-icon>
            </button>
          </div>
          <div class="column">
            <b-autocomplete
              v-model="keyword"
              :data="suggestList"
              placeholder="试着输入些内容吧.."
              icon="magnify"
              @input="suggestdebu"
              clearable>
              <template #empty>No results found</template>
            </b-autocomplete>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import CONFIG from '@/config.json'
export default {
  name: "Search",
  data: () => {
    return {
      keyword: "",
      suggestList: [],
      suggestdebu: null
    }
  },
  mounted() {
    this.suggestdebu = this.Lodash.debounce(() => {
      if (this.keyword != "") {
        this.suggest()
      }
    },800)
  },
  methods: {
    suggest() {
      this.axios
        .get(CONFIG.API_HOST + `illust/search/${this.keyword}/suggest`)
        .then((response) => {
          if (response.data.error) {
            this.error(response.data.message)
            return;
          }
          this.suggestList = response.data.data.suggest_words
        }).catch((error)=>{
        this.error(error.response.data.message)
      })
    },
    error(message) {
      this.$buefy.notification.open({
        duration: 5000,
        message: message,
        type: 'is-danger',
      })
    }
  },
};
</script>

<style lang="scss">
.search-form {
  padding: {
    top: 3rem;
    bottom: 2rem;
  };
  min-width: 30rem;
}
</style>