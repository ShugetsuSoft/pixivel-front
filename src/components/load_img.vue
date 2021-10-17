<template>
	<LazyImg :src="url" @loaded="loaded" @preloaded="loaded" ref="loadimg">
		<div class="loading-overlay-custom" v-show="loading">
			<div class="loading-icon-custom"></div>
		</div>
	</LazyImg>
</template>

<script>
	import LazyImg from '@/components/lazyimg'

	export default {
		name: "LoadImg",
		props: {
			src: String,
      key: {
			  default: "",
      },
		},
		components: {
			LazyImg
		},
		data() {
			return {
				loading: true
			}
		},
		mounted() {
			
		},
		computed: {
			url() {
				return this.imgProxy(this.src, this.key)
			}
		},
		methods: {
			loaded() {
				this.loading = false
			}
		}
	}
</script>