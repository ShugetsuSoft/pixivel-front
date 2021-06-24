<template>
	<section>
		<div class="background" :style="{'background-image':`url(${backgroundImg})`}">
		</div>
		<div class="page card">
			<div class="pre-shows">
				<LandingRank />
			</div>
		</div>
	</section>
</template>

<script>
	import LandingRank from '../components/landing_rank.vue'

	export default {
		name: "Landing",
		components: {
			LandingRank
		},
		data() {
			return {
				backgroundImg: "https://i.pixiv.cat/img-original/img/2014/04/18/00/09/15/42947917_p0.jpg"
			}
		}
	}
</script>

<style lang="scss">
	.background {
		position: relative;
		height: calc(100vh + 6rem);

		background: {
			attachment: scroll;
			repeat: no-repeat;
			position: 50%;
			size: cover;
		}

		&:before {
			content: "";
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 0;

			background: {
				attachment: fixed;
				image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAADAQMAAACDJEzCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAGUExURQAAAEdwTIDnVscAAAACdFJOUzMAgvioCAAAAA5JREFUCNdjOMBwgIEBAAYGAYE538a8AAAAAElFTkSuQmCC);
			}
		}
	}

	.page {}

	.pre-shows {
		margin-top: -6rem !important;
	}

	.card {
		border: {
			radius: 1rem;
		}

		background-color: white;
	}
</style>
