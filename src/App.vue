<template>
	<div id="app">
		<Nav />
		<transition name="fade">
			<router-view />
		</transition>
		<Footer />
	</div>
</template>

<script>
	import Nav from '@/components/nav'
	import Footer from '@/components/footer.vue'
	import '@/assets/fonts/font.scss'

	export default {
		name: 'App',
		components: {
			Nav,
			Footer
		}
	}
</script>

<style lang="scss">
	html,
	body {
		width: 100%;
		height: auto;
		padding: 0;
		margin: 0;
		color: #111;

		font-family: 'M PLUS 1p Light', 'M PLUS 1c Light' !important;
	}

	html,
	body {
		background-color: #fdfdfd;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-family: 'M PLUS 1p Regular', 'M PLUS 1c Regular' !important;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter,
	.fade-leave-to

	/* .fade-leave-active below version 2.1.8 */
		{
		opacity: 0;
	}

	::selection {
		background: rgba(37, 100, 255, .15);
	}

	::-webkit-scrollbar-thumb {
		background: #8c8c8c;
		border-radius: 5px;
	}

	::-webkit-scrollbar-track {
		background: #ededed;
	}

	::-webkit-scrollbar {
		width: 5px;
		height: 5px;
		display: block;
		background: #fff;
	}

	.default-full-screen-top {
		min-height: 100vh;
	}

	.is-rounded {
		border-radius: 50%;
	}

	.is-vertical-centered {
		align-items: center;
	}

	.break-raw-text {
		white-space: pre-wrap;
	}

	.full-hw {
		height: 100% !important;
		width: 100% !important;
	}

	.clickable-tag {
		cursor: pointer;
		user-select: none !important;
	}

	.loading-overlay-custom {
		-webkit-box-align: center;
		align-items: center;
		-webkit-box-pack: center;
		justify-content: center;
		overflow: hidden;
		z-index: 999;
		display: flex;
		background: rgba(255, 255, 255, 0.5);
		width: 100%;
		height: 100%;

		.loading-icon-custom {
			position: relative;

			&::after {
				animation: spinAround 500ms infinite linear;
				border: 2px solid #dbdbdb;
				border-radius: 9999px;
				border-right-color: transparent;
				border-top-color: transparent;
				content: "";
				display: block;
				height: 1em;
				position: relative;
				width: 1em;
				position: absolute;
				top: calc(50% - 1.5em);
				left: calc(50% - 1.5em);
				width: 3em;
				height: 3em;
				border-width: 0.25em;
			}
		}
	}
</style>
