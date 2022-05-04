import BookMarkProtocol from './protob/bookmark_pb'
import db from './idb'
import Lodash from "lodash"
import { renewAccessTokenIfExpired, getAccessToken, isLoggedIn } from './account'
import axios from "axios"
import CONFIG from '@/config.json'
import storage from "store2"
import { SnackbarProgrammatic as Snackbar } from 'buefy'

const BOOKMARK_DATABASE_NAME = "bookmark"
const PAGE_LIMIT = 50

const syncDEBU = Lodash.debounce(async () => {
  Snackbar.open({
    duration: 2000,
    message:'收藏夹上传中...',
    queue: false
  })
  await uploadBookMark()
}, 2000, {
  maxWait: 10
})

export async function addBookMark(illust) {
  storage.set("last_bookmark_modify", Date.now())
  let thumbIllust = Lodash.pick(illust, ["id", "height", "width", "type", "pageCount", "sanity", "title", "image"])
  thumbIllust["time"] = (new Date().getTime())
  let count = await db[BOOKMARK_DATABASE_NAME].update(thumbIllust["id"], thumbIllust)
  if (count === 0) {
    await db[BOOKMARK_DATABASE_NAME].add(thumbIllust)
  }
  syncDEBU()
  return true
}

export async function deleteBookMark(id) {
  storage.set("last_bookmark_modify", Date.now())
  await db[BOOKMARK_DATABASE_NAME].delete(id)
  syncDEBU()
}

export async function countBookMark() {
  return await db[BOOKMARK_DATABASE_NAME].count()
}

export async function clearBookMark() {
  storage.set("last_bookmark_modify", Date.now())
  await db[BOOKMARK_DATABASE_NAME].clear()
  Snackbar.open({
    duration: 2000,
    message:'收藏夹，无了。。。呜呜',
    queue: false
  })
  syncDEBU()
}

export async function getBookMark(page) {
  return await db[BOOKMARK_DATABASE_NAME].orderBy('time').reverse().offset(page * PAGE_LIMIT).limit(PAGE_LIMIT).toArray()
}

export async function isBookMarked(id) {
  return (await db[BOOKMARK_DATABASE_NAME].get(id)) !== undefined
}

export async function uploadBookMark() {
  let collect = new BookMarkProtocol.BookMarks()
  await db[BOOKMARK_DATABASE_NAME].toCollection().each(illust => {
    let obj = new BookMarkProtocol.IllustSimple()
    obj.setId(illust.id)
    obj.setHeight(illust.height)
    obj.setWidth(illust.width)
    obj.setTitle(illust.title)
    obj.setImage(illust.image)
    obj.setPagecount(illust.pageCount)
    obj.setSanity(illust.sanity)
    obj.setTime(illust.time)
    obj.setType(illust.type)
    collect.addIllusts(obj)
  })
  collect.setTime(storage.get("last_bookmark_modify", 0))
  let bin = collect.serializeBinary()
  await renewAccessTokenIfExpired()
  await axios.put(CONFIG.USER_API + "bookmark", bin, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  })
}

export async function syncBookMark() {
  Snackbar.open({
    duration: 2000,
    message:'收藏夹同步中...',
    queue: false
  })

  await renewAccessTokenIfExpired()
  let res
  try {
    res = await axios.get(CONFIG.USER_API + "bookmark", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      responseType: 'arraybuffer'
    })
  } catch (e) {
    if (e.response.status == 404) {
      await uploadBookMark()
    }
    return
  }

  let remoteData = BookMarkProtocol.BookMarks.deserializeBinary(res.data)

  let lastModifyTimeRemote = remoteData.getTime()
  let lastModifyTimeLocal = storage.get("last_bookmark_modify", 0)

  if (lastModifyTimeRemote == lastModifyTimeLocal) {
    return
  } else if (lastModifyTimeRemote < lastModifyTimeLocal) {
    await uploadBookMark()
    return
  }

  await db[BOOKMARK_DATABASE_NAME].clear()
  await Promise.all(remoteData.getIllustsList().map(i => new Promise(resolve => {
    let illust = i.toObject()
    db[BOOKMARK_DATABASE_NAME].add(illust).then(() => {
      resolve()
    })
  })))
}

if (isLoggedIn()) {
  syncBookMark()
}
