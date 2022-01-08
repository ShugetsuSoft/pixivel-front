<template>
  <div class="userlist">
    <RouterA class="media is-vertical-centered" :to="{'name': 'User', 'params': {'id': user.id}}" v-for="user in users" :key="user.id">
      <div class="media-left">
        <figure class="image is-64x64">
          <img :src="imgProxy(user.image.url, user.id)" class="is-rounded full-hw obj-cover">
        </figure>
      </div>
      <div>
        <h1 class="title is-4 no-margin-bottom"> {{ user.name }} </h1>
        <p class="break-raw-text"> {{ user.bio | break }} </p>
      </div>
    </RouterA>
  </div>
</template>

<script>
import RouterA from '@/components/router_a'

export default {
  name: "UserList",
  props: {
    'users': Array,
    'has-load': Boolean,
  },
  components: {
    RouterA
  },
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {

  },
  filters: {
    break(content) {
      if (content.length > 20) {
        return content.substring(0, 20) + "..."
      }
      return content
    }
  }
};
</script>

<style lang="scss">
.userlist {
  margin-top: 1rem;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  a {
    text-decoration: none !important;
  }
}
</style>