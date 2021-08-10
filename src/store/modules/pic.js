import { PartitionedBloomFilter } from 'bloom-filters'

const errorRate = 0.01

const state = {
	cache: {
		filter: PartitionedBloomFilter.create(100, errorRate)
	}
}

const mutations = {
	setCacheImg(state, url) {
		state.cache.filter.add(url)
	},
}

const getters = {
	hasCached:(state) => (url) => {
		return state.cache.filter.has(url)
	}
}

export default {
    namespaced: true,
    state,
    mutations,
	getters
}