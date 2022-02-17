import CONFIG from "@/config.json";
import CRC32 from "crc-32";

const convertList = {
  original: ["img-original/img/", ""],
  regular: ["img-master/img/", "_master1200"],
  small: ["c/540x540_70/img-master/img/", "_master1200"],
  thumb_mini: ["c/128x128/img-master/img/", "_square1200"],
};

const ugoiraConvertList = {
  original: ["img-zip-ugoira/img/", "_ugoira1920x1080"],
  regular: ["img-zip-ugoira/img/", "_ugoira600x600"],
};

const proxyList = CONFIG.IMAGE_PROXY_HOSTS;

const loadBalance = (list, id) => {
  var hash = CRC32.str(JSON.stringify(id));
  return list[Math.abs(hash) % list.length];
};

const calcImg = function (id, page, imgDate, reso) {
  var date = new Date(imgDate);
  var Y = date.getFullYear().toString();
  var M = (
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0");
  var D = date.getDate().toString().padStart(2, "0");
  var h = date.getHours().toString().padStart(2, "0");
  var m = date.getMinutes().toString().padStart(2, "0");
  var s = date.getSeconds().toString().padStart(2, "0");
  var url = loadBalance(proxyList, { id: id, page: page });
  url += convertList[reso][0];
  url += `${Y}/${M}/${D}/${h}/${m}/${s}`;
  if (page == -1) {
    url += `/${id}`;
  } else {
    url += `/${id}_p${page}`;
  }
  url += convertList[reso][1];
  if (reso != "original") {
    url += ".jpg";
  }
  return url;
};

const calcUgoira = function (id, imgDate, reso) {
  var date = new Date(imgDate);
  var Y = date.getFullYear().toString();
  var M = (
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0");
  var D = date.getDate().toString().padStart(2, "0");
  var h = date.getHours().toString().padStart(2, "0");
  var m = date.getMinutes().toString().padStart(2, "0");
  var s = date.getSeconds().toString().padStart(2, "0");
  var url = loadBalance(proxyList, { id: id, page: -1 });
  url += ugoiraConvertList[reso][0];
  url += `${Y}/${M}/${D}/${h}/${m}/${s}`;
  url += `/${id}`;
  url += ugoiraConvertList[reso][1];
  url += ".zip";
  return url;
};

const imgProxy = function (original, id) {
  return original.replace("https://i.pximg.net/", loadBalance(proxyList, id));
};

export default {
  calcImg,
  calcUgoira,
  imgProxy,
  loadBalance,
};
