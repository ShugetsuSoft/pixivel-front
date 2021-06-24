<template>
	<div id="app">
		<Nav />
		<transition name="fade">
			<router-view />
		</transition>
	</div>
</template>

<script>
	import Nav from '@/components/nav'
	
	export default {
		name: 'App',
		components: {
			Nav
		}
	}
</script>

<style lang="scss">
	html,
	body {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
	}
	
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	  opacity: 0;
	}
	
	::selection {
	    background: rgba(37,100,255,.15);
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
</style>
