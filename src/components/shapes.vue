<template>
  <transition-group class="shapes" tag="div" name="shapes">
    <img
      class="shapes-item"
      v-for="shape in shapeList"
      v-bind:key="shape.shape + shape.top + '.' + shape.left"
      :src="shape.shape"
      :style="{
        top: shape.top + '%',
        left: shape.left + '%',
        zoom: shape.size,
        'animation-delay': parseInt(Math.random() * 2000) / 1000 + 's',
      }"
    />
  </transition-group>
</template>

<script>
import Shape1 from "../assets/svgs/shape1.svg";
import Shape2 from "../assets/svgs/shape2.svg";
import Shape3 from "../assets/svgs/shape3.svg";
import Shape4 from "../assets/svgs/shape4.svg";
import Shape5 from "../assets/svgs/shape5.svg";
import Shape6 from "../assets/svgs/shape6.svg";
export default {
  components: {},
  data() {
    return {
      shapeList: [
        {
          shape: Shape1,
          top: 30,
          left: 4,
          size: 0.6,
        },
        {
          shape: Shape1,
          top: 23,
          left: 86,
          size: 0.5,
        },
        {
          shape: Shape2,
          top: 85,
          left: 14,
          size: 0.8,
        },
        {
          shape: Shape2,
          top: 10,
          left: 96,
          size: 0.4,
        },
        {
          shape: Shape3,
          top: 52,
          left: 86,
          size: 0.7,
        },
        {
          shape: Shape3,
          top: 65,
          left: 5,
          size: 0.6,
        },
        {
          shape: Shape4,
          top: 47,
          left: 13,
          size: 0.5,
        },
        {
          shape: Shape4,
          top: 85,
          left: 80,
          size: 0.6,
        },
        {
          shape: Shape5,
          top: 72,
          left: 90,
          size: 1,
        },
        {
          shape: Shape6,
          top: 7,
          left: 14,
          size: 1.8,
        },
      ],
    };
  },
  mounted() {},
  computed: {},
};
</script>

<style lang="scss">
.shapes {
  overflow: hidden;
  width: 100%;
  height: 100%;
  img {
    position: absolute;
    top: 0;
    left: 0;
    height: 15vmin;
    width: 15vmin;
    animation: moveUpDown 3.5s ease-in-out infinite alternate;
  }
}

@keyframes moveUpDown {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }

  100% {
    transform: translate(3px, -21px) rotate(1deg);
  }
}

.shapes-enter-active,
.shapes-leave-active {
  transition: all 1s;
}

.shapes-enter,
.shapes-leave-to {
  opacity: 0;
}
</style>
