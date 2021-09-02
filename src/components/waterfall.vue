<template>
	<div class="waterfall" ref="waterfall">
		<VirtualMasonry :items="illusts" :colWidth="width" :fit="true" :rowPerSection="4" :col="cols" :itemHeightGetter="heightGetter" :gap="gap" class="waterfall-container">
			<template slot-scope="illust">
				<ImgCard :illust="illust.data" />
			</template>
		</VirtualMasonry>
	</div>
</template>

<script>
	import ImgCard from '@/components/imgcard'

	export default {
		name: "WaterFall",
		props: {
			'illusts': Array,
			'expect-width': {
				default: 280,
				type: Number
			},
      'expect-width-mobile': {
        default: 170,
        type: Number
      },
      'gap': {
        default: 25,
        type: Number
      },
      'gap-mobile': {
        default: 5,
        type: Number
      }
		},
		components: {
			ImgCard
		},
		data() {
			return {
				width: this.expectWidth,
				containerWidth: 0,
				parentObserver: null,
        cols: 0,
        calcdebu: null,
			}
		},
		created() {
			
		},
		mounted() {
			let parentNode = this.$refs.waterfall.parentNode
      this.containerWidth = parentNode.offsetWidth
			this.parentObserver = new window.ResizeObserver(entries => {
				let entry = entries[0]
				this.containerResized(entry)
			})
			this.parentObserver.observe(parentNode)
      this.calc()
      let that = this
      this.calcdebu = this.Lodash.debounce(() => {
        that.calc()
      },100)
		},
		beforeDestroy() {
			if (this.parentObserver) {
				this.parentObserver.disconnect()
				this.parentObserver = null
			}
		},
    computed: {
      expWidth() {
        if (this.containerWidth > 435) {
          return this.expectWidth + this.gap
        } else {
          return this.expectWidthMobile + this.gapMobile
        }
      }
    },
		methods: {
			heightGetter(item) {
				return (item.height / item.width) * this.width
			},
			containerResized(entry) {
				this.containerWidth = Math.floor(entry.contentRect.width)
        this.calcdebu()
			},
      calc() {
        let num = parseInt(this.containerWidth / this.expWidth)
        let rem = this.containerWidth % this.expWidth
        if (rem >= this.expWidth / 2) {
          num += 1
        }
        let width = this.containerWidth / num
        if (this.cols != num) {
          this.cols = num
        }
        this.width = width - this.gap
      }
		}
	}
</script>

<style lang="scss">
	.waterfall {
		.waterfall-container {
			position: relative;
			margin: 0 auto;
		}
	}
</style>
