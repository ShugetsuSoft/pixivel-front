import CONFIG from '@/config.json'

const convertList = {
	original: ["img-original/img/", ""],
	regular: ["img-master/img/", "_master1200"],
	small: ["c/540x540_70/img-master/img/", "_master1200"],
	thumb_mini: ["c/128x128/img-master/img/", "_square1200"]
}

const proxyList = CONFIG.IMAGE_PROXY_HOSTS//["https://proxy.pixivel.moe/"]

export default {
	install(Vue) {
		Vue.prototype.calcImg = function(id, page, imgDate, reso) {
			var date = new Date(imgDate)
			var Y = date.getFullYear().toString()
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString().padStart(2, '0')
			var D = date.getDate().toString().padStart(2, '0')
			var h = (date.getHours()).toString().padStart(2, '0')
			var m = date.getMinutes().toString().padStart(2, '0')
			var s = date.getSeconds().toString().padStart(2, '0')
			var url = proxyList[parseInt(Math.random() * proxyList.length)]
			url += convertList[reso][0]
			url += `${Y}/${M}/${D}/${h}/${m}/${s}`
			url += `/${id}_p${page}`
			url += convertList[reso][1]
			if (reso == "original") {
				url += ".png"
			} else {
				url += ".jpg"
			}
			return url
		}
		
		Vue.prototype.imgProxy = function(original) {
			return original.replace("https://i.pximg.net/", proxyList[parseInt(Math.random() * proxyList.length)])
		}
	}
}
