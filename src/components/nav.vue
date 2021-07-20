<template>
	<div class="nav">
		<div class="nav-circle" @click="">
			<b-icon icon="account"></b-icon>
		</div>
		<div class="nav-circle" @click="">
			<b-icon icon="home"></b-icon>
		</div>
		<div class="nav-circle nav-center" >
			<img class="icon" src="../assets/favicon.png" />
		</div>
		<div class="nav-circle" @click="">
			<b-icon icon="view-dashboard"></b-icon>
		</div>
		<div class="nav-circle" @click="">
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
			changeRouter() {
				this.$router.push()
			}
		},
	};
</script>

<style lang="scss">
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
		transition: all .2s ease-in-out;
		
		
		border: {
			radius: 2rem;
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
			width: 3rem;
			height: 3rem;
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
</style>
