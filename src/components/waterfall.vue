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
			'max-width': {
				default: 280,
				type: Number
			}
		},
		components: {
			ImgCard
		},
		data() {
			return {
				width: this.maxWidth,
				containerWidth: 0,
				parentObserver: null,
        gap: 25,
        cols: 4,
			}
		},
		created() {
			
		},
		mounted() {
			var parentNode = this.$refs.waterfall.parentNode
			this.parentObserver = new window.ResizeObserver(entries => {
				var entry = entries[0]
				this.containerResized(entry)
			})
			this.parentObserver.observe(parentNode)
		},
		beforeDestroy() {
			if (this.parentObserver) {
				this.parentObserver.disconnect()
				this.parentObserver = null
			}
		},
		methods: {
			heightGetter(item) {
				return (item.height / item.width) * this.width
			},
			containerResized(entry) {
				this.containerWidth = Math.floor(entry.contentRect.width)
			},
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
