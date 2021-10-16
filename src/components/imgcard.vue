<template>
	<RouterA ref="imgCard" :to="{'name':'Detail', 'params':{'id': illust.id}}">
		<LazyImg :src="url" @loaded="loaded" @preloaded="loaded" />
		<div class="loading-overlay" :class="{'is-active': loading}">
			<div class="loading-background"></div>
			<div class="loading-icon"></div>
		</div>
		<div class="title-container">
			<h5 class="title is-5 has-text-white" v-html="illust.title"></h5>
		</div>
	</RouterA>
</template>

<script>
	import LazyImg from '@/components/lazyimg'
	import RouterA from '@/components/router_a'

	export default {
		name: "ImgCard",
		props: {
			illust: Object,
			width: Number,
			quality: {
				default: "small",
				type: String
			}
		},
		components: {
			LazyImg,
			RouterA
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
				return this.calcImg(this.illust.id, 0, this.illust.image, this.quality)
			}
		},
		methods: {
			loaded() {
				this.loading = false
			}
		}
	}
</script>

<style lang="scss">
	.masonry-item {
		overflow: hidden;
		animation: show .5s forwards;
		visibility: hidden;
		opacity: 0;
		transform: translateY(100px);

		box-shadow: 0 0 8px rgba(0, 0, 0, .18);

		border: {
			radius: 12px;
		}

		.title-container {
			position: absolute;
			right: 0;
			left: 0;
			z-index: 1000;
			display: flex;
			-webkit-box-pack: center;
			justify-content: center;
			padding-left: 0;
			margin-right: 15%;
			margin-left: 15%;
			list-style: none;
			transition: opacity .25s ease-in-out;
			opacity: 0;
			bottom: 50%;
			transform: translateY(50%);

      em {
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 10%;
        color: rgba(0, 0, 0, 0.7);
        font-style: normal;
      }
		}

		&:hover {
			.title-container {
				opacity: 1;
			}

			div.lazyimg {
				transform: scale(1.1);

				&:after {
					background-color: rgba(0, 0, 0, .3);
				}
			}
		}

		div.lazyimg {
			transition: transform .45s ease-in-out;

			&:after {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				z-index: 0;
				content: "";
				transition: .2s;
				box-sizing: border-box;
				width: 100%;
				height: 100%;
			}
		}
	}

	@keyframes show {
		to {
			visibility: visible;
			opacity: 1;
			transform: translateY(0)
		}
	}
</style>
