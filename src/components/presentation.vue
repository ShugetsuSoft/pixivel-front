<template>
	<div ref="presentation">
		<div class="presentation" :style="{'width': width + 'px'}">
			<div class="presentation-img" :style="{'height': height + 'px'}" ref="presentation-img">
				<img :src="CurrentImgUrl" :alt="id + '-' + pageCount" />
			</div>
		</div>
		<Pagination :max-page="pageCount" v-model="CurrentPage" v-if="pageCount > 1" />
	</div>
</template>

<script>
	import Pagination from '@/components/pagination.vue'

	export default {
		name: "Presentation",
		components: {
			Pagination,
		},
		props: {
			"id": Number,
			"image": [String, Number],
			"page-count": Number,
			"initial-width": Number,
			"initial-height": Number
		},
		watch: {
			"CurrentPage": "switchPage",
			"containerWidth": "resizeImg",
			"windowHeight": "resizeImg",
			"imgWidth": "resizeImg",
			"imgHeight": "resizeImg",
		},
		data() {
			return {
				MaxPercent: 0.90,
				CurrentImgUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
				CurrentPage: 1,
				width: 0,
				height: 0,
				containerWidth: 0,
				windowHeight: 0,
				imgWidth: 0,
				imgHeight: 0,
				windowWidth: 0,
				parentObserver: null,
				preloadList: []
			}
		},
		created() {

		},
		mounted() {
			var parentNode = this.$refs.presentation.parentNode
			this.parentObserver = new window.ResizeObserver(entries => {
				var entry = entries[0]
				this.containerResized(entry)
			})
			this.parentObserver.observe(parentNode)
			window.addEventListener('resize', this.windowResized, false)
			this.windowResized()

			this.preLoad()
		},
		beforeDestroy() {
			if (this.parentObserver) {
				this.parentObserver.disconnect()
				this.parentObserver = null
			}
			window.removeEventListener('resize', this.windowResized, false)
		},
		computed: {},
		methods: {
			preLoad() {
				this.preloadList = []
				for (var i = 0; i < this.pageCount; ++i) {
					var preloader = new Image()
					preloader.src = this.calcImg(this.id, i, this.image, "regular")
					this.preloadList.push(preloader)
				}
				this.switchPage()
			},
			switchPage() {
				var preloader = this.preloadList[this.CurrentPage - 1]
				var imgheight = preloader.naturalHeight
				var imgwidth = preloader.naturalWidth
				this.CurrentImgUrl = preloader.src
				if (imgwidth === 0 || imgheight === 0) {
					if (this.CurrentPage === 1) {
						this.imgWidth = this.initialWidth
						this.imgHeight = this.initialHeight
					} else {
						var loading = this.imgLoading()
						var checkImg = () => {
							if (preloader.naturalHeight > 0 || preloader.naturalWidth > 0) {
								this.imgWidth = preloader.naturalWidth
								this.imgHeight = preloader.naturalHeight
								loading.close()
								clearInterval(set)
							}
						}
						var set = setInterval(checkImg, 40)
					}
				} else {
					this.imgWidth = imgwidth
					this.imgHeight = imgheight
				}
			},
			containerResized(entry) {
				this.containerWidth = Math.floor(entry.contentRect.width)
			},
			windowResized() {
				this.windowHeight = document.documentElement.clientHeight
				this.windowWidth = document.documentElement.clientWidth
			},
			resizeImg() {
				var maxWidth = this.containerWidth
				var maxHeight = this.windowHeight * this.MaxPercent
				var oriWidth = this.imgWidth
				var oriHeight = this.imgHeight

				var minExpRatio
				
				if (this.windowWidth < 790) {
					minExpRatio = maxWidth / oriWidth
					
					this.width = oriWidth * minExpRatio
					this.height = oriHeight * minExpRatio
					
					return
				}

				var whRatio = this.imgWidth / this.imgHeight
				if (whRatio < 9 / 21) {
					minExpRatio = maxWidth / oriWidth / 2

					this.width = oriWidth * minExpRatio
					this.height = oriHeight * minExpRatio

					return
				}

				var heightExpRatio = maxHeight / oriHeight
				var widthExpRatio = maxWidth / oriWidth
				minExpRatio = Math.min(heightExpRatio, widthExpRatio)

				this.width = oriWidth * minExpRatio
				this.height = oriHeight * minExpRatio
			},
			imgLoading() {
				return this.$buefy.loading.open({
					container: this.$refs.presentationImg
				})
			}
		}
	};
</script>

<style lang="scss">
	.presentation {
		margin: auto;
		padding: 0;

		.presentation-img {
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
