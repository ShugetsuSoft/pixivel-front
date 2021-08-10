<template>
	<div class="nav nav-hori">
		<div class="nav-circle" @click="routerChange('')">
			<b-icon icon="account"></b-icon>
		</div>
		<div class="nav-circle" @click="routerChange('')">
			<b-icon icon="home"></b-icon>
		</div>
		<div class="nav-circle nav-center" @click="routerChange('Landing')">
			<img class="icon" src="../assets/images/favicon.png" />
		</div>
		<div class="nav-circle" @click="routerChange('')">
			<b-icon icon="view-dashboard"></b-icon>
		</div>
		<div class="nav-circle" @click="routerChange('')">
			<b-icon icon="alert-rhombus-outline"></b-icon>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Nav",
		watch: {},
		data: () => ({

		}),
		methods: {
			routerChange(name) {
				if (name != this.$route.name) {
					this.$router.push({
						name,
					})
				}
			},
		},
	};
</script>

<style lang="scss">
	@media screen and (max-width: 790px) {
		.nav-hori {
			padding: {
				top: 0.35rem;
				bottom: 0.35rem;
			}
			
			position: fixed;
			bottom: 13px;
			margin:0 auto;
			text-align: center;
			width: 70%;
			max-width: 16rem;
			left:0;
			right:0;
			height: 3rem;
			z-index: 100;
			background: rgb(255, 255, 255);
			display: flex;
			align-items: center;

			border: {
				radius: 1.5rem;
			}

			.nav-circle {
				width: 1.6rem;
				height: 1.6rem;
				border-radius: 50%;
				flex: 1;
				text-align: center;

				margin: {
					left: 0.5rem;
					right: 0.5rem;

					top: 0.35rem;
					bottom: 0.35rem;
				}

				display: flex;
				transition: all .2s ease-in-out;
				align-content: center;
				justify-content: center;
				align-items: center;
			}

			.nav-center {
				width: 2.3rem;
				height: 2.3rem;
				border-radius: 50%;
				margin: 0;
				background-color: rgb(255, 255, 255);
				flex: 1;
				text-align: center;
				
				margin: {
					left: 0.5rem;
					right: 0.5rem;
					
					top: 0.23rem;
					bottom: 0.23rem;
				}
			}

			.icon {
				width: 80%;
				height: 80%;
			}
		}
	}

	@media screen and (min-width: 790px) {
		.nav {

			padding: {
				top: 0.35rem;
				bottom: 0.35rem;
			}

			position: fixed;
			bottom: 20px;
			left: 20px;
			width: 3rem;
			z-index: 100;
			background: rgb(255, 255, 255);
			transition: hover .2s ease-in-out;


			border: {
				radius: 2rem;
				color: rgb(230, 230, 230);
				width: 1px;
				style: solid
			}

			.nav-circle {
				width: 2rem;
				height: 2rem;
				border-radius: 1rem;

				margin: {
					left: 0.5rem;
					right: 0.5rem;

					top: 0.35rem;
					bottom: 0.35rem;
				}

				display: flex;
				transition: all .2s ease-in-out;
				align-content: center;
				justify-content: center;
				align-items: center;

				&:hover {
					background-color: rgb(240, 240, 240);
				}
			}

			.nav-center {
				width: 2.9rem;
				height: 2.9rem;
				border-radius: 1.5rem;
				margin: 0;
				background-color: rgb(255, 255, 255);

				margin: {
					top: 0.23rem;
					bottom: 0.23rem;
				}
			}

			.icon {
				width: 80%;
				height: 80%;
			}
		}
	}
</style>
