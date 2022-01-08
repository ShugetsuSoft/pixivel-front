import { PartitionedBloomFilter } from 'bloom-filters'
import axios from "axios";
import ImgReso from '@/utils/ImgReso'
import Vue from 'vue'
import JSZip from "jszip"

const errorRate = 0.01

const state = {
	cache: {
		filter: PartitionedBloomFilter.create(100, errorRate)
	},
	download: {
		queue: [],
		downloadingQueue: {},
		errors: [],
	}
}

const limitParallelTasks = 3

const newProcesses = () => {
	if (Object.keys(state.download.downloadingQueue).length < limitParallelTasks) {
		for (let i = 0; i < limitParallelTasks - Object.keys(state.download.downloadingQueue).length; i ++) {
			processDownload(state)
		}
	}
}

const triggerSave = (uri, name) => {
	let a = document.createElement('a')
	let event = new MouseEvent('click')
	a.href = uri
	a.download = name
	a.dispatchEvent(event)
}

const processDownload = (state) => {
	if (state.download.queue.length > 0) {
		let data = state.download.queue.shift()
		let url = ""
		if (data["type"] == "ugoira") {
			url = ImgReso.calcUgoira(data["id"], data["image"], "original")
		} else {
			url = ImgReso.calcImg(data["id"], data["page"], data["image"], "original")
			if (data["ispng"]) {
				url += ".png"
			} else {
				url += ".jpg"
			}
		}

		let iden = JSON.stringify(data)
		Vue.set(state.download.downloadingQueue, iden, 0)
		axios.get(url, {
			responseType: 'blob',
			background: true,
			onDownloadProgress: (event) => {
				Vue.set(state.download.downloadingQueue, iden, event.loaded  /  event.total)
			}
		}).then((response) => {
			if (data["type"] == "ugoira") {
				let file = new JSZip()
				file.loadAsync(response.data).then(() => {
					let ugoiraImages = {}
					Promise.all(data["ugoiraFrames"].map((item) => {
						return new Promise((resolve, reject) => {
							file.file(item["file"]).async("blob").then((data) => {
								let img = new Image()
								img.src = URL.createObjectURL(data)
								img.onload = () => {
									resolve()
								}
								ugoiraImages[item["file"]] = img
							}).catch(error => {
								reject(error)
							})
						})
					})).then(() => {
						let gif = new window.GIF({
							worker: 10,
							workerScript: '/js/gif.worker.js',
							quality: 10,
							width: ugoiraImages[data["ugoiraFrames"][0]["file"]].width,
							height: ugoiraImages[data["ugoiraFrames"][0]["file"]].height,
							background: '#fff',
						})
						gif.on('finished', (blob) => {
							let uri = URL.createObjectURL(blob)
							triggerSave(uri, data["name"])
							URL.revokeObjectURL(uri)
							Vue.delete(state.download.downloadingQueue, iden)
							newProcesses()
						})
						gif.on('error', (error) => {
							console.error(error)
							state.download.errors.push(error.message)
							Vue.delete(state.download.downloadingQueue, iden)
							newProcesses()
						})
						for (let i in data["ugoiraFrames"]) {
							let frameInfo = data["ugoiraFrames"][i]
							let img = ugoiraImages[frameInfo["file"]]
							gif.addFrame(img, {
								delay: frameInfo["delay"]
							})
						}
						gif.render()
					}).catch(error => {
						console.error(error)
						state.download.errors.push(error.message)
						Vue.delete(state.download.downloadingQueue, iden)
						newProcesses()
					})
				})
			} else {
				let uri = URL.createObjectURL(response.data)
				triggerSave(uri, data["name"])
				URL.revokeObjectURL(uri)
				Vue.delete(state.download.downloadingQueue, iden)
				newProcesses()
			}
		}).catch(error => {
			console.error(error)
			if (error.response && error.response.status == 404) {
				if (data["type"] != "ugoira" && data["ispng"] == true) {
					data["ispng"] = false
					state.download.queue.push(data)
				}
			}
			state.download.errors.push(error.message)
			Vue.delete(state.download.downloadingQueue, iden)
			newProcesses()
		})
	}
}

const mutations = {
	setCacheImg(state, url) {
		state.cache.filter.add(url)
	},
	newDownloadTask(state, data) {
		if (data["type"] != "ugoira") {
			data["ispng"] = true
		}
		state.download.queue.push(data)
		if (state.download.queue.length > 0) {
			newProcesses()
		}
	},
	removeDownloadTask(state, index) {
		state.download.queue.splice(index, 1)
	}
}

const getters = {
	hasCached:(state) => (url) => {
		return state.cache.filter.has(url)
	},
	isDownloadFinish:(state) => {
		return Object.keys(state.download.downloadingQueue).length < 1
	}
}

export default {
    namespaced: true,
    state,
    mutations,
	getters
}