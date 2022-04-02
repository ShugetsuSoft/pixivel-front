<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" @click="onclick" :class="{'is-bookmarked': isBookMarked}">
    <path class="heart-icon" d="M12,20.8623a2.75115,2.75115,0,0,1-1.94922-.80468L3.83691,13.84277A6.27238,6.27238,0,0,1,12,4.36328a6.27239,6.27239,0,0,1,8.16309,9.47949l-6.21338,6.21387A2.75,2.75,0,0,1,12,20.8623Z"></path>
  </svg>
</template>

<script>
import { deleteBookMark, isBookMarked, addBookMark } from "@/utils/bookmark";

export default {
  name: "Like",
  props: {
    illust: Object
  },
  data() {
    return {
      isBookMarked: false
    }
  },
  async created() {
    this.isBookMarked = await isBookMarked(this.illust.id)
  },
  methods: {
    async onclick(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.isBookMarked) {
        this.isBookMarked = false
        await deleteBookMark(this.illust.id)
      } else {
        this.isBookMarked = true
        await addBookMark(this.illust)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.is-bookmarked {
  animation: like 0.2s ease-in-out;

  .heart-icon {
    fill: #ff2f2f;
    stroke: #fff;
  }
}

svg {
  width: 100%;
  height: 100%;
  transition: all 0.2s ease-out;

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(1.1);
  }

  .heart-icon {
    stroke: #aaa;
    fill: #fff;
  }
}

@keyframes like {
  0% {
    transform: scale(1.2);
  }

  40% {
    transform: scale(0.6);
  }

  80% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}
</style>